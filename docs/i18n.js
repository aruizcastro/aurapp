/* Los idiomas — Spanish, English and Portuguese.

   Two rules that shaped this file:

   · Nothing she needs is a word. She cannot read in any language, so the
     translations matter to the parent, not to her. That is why the worlds
     still have names — the parent panel lists them — while the buttons she
     touches are icons everywhere.

   · The help text lives here as whole blocks of HTML rather than as fifty
     little keys. Long prose translated fragment by fragment comes out reading
     like a machine did it; translated as a block it comes out reading like
     someone wrote it.

   Adding a language means adding one more object with the same keys. Any key
   missing from it falls back to Spanish rather than showing the raw key. */

'use strict';

const I18N_LANGS = [
  { id: 'es', name: 'Español' },
  { id: 'en', name: 'English' },
  { id: 'pt', name: 'Português' }
];

const I18N = {

  // ------------------------------------------------------------- español
  es: {
    'worlds.ask': '¿Qué quieres ver hoy?',
    'bar.videos': 'videos',

    'w.songs': 'Canciones',
    'w.animals': 'Animales',
    'w.learning': 'Aprender',
    'w.unicorns': 'Unicornios',
    'w.bedtime': 'Dormir',
    'w.favorites': 'Favoritos',

    'x.paint': 'Pintar',           'x.paint.sub': '22 dibujos',
    'x.pets': 'Amigos',            'x.pets.sub': 'Capi, Michi y Coneja',
    'x.worm': 'El gusanito',       'x.worm.sub': 'Come las naranjas',
    'x.bugs': 'Los mosquitos',     'x.bugs.sub': 'Atrápalos con el dedo',
    'x.fish': 'A pescar',          'x.fish.sub': 'Llena el balde',
    'x.camera': 'Fotos',           'x.camera.sub': 'Con disfraces',
    'x.story': 'El lobo',          'x.story.sub': 'y los tres cerditos',
    'x.forest': 'El bosque',       'x.forest.sub': 'Juguemos con el lobo',
    'x.count': 'Los números',      'x.count.sub': 'Contar del 1 al 9',
    'x.match': 'Une la flecha',    'x.match.sub': 'Del grupo a su número',

    'timeup.title': 'El unicornio se fue a dormir',
    'timeup.sub': 'Mañana hay más videos',
    'timeup.cta': '🎨 Vamos a pintar',
    'timeup.parents': 'Soy papá o mamá',

    'paint.ask': '¿Qué quieres pintar?',
    'paint.color': 'Colorear',   'paint.color.sub': '22 dibujos',
    'paint.draw': 'Dibujar',     'paint.draw.sub': 'Lo que quieras',
    'draw.title': 'Mi dibujo',
    'tool.pencil': '✏️ Lápiz',
    'tool.brush': '🖌 Pincel',
    'tool.eraser': '🩹 Borrador',
    'tool.new': '🗑 Nuevo',
    'draw.confirm': '¿Empezamos un dibujo nuevo?',

    'pets.sleeping': 'Está durmiendo. Vuelve mañana o cámbiale de actividad.',
    'cam.denied': 'No pude encender la cámara. Pídele ayuda a un adulto.',

    'story.straw': '¡Voló la paja!',
    'story.stick': '¡Volaron los palitos!',
    'story.brick': '¡La casa aguantó!',
    'forest.ask': 'Pregúntale si ya está listo.',
    'forest.putting': 'Se está poniendo ',
    'forest.ready': '¡Ya está listo!',
    'forest.escaped': '¡Salió! Nadie lo alcanzó.',

    'count.hint': 'Lleva el {n} a {art} {name}.',
    'count.done': '¡Contaste hasta {n}! Otra vez.',

    'pin.title': 'PIN de papá o mamá',
    'pin.cancel': 'Cancelar',
    'help.done': 'Listo',
    'help.title': 'Cómo funciona',

    'p.title': 'Ajustes',
    'p.done': 'Listo',
    'p.help.h': 'Instrucciones',
    'p.help.link': 'Cómo funciona todo',
    'p.help.sub': 'Cómo agregar videos, sacar la clave de YouTube, el Modo Guiado y el respaldo.',
    'p.time.h': 'Tiempo',
    'p.time.limit': 'Límite diario',
    'p.time.none': 'Sin límite',
    'p.time.min': '{n} minutos',
    'p.time.used': 'Usado hoy',
    'p.time.reset': 'Reiniciar el contador de hoy',
    'p.search.h': 'Buscar en YouTube',
    'p.search.q': 'Buscar',
    'p.search.world': 'Mundo',
    'p.search.go': 'Buscar',
    'p.search.needkey': 'Necesita una clave de YouTube. Ponla más abajo.',
    'p.search.sugg': 'Sugerencias por mundo — un toque y busca:',
    'p.list.h': 'Importar una lista de reproducción',
    'p.list.link': 'Enlace',
    'p.list.go': 'Traer todos',
    'p.list.note': 'Solo listas públicas o no listadas. Las privadas y «Ver más tarde» necesitan iniciar sesión.',
    'p.bulk.h': 'Pegar muchos enlaces',
    'p.bulk.go': 'Agregar todos',
    'p.bulk.note': 'Esto no necesita clave. Sirve pegar texto suelto: la app saca los enlaces que encuentre.',
    'p.add.h': 'Agregar un video',
    'p.add.link': 'Enlace',
    'p.add.title': 'Título',
    'p.add.world': 'Mundo',
    'p.add.go': 'Agregar',
    'p.add.note': 'El título y la portada se llenan solos al pegar el enlace.',
    'p.videos.h': 'Videos',
    'p.videos.empty': 'Todavía no hay videos. Pega un enlace de YouTube arriba.',
    'p.worlds.h': 'Mundos visibles',
    'p.worlds.note': 'Se ocultan de la pantalla de inicio, no se borran. Vuelve a marcarlos cuando quieras.',
    'p.theme.h': 'Colores de la app',
    'p.theme.note': 'Cambia los fondos y los botones. Los dibujos y los personajes no cambian.',
    'p.lang.h': 'Idioma',
    'p.lang.note': 'Arranca con el idioma del dispositivo. Cámbialo aquí si prefieres otro.',
    'p.key.h': 'Clave de YouTube',
    'p.key.save': 'Guardar clave',
    'p.key.note': 'Gratuita, se crea en Google Cloud y se pega una sola vez. Sin ella siguen funcionando el pegado de enlaces y todo lo demás.',
    'p.sec.h': 'Seguridad',
    'p.sec.save': 'Guardar PIN',
    'p.sec.note': 'Activa el Modo Guiado en Ajustes → Accesibilidad para que no pueda salirse de la app: triple clic en el botón lateral.',
    'p.backup.h': 'Respaldo',
    'p.backup.export': 'Exportar la lista',
    'p.backup.import': 'Importar',
    'p.backup.note': 'Guarda un archivo con tus videos, por si cambias de iPad.',

    'msg.pin4': 'El PIN debe tener 4 dígitos',
    'msg.looking': 'Buscando el título…',
    'msg.found': 'Título encontrado.',
    'msg.notitle': 'No se pudo leer el título. Escríbelo a mano.',
    'msg.needtitle': 'Ponle un título.',
    'msg.dup': 'Ese video ya está en la lista.',
    'msg.type': 'Escribe qué buscar y toca Buscar.',
    'msg.needkey': 'Necesita una clave de YouTube. Ponla más abajo. Pegar enlaces sí funciona sin clave.',
    'msg.nothing': 'No encontré nada con eso.',
    'msg.ytsaid': 'YouTube respondió: ',
    'msg.nolinks': 'No encontré enlaces en ese texto.',
    'msg.added': 'Encontré {found}, agregué {added}.'
  },

  // ------------------------------------------------------------- english
  en: {
    'worlds.ask': 'What shall we watch today?',
    'bar.videos': 'videos',

    'w.songs': 'Songs',
    'w.animals': 'Animals',
    'w.learning': 'Learning',
    'w.unicorns': 'Unicorns',
    'w.bedtime': 'Bedtime',
    'w.favorites': 'Favourites',

    'x.paint': 'Painting',        'x.paint.sub': '22 pictures',
    'x.pets': 'Friends',          'x.pets.sub': 'Capy, Kitty and Bunny',
    'x.worm': 'The little worm',  'x.worm.sub': 'Eat the berries',
    'x.bugs': 'The mosquitoes',   'x.bugs.sub': 'Catch them with your finger',
    'x.fish': 'Fishing',          'x.fish.sub': 'Fill up the bucket',
    'x.camera': 'Photos',         'x.camera.sub': 'With costumes',
    'x.story': 'The wolf',        'x.story.sub': 'and the three little pigs',
    'x.forest': 'The forest',     'x.forest.sub': "Let's play with the wolf",
    'x.count': 'Numbers',         'x.count.sub': 'Counting 1 to 9',
    'x.match': 'Draw the arrow',  'x.match.sub': 'Group to its number',

    'timeup.title': 'The unicorn has gone to sleep',
    'timeup.sub': 'More videos tomorrow',
    'timeup.cta': "🎨 Let's paint",
    'timeup.parents': "I'm a grown-up",

    'paint.ask': 'What shall we paint?',
    'paint.color': 'Colouring',  'paint.color.sub': '22 pictures',
    'paint.draw': 'Drawing',     'paint.draw.sub': 'Anything you like',
    'draw.title': 'My drawing',
    'tool.pencil': '✏️ Pencil',
    'tool.brush': '🖌 Brush',
    'tool.eraser': '🩹 Eraser',
    'tool.new': '🗑 New',
    'draw.confirm': 'Start a new drawing?',

    'pets.sleeping': "They're asleep. Come back tomorrow, or try something else.",
    'cam.denied': "I couldn't turn the camera on. Ask a grown-up for help.",

    'story.straw': 'The straw flew away!',
    'story.stick': 'The sticks flew away!',
    'story.brick': 'The house held!',
    'forest.ask': 'Ask if he is ready yet.',
    'forest.putting': 'He is putting on ',
    'forest.ready': 'He is ready!',
    'forest.escaped': 'He got away! Nobody caught him.',

    'count.hint': 'Take the {n} to the {name}.',
    'count.done': 'You counted all the way to {n}! Again.',

    'pin.title': "Grown-up's PIN",
    'pin.cancel': 'Cancel',
    'help.done': 'Done',
    'help.title': 'How it works',

    'p.title': 'Settings',
    'p.done': 'Done',
    'p.help.h': 'Instructions',
    'p.help.link': 'How everything works',
    'p.help.sub': 'Adding videos, getting a YouTube key, Guided Access and backups.',
    'p.time.h': 'Time',
    'p.time.limit': 'Daily limit',
    'p.time.none': 'No limit',
    'p.time.min': '{n} minutes',
    'p.time.used': 'Used today',
    'p.time.reset': "Reset today's counter",
    'p.search.h': 'Search YouTube',
    'p.search.q': 'Search',
    'p.search.world': 'World',
    'p.search.go': 'Search',
    'p.search.needkey': 'This needs a YouTube key. Add one further down.',
    'p.search.sugg': 'Suggestions by world — one tap and it searches:',
    'p.list.h': 'Import a playlist',
    'p.list.link': 'Link',
    'p.list.go': 'Fetch them all',
    'p.list.note': 'Public or unlisted playlists only. Private ones and "Watch later" need a sign-in.',
    'p.bulk.h': 'Paste lots of links',
    'p.bulk.go': 'Add them all',
    'p.bulk.note': 'No key needed. You can paste loose text too — the app picks out the links it finds.',
    'p.add.h': 'Add one video',
    'p.add.link': 'Link',
    'p.add.title': 'Title',
    'p.add.world': 'World',
    'p.add.go': 'Add',
    'p.add.note': 'The title and thumbnail fill themselves in when you paste the link.',
    'p.videos.h': 'Videos',
    'p.videos.empty': 'No videos yet. Paste a YouTube link above.',
    'p.worlds.h': 'Visible worlds',
    'p.worlds.note': 'They are hidden from the home screen, not deleted. Tick them again whenever you like.',
    'p.theme.h': 'App colours',
    'p.theme.note': 'Changes the backgrounds and the buttons. The pictures and the characters stay as they are.',
    'p.lang.h': 'Language',
    'p.lang.note': "It starts in the device's language. Change it here if you prefer another.",
    'p.key.h': 'YouTube key',
    'p.key.save': 'Save key',
    'p.key.note': 'Free, created in Google Cloud, pasted once. Without it, pasting links and everything else still works.',
    'p.sec.h': 'Security',
    'p.sec.save': 'Save PIN',
    'p.sec.note': 'Turn on Guided Access in Settings → Accessibility so she cannot leave the app: triple-click the side button.',
    'p.backup.h': 'Backup',
    'p.backup.export': 'Export the list',
    'p.backup.import': 'Import',
    'p.backup.note': 'Saves a file with your videos, in case you change iPad.',

    'msg.pin4': 'The PIN must be 4 digits',
    'msg.looking': 'Looking up the title…',
    'msg.found': 'Title found.',
    'msg.notitle': "Couldn't read the title. Type it in yourself.",
    'msg.needtitle': 'Give it a title.',
    'msg.dup': 'That video is already on the list.',
    'msg.type': 'Type what to look for and tap Search.',
    'msg.needkey': 'This needs a YouTube key. Add one further down. Pasting links does work without a key.',
    'msg.nothing': "I didn't find anything for that.",
    'msg.ytsaid': 'YouTube said: ',
    'msg.nolinks': "I didn't find any links in that text.",
    'msg.added': 'Found {found}, added {added}.'
  },

  // ---------------------------------------------------------- português
  pt: {
    'worlds.ask': 'O que você quer ver hoje?',
    'bar.videos': 'vídeos',

    'w.songs': 'Músicas',
    'w.animals': 'Animais',
    'w.learning': 'Aprender',
    'w.unicorns': 'Unicórnios',
    'w.bedtime': 'Dormir',
    'w.favorites': 'Favoritos',

    'x.paint': 'Pintar',           'x.paint.sub': '22 desenhos',
    'x.pets': 'Amigos',            'x.pets.sub': 'Capi, Mimi e Coelhinha',
    'x.worm': 'A minhoca',         'x.worm.sub': 'Come as frutinhas',
    'x.bugs': 'Os mosquitos',      'x.bugs.sub': 'Pegue com o dedo',
    'x.fish': 'Pescaria',          'x.fish.sub': 'Encha o balde',
    'x.camera': 'Fotos',           'x.camera.sub': 'Com fantasias',
    'x.story': 'O lobo',           'x.story.sub': 'e os três porquinhos',
    'x.forest': 'A floresta',      'x.forest.sub': 'Vamos brincar com o lobo',
    'x.count': 'Os números',       'x.count.sub': 'Contar de 1 a 9',
    'x.match': 'Ligue a seta',     'x.match.sub': 'Do grupo ao seu número',

    'timeup.title': 'O unicórnio foi dormir',
    'timeup.sub': 'Amanhã tem mais vídeos',
    'timeup.cta': '🎨 Vamos pintar',
    'timeup.parents': 'Sou o pai ou a mãe',

    'paint.ask': 'O que você quer pintar?',
    'paint.color': 'Colorir',    'paint.color.sub': '22 desenhos',
    'paint.draw': 'Desenhar',    'paint.draw.sub': 'O que você quiser',
    'draw.title': 'Meu desenho',
    'tool.pencil': '✏️ Lápis',
    'tool.brush': '🖌 Pincel',
    'tool.eraser': '🩹 Borracha',
    'tool.new': '🗑 Novo',
    'draw.confirm': 'Vamos começar um desenho novo?',

    'pets.sleeping': 'Está dormindo. Volte amanhã ou mude de atividade.',
    'cam.denied': 'Não consegui ligar a câmera. Peça ajuda a um adulto.',

    'story.straw': 'A palha voou!',
    'story.stick': 'As varetas voaram!',
    'story.brick': 'A casa aguentou!',
    'forest.ask': 'Pergunte se ele já está pronto.',
    'forest.putting': 'Ele está vestindo ',
    'forest.ready': 'Ele já está pronto!',
    'forest.escaped': 'Ele escapou! Ninguém pegou.',

    'count.hint': 'Leve o {n} até {art} {name}.',
    'count.done': 'Você contou até {n}! De novo.',

    'pin.title': 'PIN do pai ou da mãe',
    'pin.cancel': 'Cancelar',
    'help.done': 'Pronto',
    'help.title': 'Como funciona',

    'p.title': 'Ajustes',
    'p.done': 'Pronto',
    'p.help.h': 'Instruções',
    'p.help.link': 'Como tudo funciona',
    'p.help.sub': 'Como adicionar vídeos, obter a chave do YouTube, o Acesso Guiado e o backup.',
    'p.time.h': 'Tempo',
    'p.time.limit': 'Limite diário',
    'p.time.none': 'Sem limite',
    'p.time.min': '{n} minutos',
    'p.time.used': 'Usado hoje',
    'p.time.reset': 'Zerar o contador de hoje',
    'p.search.h': 'Buscar no YouTube',
    'p.search.q': 'Buscar',
    'p.search.world': 'Mundo',
    'p.search.go': 'Buscar',
    'p.search.needkey': 'Precisa de uma chave do YouTube. Coloque mais abaixo.',
    'p.search.sugg': 'Sugestões por mundo — um toque e já busca:',
    'p.list.h': 'Importar uma playlist',
    'p.list.link': 'Link',
    'p.list.go': 'Trazer todos',
    'p.list.note': 'Só playlists públicas ou não listadas. As privadas e "Assistir mais tarde" exigem login.',
    'p.bulk.h': 'Colar vários links',
    'p.bulk.go': 'Adicionar todos',
    'p.bulk.note': 'Isso não precisa de chave. Pode colar texto solto: o app encontra os links.',
    'p.add.h': 'Adicionar um vídeo',
    'p.add.link': 'Link',
    'p.add.title': 'Título',
    'p.add.world': 'Mundo',
    'p.add.go': 'Adicionar',
    'p.add.note': 'O título e a capa se preenchem sozinhos ao colar o link.',
    'p.videos.h': 'Vídeos',
    'p.videos.empty': 'Ainda não há vídeos. Cole um link do YouTube aí em cima.',
    'p.worlds.h': 'Mundos visíveis',
    'p.worlds.note': 'Ficam escondidos da tela inicial, não são apagados. Marque de novo quando quiser.',
    'p.theme.h': 'Cores do app',
    'p.theme.note': 'Muda os fundos e os botões. Os desenhos e os personagens não mudam.',
    'p.lang.h': 'Idioma',
    'p.lang.note': 'Começa no idioma do aparelho. Mude aqui se preferir outro.',
    'p.key.h': 'Chave do YouTube',
    'p.key.save': 'Salvar chave',
    'p.key.note': 'Gratuita, criada no Google Cloud e colada uma única vez. Sem ela, colar links e todo o resto continua funcionando.',
    'p.sec.h': 'Segurança',
    'p.sec.save': 'Salvar PIN',
    'p.sec.note': 'Ative o Acesso Guiado em Ajustes → Acessibilidade para que ela não saia do app: três cliques no botão lateral.',
    'p.backup.h': 'Backup',
    'p.backup.export': 'Exportar a lista',
    'p.backup.import': 'Importar',
    'p.backup.note': 'Salva um arquivo com os seus vídeos, caso troque de iPad.',

    'msg.pin4': 'O PIN precisa ter 4 dígitos',
    'msg.looking': 'Procurando o título…',
    'msg.found': 'Título encontrado.',
    'msg.notitle': 'Não deu para ler o título. Escreva à mão.',
    'msg.needtitle': 'Coloque um título.',
    'msg.dup': 'Esse vídeo já está na lista.',
    'msg.type': 'Escreva o que procurar e toque em Buscar.',
    'msg.needkey': 'Precisa de uma chave do YouTube. Coloque mais abaixo. Colar links funciona sem chave.',
    'msg.nothing': 'Não encontrei nada com isso.',
    'msg.ytsaid': 'O YouTube respondeu: ',
    'msg.nolinks': 'Não encontrei links nesse texto.',
    'msg.added': 'Encontrei {found}, adicionei {added}.'
  }
};

