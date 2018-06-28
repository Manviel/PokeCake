import { username, password } from '../../src/secret';

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
  return function (dispatch) {
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

function postJson(params) {
  params["username"] = username;
  params["password"] = password;

  const bodyParams = Object.keys(params).map(key => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
  }).join('&');

  return fetch('https://api.imgflip.com/caption_image', {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: bodyParams
  }).then(response => response.json());
}

export function createMeme(obj) {
  return function(dispatch) {
    return postJson(obj)
      .then(new_meme => dispatch(newMeme(new_meme)))
  }
}