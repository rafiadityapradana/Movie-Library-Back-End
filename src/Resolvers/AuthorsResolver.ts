import { AuthApiKey } from "../Meddelware/Authorization";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { createQueryBuilder } from "typeorm";

import { Authors } from "../entities/Authors";
import { AuthorBody, InputId, ResponeData } from "../Interface";
@Resolver()
export class AuthorsResolver {
  @Query(() => [Authors])
  @UseMiddleware(AuthApiKey)
  async AuthorList(): Promise<Authors[] | any> {
    try {
      return (await createQueryBuilder("Authors")
        .leftJoinAndSelect("Authors.Movies", "Movies")
        .leftJoinAndSelect("Movies.Actors", "Actors")
        .where("Authors.IsDelete = false")
        .orderBy("Authors.CreatedAt", "DESC")
        .getMany()) as any;
    } catch (error) {
      throw new Error(error);
    }
  }
  @Query(() => Authors, { nullable: true })
  @UseMiddleware(AuthApiKey)
  async AuthorDetail(@Arg("options") options: InputId): Promise<Authors | any> {
    try {
      return (await createQueryBuilder("Authors")
        .leftJoinAndSelect("Authors.Movies", "Movies")
        .leftJoinAndSelect("Movies.Actors", "Actors")
        .where("Authors.IsDelete = false")
        .where("Authors.Id =:Id", { Id: options.Id })
        .orderBy("Authors.CreatedAt", "DESC")
        .getOneOrFail()) as any;
    } catch (error) {
      throw new Error(error);
    }
  }
  @Mutation(() => ResponeData)
  @UseMiddleware(AuthApiKey)
  async AuthorDelete(
    @Arg("options") options: InputId
  ): Promise<ResponeData | any> {
    try {
      const Data = (await createQueryBuilder("Authors")
        .where("Authors.Id =:Id", { Id: options.Id })
        .getOneOrFail()) as any;
      if (!Data) throw new Error("Data not Found !");
      await createQueryBuilder("Authors")
        .update(Authors)
        .set({
          IsDelete: true,
        })
        .where("Id =:Id", { Id: options.Id })
        .execute();
      return {
        Message: "Success",
      };
    } catch (error) {
      throw new Error(error);
    }
  }
  @Mutation(() => ResponeData)
  @UseMiddleware(AuthApiKey)
  async AuthorCreate(
    @Arg("options") options: AuthorBody
  ): Promise<ResponeData | any> {
    try {
      await createQueryBuilder("Authors")
        .insert()
        .into(Authors)
        .values([
          {
            AuthorsName: options.AuthorsName,
          },
        ])
        .execute();
      return {
        Message: "Success",
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Mutation(() => ResponeData)
  @UseMiddleware(AuthApiKey)
  async AuthorUpdate(
    @Arg("options") options: InputId,
    @Arg("optionBody") optionBody: AuthorBody
  ): Promise<boolean | any> {
    try {
      const Data = (await createQueryBuilder("Authors")
        .where("Id =:Id", { Id: options.Id })
        .getOneOrFail()) as any;
      if (!Data) throw new Error("Data not Found !");
      await createQueryBuilder("Authors")
        .update(Authors)
        .set({
          AuthorsName: optionBody.AuthorsName,
        })
        .where("Id =:Id", { Id: options.Id })
        .execute();
      return {
        Message: "Success",
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
