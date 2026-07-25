# AurApp

Una app de iPad para una niña de 4 años: videos de YouTube de una lista que tú controlas, y un mundo para pintar.

Es una PWA: se instala desde Safari, sin Mac, sin Xcode, sin cuenta de desarrollador y sin caducidad. Vive en `docs/` y se publica con GitHub Pages.

El código, los nombres de archivo y los comentarios están en inglés. Los textos que ella ve están en español.

---

## Qué hace

**Videos.** Seis mundos temáticos en la primera pantalla. Dentro de cada mundo, páginas de 6 videos con flechas grandes (también funciona deslizar). Nunca hay más de 7 cosas en pantalla y cualquier video queda a dos toques. El mundo *Favoritos* se llena solo con lo que ella repite tres veces o más.

**Reproductor.** Usa el IFrame Player API oficial de YouTube, con los controles de YouTube apagados y reemplazados por dos botones de 76 px: pausa y casita.

Una capa invisible cubre el iframe y se traga todos los toques. Sin eso, tocar el video abre la barra de título de YouTube, el botón de compartir, o directamente una ventana nueva de YouTube. Y como YouTube dibuja su rejilla de "More videos" apenas el video se pausa —`rel=0` dejó de eliminarla en 2018—, mientras está pausado la app tapa el cuadro por completo.

**Límite de tiempo.** El contador solo corre mientras un video está efectivamente reproduciéndose, no mientras ella navega. Al agotarse aparece una pantalla de "el unicornio se fue a dormir" que ofrece ir a pintar. Se reinicia solo al cambiar el día.

**Pintar.** *Colorear*: 22 dibujos originales en dos categorías — 16 animales y 6 paisajes (casa, playa, montañas, castillo, cohete, arcoíris). Se toca un color y luego una zona, que se llena completa. *Dibujar*: lienzo libre con lápiz fino y opaco, pincel grueso y translúcido (los trazos superpuestos se mezclan), y borrador.

**Amigos.** Tres personajes en estilo sticker — Capi el capibara, Michi la gata y Coneja — que comparten un mismo cuerpo, así que la ropa le queda a los tres. Cinco actividades: vestir, darles de comer, bañarlos, jugar y dormir.

En el baño, la mascota se mete en la tina y ella pasa el dedo por encima: donde frota va quedando espuma, que nunca se borra sola. Al llenarla de espuma la mascota sonríe y salen destellos. Jugando, toca un juguete y este llega volando en arco hasta caer a su lado. Las pestañas son dibujos, no palabras: se elige el amigo por su cara y la actividad por el objeto.

**Fotos** *(oculto por ahora)*. Cámara con seis disfraces combinables (sombrero, gafas, corbata, orejas de gato, nariz de perro y cuerno de unicornio). Cada uno se arrastra donde ella quiera y todos quedan quemados en la foto. Las fotos se guardan en IndexedDB en el propio dispositivo, con tope de 30 — al llegar, la más vieja se borra sola. Nunca salen del iPad: no hay servidor.

**El lobo y los tres cerditos.** Tres rondas: casa de paja, de palitos y de ladrillos. Un botón enorme sopla, las dos primeras casas vuelan por los aires y los cerditos corren; la de ladrillos aguanta y el lobo se cae de espaldas. El lobo nunca alcanza a nadie y siempre pierde.

**El bosque.** El juego tradicional de preguntarle al lobo si ya está listo. Cada toque le pone una prenda más — siete en total — y al terminar sale corriendo y los tres amigos se dispersan muertos de risa. El botón nunca cambia de forma, así que la única pista de cuánto falta es mirar al lobo: la espera es el juego.

**Mundos visibles.** Cada mundo que no es de video —Pintar, Amigos, Fotos, El lobo, El bosque— se puede ocultar de la pantalla de inicio desde el panel de padres. Se ocultan, no se borran. *Fotos* viene oculto de fábrica.

**Colores de la app.** Tres paletas en el panel de padres: Unicornio (rosados y morados, la de siempre), Mar (azules y verdes) y Bosque (verdes y tierra). Cambia fondos, botones, acentos y mosaicos. Los personajes y los dibujos para colorear no cambian: son ilustración, no interfaz.

**Panel de padres.** Protegido con PIN de 4 dígitos. Se entra manteniendo apretado el candado 2 segundos. Los números del teclado salen en desorden cada vez: a los 4 años se memorizan posiciones mucho antes que números.

---

## Instalarla en el iPad

1. Abre en **Safari** la dirección donde esté publicada. Tiene que ser Safari — Chrome en iOS no puede instalar apps en la pantalla de inicio.
2. Toca el botón **Compartir** (el cuadrito con la flecha).
3. **Añadir a pantalla de inicio** y confirma.

