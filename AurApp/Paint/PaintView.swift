import SwiftUI

/// Entry screen for the painting world: two big doors.
struct PaintView: View {
    @Environment(\.dismiss) private var dismiss

    @State private var showColoring = false
    @State private var showFreeDraw = false

    var body: some View {
        ZStack {
            Color.pinkBackground.ignoresSafeArea()

            VStack(spacing: 22) {
                HStack(spacing: 12) {
                    RoundIconButton(symbol: "house.fill") { dismiss() }
                    Text("¿Qué quieres pintar?")
                        .font(.system(size: 28, weight: .semibold, design: .rounded))
                        .foregroundStyle(Color.deepPurple)
                    Spacer()
                }

                HStack(spacing: 18) {
                    Button { showColoring = true } label: {
                        PaintDoor(title: "Colorear",
                                  detail: "16 dibujos",
                                  color: .softTeal) {
                            SilhouettePreview(shapes: SilhouetteLibrary.unicorn.shapes,
                                              tint: Color.deepPurple.opacity(0.75))
                        }
                    }
                    .buttonStyle(.plain)

                    Button { showFreeDraw = true } label: {
                        PaintDoor(title: "Dibujar",
                                  detail: "Lo que quieras",
                                  color: .softAmber) {
                            Image(systemName: "scribble.variable")
                                .font(.system(size: 70))
                                .foregroundStyle(Color.deepPurple.opacity(0.75))
                        }
                    }
                    .buttonStyle(.plain)
                }

                Spacer(minLength: 0)
            }
            .padding(22)
        }
        .fullScreenCover(isPresented: $showColoring) { ColoringView() }
        .fullScreenCover(isPresented: $showFreeDraw) { FreeDrawView() }
    }
}

struct PaintDoor<Art: View>: View {
    let title: String
    let detail: String
    let color: Color
    @ViewBuilder var art: Art

    var body: some View {
        VStack(spacing: 10) {
            art.frame(height: 130)

            Text(title)
                .font(.system(size: 26, weight: .semibold, design: .rounded))
                .foregroundStyle(Color.deepPurple)

            Text(detail)
                .font(.system(size: 16, design: .rounded))
                .foregroundStyle(Color.deepPurple.opacity(0.6))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 34)
        .background(color, in: RoundedRectangle(cornerRadius: 28, style: .continuous))
    }
}
