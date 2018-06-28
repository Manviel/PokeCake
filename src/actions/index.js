export const GET_MEMES = 'GET_MEMES';
export const NEW_MEME = 'NEW MEME';

function receiveMemes(json) {
  const { memes } = json.data;

  return {
    type: GET_MEMES,
    memes
  }
}

function fetchJson() {
  return fetch('https://api.imgflip.com/get_memes')
    .then(response => response.json())
}

export function fetchMemes() {
  return function(dispatch) {
    return fetchJson()
      .then(json => dispatch(receiveMemes(json)))
  }
}

export function newMeme(meme) {
  return {
    type: NEW_MEME,
    meme
  }
}