Queda el ícono del unicornio. Al abrirlo no se ve Safari por ningún lado. Úsala en horizontal.

### Modo Guiado

Esto no es opcional. Sin esto ella simplemente cierra la app y abre otra cosa, y el límite de tiempo no sirve de nada.

**Ajustes → Accesibilidad → Modo Guiado** → activarlo y ponerle un código.

Para usarlo: abre AurApp y da tres clics rápidos al botón lateral. El iPad queda encerrado en la app. Para salir, otros tres clics y el código.

---

## Agregar videos

Mantén apretado el candado 2 segundos, escribe el PIN (viene en `1234`, cámbialo) y pega enlaces de YouTube. El título y la portada se llenan solos: la app se los pide a YouTube por oEmbed, que no necesita API key.

Sirve cualquier forma de enlace:

```
https://www.youtube.com/watch?v=XXXXXXXXXXX
https://youtu.be/XXXXXXXXXXX
https://www.youtube.com/shorts/XXXXXXXXXXX
```

---

## Dónde viven los datos

La lista de videos, el PIN y el contador de tiempo se guardan en `localStorage`, en el dispositivo. **Cada dispositivo tiene su propia lista**: lo que agregues en la Mac no aparece en el iPad.

Safari borra el almacenamiento de sitios que no se visitan en 7 días, **pero las apps agregadas a la pantalla de inicio están exentas** de esa regla.

Aun así, el panel de padres tiene **Exportar** e **Importar**. Vale la pena exportar una vez que tengas los videos cargados, y es la forma de pasar la lista de un dispositivo a otro.

---

## Publicar cambios

Editas los archivos de `docs/`, y:

```bash
git add . && git commit -m "cambios" && git push
```

En un par de minutos el iPad recoge la versión nueva sola. **Nunca borres la app del iPad para actualizarla**: al borrarla se va el `localStorage` y con él toda la lista de videos.

El service worker va en modo *red primero*: cada vez que la app abre con señal, pide los archivos frescos y usa el caché solo como respaldo. Así una actualización entra en la primera apertura, sin trucos.

Si alguna vez queda pegada, basta cerrarla del todo (deslizar hacia arriba en el selector de apps) y volver a abrirla.

Si es la primera vez, en **Settings → Pages** del repositorio: Source `Deploy from a branch`, rama `main`, carpeta **`/docs`**.

---

## Estructura

```
docs/
├── index.html               Todas las pantallas
├── app.css                  Estilos (nada táctil bajo 52 px)
├── app.js                   Estado, navegación, reproductor, pintar
├── silhouettes.js           Los 22 dibujos para colorear
├── pets.js                  Capi, Michi y Coneja, y su clóset compartido
├── camera.js                Disfraces y guardado de fotos en IndexedDB
├── story.js                 El lobo y los tres cerditos
├── forest.js                Juguemos en el bosque (reusa el lobo de story.js)
├── manifest.webmanifest     Para que se instale como app
├── sw.js                    Service worker: pintar funciona sin internet
└── icons/                   Íconos de 180, 192 y 512

silhouettes-preview.png      Cómo se ven los 22 dibujos
```

---

## Los anuncios

El IFrame Player es la única forma que las políticas de YouTube permiten para reproducir sus videos dentro de una app de terceros. Una suscripción Premium **no** aplica ahí: Premium va atado a la cuenta, y ese reproductor incrustado no está firmado con ella. Van a salir anuncios, normalmente de 5 a 15 segundos en contenido infantil.

Las alternativas son descargar los videos (sin anuncios y funciona sin internet, pero viola los términos de YouTube), o usar YouTube Kids para los videos y esta app solo para pintar.

---

## Sobre los dibujos

Los 22 dibujos son originales, construidos con círculos, elipses y curvas. No están basados en ningún personaje existente — los personajes conocidos tienen derechos de autor y no pueden ir en la app ni para uso personal.

Viven en `docs/silhouettes.js`, que es la fuente de verdad. Cada dibujo se traza en una caja de 320 × 300 y se escala solo. Las zonas se listan de atrás hacia adelante: la última dibujada queda encima, y el toque se resuelve recorriendo la lista al revés.

Para agregar un dibujo nuevo se añade una entrada más al arreglo, con su `id`, `name`, `category` y el SVG de sus zonas. No hay que tocar ningún otro archivo.

```js
{
  "id": "star",
  "name": "Estrella",
  "category": "places",
  "svg": "<circle cx=\"160\" cy=\"150\" r=\"60\" class=\"rg\"/>"
}
```

Las zonas llevan `class="rg"`. Si una zona es solo una línea (un bigote, una antena), lleva `class="rg ln"` y `fill="none"`.
