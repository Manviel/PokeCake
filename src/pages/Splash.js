import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { GraphQLClient } from "graphql-request";

import { CLIENT_ID } from "../config";

import { ME_QUERY } from "../graphql/queries";

import Context from "../actions/context";

const Splash = () => {
  const { dispatch } = useContext(Context);

  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;

      const client = new GraphQLClient("http://localhost:4000/graphql", {
        headers: { authorization: idToken }
      });

      const { me } = await client.request(ME_QUERY);

      dispatch({ type: "LOGIN_USER", payload: me });
    } catch (error) {
      onFailure(error);
    }
  };

  const onFailure = err => console.error(err);

  return (
    <section className="container">
      <h1 className="title">Login</h1>
      <GoogleLogin
        clientId={CLIENT_ID}
        onSuccess={onSuccess}
        isSignedIn={true}
        onFailure={onFailure}
      />
    </section>
  );
};

export default Splash;