// ------------------------------------------------------------------ api

let i18nLang = 'es';

/* The device's language, if we speak it. navigator.language gives things like
   "pt-BR" and "en-GB", so only the first two letters are compared. */
function i18nDetect() {
  const tags = (navigator.languages && navigator.languages.length)
    ? navigator.languages : [navigator.language || 'es'];
  for (const tag of tags) {
    const two = String(tag).slice(0, 2).toLowerCase();
    if (I18N[two]) return two;
  }
  return 'es';
}

function i18nSet(lang) {
  i18nLang = I18N[lang] ? lang : 'es';
  document.documentElement.setAttribute('lang', i18nLang);
  return i18nLang;
}

/* A missing key falls back to Spanish, and then to the key itself, so a
   half-finished translation degrades into readable text instead of into
   «p.backup.note» on someone's screen. */
function t(key, vars) {
  let s = (I18N[i18nLang] && I18N[i18nLang][key]);
  if (s === undefined) s = I18N.es[key];
  if (s === undefined) return key;
  if (vars) {
    Object.keys(vars).forEach(k => { s = s.split('{' + k + '}').join(vars[k]); });
  }
  return s;
}

/* Applies every translation marked up in the HTML.

   data-t      → the element's text
   data-thtml  → the element's markup (for the help pages)
   data-tph    → an input's placeholder
   data-tlabel → the aria-label */
