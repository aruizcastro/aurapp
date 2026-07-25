import SwiftUI

/// One colorable drawing. Original artwork built from geometric primitives —
/// deliberately not based on any existing character, so the app stays clean
/// of third-party rights.
struct Silhouette: Identifiable {
    var id: String
    var name: String        // shown to the child, in Spanish
    var category: String    // "animals" or "places"
    var shapes: [Shape2D]
}

/// Regions are listed back to front: whatever is drawn last sits on top,
/// and tap testing walks the list in reverse so the top shape wins.
enum SilhouetteLibrary {

    static let all: [Silhouette] = animals + places

    static let animals: [Silhouette] = [
        unicorn, babyUnicorn, flower, sunflower, snail, babySnail,
        cat, dog, rabbit, bear, elephant, sheep, owl, bird, butterfly, fish
    ]

    /// Scenes have far more regions than a single animal, so they hold her
    /// attention much longer — a landscape is 15 to 20 taps, a cat is 7.
    static let places: [Silhouette] = [
        house, beach, mountains, castle, rocket, rainbow
    ]

    // MARK: Unicorns

    /// Facing the viewer. A side-on horse needs foreshortening that simple
    /// primitives cannot fake; head-on reads instantly at any size.
    static let unicorn = Silhouette(id: "unicorn", name: "Unicornio", category: "animals", shapes: [
        .rect(x: 108, y: 248, w: 22, h: 42, corner: 11),
        .rect(x: 142, y: 252, w: 22, h: 38, corner: 11),
        .rect(x: 182, y: 252, w: 22, h: 38, corner: 11),
        .rect(x: 216, y: 248, w: 22, h: 42, corner: 11),
        .path("M232 196 C272 182 288 222 270 250 C258 270 234 266 232 248 C248 240 250 216 232 196 Z"),
        .ellipse(x: 162, y: 216, rx: 72, ry: 54, rotation: 0),
        .ellipse(x: 106, y: 82, rx: 16, ry: 28, rotation: -30),
        .ellipse(x: 214, y: 82, rx: 16, ry: 28, rotation: 30),
        .path("M148 58 L160 2 L176 56 Z"),
        // Mane tufts, drawn before the head so they frame it.
        .circle(x: 86, y: 110, r: 26),
        .circle(x: 234, y: 110, r: 26),
        .circle(x: 98, y: 166, r: 24),
        .circle(x: 222, y: 166, r: 24),
        .circle(x: 160, y: 128, r: 66),
        .ellipse(x: 160, y: 168, rx: 26, ry: 18, rotation: 0),
        .circle(x: 134, y: 122, r: 10),
        .circle(x: 186, y: 122, r: 10),
        .path("M160 158 L170 170 L150 170 Z")
    ])

    static let babyUnicorn = Silhouette(id: "babyUnicorn", name: "Unicornito", category: "animals", shapes: [
        .rect(x: 126, y: 250, w: 22, h: 36, corner: 11),
        .rect(x: 172, y: 250, w: 22, h: 36, corner: 11),
        .ellipse(x: 160, y: 214, rx: 58, ry: 48, rotation: 0),
        .ellipse(x: 108, y: 88, rx: 16, ry: 27, rotation: -28),
        .ellipse(x: 212, y: 88, rx: 16, ry: 27, rotation: 28),
        .path("M148 64 L160 6 L176 62 Z"),
        // Mane behind the head, peeking out on the right.
        .path("M196 76 C240 90 244 142 214 162 C228 130 220 96 196 76 Z"),
        .circle(x: 160, y: 130, r: 62),
        .ellipse(x: 160, y: 166, rx: 23, ry: 15, rotation: 0),
        .circle(x: 137, y: 126, r: 9),
        .circle(x: 183, y: 126, r: 9),
        .path("M160 158 L169 168 L151 168 Z")
    ])

    // MARK: Flowers

    static let flower = Silhouette(id: "flower", name: "Flor", category: "animals", shapes: [
        .rect(x: 152, y: 140, w: 15, h: 142, corner: 7),
        .path("M152 214 C112 194 86 214 88 240 C118 250 146 238 152 214 Z"),
        .path("M167 188 C207 168 233 188 231 214 C201 224 173 212 167 188 Z"),
        .circle(x: 160, y: 44, r: 33),
        .circle(x: 212, y: 74, r: 33),
        .circle(x: 212, y: 134, r: 33),
        .circle(x: 160, y: 164, r: 33),
        .circle(x: 108, y: 134, r: 33),
        .circle(x: 108, y: 74, r: 33),
        .circle(x: 160, y: 104, r: 29)
    ])

