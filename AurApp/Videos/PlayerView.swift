import SwiftUI
import WebKit

/// Player built on YouTube's IFrame Player API.
/// No search, no recommendations, no related videos at the end.
/// The controls are ours: two big buttons and a progress bar.
struct PlayerView: View {
    let video: Video

    @Environment(Store.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var controller = PlayerController()
    @State private var isPlaying = true
    @State private var currentTime: Double = 0
    @State private var duration: Double = 1
    @State private var ticker: Timer?

    var body: some View {
        ZStack {
            Color.deepPurple.ignoresSafeArea()

            VStack(spacing: 18) {
                YouTubeWebPlayer(videoID: video.id, controller: controller) { event in
                    switch event {
                    case .time(let current, let total):
                        currentTime = current
                        if total > 0 { duration = total }
                    case .state(let state):
                        isPlaying = (state == 1)
                        if state == 0 { dismiss() }   // video ended
                    }
                }
                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

                HStack(spacing: 18) {
                    Button {
                        isPlaying ? controller.pause() : controller.play()
                    } label: {
                        Image(systemName: isPlaying ? "pause.fill" : "play.fill")
                            .font(.system(size: 30))
                            .foregroundStyle(Color.deepPurple)
                            .frame(width: 76, height: 76)
                            .background(Color.softPink, in: Circle())
                    }
                    .buttonStyle(.plain)

                    GeometryReader { geometry in
                        ZStack(alignment: .leading) {
                            Capsule().fill(.white.opacity(0.22))
                            Capsule()
                                .fill(Color.softPink)
                                .frame(width: max(0, geometry.size.width * progress))
                        }
                    }
                    .frame(height: 14)

                    Button { dismiss() } label: {
                        Image(systemName: "house.fill")
                            .font(.system(size: 30))
                            .foregroundStyle(Color.deepPurple)
                            .frame(width: 76, height: 76)
                            .background(Color.softPurple, in: Circle())
                    }
                    .buttonStyle(.plain)
                }
                .padding(.horizontal, 4)
            }
            .padding(22)
        }
        .statusBarHidden()
        .onAppear {
            store.recordPlay(video)
            // Time only burns while the video is actually running.
            ticker = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
                guard isPlaying else { return }
                store.addOneSecond()
                if store.isOutOfTime { dismiss() }
            }
        }
        .onDisappear {
            ticker?.invalidate()
            ticker = nil
        }
    }

    private var progress: Double {
        guard duration > 0 else { return 0 }
        return min(1, max(0, currentTime / duration))
    }
}

// MARK: - Bridge to the YouTube player

enum PlayerEvent {
    case time(Double, Double)
    case state(Int)
}

@Observable
final class PlayerController {
    weak var webView: WKWebView?

    func play()  { webView?.evaluateJavaScript("command('play')") }
    func pause() { webView?.evaluateJavaScript("command('pause')") }
}

struct YouTubeWebPlayer: UIViewRepresentable {
    let videoID: String
    let controller: PlayerController
    let onEvent: (PlayerEvent) -> Void

    func makeCoordinator() -> Coordinator { Coordinator(onEvent: onEvent) }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        configuration.userContentController.add(context.coordinator, name: "app")

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.navigationDelegate = context.coordinator

        controller.webView = webView
        webView.loadHTMLString(Self.html(videoID: videoID),
                               baseURL: URL(string: "https://www.youtube.com"))
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    final class Coordinator: NSObject, WKScriptMessageHandler, WKNavigationDelegate {
        let onEvent: (PlayerEvent) -> Void
        init(onEvent: @escaping (PlayerEvent) -> Void) { self.onEvent = onEvent }

        func userContentController(_ controller: WKUserContentController,
                                   didReceive message: WKScriptMessage) {
            guard let body = message.body as? [String: Any],
                  let kind = body["kind"] as? String else { return }

            if kind == "time" {
                onEvent(.time(body["current"] as? Double ?? 0, body["total"] as? Double ?? 0))
            } else if kind == "state" {
                onEvent(.state(body["value"] as? Int ?? -1))
            }
        }

        /// No navigating away from the video. If YouTube tries to open another
        /// page (a link in the description, a channel), it gets blocked.
        func webView(_ webView: WKWebView,
                     decidePolicyFor action: WKNavigationAction,
                     decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            decisionHandler(action.navigationType == .linkActivated ? .cancel : .allow)
        }
    }

    static func html(videoID: String) -> String {
        """
        <!doctype html><html><head>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        <style>
          html, body { margin:0; padding:0; background:#26215C; overflow:hidden; height:100%; }
          #player { position:absolute; inset:0; width:100%; height:100%; }
          /* Covers the player's title bar and share button */
          #shield { position:absolute; top:0; left:0; right:0; height:70px; z-index:9; }
        </style></head>
        <body>
        <div id="player"></div>
        <div id="shield"></div>
        <script src="https://www.youtube.com/iframe_api"></script>
        <script>
        var player;

        function send(message) { window.webkit.messageHandlers.app.postMessage(message); }

        function onYouTubeIframeAPIReady() {
          player = new YT.Player('player', {
            videoId: '\(videoID)',
            playerVars: {
              playsinline: 1, controls: 0, rel: 0, modestbranding: 1,
              fs: 0, disablekb: 1, iv_load_policy: 3, autoplay: 1
            },
            events: {
              onReady: function () { player.playVideo(); heartbeat(); },
              onStateChange: function (event) { send({ kind: 'state', value: event.data }); }
            }
          });
        }

        function heartbeat() {
          try {
            if (player && player.getCurrentTime) {
              send({ kind: 'time',
                     current: player.getCurrentTime() || 0,
                     total: player.getDuration() || 0 });
            }
          } catch (error) {}
          setTimeout(heartbeat, 500);
        }

        function command(name) {
          if (!player) return;
          if (name === 'play')  player.playVideo();
          if (name === 'pause') player.pauseVideo();
        }
        </script></body></html>
        """
    }
}
