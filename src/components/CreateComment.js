import React, { useContext, useState } from "react";

import Context from "../actions/context";
import { useClient } from "../actions/client";

import { CREATE_COMMENT } from "../graphql/mutations";

const CreateComment = () => {
  const [text, setText] = useState("");

  const client = useClient();

  const { state } = useContext(Context);

  const handleSubmit = async () => {
    const variables = { pinId: state.currentPin._id, text };

    await client.request(CREATE_COMMENT, variables);

    setText("");
  };

  return (
    <div className="form">
      <h2 className="text mb">Leave a comment down below</h2>
      <input
        type="text"
        placeholder="What do you think"
        className="input mb"
        onChange={e => setText(e.target.value)}
      />
      <button className="input btn" disabled={!text} onClick={handleSubmit}>
        Send
      </button>
    </div>
  );
};

export default CreateComment;
