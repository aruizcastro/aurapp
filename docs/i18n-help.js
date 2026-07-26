/* The help pages, one block of markup per language.

   Kept apart from i18n.js because it is prose, not labels, and because prose
   translated as a whole reads like a person wrote it while prose translated
   sentence-key by sentence-key does not.

   The links are the same in every language: Google Cloud follows the
   browser's own language anyway. */

'use strict';

const I18N_HELP = {

  es: {
    body: `
    <section>
      <h3>Entrar a los ajustes</h3>
      <p>Mantén apretado el <b>candado</b> 🔒 durante <b>dos segundos</b> y escribe el PIN. Viene en <code>1234</code>; cámbialo en Seguridad.</p>
      <p>Los números del teclado salen en desorden cada vez. A los 4 años se memorizan posiciones mucho antes que números, así que un teclado fijo se aprende en dos días.</p>
    </section>

    <section>
      <h3>Agregar videos</h3>
      <p><b>Buscar en YouTube</b> — escribes qué buscar y tocas «Agregar» en los resultados que quieras. La forma más rápida. Necesita clave.</p>
      <p><b>Importar una lista</b> — pegas el enlace de una playlist y trae todos sus videos. Solo listas públicas o no listadas. Necesita clave.</p>
      <p><b>Pegar muchos enlaces</b> — pegas varios de una vez, incluso dentro de texto suelto. <b>No necesita clave.</b></p>
      <p><b>Uno por uno</b> — pegas un enlace y ya. <b>No necesita clave.</b></p>
    </section>

    <section>
      <h3>Sacar la clave de YouTube</h3>
      <p>Es gratis y <b>no pide tarjeta de crédito</b>. Son cuatro pasos, una sola vez:</p>
      <ol class="steps">
        <li><a href="https://console.cloud.google.com/projectcreate" target="_blank" rel="noopener">Crear un proyecto</a> en Google Cloud.</li>
        <li><a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noopener">Habilitar YouTube Data API v3</a>.</li>
        <li><a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener">Crear la clave</a> con «Crear credenciales → Clave de API».</li>
        <li>Edita la clave, y en <i>Restricciones de aplicación</i> elige <b>Sitios web</b> agregando la dirección de tu app con <code>/*</code> al final.</li>
      </ol>
      <p>El paso 4 importa: la clave queda visible en la página, cosa inevitable en una app sin servidor. Restringida a tu dominio no sirve en ningún otro sitio, y no tiene nada más colgado — lo peor que puede pasar es que alguien gaste la cuota gratuita.</p>
      <p>La cuota son 10.000 unidades al día. Una búsqueda cuesta 100 y leer una lista cuesta 1 por cada 50 videos: da para unas 100 búsquedas diarias.</p>
    </section>

    <section>
      <h3>La clave es tuya, por dispositivo</h3>
      <p>Se guarda en este dispositivo, no en el código. Si alguien más abre la dirección de la app, tendría que poner su propia clave: tu cuota está protegida.</p>
      <p>Lo cómodo es ponerla solo en el computador, cargar los videos ahí con teclado, y pasar la lista al iPad con <b>Exportar</b> e <b>Importar</b>. Así el iPad nunca necesita clave.</p>
    </section>

    <section>
      <h3>Modo Guiado</h3>
      <p>Sin esto ella se sale de la app y el límite de tiempo no sirve de nada.</p>
      <p>En el iPad: <b>Ajustes → Accesibilidad → Modo Guiado</b>, actívalo y ponle un código. Para usarlo, abre la app y da <b>tres clics rápidos al botón lateral</b>. Para salir, otros tres clics y el código.</p>
    </section>

    <section>
      <h3>El tiempo</h3>
      <p>El contador solo corre mientras un video está efectivamente reproduciéndose, no mientras ella navega. Al agotarse, los videos se cierran pero <b>pintar y los juegos siguen disponibles</b>.</p>
      <p>Se reinicia solo al cambiar el día. También puedes reiniciarlo a mano en Ajustes.</p>
    </section>

    <section>
      <h3>Respaldo</h3>
      <p>Todo vive en este dispositivo. <b>No borres la app para actualizarla</b>: al borrarla se va la lista de videos.</p>
      <p>Usa <b>Exportar</b> una vez que tengas la lista armada. Ese archivo también sirve para pasarla a otro dispositivo, y <b>no incluye tu clave</b>.</p>
    </section>

    <section>
      <h3>Los anuncios</h3>
      <p>Van a salir. Es la única forma que las políticas de YouTube permiten para reproducir sus videos dentro de otra app, y una suscripción Premium no aplica ahí porque va atada a la cuenta. En contenido infantil suelen ser de 5 a 15 segundos.</p>
    </section>`
  },

  en: {
    body: `
    <section>
      <h3>Getting into the settings</h3>
      <p>Hold the <b>padlock</b> 🔒 down for <b>two seconds</b> and type the PIN. It ships as <code>1234</code>; change it under Security.</p>
      <p>The keypad shuffles its digits every time. At four, positions are memorised long before numbers are, so a fixed keypad gets learned in two days.</p>
    </section>

    <section>
      <h3>Adding videos</h3>
      <p><b>Search YouTube</b> — type what to look for and tap "Add" on the results you want. The quickest way. Needs a key.</p>
      <p><b>Import a playlist</b> — paste a playlist link and it fetches every video in it. Public or unlisted playlists only. Needs a key.</p>
      <p><b>Paste lots of links</b> — several at once, even buried in loose text. <b>No key needed.</b></p>
      <p><b>One at a time</b> — paste a link and you're done. <b>No key needed.</b></p>
    </section>

    <section>
      <h3>Getting a YouTube key</h3>
      <p>It is free and <b>asks for no credit card</b>. Four steps, once:</p>
      <ol class="steps">
        <li><a href="https://console.cloud.google.com/projectcreate" target="_blank" rel="noopener">Create a project</a> in Google Cloud.</li>
        <li><a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noopener">Enable YouTube Data API v3</a>.</li>
        <li><a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener">Create the key</a> with "Create credentials → API key".</li>
        <li>Edit the key, and under <i>Application restrictions</i> choose <b>Websites</b>, adding your app's address with <code>/*</code> at the end.</li>
      </ol>
      <p>Step 4 matters: the key is visible in the page, which is unavoidable in an app with no server. Restricted to your domain it is useless anywhere else, and it has nothing else attached to it — the worst that can happen is that somebody spends the free quota.</p>
      <p>The quota is 10,000 units a day. A search costs 100 and reading a playlist costs 1 per 50 videos: room for about 100 searches a day.</p>
    </section>

    <section>
      <h3>The key is yours, per device</h3>
      <p>It is stored on this device, not in the code. If somebody else opens the app's address they would have to add their own key: your quota is safe.</p>
      <p>The comfortable way is to put it only on the computer, load the videos there with a keyboard, and move the list to the iPad with <b>Export</b> and <b>Import</b>. That way the iPad never needs a key at all.</p>
    </section>

    <section>
      <h3>Guided Access</h3>
      <p>Without this she leaves the app and the time limit means nothing.</p>
      <p>On the iPad: <b>Settings → Accessibility → Guided Access</b>, turn it on and set a passcode. To use it, open the app and <b>triple-click the side button</b>. To leave, three more clicks and the passcode.</p>
    </section>

    <section>
      <h3>The time limit</h3>
      <p>The counter only runs while a video is actually playing, not while she is browsing. When it runs out the videos close, but <b>painting and the games stay available</b>.</p>
      <p>It resets by itself when the day changes. You can also reset it by hand in Settings.</p>
    </section>

    <section>
      <h3>Backup</h3>
      <p>Everything lives on this device. <b>Do not delete the app to update it</b>: deleting it takes the video list with it.</p>
      <p>Use <b>Export</b> once the list is the way you want it. That file also moves the list to another device, and <b>does not include your key</b>.</p>
    </section>

    <section>
      <h3>The adverts</h3>
      <p>They will appear. It is the only way YouTube's policies allow their videos to play inside another app, and a Premium subscription does not apply there because it is tied to the account. On children's content they tend to run 5 to 15 seconds.</p>
    </section>`
  },

  pt: {
    body: `
    <section>
      <h3>Entrar nos ajustes</h3>
      <p>Segure o <b>cadeado</b> 🔒 por <b>dois segundos</b> e digite o PIN. Vem como <code>1234</code>; troque em Segurança.</p>
      <p>Os números do teclado aparecem embaralhados a cada vez. Aos 4 anos, posições se memorizam muito antes que números, então um teclado fixo se aprende em dois dias.</p>
    </section>

    <section>
      <h3>Adicionar vídeos</h3>
      <p><b>Buscar no YouTube</b> — você escreve o que procurar e toca em "Adicionar" nos resultados que quiser. O jeito mais rápido. Precisa de chave.</p>
      <p><b>Importar uma playlist</b> — cole o link da playlist e ele traz todos os vídeos. Só playlists públicas ou não listadas. Precisa de chave.</p>
      <p><b>Colar vários links</b> — vários de uma vez, mesmo dentro de texto solto. <b>Não precisa de chave.</b></p>
      <p><b>Um por um</b> — cole um link e pronto. <b>Não precisa de chave.</b></p>
    </section>

    <section>
      <h3>Obter a chave do YouTube</h3>
      <p>É grátis e <b>não pede cartão de crédito</b>. São quatro passos, uma única vez:</p>
      <ol class="steps">
        <li><a href="https://console.cloud.google.com/projectcreate" target="_blank" rel="noopener">Criar um projeto</a> no Google Cloud.</li>
        <li><a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noopener">Ativar a YouTube Data API v3</a>.</li>
        <li><a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener">Criar a chave</a> em "Criar credenciais → Chave de API".</li>
        <li>Edite a chave e, em <i>Restrições de aplicativo</i>, escolha <b>Sites</b>, colocando o endereço do seu app com <code>/*</code> no final.</li>
      </ol>
      <p>O passo 4 importa: a chave fica visível na página, o que é inevitável num app sem servidor. Restrita ao seu domínio, ela não serve em nenhum outro lugar, e não tem mais nada ligado a ela — o pior que pode acontecer é alguém gastar a cota gratuita.</p>
      <p>A cota é de 10.000 unidades por dia. Uma busca custa 100 e ler uma playlist custa 1 a cada 50 vídeos: dá para umas 100 buscas por dia.</p>
    </section>

    <section>
      <h3>A chave é sua, por aparelho</h3>
      <p>Fica guardada neste aparelho, não no código. Se outra pessoa abrir o endereço do app, teria que colocar a própria chave: a sua cota está protegida.</p>
      <p>O mais cômodo é colocá-la só no computador, carregar os vídeos ali com teclado, e passar a lista para o iPad com <b>Exportar</b> e <b>Importar</b>. Assim o iPad nunca precisa de chave.</p>
    </section>

    <section>
      <h3>Acesso Guiado</h3>
      <p>Sem isso ela sai do app e o limite de tempo não serve para nada.</p>
      <p>No iPad: <b>Ajustes → Acessibilidade → Acesso Guiado</b>, ative e coloque um código. Para usar, abra o app e dê <b>três cliques rápidos no botão lateral</b>. Para sair, mais três cliques e o código.</p>
    </section>

    <section>
      <h3>O tempo</h3>
      <p>O contador só corre enquanto um vídeo está de fato tocando, não enquanto ela navega. Quando acaba, os vídeos fecham, mas <b>pintar e os jogos continuam disponíveis</b>.</p>
      <p>Ele zera sozinho na virada do dia. Você também pode zerar na mão, nos Ajustes.</p>
    </section>

    <section>
      <h3>Backup</h3>
      <p>Tudo vive neste aparelho. <b>Não apague o app para atualizá-lo</b>: apagando, a lista de vídeos vai junto.</p>
      <p>Use <b>Exportar</b> quando a lista estiver do jeito que você quer. Esse arquivo também serve para passar a lista para outro aparelho, e <b>não inclui a sua chave</b>.</p>
    </section>

    <section>
      <h3>Os anúncios</h3>
      <p>Eles vão aparecer. É a única forma que as políticas do YouTube permitem para reproduzir os vídeos deles dentro de outro app, e uma assinatura Premium não vale ali porque está ligada à conta. Em conteúdo infantil costumam durar de 5 a 15 segundos.</p>
    </section>`
  }
};
