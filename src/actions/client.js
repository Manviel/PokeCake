import { useState, useEffect } from "react";
import { GraphQLClient } from "graphql-request";

import { BASE_URL } from "../config";

export const useClient = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const idToken = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().id_token;

    setToken(idToken);
  }, []);

  return new GraphQLClient(BASE_URL, {
    headers: { authorization: token }
  });
};