    static let sunflower: Silhouette = {
        var shapes: [Shape2D] = [
            .rect(x: 152, y: 150, w: 15, h: 132, corner: 7),
            .path("M152 220 C112 200 86 220 88 246 C118 256 146 244 152 220 Z"),
            .path("M167 196 C207 176 233 196 231 222 C201 232 173 220 167 196 Z")
        ]
        // Ten petals around the center.
        for index in 0 ..< 10 {
            let angle = Double(index) * 36
            let radians = angle * .pi / 180
            let x = 160 + sin(radians) * 60
            let y = 108 - cos(radians) * 60
            shapes.append(.ellipse(x: x, y: y, rx: 15, ry: 38, rotation: angle))
        }
        shapes.append(.circle(x: 160, y: 108, r: 43))
        shapes.append(.circle(x: 160, y: 108, r: 24))
        return Silhouette(id: "sunflower", name: "Girasol", category: "animals", shapes: shapes)
    }()

    // MARK: Snails

    static let snail = Silhouette(id: "snail", name: "Caracol", category: "animals", shapes: [
        .path("M36 242 C30 206 66 190 104 196 L214 210 C244 216 244 242 214 242 Z"),
        .circle(x: 182, y: 150, r: 74),
        .circle(x: 182, y: 150, r: 47),
        .circle(x: 182, y: 150, r: 21),
        .line("M64 200 C56 172 44 160 34 156"),
        .line("M94 196 C92 168 84 154 74 146"),
        .circle(x: 32, y: 152, r: 9),
        .circle(x: 72, y: 142, r: 9)
    ])

    static let babySnail = Silhouette(id: "babySnail", name: "Caracolito", category: "animals", shapes: [
        .path("M44 250 C38 220 70 204 104 210 L212 222 C240 228 240 250 212 250 Z"),
        .circle(x: 176, y: 160, r: 68),
        .circle(x: 176, y: 160, r: 50),
        .circle(x: 176, y: 160, r: 34),
        .circle(x: 176, y: 160, r: 16),
        .line("M70 212 C62 184 52 172 42 168"),
        .line("M98 208 C96 182 88 168 78 160"),
        .circle(x: 40, y: 164, r: 9),
        .circle(x: 76, y: 156, r: 9)
    ])

    // MARK: Animals

    static let cat = Silhouette(id: "cat", name: "Gato", category: "animals", shapes: [
        .ellipse(x: 160, y: 220, rx: 72, ry: 56, rotation: 0),
        .path("M108 78 L104 24 L152 60 Z"),
        .path("M212 78 L216 24 L168 60 Z"),
        .line("M226 240 C266 232 270 194 248 182"),
        .circle(x: 160, y: 118, r: 62),
        .circle(x: 136, y: 108, r: 11),
        .circle(x: 184, y: 108, r: 11),
        .path("M160 130 L174 142 L146 142 Z")
    ])

    static let dog = Silhouette(id: "dog", name: "Perro", category: "animals", shapes: [
        .ellipse(x: 160, y: 215, rx: 78, ry: 58, rotation: 0),
        .path("M106 78 C74 74 70 140 100 146 C110 122 106 96 106 78 Z"),
        .path("M214 78 C246 74 250 140 220 146 C210 122 214 96 214 78 Z"),
        .circle(x: 160, y: 115, r: 60),
        .ellipse(x: 160, y: 146, rx: 30, ry: 22, rotation: 0),
        .ellipse(x: 160, y: 134, rx: 11, ry: 8, rotation: 0),
        .circle(x: 138, y: 100, r: 9),
        .circle(x: 182, y: 100, r: 9)
    ])

    static let rabbit = Silhouette(id: "rabbit", name: "Conejo", category: "animals", shapes: [
        .ellipse(x: 160, y: 232, rx: 62, ry: 48, rotation: 0),
        .ellipse(x: 138, y: 60, rx: 18, ry: 52, rotation: -12),
        .ellipse(x: 182, y: 60, rx: 18, ry: 52, rotation: 12),
        .circle(x: 160, y: 140, r: 52),
        .circle(x: 142, y: 132, r: 8),
        .circle(x: 178, y: 132, r: 8),
        .path("M160 152 L169 161 L151 161 Z")
    ])

