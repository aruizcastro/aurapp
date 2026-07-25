import SwiftUI

/// Free drawing. Pencil is thin and opaque, brush is thick and slightly
/// translucent so overlapping strokes blend — noticing that difference is
/// half the fun at this age. The eraser paints white rather than removing
/// strokes: simpler to understand, and it cannot wipe the whole drawing.
struct FreeDrawView: View {
    @Environment(\.dismiss) private var dismiss

    enum Tool: String, CaseIterable {
        case pencil, brush, eraser

        var label: String {
            switch self {
            case .pencil: return "Lápiz"
            case .brush:  return "Pincel"
            case .eraser: return "Borrador"
            }
        }

        var symbol: String {
            switch self {
            case .pencil: return "pencil"
            case .brush:  return "paintbrush.fill"
            case .eraser: return "eraser.fill"
            }
        }

        var width: Double {
            switch self {
            case .pencil: return 4
            case .brush:  return 22
            case .eraser: return 30
            }
        }

        var opacity: Double { self == .brush ? 0.75 : 1 }
    }

    struct Stroke: Identifiable {
        let id = UUID()
        var points: [CGPoint]
        var color: Color
        var width: Double
        var opacity: Double
    }

    @State private var strokes: [Stroke] = []
    @State private var current: Stroke?
    @State private var tool: Tool = .pencil
    @State private var chosenColor = paintPalette[6]
    @State private var showClearAlert = false

    var body: some View {
        ZStack {
            Color.pinkBackground.ignoresSafeArea()

            VStack(spacing: 14) {
                header
                toolbar
                canvas
                PaletteBar(colors: paintPalette, selected: $chosenColor)
            }
            .padding(18)
        }
        .alert("¿Empezamos un dibujo nuevo?", isPresented: $showClearAlert) {
            Button("Sí, borrar todo", role: .destructive) {
                strokes.removeAll()
            }
            Button("No", role: .cancel) {}
        }
    }

    // MARK: Pieces

    private var header: some View {
        HStack(spacing: 12) {
            RoundIconButton(symbol: "chevron.left") { dismiss() }

            Text("Mi dibujo")
                .font(.system(size: 24, weight: .semibold, design: .rounded))
                .foregroundStyle(Color.deepPurple)

            Spacer()

            Button {
                if !strokes.isEmpty { strokes.removeLast() }
            } label: {
                Image(systemName: "arrow.uturn.backward")
                    .font(.system(size: 20))
                    .foregroundStyle(Color.deepPurple)
                    .frame(width: 52, height: 52)
                    .background(.white, in: Circle())
            }
            .buttonStyle(.plain)
            .disabled(strokes.isEmpty)
            .opacity(strokes.isEmpty ? 0.4 : 1)
        }
    }

    private var toolbar: some View {
        HStack(spacing: 10) {
            ForEach(Tool.allCases, id: \.self) { item in
                Button { tool = item } label: {
                    HStack(spacing: 7) {
                        Image(systemName: item.symbol)
                        Text(item.label)
                    }
                    .font(.system(size: 17, weight: .medium, design: .rounded))
                    .foregroundStyle(tool == item ? .white : Color.deepPurple)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(tool == item ? Color.pinkStrong : .white,
                                in: RoundedRectangle(cornerRadius: 14))
                }
                .buttonStyle(.plain)
            }

            Button { showClearAlert = true } label: {
                HStack(spacing: 7) {
                    Image(systemName: "trash")
                    Text("Nuevo")
                }
                .font(.system(size: 17, weight: .medium, design: .rounded))
                .foregroundStyle(Color.deepPurple)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(.white, in: RoundedRectangle(cornerRadius: 14))
            }
            .buttonStyle(.plain)
        }
    }

    private var canvas: some View {
        Canvas { context, _ in
            for stroke in strokes + (current.map { [$0] } ?? []) {
                context.stroke(path(for: stroke),
                               with: .color(stroke.color.opacity(stroke.opacity)),
                               style: StrokeStyle(lineWidth: stroke.width,
                                                  lineCap: .round,
                                                  lineJoin: .round))
            }
        }
        .background(.white, in: RoundedRectangle(cornerRadius: 18))
        .contentShape(RoundedRectangle(cornerRadius: 18))
        .gesture(
            DragGesture(minimumDistance: 0)
                .onChanged { value in
                    if current == nil {
                        current = Stroke(points: [value.location],
                                         color: tool == .eraser ? .white : chosenColor,
                                         width: tool.width,
                                         opacity: tool.opacity)
                    } else {
                        current?.points.append(value.location)
                    }
                }
                .onEnded { _ in
                    if let current { strokes.append(current) }
                    current = nil
                }
        )
    }

    private func path(for stroke: Stroke) -> Path {
        var path = Path()
        guard let first = stroke.points.first else { return path }
        path.move(to: first)
        for point in stroke.points.dropFirst() { path.addLine(to: point) }
        // A single tap should still leave a dot.
        if stroke.points.count == 1 { path.addLine(to: first) }
        return path
    }
}
