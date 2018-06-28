import { combineReducers } from 'redux';
import { GET_MEMES, NEW_MEME } from '../actions';

function memes(state = [], action) {
  switch (action.type) {
    case GET_MEMES:
      return action.memes;
    default:
      return state;
  }
}

function myMemes(state = [], action) {
  switch (action.type) {
    case NEW_MEME:
      return state = [...state, action.meme];
    default:
      return state
  }
}

const rootReducer = combineReducers({ memes, myMemes });

export default rootReducer;