    static let bear = Silhouette(id: "bear", name: "Oso", category: "animals", shapes: [
        .circle(x: 104, y: 76, r: 32),
        .circle(x: 216, y: 76, r: 32),
        .circle(x: 160, y: 150, r: 86),
        .ellipse(x: 160, y: 182, rx: 44, ry: 34, rotation: 0),
        .ellipse(x: 160, y: 164, rx: 15, ry: 11, rotation: 0),
        .circle(x: 128, y: 126, r: 10),
        .circle(x: 192, y: 126, r: 10)
    ])

    static let elephant = Silhouette(id: "elephant", name: "Elefante", category: "animals", shapes: [
        .rect(x: 132, y: 212, w: 32, h: 60, corner: 10),
        .rect(x: 198, y: 212, w: 32, h: 60, corner: 10),
        .ellipse(x: 184, y: 166, rx: 76, ry: 62, rotation: 0),
        .line("M258 172 C286 166 292 200 274 210"),
        .circle(x: 106, y: 150, r: 50),
        .path("M68 168 C44 196 50 240 80 246 C98 250 102 230 90 226 C78 222 74 198 92 182 Z"),
        .ellipse(x: 128, y: 140, rx: 30, ry: 38, rotation: 0),
        .circle(x: 80, y: 138, r: 8)
    ])

    static let sheep = Silhouette(id: "sheep", name: "Oveja", category: "animals", shapes: [
        .rect(x: 118, y: 228, w: 17, h: 46, corner: 8),
        .rect(x: 182, y: 228, w: 17, h: 46, corner: 8),
        .path("M92 204 C58 204 58 148 92 142 C92 106 146 98 154 114 C162 98 216 106 216 142 C250 148 250 204 216 204 C216 232 162 242 154 228 C146 242 92 232 92 204 Z"),
        .ellipse(x: 248, y: 184, rx: 29, ry: 33, rotation: 0),
        .ellipse(x: 220, y: 166, rx: 19, ry: 10, rotation: -20),
        .circle(x: 252, y: 176, r: 7)
    ])

    static let owl = Silhouette(id: "owl", name: "Búho", category: "animals", shapes: [
        .ellipse(x: 132, y: 272, rx: 18, ry: 8, rotation: 0),
        .ellipse(x: 188, y: 272, rx: 18, ry: 8, rotation: 0),
        .path("M160 56 C226 56 262 118 258 178 C254 240 214 268 160 268 C106 268 66 240 62 178 C58 118 94 56 160 56 Z"),
        .path("M70 160 C56 200 62 236 84 250 C92 216 88 184 70 160 Z"),
        .path("M250 160 C264 200 258 236 236 250 C228 216 232 184 250 160 Z"),
        .circle(x: 124, y: 140, r: 36),
        .circle(x: 196, y: 140, r: 36),
        .circle(x: 124, y: 140, r: 14),
        .circle(x: 196, y: 140, r: 14),
        .path("M160 164 L176 188 L144 188 Z")
    ])

    static let bird = Silhouette(id: "bird", name: "Pájaro", category: "animals", shapes: [
        .rect(x: 140, y: 210, w: 9, h: 46, corner: 4),
        .rect(x: 174, y: 210, w: 9, h: 46, corner: 4),
        .path("M94 148 C62 120 34 116 20 126 C34 146 34 170 22 192 C38 200 68 184 94 172 Z"),
        .ellipse(x: 152, y: 158, rx: 70, ry: 58, rotation: 0),
        .circle(x: 214, y: 114, r: 40),
        .path("M250 108 L300 122 L250 136 Z"),
        .ellipse(x: 148, y: 166, rx: 40, ry: 25, rotation: -18),
        .circle(x: 222, y: 106, r: 7)
    ])

    static let butterfly = Silhouette(id: "butterfly", name: "Mariposa", category: "animals", shapes: [
        .path("M146 110 C90 40 20 70 44 130 C62 176 116 168 146 146 Z"),
        .path("M174 110 C230 40 300 70 276 130 C258 176 204 168 174 146 Z"),
        .path("M146 160 C96 190 50 240 96 264 C134 282 142 220 146 190 Z"),
        .path("M174 160 C224 190 270 240 224 264 C186 282 178 220 174 190 Z"),
        .ellipse(x: 160, y: 150, rx: 14, ry: 76, rotation: 0),
        .line("M154 78 C140 46 116 36 100 40"),
        .line("M166 78 C180 46 204 36 220 40")
    ])

