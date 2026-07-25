import SwiftUI

/// PIN pad. The digits are shuffled on purpose: a four-year-old can memorize
/// button positions long before she can read numbers.
struct PinView: View {
    @Environment(Store.self) private var store
    @Environment(\.dismiss) private var dismiss

    let onFinish: (Bool) -> Void

    @State private var entered = ""
    @State private var wrong = false
    @State private var keys: [Int] = Array(0...9).shuffled()

    private let columns = Array(repeating: GridItem(.flexible()), count: 3)

    var body: some View {
        ZStack {
            Color(white: 0.96).ignoresSafeArea()

            VStack(spacing: 22) {
                Text("PIN de papá o mamá")
                    .font(.system(size: 22, weight: .medium, design: .rounded))

                HStack(spacing: 14) {
                    ForEach(0 ..< 4, id: \.self) { index in
                        Circle()
                            .fill(index < entered.count ? Color.pinkStrong : Color(white: 0.86))
                            .frame(width: 18, height: 18)
                    }
                }
                .modifier(ShakeEffect(active: wrong))

                LazyVGrid(columns: columns, spacing: 14) {
                    ForEach(keys.prefix(9), id: \.self) { digit in
                        key(digit)
                    }

                    Color.clear.frame(height: 62)

                    key(keys[9])

                    Button {
                        if !entered.isEmpty { entered.removeLast() }
                    } label: {
                        Image(systemName: "delete.left")
                            .font(.system(size: 22))
                            .frame(maxWidth: .infinity, minHeight: 62)
                            .background(.white, in: RoundedRectangle(cornerRadius: 16))
                    }
                    .buttonStyle(.plain)
                }
                .frame(width: 300)

                Button("Cancelar") {
                    onFinish(false)
                    dismiss()
                }
                .font(.system(size: 16, design: .rounded))
                .foregroundStyle(.secondary)
                .padding(.top, 8)
            }
        }
    }

    private func key(_ digit: Int) -> some View {
        Button {
            guard entered.count < 4 else { return }
            entered.append(String(digit))
            if entered.count == 4 { check() }
        } label: {
            Text("\(digit)")
                .font(.system(size: 26, weight: .medium, design: .rounded))
                .foregroundStyle(Color.ink)
                .frame(maxWidth: .infinity, minHeight: 62)
                .background(.white, in: RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.plain)
    }

    private func check() {
        if entered == store.pin {
            onFinish(true)
            dismiss()
        } else {
            withAnimation(.default) { wrong = true }
            entered = ""
            keys.shuffle()
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { wrong = false }
        }
    }
}

struct ShakeEffect: ViewModifier {
    let active: Bool

    func body(content: Content) -> some View {
        content
            .offset(x: active ? 9 : 0)
            .animation(.default.repeatCount(3, autoreverses: true).speed(6), value: active)
    }
}
