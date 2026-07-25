import SwiftUI

/// Inside a world: pages of 6 videos, no scrolling.
struct WorldVideosView: View {
    let world: World

    @Environment(Store.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var page = 0
    @State private var openVideo: Video?

    private let perPage = 6
    private let columns = Array(repeating: GridItem(.flexible(), spacing: 14), count: 3)

    private var all: [Video] { store.videos(inWorld: world.id) }
    private var pageCount: Int { max(1, Int(ceil(Double(all.count) / Double(perPage)))) }

    private var visible: [Video] {
        let start = page * perPage
        guard start < all.count else { return [] }
        return Array(all[start ..< min(start + perPage, all.count)])
    }

    var body: some View {
        ZStack {
            Color.purpleBackground.ignoresSafeArea()

            VStack(spacing: 16) {
                HStack(spacing: 12) {
                    RoundIconButton(symbol: "house.fill") { dismiss() }

                    Text(world.name)
                        .font(.system(size: 27, weight: .semibold, design: .rounded))
                        .foregroundStyle(Color.deepPurple)

                    Spacer()

                    if store.dailyLimitMinutes > 0 {
                        HStack(spacing: 7) {
                            Image(systemName: "clock.fill")
                            Text("\(store.minutesRemaining) min")
                        }
                        .font(.system(size: 17, weight: .medium, design: .rounded))
                        .foregroundStyle(Color.deepPurple)
                        .padding(.horizontal, 15)
                        .padding(.vertical, 8)
                        .background(.white.opacity(0.7), in: Capsule())
                    }
                }

                HStack(spacing: 12) {
                    PageArrow(symbol: "chevron.left", enabled: page > 0) {
                        withAnimation(.snappy) { page -= 1 }
                    }

                    LazyVGrid(columns: columns, spacing: 14) {
                        ForEach(visible) { video in
                            Button { openVideo = video } label: {
                                VideoTile(video: video)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .frame(maxWidth: .infinity)

                    PageArrow(symbol: "chevron.right", enabled: page < pageCount - 1) {
                        withAnimation(.snappy) { page += 1 }
                    }
                }

                if pageCount > 1 {
                    HStack(spacing: 10) {
                        ForEach(0 ..< pageCount, id: \.self) { index in
                            Circle()
                                .fill(index == page ? Color.pinkStrong : Color.softPink)
                                .frame(width: 14, height: 14)
                        }
                    }
                }

                Spacer(minLength: 0)
            }
            .padding(22)
        }
        // Swiping also turns the page.
        .gesture(
            DragGesture(minimumDistance: 40).onEnded { value in
                if value.translation.width < -40, page < pageCount - 1 {
                    withAnimation(.snappy) { page += 1 }
                } else if value.translation.width > 40, page > 0 {
                    withAnimation(.snappy) { page -= 1 }
                }
            }
        )
        .fullScreenCover(item: $openVideo) { PlayerView(video: $0) }
    }
}

struct VideoTile: View {
    let video: Video

    var body: some View {
        VStack(alignment: .leading, spacing: 7) {
            ZStack(alignment: .topLeading) {
                Thumbnail(id: video.id)
                    .aspectRatio(16.0 / 9.0, contentMode: .fit)
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))

                Image(systemName: "play.fill")
                    .font(.system(size: 15))
                    .foregroundStyle(Color.deepPurple)
                    .frame(width: 34, height: 34)
                    .background(.white.opacity(0.92), in: Circle())
                    .padding(8)
            }

            Text(video.title)
                .font(.system(size: 16, weight: .medium, design: .rounded))
                .foregroundStyle(Color.deepPurple)
                .lineLimit(2)
                .multilineTextAlignment(.leading)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(9)
        .background(.white, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
    }
}

struct PageArrow: View {
    let symbol: String
    let enabled: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: symbol)
                .font(.system(size: 30, weight: .semibold))
                .foregroundStyle(enabled ? .white : Color.deepPurple.opacity(0.25))
                .frame(width: 62, height: 130)
                .background(enabled ? Color.pinkStrong : Color.white.opacity(0.6),
                            in: RoundedRectangle(cornerRadius: 20, style: .continuous))
        }
        .buttonStyle(.plain)
        .disabled(!enabled)
    }
}

struct RoundIconButton: View {
    let symbol: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: symbol)
                .font(.system(size: 22))
                .foregroundStyle(Color.deepPurple)
                .frame(width: 52, height: 52)
                .background(.white, in: Circle())
        }
        .buttonStyle(.plain)
    }
}
