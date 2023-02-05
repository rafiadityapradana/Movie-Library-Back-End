import { AuthApiKey } from "../Meddelware/Authorization";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { createQueryBuilder } from "typeorm";
import { Movies } from "../entities/Movies";
import { InputId, MovieBody, ResponeData } from "../Interface";
@Resolver()
export class MovieResolvers {
  @Query(() => [Movies])
  @UseMiddleware(AuthApiKey)
  async MovieList(): Promise<Movies[] | any> {
    try {
      return (await createQueryBuilder("Movies")
        .leftJoinAndSelect("Movies.Authors", "Authors")
        .leftJoinAndSelect("Movies.Actors", "Actors")
        .orderBy("Movies.CreatedAt", "DESC")
        .getMany()) as any;
    } catch (error) {
      throw new Error(error);
    }
  }
  @Query(() => Movies, { nullable: true })
  @UseMiddleware(AuthApiKey)
  async MovieDetail(@Arg("options") options: InputId): Promise<Movies | any> {
    try {
      return (await createQueryBuilder("Movies")
        .leftJoinAndSelect("Movies.Authors", "Authors")
        .leftJoinAndSelect("Movies.Actors", "Actors")
        .where("Movies.Id =:Id", { Id: options.Id })
        .orderBy("Movies.CreatedAt", "DESC")
        .getOneOrFail()) as any;
    } catch (error) {
      throw new Error(error);
    }
  }
  @Mutation(() => ResponeData)
  @UseMiddleware(AuthApiKey)
  async MovieDelete(@Arg("options") options: InputId): Promise<boolean | any> {
    try {
      const Data = (await createQueryBuilder("Movies")
        .where("Movies.Id =:Id", { Id: options.Id })
        .getOneOrFail()) as any;

      if (!Data) throw new Error("Data not Found !");
      await createQueryBuilder("Movies")
        .delete()
        .from(Movies)
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
  async MovieUpdate(
    @Arg("options") options: InputId,
    @Arg("optionBody") optionBody: MovieBody
  ): Promise<boolean | any> {
    try {
      const Data = (await createQueryBuilder("Movies")
        .where("Id =:Id", { Id: options.Id })
        .getOneOrFail()) as any;
      if (!Data) throw new Error("Data not Found !");
      await createQueryBuilder("Movies")
        .update(Movies)
        .set({
          MovieTitle: optionBody.MovieTitle,
          MovieDesc: optionBody.MovieDesc,
          Actors: { Id: optionBody.Actors },
          Authors: { Id: optionBody.Authors },
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
  async MovieCreate(
    @Arg("options") options: MovieBody
  ): Promise<ResponeData | any> {
    try {
      await createQueryBuilder("Movies")
        .insert()
        .into(Movies)
        .values([
          {
            MovieTitle: options.MovieTitle,
            MovieDesc: options.MovieDesc,
            Actors: { Id: options.Actors },
            Authors: { Id: options.Authors },
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
}
