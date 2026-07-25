import SwiftUI

/// Downloads the video cover art and keeps it on disk, so the grid opens
/// instantly and still shows covers with no internet.
@MainActor
final class ThumbnailCache {
    static let shared = ThumbnailCache()

    private var inMemory: [String: UIImage] = [:]

    private var folder: URL {
        let url = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("thumbnails")
        try? FileManager.default.createDirectory(at: url, withIntermediateDirectories: true)
        return url
    }

    func image(for id: String) async -> UIImage? {
        if let cached = inMemory[id] { return cached }

        let file = folder.appendingPathComponent("\(id).jpg")
        if let data = try? Data(contentsOf: file), let image = UIImage(data: data) {
            inMemory[id] = image
            return image
        }

        // maxresdefault is missing for some videos; hqdefault always exists.
        for quality in ["maxresdefault", "hqdefault"] {
            guard let url = URL(string: "https://img.youtube.com/vi/\(id)/\(quality).jpg") else { continue }
            if let (data, _) = try? await URLSession.shared.data(from: url),
               let image = UIImage(data: data), image.size.width > 150 {
                try? data.write(to: file, options: .atomic)
                inMemory[id] = image
                return image
            }
        }
        return nil
    }
}

struct Thumbnail: View {
    let id: String
    @State private var image: UIImage?

    var body: some View {
        ZStack {
            Color.softPurple
            if let image {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            }
        }
        .clipped()
        .task { image = await ThumbnailCache.shared.image(for: id) }
    }
}
