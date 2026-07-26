# La app de Android

La misma app web, empaquetada en un APK. **Sin videos**, sin permisos, sin
internet.

No es un TWA: los archivos van *dentro* del APK y se sirven con
`WebViewAssetLoader`. Eso significa que funciona sin conexión, que no depende
de que GitHub Pages siga en pie, y que no hace falta verificar el dominio con
Digital Asset Links.

---

## Lo que necesitas

- **Android Studio** (cualquier versión reciente). Corre bien en tu Mac mini
  con Sequoia — este es justamente el camino que Xcode te cerró.
- Nada más. No hay que instalar Gradle aparte: Android Studio lo trae.

---

## Compilar

```bash
cd ~/projects/aurapp
./android/sync-web.sh        # copia docs/ dentro del APK y apaga los videos
```

Después abre la carpeta `android/` en Android Studio (*Open*, no *Import*),
deja que sincronice, y:

- **Probar en un dispositivo**: conecta el teléfono con depuración USB y dale
  al botón de *Run*.
- **Generar el instalable**: *Build → Generate Signed App Bundle / APK*.
  Elige **Android App Bundle** (`.aab`), que es lo que pide Play.

> **Cada vez que cambies algo en `docs/` hay que volver a correr
> `sync-web.sh`.** El APK lleva una copia; no lee `docs/` al compilar. El
> script falla ruidosamente si algo no cuadra, en vez de generar un APK roto en
> silencio.

---

## Si el build falla

**«Duplicate class kotlin.…»** — desde Kotlin 1.8, `kotlin-stdlib-jdk7` y
`kotlin-stdlib-jdk8` viven dentro de `kotlin-stdlib`. Si una librería pide la
nueva y otra sigue pidiendo las viejas, las mismas clases llegan dos veces.
`app/build.gradle` ya trae el BOM de Kotlin y un `force` para las tres, que es
la solución. Si vuelve a aparecer con otro nombre, para ver quién lo pide:

```bash
cd android
./gradlew :app:dependencies --configuration releaseRuntimeClasspath | grep kotlin
```

Y después de tocar `build.gradle`: *File → Sync Project with Gradle Files*, y si
insiste, *Build → Clean Project*.

**Gradle no encuentra el wrapper** — abre la carpeta `android/` con *Open*, no
con *Import*; Android Studio genera el wrapper solo. También sirve
`gradle wrapper` si tienes Gradle instalado.

---

## La llave de firma

La primera vez, Android Studio te ofrece crear un *keystore*. **Guárdalo y
guarda su contraseña donde no se pierdan.**

Si pierdes esa llave no puedes volver a actualizar la app nunca: Play rechaza
cualquier versión firmada con otra llave. Es el error más caro y más común de
un primer lanzamiento. Ponlo en tu gestor de contraseñas, no en la carpeta del
proyecto — el `.gitignore` ignora los `.jks` y `.keystore` a propósito, para
que no acaben en GitHub.

Vale la pena activar **Play App Signing** al subir la app: Google guarda la
llave de firma y tú solo conservas la de subida, que sí se puede reemplazar si
se pierde.

---

## Qué lleva y qué no

| | |
| --- | --- |
| Mundos | Los 9: pintar, dibujar, amigos, gusanito, mosquitos, pescar, lobo, bosque, números, unir la flecha |
| Videos | **No.** `BUILD.videos = false` |
| Cámara | **Eliminada.** Ni el mundo ni el código |
| Permisos | **Ninguno**, ni siquiera internet |
| Idiomas | Español, inglés y portugués, según el idioma del teléfono |
| Tamaño | Alrededor de 1 MB. Todo el arte es SVG generado por código |

**Por qué se eliminó la cámara:** activarla obliga a pedir el permiso
`CAMERA`, a declararlo en el formulario de seguridad de datos y a justificarlo
ante la revisión de la categoría infantil, que es la más estricta de Play. Por
un mundo que además guarda fotos de una niña en el aparato, no valía la pena.
Se quitó entera —el mundo, la pantalla, el CSS y `camera.js`— en vez de dejarla
apagada: código que nadie ejecuta es código que nadie mantiene, y en una
revisión hay que explicarlo igual.

**Por qué no está el límite de tiempo:** ese contador solo corre mientras se
reproduce un video. Sin videos no cuenta nada, así que la sección desaparece
del panel de padres. Un control que no hace nada es peor que no tenerlo. Si
algún día se quiere un límite de tiempo real para los juegos, hay que
construirlo aparte — y arrancarlo en «sin límite», no en 30 minutos.

---

## Antes de subirla a Play

1. **Cuenta de desarrollador** — 25 USD, pago único.
2. **Política de privacidad** — obligatoria aunque no recojas nada. En este
   caso es corta y honesta: *la app no recoge, almacena ni transmite ningún
   dato personal; no tiene acceso a internet; todo lo que el niño crea se
   guarda únicamente en el dispositivo*. Puede vivir en tu propio GitHub Pages.
3. **Formulario de seguridad de datos** — todo «no».
4. **Cuestionario de contenido** — apto para todos.
5. **Designed for Families / Teacher Approved** — opcional. Da visibilidad en
   la sección infantil, a cambio de una revisión más lenta y estricta. Sin
   anuncios, sin compras y sin internet, esta app está bien posicionada para
   pasarla.
6. **Capturas de pantalla** — mínimo dos, en teléfono. Las de los mundos de
   pescar, mascotas y colorear son las que mejor venden.

---

## Estructura

```
android/
├── settings.gradle              Proyecto y repositorios
├── build.gradle                 Versión del plugin de Android
├── sync-web.sh                  docs/ → assets/www, apagando los videos
└── app/
    ├── build.gradle             SDK, versión, dependencias
    └── src/main/
        ├── AndroidManifest.xml  Cero permisos
        ├── java/…/MainActivity.java   El WebView y nada más
        ├── res/                 Iconos, colores, nombre en 3 idiomas
        └── assets/www/          La app web (la genera sync-web.sh)
```

`assets/www/` se regenera con el script; no lo edites a mano.
