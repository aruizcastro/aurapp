import SwiftUI

// MARK: - Video

struct Video: Identifiable, Codable, Hashable {
    var id: String          // YouTube ID: the 11 characters after v=
    var title: String
    var world: String       // id of the world it belongs to
    var playCount: Int = 0

    var thumbnailURL: URL? {
        URL(string: "https://img.youtube.com/vi/\(id)/hqdefault.jpg")
    }

    /// Pulls the video ID out of any form of YouTube link.
    /// Accepts: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID,
    /// youtube.com/embed/ID, or a bare ID.
    static func extractID(from text: String) -> String? {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)

        if trimmed.count == 11,
           trimmed.allSatisfy({ $0.isLetter || $0.isNumber || $0 == "-" || $0 == "_" }) {
            return trimmed
        }

        guard let components = URLComponents(string: trimmed) else { return nil }

        if let v = components.queryItems?.first(where: { $0.name == "v" })?.value, v.count == 11 {
            return v
        }

        // youtu.be/ID · /shorts/ID · /embed/ID
        if let last = components.path.split(separator: "/").last, last.count == 11 {
            return String(last)
        }

        return nil
    }
}

// MARK: - World

struct World: Identifiable, Codable, Hashable {
    var id: String
    var name: String        // shown to the child, in Spanish
    var symbol: String      // SF Symbol name
    var color: StorableColor

    static let defaults: [World] = [
        World(id: "songs",     name: "Canciones",  symbol: "music.note",      color: .init(.softPurple)),
        World(id: "animals",   name: "Animales",   symbol: "pawprint.fill",   color: .init(.softTeal)),
        World(id: "learning",  name: "Aprender",   symbol: "abc",             color: .init(.softAmber)),
        World(id: "unicorns",  name: "Unicornios", symbol: "sparkles",        color: .init(.softPink)),
        World(id: "bedtime",   name: "Dormir",     symbol: "moon.stars.fill", color: .init(.softBlue)),
        World(id: "favorites", name: "Favoritos",  symbol: "star.fill",       color: .init(.softPeach))
    ]
}

/// The favorites world is not editable: it fills itself with whatever she replays most.
let favoritesWorldID = "favorites"

// MARK: - JSON-friendly color

struct StorableColor: Codable, Hashable {
    var r: Double, g: Double, b: Double

    init(r: Double, g: Double, b: Double) { self.r = r; self.g = g; self.b = b }

    init(_ color: Color) {
        var rr: CGFloat = 0, gg: CGFloat = 0, bb: CGFloat = 0, aa: CGFloat = 0
        UIColor(color).getRed(&rr, green: &gg, blue: &bb, alpha: &aa)
        self.r = Double(rr); self.g = Double(gg); self.b = Double(bb)
    }

    var color: Color { Color(red: r, green: g, blue: b) }
}

// MARK: - App palette

extension Color {
    static let pinkBackground   = Color(red: 0.98, green: 0.92, blue: 0.94)
    static let pinkStrong       = Color(red: 0.83, green: 0.33, blue: 0.49)
    static let softPink         = Color(red: 0.96, green: 0.75, blue: 0.82)
    static let purpleBackground = Color(red: 0.93, green: 0.93, blue: 1.00)
    static let softPurple       = Color(red: 0.81, green: 0.80, blue: 0.96)
    static let deepPurple       = Color(red: 0.15, green: 0.13, blue: 0.36)
    static let softTeal         = Color(red: 0.62, green: 0.88, blue: 0.80)
    static let softAmber        = Color(red: 0.98, green: 0.78, blue: 0.46)
    static let softBlue         = Color(red: 0.71, green: 0.83, blue: 0.96)
    static let softPeach        = Color(red: 0.96, green: 0.77, blue: 0.70)
    static let ink              = Color(red: 0.17, green: 0.17, blue: 0.16)
}

/// The 10 colors in the painting palette.
let paintPalette: [Color] = [
    Color(red: 0.89, green: 0.29, blue: 0.29),   // red
    Color(red: 0.94, green: 0.62, blue: 0.15),   // orange
    Color(red: 0.98, green: 0.78, blue: 0.46),   // yellow
    Color(red: 0.59, green: 0.77, blue: 0.35),   // light green
    Color(red: 0.11, green: 0.62, blue: 0.46),   // green
    Color(red: 0.22, green: 0.54, blue: 0.87),   // blue
    Color(red: 0.50, green: 0.47, blue: 0.87),   // purple
    Color(red: 0.83, green: 0.33, blue: 0.49),   // pink
    Color(red: 0.85, green: 0.35, blue: 0.19),   // brown
    Color(red: 0.17, green: 0.17, blue: 0.16)    // black
]