function i18nApply(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-t]').forEach(el => {
    el.textContent = t(el.getAttribute('data-t'));
  });
  scope.querySelectorAll('[data-thtml]').forEach(el => {
    el.innerHTML = I18N_HELP[i18nLang] && I18N_HELP[i18nLang][el.getAttribute('data-thtml')] ||
                   I18N_HELP.es[el.getAttribute('data-thtml')] || '';
  });
  scope.querySelectorAll('[data-tph]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-tph')));
  });
  scope.querySelectorAll('[data-tlabel]').forEach(el => {
    el.setAttribute('aria-label', t(el.getAttribute('data-tlabel')));
  });
}

/* The nine things she counts, in three languages. Kept next to the strings
   rather than inside counting.js so that adding a language means touching one
   file, not two. */
const COUNT_NAMES = {
  es: { ball: 'balones', star: 'estrellas', flower: 'flores', apple: 'manzanas',
        fish: 'pececitos', butterfly: 'mariposas', heart: 'corazones',
        leaf: 'hojitas', duck: 'patitos' },
  en: { ball: 'balls', star: 'stars', flower: 'flowers', apple: 'apples',
        fish: 'little fish', butterfly: 'butterflies', heart: 'hearts',
        leaf: 'leaves', duck: 'ducklings' },
  pt: { ball: 'bolas', star: 'estrelas', flower: 'flores', apple: 'maçãs',
        fish: 'peixinhos', butterfly: 'borboletas', heart: 'corações',
        leaf: 'folhinhas', duck: 'patinhos' }
};

const COUNT_ARTS = {
  es: { ball: 'los', star: 'las', flower: 'las', apple: 'las', fish: 'los',
        butterfly: 'las', heart: 'los', leaf: 'las', duck: 'los' },
  en: { },
  pt: { ball: 'as', star: 'as', flower: 'as', apple: 'as', fish: 'os',
        butterfly: 'as', heart: 'os', leaf: 'as', duck: 'os' }
};

/* The wolf's clothes, for the one line of text this game shows. */
const FOREST_NAMES = {
  es: { trousers: 'el pantalón', shirt: 'la camisa', shoes: 'los zapatos',
        tie: 'la corbata', hat: 'el sombrero', scarf: 'la bufanda', glasses: 'las gafas' },
  en: { trousers: 'his trousers', shirt: 'his shirt', shoes: 'his shoes',
        tie: 'his tie', hat: 'his hat', scarf: 'his scarf', glasses: 'his glasses' },
  pt: { trousers: 'a calça', shirt: 'a camisa', shoes: 'os sapatos',
        tie: 'a gravata', hat: 'o chapéu', scarf: 'o cachecol', glasses: 'os óculos' }
};
