import React, { useContext, Fragment } from "react";
import { GoogleLogout } from "react-google-login";

import Context from "../actions/context";

const Header = () => {
  const { dispatch, state } = useContext(Context);
  const { currentUser } = state;

  const onSignOut = () => {
    dispatch({ type: "SIGNOUT_USER" });
    console.log(state);
  };

  return (
    <Fragment>
      <h1>Head</h1>
      {currentUser && <h5>{currentUser.name}</h5>}
      <GoogleLogout onLogoutSuccess={onSignOut} />
    </Fragment>
  );
};

export default Header;
