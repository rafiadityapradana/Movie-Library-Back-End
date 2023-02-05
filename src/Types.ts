import { Request, Response } from "express";
import { getConnection } from "typeorm";

export const __prod__ = process.env.NODE_ENV === "production";
export type MyContext = {
  req: Request;
  res: Response;
};
export const ConnectioncreateQueryRunner = () => {
  const QUERY = getConnection().createQueryRunner();
  return QUERY;
};
