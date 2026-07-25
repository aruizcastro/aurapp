import SwiftUI
import Observation

/// Holds everything: the video list, the worlds, the PIN and today's screen time.
/// The list lives in a JSON file inside the app and mirrors to iCloud so the
/// parent can add videos from their phone.
@Observable
final class Store {

    // MARK: Data

    var videos: [Video] = []
    var worlds: [World] = World.defaults

    /// Minutes of video allowed per day. 0 means no limit.
    var dailyLimitMinutes: Int = 30

    /// 4-digit PIN that guards the parent panel.
    var pin: String = "1234"

    /// Seconds of video watched today.
    private(set) var secondsToday: Int = 0
    private var countedDay: String = ""

    // MARK: Paths

    private static var documentsFolder: URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }
    private static var listFile: URL { documentsFolder.appendingPathComponent("list.json") }

    private let cloud = NSUbiquitousKeyValueStore.default

    // MARK: Lifecycle

    init() {
        load()
        rolloverIfNeeded()
    }

    // MARK: Screen time

    var minutesUsedToday: Int { secondsToday / 60 }

    var minutesRemaining: Int {
        guard dailyLimitMinutes > 0 else { return 999 }
        return max(0, dailyLimitMinutes - minutesUsedToday)
    }

    var isOutOfTime: Bool {
        dailyLimitMinutes > 0 && secondsToday >= dailyLimitMinutes * 60
    }

    /// Called once per second while a video is actually playing.
    func addOneSecond() {
        rolloverIfNeeded()
        secondsToday += 1
        if secondsToday % 15 == 0 { saveCounter() }
    }

    func resetTodaysTime() {
        secondsToday = 0
        saveCounter()
    }

    /// When the calendar day changes, the counter goes back to zero.
    private func rolloverIfNeeded() {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        let today = formatter.string(from: Date())
        if today != countedDay {
            countedDay = today
            secondsToday = 0
            saveCounter()
        }
    }

    // MARK: Videos

    func videos(inWorld worldID: String) -> [Video] {
        if worldID == favoritesWorldID {
            return videos
                .filter { $0.playCount >= 3 }
                .sorted { $0.playCount > $1.playCount }
                .prefix(12)
                .map { $0 }
        }
        return videos.filter { $0.world == worldID }
    }

    func videoCount(inWorld worldID: String) -> Int {
        videos(inWorld: worldID).count
    }

    @discardableResult
    func add(link: String, title: String, world: String) -> Bool {
        guard let id = Video.extractID(from: link) else { return false }
        guard !videos.contains(where: { $0.id == id }) else { return false }
        videos.append(Video(id: id, title: title, world: world))
        save()
        return true
    }

    func delete(_ video: Video) {
        videos.removeAll { $0.id == video.id }
        save()
    }

    func move(_ video: Video, toWorld worldID: String) {
        guard let index = videos.firstIndex(where: { $0.id == video.id }) else { return }
        videos[index].world = worldID
        save()
    }

    func recordPlay(_ video: Video) {
        guard let index = videos.firstIndex(where: { $0.id == video.id }) else { return }
        videos[index].playCount += 1
        save()
    }

    /// Asks YouTube for the real title. Needs no API key.
    static func fetchTitle(forID id: String) async -> String? {
        let link = "https://www.youtube.com/watch?v=\(id)"
        guard let escaped = link.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed),
              let url = URL(string: "https://www.youtube.com/oembed?url=\(escaped)&format=json")
        else { return nil }

        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            let json = try JSONSerialization.jsonObject(with: data) as? [String: Any]
            return json?["title"] as? String
        } catch {
            return nil
        }
    }

    // MARK: Persistence

    private struct Snapshot: Codable {
        var videos: [Video]
        var worlds: [World]
        var dailyLimitMinutes: Int
        var pin: String
    }

    func save() {
        let snapshot = Snapshot(videos: videos,
                                worlds: worlds,
                                dailyLimitMinutes: dailyLimitMinutes,
                                pin: pin)
        guard let data = try? JSONEncoder().encode(snapshot) else { return }
        try? data.write(to: Self.listFile, options: .atomic)
        cloud.set(data, forKey: "list")
        cloud.synchronize()
    }

    private func saveCounter() {
        UserDefaults.standard.set(secondsToday, forKey: "secondsToday")
        UserDefaults.standard.set(countedDay, forKey: "countedDay")
    }

    private func load() {
        secondsToday = UserDefaults.standard.integer(forKey: "secondsToday")
        countedDay = UserDefaults.standard.string(forKey: "countedDay") ?? ""

        // iCloud first, then the local file, then an empty list.
        let data = cloud.data(forKey: "list") ?? (try? Data(contentsOf: Self.listFile))

        if let data, let snapshot = try? JSONDecoder().decode(Snapshot.self, from: data) {
            videos = snapshot.videos
            worlds = snapshot.worlds.isEmpty ? World.defaults : snapshot.worlds
            dailyLimitMinutes = snapshot.dailyLimitMinutes
            pin = snapshot.pin
        } else {
            videos = []
            worlds = World.defaults
        }
    }
}
