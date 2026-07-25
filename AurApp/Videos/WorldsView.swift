import SwiftUI

/// First screen: the doors. Never more than 7 things on screen at once.
struct WorldsView: View {
    @Environment(Store.self) private var store

    @State private var openWorld: World?
    @State private var showPaint = false
    @State private var askingPin = false
    @State private var showParents = false

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 14), count: 3)

    var body: some View {
        ZStack {
            Color.pinkBackground.ignoresSafeArea()

            VStack(spacing: 18) {
                header

                LazyVGrid(columns: columns, spacing: 14) {
                    ForEach(store.worlds) { world in
                        let count = store.videoCount(inWorld: world.id)
                        Button { openWorld = world } label: {
                            WorldTile(name: world.name,
                                      symbol: world.symbol,
                                      color: world.color.color,
                                      detail: "\(count) videos")
                        }
                        .buttonStyle(.plain)
                        .disabled(count == 0)
                        .opacity(count == 0 ? 0.4 : 1)
                    }

                    Button { showPaint = true } label: {
                        WorldTile(name: "Pintar",
                                  symbol: "paintbrush.pointed.fill",
                                  color: .softPink,
                                  detail: "16 dibujos")
                    }
                    .buttonStyle(.plain)
                }

                Spacer(minLength: 0)
            }
            .padding(22)
        }
        .fullScreenCover(item: $openWorld) { WorldVideosView(world: $0) }
        .fullScreenCover(isPresented: $showPaint) { PaintView() }
        .fullScreenCover(isPresented: $askingPin) {
            PinView { correct in
                askingPin = false
                if correct { showParents = true }
            }
        }
        .fullScreenCover(isPresented: $showParents) { ParentsView() }
    }

    private var header: some View {
        HStack {
            Text("¿Qué quieres ver hoy?")
                .font(.system(size: 30, weight: .semibold, design: .rounded))
                .foregroundStyle(Color.deepPurple)

            Spacer()

            if store.dailyLimitMinutes > 0 {
                HStack(spacing: 7) {
                    Image(systemName: "clock.fill")
                    Text("\(store.minutesRemaining) min")
                }
                .font(.system(size: 18, weight: .medium, design: .rounded))
                .foregroundStyle(Color.deepPurple)
                .padding(.horizontal, 16)
                .padding(.vertical, 9)
                .background(Color.purpleBackground, in: Capsule())
            }

            // Parent lock: has to be held down for two seconds.
            Image(systemName: "lock.fill")
                .font(.system(size: 20))
                .foregroundStyle(.secondary)
                .frame(width: 46, height: 46)
                .background(.white.opacity(0.7), in: Circle())
                .onLongPressGesture(minimumDuration: 2) { askingPin = true }
                .padding(.leading, 6)
        }
    }
}

struct WorldTile: View {
    let name: String
    let symbol: String
    let color: Color
    let detail: String

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: symbol)
                .font(.system(size: 46))
                .foregroundStyle(Color.deepPurple.opacity(0.85))
            Text(name)
                .font(.system(size: 21, weight: .semibold, design: .rounded))
                .foregroundStyle(Color.deepPurple)
            Text(detail)
                .font(.system(size: 14, design: .rounded))
                .foregroundStyle(Color.deepPurple.opacity(0.6))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 26)
        .background(color, in: RoundedRectangle(cornerRadius: 26, style: .continuous))
    }
}
