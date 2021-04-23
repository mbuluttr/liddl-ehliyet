require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./graphql/index.js");
const getParsedQuestionData = require("./scripts/questionParser");
const getParsedSignData = require("./scripts/signParser");
const prepareQuestionURL = require("./scripts/prepareQuestionURL");
const changeURL = require("./scripts/changeURL");
const jwt = require("jsonwebtoken");

const dbURI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

const app = express();

const getUser = (token) => {
  if (token) {
    token = token.replace("Bearer ", "");
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error("Session invalid");
    }
  }
};

const graphQLServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization;
    const currentUser = getUser(token);

    return {
      getParsedQuestionData: getParsedQuestionData,
      getParsedSignData: getParsedSignData,
      prepareQuestionURL: prepareQuestionURL,
      changeURL: changeURL,
      currentUser: currentUser,
    };
  },
  playground: process.env.GRAPHQL_PLAYGROUND === "development",
});

graphQLServer.applyMiddleware({ app, path: "/ehliyet" });

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 GraphQL server is running on http://localhost:${PORT}${graphQLServer.graphqlPath}`);
    });
  })
  .catch((err) => console.log(err));
