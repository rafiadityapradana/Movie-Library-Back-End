import { ApolloError } from "apollo-server-express";

import { MyContext } from "../Types";
import { MiddlewareFn } from "type-graphql";

export const AuthApiKey: MiddlewareFn<MyContext> = async (
  { context },
  next
) => {
  const ReqApiKey = context.req.headers["api-key-node"];
  if (ReqApiKey) {
    if (ReqApiKey.toString().split(" ")[0] === "NODE-KEY") {
      const KeyExisi =
        ReqApiKey.toString().split(" ")[1] === process.env.APPOLLO_KEY;
      if (KeyExisi) {
        return next();
      } else {
        throw new ApolloError("Bad Request !");
      }
    } else {
      throw new ApolloError("Bad Request !");
    }
  } else {
    throw new ApolloError("Bad Request !");
  }
};
