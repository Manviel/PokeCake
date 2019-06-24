const rootReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_USER":
      return {
        ...state,
        currentUser: action.payload
      };
    case "IS_LOGGED_IN":
      return {
        ...state,
        isAuth: action.payload
      };
    case "SIGNOUT_USER":
      return {
        ...state,
        currentUser: null,
        isAuth: false
      };
    case "CREATE_DRAFT":
      return {
        ...state
      };
    case "UPDATE_DRAFT":
      return {
        ...state,
        draft: action.payload
      };
    default:
      return state;
  }
};

export default rootReducer;
