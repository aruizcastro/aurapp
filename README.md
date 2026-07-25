# AurApp

Una app de iPad para una niña de 4 años: videos de YouTube de una lista que tú controlas, y un mundo para pintar.

Hay dos versiones del mismo proyecto en este repositorio:

| Carpeta | Qué es | Estado |
|---|---|---|
| `docs/` | **PWA** — se instala desde Safari, sin Mac ni Xcode | **Esta es la que se usa** |
| `AurApp/` | App nativa SwiftUI | Completa, pero no compilable con el equipo actual |

El código, los nombres de archivo y los comentarios están en inglés. Los textos que ella ve están en español.

---

## Por qué la PWA y no la app nativa

El Mac mini de 2018 se quedó en macOS Sequoia: Apple lo dejó fuera de macOS Tahoe 26. Y como Xcode 26 exige Tahoe, el techo de ese equipo es Xcode 16.4, que trae los SDK de iPadOS 18.5. El iPad está en iPadOS 26.5.2, así que Xcode 16.4 se niega a instalarle nada.

El código SwiftIUI queda guardado en `AurApp/` por si algún día hay una Mac más nueva. Mientras tanto, la PWA hace lo mismo y en varios aspectos gana: no caduca a los 7 días, no cuesta $99 al año, y se actualiza sola cuando cambias el código.

---

## Qué hace

**Videos.** Seis mundos temáticos en la primera pantalla. Dentro de cada mundo, páginas de 6 videos con flechas grandes (también funciona deslizar). Nunca hay más de 7 cosas en pantalla y cualquier video queda a dos toques. El mundo *Favoritos* se llena solo con lo que ella repite tres veces o más.

**Reproductor.** Usa el IFrame Player API oficial de YouTube, con los controles de YouTube apagados y reemplazados por dos botones de 76 px: pausa y casita.

Una capa invisible cubre el iframe y se traga todos los toques. Sin eso, tocar el video abre la barra de título de YouTube, el botón de compartir, o directamente una ventana nueva de YouTube. Y como YouTube dibuja su rejilla de "More videos" apenas el video se pausa —`rel=0` dejó de eliminarla en 2018—, mientras está pausado la app tapa el cuadro por completo.

**Límite de tiempo.** El contador solo corre mientras un video está efectivamente reproduciéndose, no mientras ella navega. Al agotarse aparece una pantalla de "el unicornio se fue a dormir" que ofrece ir a pintar. Se reinicia solo al cambiar el día.

**Pintar.** *Colorear*: 22 dibujos originales en dos categorías — 16 animales y 6 paisajes (casa, playa, montañas, castillo, cohete, arcoíris). Se toca un color y luego una zona, que se llena completa. *Dibujar*: lienzo libre con lápiz fino y opaco, pincel grueso y translúcido (los trazos superpuestos se mezclan), y borrador.

**Panel de padres.** Protegido con PIN de 4 dígitos. Se entra manteniendo apretado el candado 2 segundos. Los números del teclado salen en desorden cada vez: a los 4 años se memorizan posiciones mucho antes que números.

---

## Publicarla (una sola vez, ~10 minutos)

La PWA necesita estar en una dirección con HTTPS. GitHub Pages es gratis y permanente.

### 1. Subir el repositorio

