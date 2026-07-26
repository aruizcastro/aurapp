# Los sonidos

Aquí van las grabaciones. Los nombres tienen que ser exactamente estos:

| Archivo | Cuándo suena | Cómo debe ser |
| --- | --- | --- |
| `buzz.wav` | Mientras los mosquitos vuelan | En bucle: el final tiene que empalmar con el principio sin salto. 2 a 5 segundos. Bajito. **WAV, no MP3** — ver abajo. |
| `pop.mp3` | Al atrapar un mosquito | Muy corto, menos de medio segundo. Alegre, no de golpe. |
| `cheer.mp3` | Al terminar la ronda | 1 a 2 segundos. |
| `water.wav` | Mientras pesca | En bucle, como el zumbido. Muy bajito: es el cuarto donde está, no el juego. **WAV.** |
| `splash.mp3` | Cuando un pez cae al balde | Medio segundo. Un «plop» de agua. |
| `blow.mp3` | El lobo soplando la casa | 1,5 s. Aire, no grito. |
| `crash.mp3` | La casa que sale volando | 1 s. Paja y palitos: muchos golpecitos, no un portazo. |
| `thud.mp3` | El lobo cae al rebotar en la casa de ladrillos | Medio segundo. Sordo y gracioso. |
| `swish.mp3` | Cada prenda que se pone el lobo en el bosque | 0,4 s. Roce de tela. |

Mono, MP3 o M4A, cualquier calidad razonable. Van dentro del APK, así que
conviene que entre los tres no pasen de unos 300 KB.

**Por qué el zumbido va en WAV.** El codificador de MP3 mete unas milésimas de
silencio al principio y al final de cada archivo. En un sonido suelto no se
nota; en un bucle se oye un hueco en cada vuelta. El WAV guarda exactamente
las muestras, así que empalma. Pesa 66 KB en vez de 20, que es barato por un
bucle limpio. Mono y 11 kHz sobran: un zumbido no tiene agudos.

**Los que hay ahora son sintetizados**, generados por `tools/make-sounds.py`.
Si grabas los tuyos, reemplaza los archivos y listo — la app no distingue de
dónde salieron.

**Si un archivo no está, no pasa nada:** `sound.js` toca un sonido sintetizado
en su lugar. Por eso los juegos ya suenan hoy y solo van a sonar mejor cuando
lleguen las grabaciones.

Después de agregarlos hay que correr `./android/sync-web.sh` para que entren en
la app de Android.