    static let fish = Silhouette(id: "fish", name: "Pez", category: "animals", shapes: [
        .path("M250 150 L306 96 L306 204 Z"),
        .ellipse(x: 150, y: 150, rx: 100, ry: 66, rotation: 0),
        .path("M140 84 C160 40 200 44 208 92 Z"),
        .path("M140 216 C160 260 200 256 208 208 Z"),
        .circle(x: 96, y: 128, r: 13),
        .line("M170 110 C200 130 200 170 170 190")
    ])

    // MARK: - Places
    //
    // Scenes are built strictly back to front: sky, then ground, then whatever
    // stands on it. Every region is at least ~24 points across so a small
    // finger can land on it.

    static let house = Silhouette(id: "house", name: "Casa", category: "places", shapes: [
        .rect(x: 0, y: 0, w: 320, h: 206, corner: 0),
        .circle(x: 266, y: 46, r: 30),
        .circle(x: 58, y: 54, r: 22),
        .circle(x: 84, y: 46, r: 27),
        .circle(x: 110, y: 56, r: 20),
        .rect(x: 0, y: 206, w: 320, h: 94, corner: 0),
        .rect(x: 34, y: 168, w: 18, h: 54, corner: 4),
        .circle(x: 43, y: 146, r: 36),
        .rect(x: 92, y: 132, w: 136, h: 88, corner: 4),
        .path("M76 138 L160 68 L244 138 Z"),
        .rect(x: 106, y: 148, w: 32, h: 28, corner: 4),
        .rect(x: 190, y: 148, w: 32, h: 28, corner: 4),
        .rect(x: 142, y: 166, w: 36, h: 54, corner: 6),
        .path("M136 300 L184 300 L173 220 L147 220 Z")
    ])

    static let beach = Silhouette(id: "beach", name: "Playa", category: "places", shapes: [
        .rect(x: 0, y: 0, w: 320, h: 148, corner: 0),
        .circle(x: 56, y: 48, r: 28),
        .rect(x: 0, y: 148, w: 320, h: 76, corner: 0),
        .line("M22 176 C42 166 62 186 82 176"),
        .line("M124 196 C144 186 164 206 184 196"),
        .rect(x: 0, y: 224, w: 320, h: 76, corner: 0),
        .path("M254 226 C248 192 252 160 262 138 L276 142 C266 162 264 194 268 226 Z"),
        // Four separate fronds, each its own region so she can make a
        // multicoloured palm. Rotated ellipses read as a propeller.
        .path("M266 144 C238 126 206 128 190 144 C214 152 244 154 266 152 Z"),
        .path("M266 140 C254 112 232 94 210 90 C216 114 240 130 262 146 Z"),
        .path("M272 140 C286 112 308 96 318 94 C314 118 294 132 276 146 Z"),
        .path("M274 144 C296 130 314 134 320 148 C304 154 288 154 274 152 Z"),
        .circle(x: 260, y: 154, r: 7),
        .circle(x: 278, y: 156, r: 7),
        .path("M56 216 L146 216 L132 242 L70 242 Z"),
        .path("M100 212 L100 146 L148 212 Z"),
        .circle(x: 182, y: 262, r: 15)
    ])

    static let mountains = Silhouette(id: "mountains", name: "Montañas", category: "places", shapes: [
        .rect(x: 0, y: 0, w: 320, h: 198, corner: 0),
        .circle(x: 270, y: 50, r: 26),
        .path("M0 198 L86 74 L172 198 Z"),
        .path("M86 74 L112 112 L96 106 L76 118 L62 100 Z"),
        .path("M132 198 L220 88 L308 198 Z"),
        .path("M220 88 L244 122 L228 116 L210 128 L198 112 Z"),
        .rect(x: 0, y: 198, w: 320, h: 102, corner: 0),
        .ellipse(x: 160, y: 254, rx: 112, ry: 32, rotation: 0),
        .rect(x: 40, y: 216, w: 12, h: 24, corner: 3),
        .path("M22 218 L46 168 L70 218 Z"),
        .rect(x: 272, y: 220, w: 12, h: 24, corner: 3),
        .path("M256 222 L278 180 L300 222 Z")
    ])

