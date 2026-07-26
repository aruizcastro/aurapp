/* Talking to YouTube from the parent panel.

   Three ways in, all sharing one API key:
     · search      — type a phrase, tap the results you want
     · playlist    — paste a playlist link, take the lot
     · bulk paste  — paste many links at once (needs no key at all)

   The key lives in localStorage and is pasted once. It is visible in the
   page, which is unavoidable in a browser-only app, so the setup notes tell
   the parent to restrict it to their Pages domain. Worst case someone
   burns the free quota; there is nothing else attached to it. */

'use strict';

const YT_API = 'https://www.googleapis.com/youtube/v3/';

/** search.list costs 100 quota units of the 10.000 free daily ones. */
const YT_SEARCH_COST = 100;

function ytHasKey(key) {
  return typeof key === 'string' && key.trim().length > 20;
}

async function ytFetch(path, params, key) {
  const query = new URLSearchParams(Object.assign({ key: key }, params));
  const response = await fetch(YT_API + path + '?' + query);
  const data = await response.json();

  if (!response.ok) {
    const reason = (data.error && data.error.message) || ('HTTP ' + response.status);
    throw new Error(reason);
  }
  return data;
}

/* Search. Two filters matter more than anything else here:
   safeSearch strict, and videoEmbeddable — without the second, results turn
   up that simply refuse to play once they are in the app. */
async function ytSearch(query, key) {
  const data = await ytFetch('search', {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: 12,
    safeSearch: 'strict',
    videoEmbeddable: 'true',
    relevanceLanguage: 'es'
  }, key);

  return (data.items || [])
    .filter(item => item.id && item.id.videoId)
    .map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle
    }));
}

/** Pulls the playlist id out of a link, or accepts a bare id. */
function ytPlaylistID(text) {
  const trimmed = (text || '').trim();
  if (/^PL[\w-]{10,}$/.test(trimmed) || /^[A-Za-z0-9_-]{13,}$/.test(trimmed)) {
    if (!trimmed.includes('/')) return trimmed;
  }
  try {
    const url = new URL(trimmed);
    return url.searchParams.get('list');
  } catch (e) {
    return null;
  }
}

/* A playlist, in pages of 50. Costs 1 unit per page, so even a 200-video
   list is 4 units — nothing against the daily allowance. */
async function ytPlaylist(listID, key, cap) {
  const limit = cap || 200;
  const out = [];
  let page = '';

  while (out.length < limit) {
    const data = await ytFetch('playlistItems', {
      part: 'snippet',
      playlistId: listID,
      maxResults: 50,
      pageToken: page
    }, key);

    (data.items || []).forEach(item => {
      const s = item.snippet;
      const id = s.resourceId && s.resourceId.videoId;
      // Deleted and private entries come back with no thumbnail; skip them.
      if (!id || !s.thumbnails || s.title === 'Deleted video' || s.title === 'Private video') return;
      out.push({ id: id, title: s.title, channel: s.videoOwnerChannelTitle || '' });
    });

    page = data.nextPageToken;
    if (!page) break;
  }

  return out.slice(0, limit);
}

/* Bulk paste. Needs no key: it only reads ids out of whatever was pasted,
   so a whole page of copied text works as well as a tidy list. */
function ytLinksFrom(text) {
  const found = [];
  const seen = new Set();
  const pattern = /(?:youtu\.be\/|v=|\/shorts\/|\/embed\/)([\w-]{11})|(?:^|\s)([\w-]{11})(?=\s|$)/g;
  let match;

  while ((match = pattern.exec(text || '')) !== null) {
    const id = match[1] || match[2];
    if (!id || seen.has(id)) continue;
    seen.add(id);
    found.push(id);
  }
  return found;
}

/** Titles for ids that came from a bare paste, via oEmbed — no key needed. */
async function ytTitles(ids) {
  const out = [];
  for (const id of ids) {
    let title = 'Video';
    try {
      const link = 'https://www.youtube.com/watch?v=' + id;
      const url = 'https://www.youtube.com/oembed?url=' + encodeURIComponent(link) + '&format=json';
      const data = await (await fetch(url)).json();
      if (data && data.title) title = data.title;
    } catch (e) {
      // Unavailable or region-locked: keep it with a placeholder title so the
      // parent can see it landed and rename or delete it.
    }
    out.push({ id: id, title: title });
  }
  return out;
}
