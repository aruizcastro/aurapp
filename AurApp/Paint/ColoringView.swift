import SwiftUI

/// Tap a color, then tap a region. Filling by tap rather than by stroke matters:
/// a four-year-old cannot stay inside the lines with a finger yet, and if the
/// result looks bad she stops playing. This way it always comes out nice.
struct ColoringView: View {
    @Environment(\.dismiss) private var dismiss

    @State private var silhouette = SilhouetteLibrary.animals[0]
    @State private var category = "animals"
    @State private var chosenColor = paintPalette[7]
    /// Region index -> color the child painted it.
    @State private var fills: [Int: Color] = [:]

    private let outline = Color(white: 0.17)
    private let blank = Color(white: 0.94)

    var body: some View {
        ZStack {
            Color.softTeal.opacity(0.28).ignoresSafeArea()

            VStack(spacing: 14) {
                header
                categories
                picker
                canvas
                PaletteBar(colors: paintPalette, selected: $chosenColor)
            }
            .padding(18)
        }
    }

    // MARK: Pieces

    private var header: some View {
        HStack(spacing: 12) {
            RoundIconButton(symbol: "chevron.left") { dismiss() }

            Text(silhouette.name)
                .font(.system(size: 24, weight: .semibold, design: .rounded))
                .foregroundStyle(Color.deepPurple)

            Spacer()

            Button {
                withAnimation(.snappy) { fills.removeAll() }
            } label: {
                HStack(spacing: 7) {
                    Image(systemName: "arrow.counterclockwise")
                    Text("Empezar de nuevo")
                }
                .font(.system(size: 16, weight: .medium, design: .rounded))
                .foregroundStyle(Color.deepPurple)
                .padding(.horizontal, 18)
                .padding(.vertical, 12)
                .background(.white, in: Capsule())
            }
            .buttonStyle(.plain)
        }
    }

    private var categories: some View {
        HStack(spacing: 10) {
            categoryChip(id: "animals", name: "Animales")
            categoryChip(id: "places", name: "Paisajes")
            Spacer()
        }
    }

    private func categoryChip(id: String, name: String) -> some View {
        Button {
            category = id
            // Jump to the first drawing of the new category, so the canvas
            // never sits on something that left the strip.
            silhouette = visible.first ?? SilhouetteLibrary.animals[0]
            fills.removeAll()
        } label: {
            Text(name)
                .font(.system(size: 17, weight: .medium, design: .rounded))
                .foregroundStyle(category == id ? .white : Color.deepPurple)
                .padding(.horizontal, 22)
                .padding(.vertical, 10)
                .background(category == id ? Color.pinkStrong : .white, in: Capsule())
        }
        .buttonStyle(.plain)
    }

    private var visible: [Silhouette] {
        SilhouetteLibrary.all.filter { $0.category == category }
    }

    private var picker: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(visible) { item in
                    Button {
                        silhouette = item
                        fills.removeAll()
                    } label: {
                        VStack(spacing: 3) {
                            SilhouettePreview(shapes: item.shapes,
                                              tint: item.id == silhouette.id
                                                  ? Color.pinkStrong
                                                  : Color(white: 0.62))
                                .frame(width: 58, height: 44)
                            Text(item.name)
                                .font(.system(size: 11, design: .rounded))
                                .foregroundStyle(.secondary)
                        }
                        .padding(6)
                        .background(item.id == silhouette.id ? Color.pinkBackground : .white,
                                    in: RoundedRectangle(cornerRadius: 12))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(item.id == silhouette.id ? Color.pinkStrong : .clear,
                                        lineWidth: 2)
                        )
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 2)
        }
    }

    private var canvas: some View {
        GeometryReader { geometry in
            let regions = silhouette.shapes.regions(fitting: geometry.size)

            Canvas { context, _ in
                for (index, region) in regions.enumerated() {
                    if region.isLine {
                        context.stroke(region.path,
                                       with: .color(fills[index] ?? outline),
                                       style: StrokeStyle(lineWidth: 4, lineCap: .round))
                    } else {
                        context.fill(region.path, with: .color(fills[index] ?? blank))
                        context.stroke(region.path,
                                       with: .color(outline),
                                       style: StrokeStyle(lineWidth: 4, lineJoin: .round))
                    }
                }
            }
            .contentShape(Rectangle())
            .onTapGesture { point in
                // Walk back to front: the topmost region under the finger wins.
                for index in regions.indices.reversed() {
                    let region = regions[index]
                    let hit = region.isLine
                        ? region.path.strokedPath(StrokeStyle(lineWidth: 22)).contains(point)
                        : region.path.contains(point)
                    if hit {
                        withAnimation(.easeOut(duration: 0.15)) { fills[index] = chosenColor }
                        return
                    }
                }
            }
        }
        .background(.white, in: RoundedRectangle(cornerRadius: 18))
    }
}

/// Small gray thumbnail used in the silhouette picker.
struct SilhouettePreview: View {
    let shapes: [Shape2D]
    let tint: Color

    var body: some View {
        GeometryReader { geometry in
            let regions = shapes.regions(fitting: geometry.size)
            Canvas { context, _ in
                for region in regions {
                    if region.isLine {
                        context.stroke(region.path, with: .color(tint),
                                       style: StrokeStyle(lineWidth: 5, lineCap: .round))
                    } else {
                        context.fill(region.path, with: .color(tint))
                    }
                }
            }
        }
    }
}

/// Row of big round color swatches.
struct PaletteBar: View {
    let colors: [Color]
    @Binding var selected: Color

    var body: some View {
        HStack(spacing: 12) {
            ForEach(colors.indices, id: \.self) { index in
                let color = colors[index]
                Button {
                    selected = color
                } label: {
                    Circle()
                        .fill(color)
                        .frame(width: 52, height: 52)
                        .overlay(
                            Circle().stroke(Color.deepPurple,
                                            lineWidth: color == selected ? 4 : 0)
                        )
                }
                .buttonStyle(.plain)
            }
        }
    }
}