    static let castle = Silhouette(id: "castle", name: "Castillo", category: "places", shapes: [
        .rect(x: 0, y: 0, w: 320, h: 214, corner: 0),
        .circle(x: 40, y: 44, r: 20),
        .circle(x: 66, y: 38, r: 24),
        .circle(x: 92, y: 46, r: 18),
        .rect(x: 0, y: 214, w: 320, h: 86, corner: 0),
        .rect(x: 44, y: 112, w: 58, h: 108, corner: 0),
        .rect(x: 218, y: 112, w: 58, h: 108, corner: 0),
        .rect(x: 96, y: 142, w: 128, h: 78, corner: 0),
        .path("M96 142 L96 128 L110 128 L110 142 L134 142 L134 128 L148 128 L148 142 L172 142 L172 128 L186 128 L186 142 L210 142 L210 128 L224 128 L224 142 Z"),
        .path("M36 112 L73 56 L110 112 Z"),
        .path("M210 112 L247 56 L284 112 Z"),
        .line("M73 56 L73 26"),
        .path("M73 28 L102 37 L73 46 Z"),
        .line("M247 56 L247 26"),
        .path("M247 28 L276 37 L247 46 Z"),
        .rect(x: 60, y: 146, w: 26, h: 34, corner: 13),
        .rect(x: 234, y: 146, w: 26, h: 34, corner: 13),
        .path("M134 220 L134 178 C134 156 186 156 186 178 L186 220 Z")
    ])

    static let rocket = Silhouette(id: "rocket", name: "Cohete", category: "places", shapes: [
        .rect(x: 0, y: 0, w: 320, h: 300, corner: 0),
        .circle(x: 44, y: 226, r: 5),
        .circle(x: 86, y: 62, r: 4),
        .circle(x: 250, y: 214, r: 5),
        .circle(x: 288, y: 122, r: 4),
        .circle(x: 30, y: 148, r: 4),
        .circle(x: 226, y: 40, r: 5),
        .ellipse(x: 66, y: 66, rx: 58, ry: 17, rotation: -22),
        .circle(x: 66, y: 66, r: 34),
        .path("M104 216 L134 158 L134 208 Z"),
        .path("M216 216 L186 158 L186 208 Z"),
        .path("M160 44 C188 84 194 148 188 202 L132 202 C126 148 132 84 160 44 Z"),
        .circle(x: 160, y: 118, r: 21),
        .rect(x: 132, y: 202, w: 56, h: 16, corner: 4),
        .path("M136 218 C144 262 176 262 184 218 C172 240 148 240 136 218 Z"),
        .path("M150 218 C154 244 166 244 170 218 Z")
    ])

    /// The bands are five nested half-rings. Cubic curves only, because the
    /// path parser deliberately does not implement elliptical arcs.
    static let rainbow = Silhouette(id: "rainbow", name: "Arcoíris", category: "places", shapes: [
        .rect(x: 0, y: 0, w: 320, h: 250, corner: 0),
        .path("M30 250 C30 178.2 88.2 120 160 120 C231.8 120 290 178.2 290 250 L270 250 C270 189.2 220.8 140 160 140 C99.2 140 50 189.2 50 250 Z"),
        .path("M50 250 C50 189.2 99.2 140 160 140 C220.8 140 270 189.2 270 250 L250 250 C250 200.3 209.7 160 160 160 C110.3 160 70 200.3 70 250 Z"),
        .path("M70 250 C70 200.3 110.3 160 160 160 C209.7 160 250 200.3 250 250 L230 250 C230 211.3 198.7 180 160 180 C121.3 180 90 211.3 90 250 Z"),
        .path("M90 250 C90 211.3 121.3 180 160 180 C198.7 180 230 211.3 230 250 L210 250 C210 222.4 187.6 200 160 200 C132.4 200 110 222.4 110 250 Z"),
        .path("M110 250 C110 222.4 132.4 200 160 200 C187.6 200 210 222.4 210 250 L190 250 C190 233.4 176.6 220 160 220 C143.4 220 130 233.4 130 250 Z"),
        .rect(x: 0, y: 250, w: 320, h: 50, corner: 0),
        .path("M0 250 C36 218 88 222 122 250 Z"),
        .path("M198 250 C232 220 284 218 320 250 Z"),
        .circle(x: 34, y: 244, r: 20),
        .circle(x: 60, y: 236, r: 25),
        .circle(x: 260, y: 236, r: 25),
        .circle(x: 286, y: 244, r: 20)
    ])
}
