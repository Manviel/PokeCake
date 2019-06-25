import React, { useContext } from "react";

import Context from "../actions/context";

import CreatePin from "./CreatePin";
import PinContent from "./PinContent";

const NoContent = () => <h2>Click on the map to add a pin</h2>;

const Blog = () => {
  const { state } = useContext(Context);
  const { draft, currentPin } = state;

  return (
    <section className="paper">
      {!draft && !currentPin ? (
        <NoContent />
      ) : currentPin ? (
        <PinContent />
      ) : (
        <CreatePin />
      )}
    </section>
  );
};

export default Blog;
