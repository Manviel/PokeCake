import React, { useContext } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { GraphQLClient } from "graphql-request";

import { CLIENT_ID, BASE_URL } from "../config";

import { ME_QUERY } from "../graphql/queries";

import Context from "../actions/context";

const Header = props => {
  const { dispatch, state } = useContext(Context);
  const { currentUser } = state;

  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;

      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken }
      });

      const { me } = await client.request(ME_QUERY);

      dispatch({ type: "LOGIN_USER", payload: me });
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn() });
    } catch (error) {
      onFailure(error);
    }
  };

  const onSignOut = () => dispatch({ type: "SIGNOUT_USER" });

  const onFailure = err => console.error(err);

  return (
    <header className="header">
      <h1 className="title mb">{props.title}</h1>
      {currentUser ? (
        <h3 className="text mb">{currentUser.email}</h3>
      ) : (
        <GoogleLogin
          clientId={CLIENT_ID}
          onSuccess={onSuccess}
          isSignedIn={true}
          onFailure={onFailure}
        />
      )}
      <GoogleLogout onLogoutSuccess={onSignOut} />
    </header>
  );
};

export default Header;
