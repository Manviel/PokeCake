import { combineReducers } from 'redux';
import { GET_MEMES } from '../actions';

function memes(state = [], action) {
  switch (action.type) {
    case GET_MEMES:
      return action.memes;
    default:
      return state;
  }
}

const rootReducer = combineReducers({ memes });

export default rootReducer;