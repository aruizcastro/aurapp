import SwiftUI

@main
struct AurAppApp: App {
    @State private var store = Store()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(store)
                // The app is built for landscape on an iPad. Locking the look
                // to light mode keeps the pastel palette from being inverted.
                .preferredColorScheme(.light)
                .persistentSystemOverlays(.hidden)
        }
    }
}

struct RootView: View {
    @Environment(Store.self) private var store
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        Group {
            if store.isOutOfTime {
                TimeUpView()
            } else {
                WorldsView()
            }
        }
        .animation(.easeInOut, value: store.isOutOfTime)
        .onChange(of: scenePhase) { _, phase in
            // Flush the list when the app goes to the background.
            if phase == .background { store.save() }
        }
    }
}
