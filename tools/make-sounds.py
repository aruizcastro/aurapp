#!/usr/bin/env python3
"""Genera los tres sonidos de la app.

    python3 tools/make-sounds.py

Escribe docs/audio/buzz.mp3, pop.mp3 y cheer.mp3.

Son sintetizados, no grabados. Si algún día se graban de verdad, basta con
reemplazar los archivos: la app no distingue de dónde salieron.

Lo único delicado es el zumbido, que va en bucle. Para que el final empalme
con el principio sin un chasquido, todas las frecuencias que intervienen —el
tono, el trémolo, el vibrato— son múltiplos enteros de 1/duración. Así, al
llegar al final del archivo, cada onda va exactamente por donde iba al
empezar.
"""

import os
import subprocess
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', 'docs', 'audio')


def write_mp3(name, audio, bitrate='64k', peak=0.85):
    """Normaliza y codifica a MP3. Para sonidos sueltos, no para bucles."""
    audio = audio / max(1e-9, np.max(np.abs(audio))) * peak
    raw = (audio * 32767).astype('<i2').tobytes()
    path = os.path.join(OUT, name)
    subprocess.run(
        ['ffmpeg', '-y', '-loglevel', 'error',
         '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', 'pipe:0',
         '-codec:a', 'libmp3lame', '-b:a', bitrate, path],
        input=raw, check=True)
    print('  %-10s %5.2f s  %6d bytes' % (name, len(audio) / SR, os.path.getsize(path)))


def write_wav(name, audio, rate, peak=0.85):
    """WAV sin comprimir, para el zumbido.

    El MP3 no sirve para un bucle: el codificador mete unas milésimas de
    silencio al principio y al final, y en cada vuelta se oye el hueco. El WAV
    guarda exactamente las muestras que le damos, así que la unión es perfecta.

    A cambio pesa más, y por eso se remuestrea: el zumbido no tiene nada por
    encima de 1,4 kHz, así que 11 kHz sobra y el archivo baja a un sexto."""
    audio = audio / max(1e-9, np.max(np.abs(audio))) * peak
    step = SR / rate
    idx = (np.arange(int(len(audio) / step)) * step).astype(int)
    small = audio[idx]
    path = os.path.join(OUT, name)
    subprocess.run(
        ['ffmpeg', '-y', '-loglevel', 'error',
         '-f', 's16le', '-ar', str(rate), '-ac', '1', '-i', 'pipe:0',
         '-c:a', 'pcm_s16le', path],
        input=(small * 32767).astype('<i2').tobytes(), check=True)
    print('  %-10s %5.2f s  %6d bytes' % (name, len(small) / rate, os.path.getsize(path)))


def saw(freq, t, harmonics=8, cutoff=1400):
    """Diente de sierra sumando armónicos, sin los agudos.

    Un mosquito real es un zumbido con cuerpo pero sin brillo; dejando entrar
    los armónicos altos suena a avispa o a zumbador de timbre."""
    out = np.zeros_like(t)
    for n in range(1, harmonics + 1):
        f = freq * n
        if f > cutoff:
            break
        out += np.sin(2 * np.pi * f * t) / n
    return out


def make_buzz(seconds=3.0):
    """El zumbido, en bucle perfecto."""
    t = np.linspace(0, seconds, int(SR * seconds), endpoint=False)
    k = 1.0 / seconds                      # la unidad que hace que todo cierre

    audio = np.zeros_like(t)
    # Tres mosquitos ligeramente desafinados. El batido entre ellos es lo que
    # da la sensación de «varios», y es más barato que sumar veinte voces.
    # Los desfases importan más de lo que parece. Sin ellos las tres voces
    # cruzan el cero a la vez justo en t=0, que es el punto de unión del bucle:
    # la onda queda ahí en su tramo más empinado y cada vuelta se oye un
    # golpecito. Con las voces repartidas, la unión es un punto cualquiera.
    for freq_units, weight, offset in ((504, 1.0, 0.0),
                                       (525, 0.8, 2.1),
                                       (551, 0.55, 4.0)):
        f0 = freq_units * k
        vib_rate = round(5 / k) * k        # ~5 Hz, redondeado a un múltiplo
        vib = 0.35 * np.sin(2 * np.pi * vib_rate * t + offset)
        phase = 2 * np.pi * f0 * t + offset + vib
        voice = np.zeros_like(t)
        for n in range(1, 7):
            if f0 * n > 1400:
                break
            voice += np.sin(phase * n) / n
        audio += weight * voice

    # Un vaivén lento de volumen: se acercan y se alejan.
    trem_rate = round(1.5 / k) * k
    audio *= 0.75 + 0.25 * np.sin(2 * np.pi * trem_rate * t)
    return audio * 0.5


def make_pop(seconds=0.28):
    """Atrapado. Un «pop» que cae de tono, no un golpe."""
    t = np.linspace(0, seconds, int(SR * seconds), endpoint=False)

    # Barrido de 900 a 260 Hz. La caída es lo que lo hace gracioso en vez de
    # agresivo — un tono que sube suena a alarma.
    f = 900 * np.exp(-t * 9) + 260
    phase = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(phase) + 0.3 * np.sin(2 * phase)

    # Un chasquido cortísimo al principio le da el borde de «pop».
    click = np.random.default_rng(7).normal(0, 1, len(t)) * np.exp(-t * 260)

    env = np.minimum(1.0, t * 400) * np.exp(-t * 12)
    return (body * 0.9 + click * 0.25) * env


def make_cheer(seconds=1.3):
    """Terminó la ronda. Tres notas subiendo, tipo marimba."""
    t = np.linspace(0, seconds, int(SR * seconds), endpoint=False)
    audio = np.zeros_like(t)

    # Do - Mi - Sol - Do. Un acorde mayor: no hace falta saber música para que
    # suene a que algo salió bien.
    for i, freq in enumerate((523.25, 659.25, 783.99, 1046.5)):
        start = i * 0.17
        idx = t >= start
        local = t[idx] - start
        env = np.minimum(1.0, local * 300) * np.exp(-local * 6.5)
        note = (np.sin(2 * np.pi * freq * local)
                + 0.35 * np.sin(4 * np.pi * freq * local)
                + 0.12 * np.sin(6 * np.pi * freq * local))
        audio[idx] += note * env * (0.9 - i * 0.08)

    return audio


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    print('Generando los sonidos:')
    write_wav('buzz.wav', make_buzz(), 11025, peak=0.7)
    write_mp3('pop.mp3', make_pop(), '96k')
    write_mp3('cheer.mp3', make_cheer(), '96k')
