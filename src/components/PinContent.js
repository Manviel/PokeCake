import React, { useContext } from "react";
import format from "date-fns/format";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

import Context from "../actions/context";

import CreateComment from "./CreateComment";

const PinContent = () => {
  const { state } = useContext(Context);
  const { title, content, author, createdAt, comments } = state.currentPin;

  return (
    <section>
      <h2 className="mb title">{title}</h2>
      <h4 className="mb">{author.email}</h4>
      <h5 className="text mb">{format(Number(createdAt), "MMM Do, YYYY")}</h5>
      <p className="text">{content}</p>
      <hr className="divider" />
      <CreateComment />
      {comments && (
        <ul className="list container">
          {comments.map((com, i) => (
            <li key={i} className="text mb">
              <p>
                {com.author.email.substring(0, com.author.email.indexOf("@"))}:{" "}
                {com.text}
              </p>
              <span className="gray">
                {distanceInWordsToNow(Number(com.createdAt))} ago
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PinContent;
