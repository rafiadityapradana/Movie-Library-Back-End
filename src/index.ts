import "reflect-metadata";
import "dotenv-safe/config";
import express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

import path from "path";
import cors from "cors";

import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { __prod__ } from "./Types";

import { MovieResolvers } from "./Resolvers/MovieResolver";
import { ActorsResolver } from "./Resolvers/ActorsResolver";
import { Movies } from "./entities/Movies";
import { Authors } from "./entities/Authors";
import { Actors } from "./entities/Actors";
import { AuthorsResolver } from "./Resolvers/AuthorsResolver";

const main = async () => {
  const app = express();

  const ConnectionDatabase = await createConnection({
    type: "postgres",
    url: "postgresql://postgres:root@localhost:5432/movie_lib",
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Movies, Authors, Actors],
  });
  try {
    app.use(
      cors({
        credentials: true,
      })
    );
  } catch (err) {
    console.log(err);
  }
  const SetApolloServer = new ApolloServer({
    formatError: (err) => {
      if (err.message.startsWith("Server Error: ")) {
        return new Error("Internal server error");
      }
      return err;
    },
    schema: await buildSchema({
      resolvers: [MovieResolvers, ActorsResolver, AuthorsResolver],
      validate: false,
    }),
    plugins: [
      ApolloServerPluginCacheControl({
        defaultMaxAge: 1000,
        calculateHttpHeaders: false,
      }),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  await SetApolloServer.start();
  SetApolloServer.applyMiddleware({
    app,
  });
  if (ConnectionDatabase?.isConnected) {
    console.log("Connection Database Success...");
    app.listen(4000, () => {
      console.log("server started on port 4000");
    });
  } else {
    console.log("Connection Database Failed...");
  }
};
main().catch((err) => {
  console.error(err);
});
