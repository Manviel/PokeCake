import React, { Fragment } from "react";
import { GoogleLogin } from "react-google-login";
import { GraphQLClient } from "graphql-request";

import { CLIENT_ID } from "../config";

import { ME_QUERY } from "../graphql/queries";

const Splash = () => {
  const onSuccess = async googleUser => {
    const idToken = googleUser.getAuthResponse().id_token;

    const client = new GraphQLClient("http://localhost:4000/graphql", {
      headers: { authorization: idToken }
    });

    await client.request(ME_QUERY);
  };

  return (
    <Fragment>
      <h1>Login</h1>
      <GoogleLogin
        clientId={CLIENT_ID}
        onSuccess={onSuccess}
        isSignedIn={true}
      />
    </Fragment>
  );
};

export default Splash;
