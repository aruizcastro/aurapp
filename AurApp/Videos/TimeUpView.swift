import SwiftUI

/// Shown over everything once the daily minutes run out.
/// Painting stays available: it does not burn video screen time.
struct TimeUpView: View {
    @State private var askingPin = false
    @State private var showParents = false
    @State private var showPaint = false

    var body: some View {
        ZStack {
            Color.purpleBackground.ignoresSafeArea()

            VStack(spacing: 16) {
                Image(systemName: "moon.zzz.fill")
                    .font(.system(size: 62))
                    .foregroundStyle(Color.deepPurple)
                    .frame(width: 132, height: 132)
                    .background(Color.softPurple, in: Circle())

                Text("El unicornio se fue a dormir")
                    .font(.system(size: 32, weight: .semibold, design: .rounded))
                    .foregroundStyle(Color.deepPurple)

                Text("Mañana hay más videos")
                    .font(.system(size: 20, design: .rounded))
                    .foregroundStyle(Color.deepPurple.opacity(0.7))

                Button { showPaint = true } label: {
                    HStack(spacing: 9) {
                        Image(systemName: "paintbrush.pointed.fill")
                        Text("Vamos a pintar")
                    }
                    .font(.system(size: 21, weight: .medium, design: .rounded))
                    .foregroundStyle(Color.deepPurple)
                    .padding(.horizontal, 30)
                    .padding(.vertical, 16)
                    .background(Color.softPink, in: Capsule())
                }
                .buttonStyle(.plain)
                .padding(.top, 12)

                Button("Soy papá o mamá") { askingPin = true }
                    .font(.system(size: 16, design: .rounded))
                    .foregroundStyle(.secondary)
                    .padding(.top, 20)
            }
        }
        .fullScreenCover(isPresented: $showPaint) { PaintView() }
        .fullScreenCover(isPresented: $askingPin) {
            PinView { correct in
                askingPin = false
                if correct { showParents = true }
            }
        }
        .fullScreenCover(isPresented: $showParents) { ParentsView() }
    }
}
