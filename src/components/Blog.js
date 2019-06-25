import React, { useContext } from "react";

import Context from "../actions/context";

import CreatePin from "./CreatePin";

const NoContent = () => <h2>Click on the map to add a pin</h2>;

const Blog = () => {
  const { state } = useContext(Context);
  const { draft } = state;

  return (
    <section className="paper">
      {!draft ? <NoContent /> : <CreatePin />}
    </section>
  );
};

export default Blog;
