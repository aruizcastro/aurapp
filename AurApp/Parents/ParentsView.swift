import SwiftUI

/// Parent panel: add videos, edit the list, change the daily limit and the PIN.
struct ParentsView: View {
    @Environment(Store.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var showAddVideo = false

    var body: some View {
        NavigationStack {
            Form {
                Section("Tiempo") {
                    Picker("Límite diario", selection: limitBinding) {
                        Text("Sin límite").tag(0)
                        ForEach([15, 20, 30, 45, 60, 90], id: \.self) { minutes in
                            Text("\(minutes) minutos").tag(minutes)
                        }
                    }
                    LabeledContent("Usado hoy", value: "\(store.minutesUsedToday) min")
                    Button("Reiniciar el contador de hoy") { store.resetTodaysTime() }
                }

                Section("Videos (\(store.videos.count))") {
                    Button { showAddVideo = true } label: {
                        Label("Agregar video", systemImage: "plus.circle.fill")
                    }

                    ForEach(store.worlds) { world in
                        let inWorld = store.videos.filter { $0.world == world.id }
                        if !inWorld.isEmpty {
                            DisclosureGroup("\(world.name) · \(inWorld.count)") {
                                ForEach(inWorld) { video in
                                    videoRow(video)
                                }
                            }
                        }
                    }

                    if store.videos.isEmpty {
                        Text("Todavía no hay videos. Toca «Agregar video» y pega un enlace de YouTube.")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }
                }

                Section("Seguridad") {
                    LabeledContent("PIN actual", value: store.pin)
                    NavigationLink("Cambiar PIN") { ChangePinView() }
                    Text("Activa el Modo Guiado en Ajustes → Accesibilidad para que no pueda salirse de la app: triple clic al botón lateral.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Ajustes")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Listo") { dismiss() }
                }
            }
            .sheet(isPresented: $showAddVideo) { AddVideoView() }
        }
    }

    private func videoRow(_ video: Video) -> some View {
        HStack(spacing: 11) {
            Thumbnail(id: video.id)
                .frame(width: 64, height: 36)
                .clipShape(RoundedRectangle(cornerRadius: 6))

            VStack(alignment: .leading, spacing: 2) {
                Text(video.title).lineLimit(1)
                Text("Vista \(video.playCount) veces")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Menu {
                ForEach(store.worlds.filter { $0.id != favoritesWorldID }) { world in
                    Button(world.name) { store.move(video, toWorld: world.id) }
                }
                Divider()
                Button("Borrar", role: .destructive) { store.delete(video) }
            } label: {
                Image(systemName: "ellipsis.circle")
            }
        }
    }

    private var limitBinding: Binding<Int> {
        Binding(
            get: { store.dailyLimitMinutes },
            set: { store.dailyLimitMinutes = $0; store.save() }
        )
    }
}

// MARK: - Add video

struct AddVideoView: View {
    @Environment(Store.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var link = ""
    @State private var title = ""
    @State private var world = "songs"
    @State private var loadingTitle = false
    @State private var problem: String?

    private var videoID: String? { Video.extractID(from: link) }

    var body: some View {
        NavigationStack {
            Form {
                Section("Enlace de YouTube") {
                    TextField("https://youtu.be/...", text: $link, axis: .vertical)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .onChange(of: link) { _, _ in lookUpTitle() }

                    if let videoID {
                        HStack(spacing: 11) {
                            Thumbnail(id: videoID)
                                .frame(width: 96, height: 54)
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                            if loadingTitle { ProgressView() }
                        }
                    }
                }

                Section("Título") {
                    TextField("Cómo lo va a ver ella", text: $title)
                }

                Section("Mundo") {
                    Picker("Mundo", selection: $world) {
                        ForEach(store.worlds.filter { $0.id != favoritesWorldID }) { world in
                            Text(world.name).tag(world.id)
                        }
                    }
                    .pickerStyle(.inline)
                    .labelsHidden()
                }

                if let problem {
                    Text(problem).foregroundStyle(.red)
                }
            }
            .navigationTitle("Agregar video")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancelar") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Guardar") { save() }
                        .disabled(videoID == nil || title.isEmpty)
                }
            }
        }
    }

    private func lookUpTitle() {
        guard let videoID, title.isEmpty else { return }
        loadingTitle = true
        Task {
            let fetched = await Store.fetchTitle(forID: videoID)
            await MainActor.run {
                if title.isEmpty, let fetched { title = fetched }
                loadingTitle = false
            }
        }
    }

    private func save() {
        if store.add(link: link, title: title, world: world) {
            dismiss()
        } else {
            problem = "Ese enlace no sirve o el video ya está en la lista."
        }
    }
}

// MARK: - Change PIN

struct ChangePinView: View {
    @Environment(Store.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var newPin = ""

    var body: some View {
        Form {
            Section("PIN nuevo") {
                TextField("4 dígitos", text: $newPin)
                    .keyboardType(.numberPad)
                    .onChange(of: newPin) { _, value in
                        newPin = String(value.filter(\.isNumber).prefix(4))
                    }
            }
            Button("Guardar") {
                store.pin = newPin
                store.save()
                dismiss()
            }
            .disabled(newPin.count != 4)
        }
        .navigationTitle("Cambiar PIN")
        .navigationBarTitleDisplayMode(.inline)
    }
}