Crea un repositorio en [github.com/new](https://github.com/new). Ponle `aurapp` y déjalo público (Pages gratis requiere repositorio público).

Desde Terminal, en esta carpeta:

```bash
cd ~/projects/aurapp
git init
git add .
git commit -m "AurApp"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/aurapp.git
git push -u origin main
```

Cambia `TU-USUARIO` por tu usuario de GitHub. Si te pide contraseña, GitHub ya no las acepta: crea un token en Settings → Developer settings → Personal access tokens y úsalo como contraseña.

### 2. Activar Pages

En el repositorio: **Settings → Pages**.

- **Source**: Deploy from a branch
- **Branch**: `main`, carpeta `/docs`
- **Save**

En un par de minutos tu app queda en:

```
https://TU-USUARIO.github.io/aurapp/
```

### 3. Instalarla en el iPad

1. Abre esa dirección en **Safari** en el iPad. Tiene que ser Safari — Chrome en iOS no puede instalar apps en la pantalla de inicio.
2. Toca el botón **Compartir** (el cuadrito con la flecha).
3. **Añadir a pantalla de inicio**.
4. Ponle el nombre y toca Añadir.

Queda el ícono del unicornio. Al abrirlo no se ve Safari por ningún lado.

### 4. Activar el Modo Guiado

Esto no es opcional. Sin esto ella simplemente cierra la app y abre otra cosa, y el límite de tiempo no sirve de nada.

**Ajustes → Accesibilidad → Modo Guiado** → activarlo y ponerle un código.

Para usarlo: abre AurApp y da tres clics rápidos al botón lateral. El iPad queda encerrado en la app. Para salir, otros tres clics y el código.

### 5. Agregar los videos

Abre la app, mantén apretado el candado 2 segundos, escribe el PIN (viene en `1234`, cámbialo) y pega enlaces de YouTube. El título se llena solo.

Sirve cualquier forma de enlace:

```
https://www.youtube.com/watch?v=XXXXXXXXXXX
https://youtu.be/XXXXXXXXXXX
https://www.youtube.com/shorts/XXXXXXXXXXX
```

---

## Actualizar la app después

Editas los archivos de `docs/`, y:

```bash
git add . && git commit -m "cambios" && git push
```

En un par de minutos el iPad recoge la versión nueva sola. No hay que reinstalar nada.

---

## Dónde viven los datos

La lista de videos, el PIN y el contador de tiempo se guardan en `localStorage`, dentro del iPad. Safari borra el almacenamiento de sitios que no se visitan en 7 días, **pero las apps agregadas a la pantalla de inicio están exentas** de esa regla.

Aun así, el panel de padres tiene **Exportar** e **Importar**: te baja un archivo con tu lista. Vale la pena exportar una vez que tengas los videos cargados, por si cambias de iPad.

---

## Estructura

```
docs/                        La PWA
├── index.html               Todas las pantallas
├── app.css                  Estilos (nada táctil bajo 52 px)
├── app.js                   Estado, navegación, reproductor, pintar
├── silhouettes.js           Los 22 dibujos — fuente de verdad
├── manifest.webmanifest     Para que se instale como app
├── sw.js                    Service worker: pintar funciona sin internet
└── icons/                   Íconos de 180, 192 y 512

AurApp/                      La versión SwiftUI, guardada para más adelante
silhouettes-preview.png      Cómo se ven los 22 dibujos
```

---

## Los anuncios

El IFrame Player es la única forma que las políticas de YouTube permiten para reproducir sus videos dentro de una app de terceros. Tu suscripción Premium **no** aplica ahí: Premium va atado a tu cuenta, y ese reproductor incrustado no está firmado con ella. Van a salir anuncios, normalmente de 5 a 15 segundos en contenido infantil.

Las alternativas son descargar los videos (sin anuncios y funciona sin internet, pero viola los términos de YouTube), o usar YouTube Kids para los videos y esta app solo para pintar.

---

## Sobre los dibujos

Los 22 dibujos son originales, construidas con círculos, elipses y curvas. No están basadas en ningún personaje existente — los personajes conocidos tienen derechos de autor y no pueden ir en la app ni para uso personal.

Viven en `docs/silhouettes.js`, que es la fuente de verdad. Cada dibujo se traza en una caja de 320 × 300 y se escala solo. Las zonas se listan de atrás hacia adelante: la última dibujada queda encima, y el toque se resuelve recorriendo la lista al revés.

Para agregar un dibujo nuevo, se añade una entrada más al arreglo con su `id`, `name`, `category` y el SVG de sus zonas. No hay que tocar ningún otro archivo.
