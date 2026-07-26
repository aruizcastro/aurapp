# Los sonidos

Aquí van las grabaciones. Los nombres tienen que ser exactamente estos:

| Archivo | Cuándo suena | Cómo debe ser |
| --- | --- | --- |
| `buzz.mp3` | Mientras los mosquitos vuelan | En bucle: el final tiene que empalmar con el principio sin salto. 2 a 5 segundos. Bajito. |
| `pop.mp3` | Al atrapar un mosquito | Muy corto, menos de medio segundo. Alegre, no de golpe. |
| `cheer.mp3` | Al terminar la ronda | 1 a 2 segundos. |

Mono, MP3 o M4A, cualquier calidad razonable. Van dentro del APK, así que
conviene que entre los tres no pasen de unos 300 KB.

**Si un archivo no está, no pasa nada:** `sound.js` toca un sonido sintetizado
en su lugar. Por eso los juegos ya suenan hoy y solo van a sonar mejor cuando
lleguen las grabaciones.

Después de agregarlos hay que correr `./android/sync-web.sh` para que entren en
la app de Android.
