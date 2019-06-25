import React, { useContext, useState } from "react";
import { GraphQLClient } from "graphql-request";

import Context from "../actions/context";

import { CREATE_PIN } from "../graphql/mutations";

const CreatePin = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { state, dispatch } = useContext(Context);

  const handleSubmit = async () => {
    const idToken = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().id_token;

    const client = new GraphQLClient("http://localhost:4000/graphql", {
      headers: { authorization: idToken }
    });

    const { latitude, longitude } = state.draft;

    const variables = {
      title,
      content,
      latitude,
      longitude
    };

    await client.request(CREATE_PIN, variables);

    handleDiscard();
  };

  const handleDiscard = () => {
    dispatch({ type: "CREATE_DRAFT" });
  };

  return (
    <div className="form">
      <h2 className="text mb">Location</h2>
      <input
        type="text"
        placeholder="Title"
        className="input mb"
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Content"
        className="input mb"
        onChange={e => setContent(e.target.value)}
      />
      <button
        className="input btn mb"
        disabled={!title || !content}
        onClick={handleSubmit}
      >
        Create
      </button>
      <button className="input btn mb" onClick={handleDiscard}>
        Cancel
      </button>
    </div>
  );
};

export default CreatePin;
