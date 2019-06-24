const { ApolloServer } = require("apollo-server");

const mongoose = require("mongoose");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const { findOrCreateUser } = require("./controllers/index");

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let currentUser = null;

    authToken = req.headers.authorization || "";

    if (authToken) {
      currentUser = await findOrCreateUser(authToken);
    } else {
      console.error(`Unable to authenticate user with token`);
    }

    return { currentUser };
  }
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
