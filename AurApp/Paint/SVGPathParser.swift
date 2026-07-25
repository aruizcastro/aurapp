import SwiftUI

/// A single fillable region of a silhouette.
struct Region {
    var path: Path
    /// Line-only regions (whiskers, antennae) get stroked, never filled.
    var isLine: Bool
}

/// Silhouettes are authored as simple shape primitives in a 320 x 300 box.
/// Keeping them as data rather than hand-written SwiftUI Paths means new
/// drawings can be added without touching any view code.
enum Shape2D {
    case circle(x: Double, y: Double, r: Double)
    case ellipse(x: Double, y: Double, rx: Double, ry: Double, rotation: Double)
    case rect(x: Double, y: Double, w: Double, h: Double, corner: Double)
    /// Path data supporting M, L, C and Z commands, absolute coordinates only.
    case path(String)
    case line(String)

    var isLine: Bool {
        if case .line = self { return true }
        return false
    }

    func makePath() -> Path {
        switch self {
        case .circle(let x, let y, let r):
            return Path(ellipseIn: CGRect(x: x - r, y: y - r, width: r * 2, height: r * 2))

        case .ellipse(let x, let y, let rx, let ry, let rotation):
            let rect = CGRect(x: -rx, y: -ry, width: rx * 2, height: ry * 2)
            let transform = CGAffineTransform(translationX: x, y: y)
                .rotated(by: rotation * .pi / 180)
            return Path(ellipseIn: rect).applying(transform)

        case .rect(let x, let y, let w, let h, let corner):
            return Path(roundedRect: CGRect(x: x, y: y, width: w, height: h), cornerRadius: corner)

        case .path(let data), .line(let data):
            return Self.parse(data)
        }
    }

    /// Minimal SVG path parser: M (moveTo), L (lineTo), C (cubic curve), Z (close).
    /// Absolute coordinates only — that is all the silhouettes use.
    static func parse(_ data: String) -> Path {
        var path = Path()
        var numbers: [Double] = []
        var command: Character = "M"

        func flush() {
            switch command {
            case "M":
                var index = 0
                while index + 1 < numbers.count {
                    let point = CGPoint(x: numbers[index], y: numbers[index + 1])
                    if index == 0 { path.move(to: point) } else { path.addLine(to: point) }
                    index += 2
                }
            case "L":
                var index = 0
                while index + 1 < numbers.count {
                    path.addLine(to: CGPoint(x: numbers[index], y: numbers[index + 1]))
                    index += 2
                }
            case "C":
                var index = 0
                while index + 5 < numbers.count {
                    path.addCurve(
                        to: CGPoint(x: numbers[index + 4], y: numbers[index + 5]),
                        control1: CGPoint(x: numbers[index], y: numbers[index + 1]),
                        control2: CGPoint(x: numbers[index + 2], y: numbers[index + 3])
                    )
                    index += 6
                }
            default:
                break
            }
            numbers.removeAll(keepingCapacity: true)
        }

        var buffer = ""

        func takeNumber() {
            if !buffer.isEmpty, let value = Double(buffer) { numbers.append(value) }
            buffer = ""
        }

        for character in data {
            if character.isLetter {
                takeNumber()
                flush()
                command = character
                if character == "Z" || character == "z" { path.closeSubpath() }
            } else if character == "-" && !buffer.isEmpty && buffer.last != "e" {
                takeNumber()
                buffer = "-"
            } else if character == " " || character == "," || character == "\n" {
                takeNumber()
            } else {
                buffer.append(character)
            }
        }
        takeNumber()
        flush()

        return path
    }
}

extension Array where Element == Shape2D {
    /// Builds renderable regions, scaled from the 320 x 300 design box
    /// into whatever space the view actually has.
    func regions(fitting size: CGSize) -> [Region] {
        let scale = min(size.width / 320.0, size.height / 300.0)
        let offsetX = (size.width - 320.0 * scale) / 2
        let offsetY = (size.height - 300.0 * scale) / 2

        let transform = CGAffineTransform(translationX: offsetX, y: offsetY)
            .scaledBy(x: scale, y: scale)

        return map { Region(path: $0.makePath().applying(transform), isLine: $0.isLine) }
    }
}
