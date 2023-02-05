import { AuthApiKey } from "../Meddelware/Authorization";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { createQueryBuilder } from "typeorm";

import { Actors } from "../entities/Actors";
import { ActorBody, InputId, ResponeData } from "../Interface";
@Resolver()
export class ActorsResolver {
  @Query(() => [Actors])
  @UseMiddleware(AuthApiKey)
  async ActorList(): Promise<Actors[] | any> {
    try {
      return (await createQueryBuilder("Actors")
        .leftJoinAndSelect("Actors.Movies", "Movies")
        .leftJoinAndSelect("Movies.Authors", "Authors")
        .where("Actors.IsDelete = false")
        .orderBy("Actors.CreatedAt", "DESC")
        .getMany()) as any;
    } catch (error) {
      throw new Error(error);
    }
  }
  @Query(() => Actors, { nullable: true })
  @UseMiddleware(AuthApiKey)
  async ActorDetail(@Arg("options") options: InputId): Promise<Actors | any> {
    try {
      return (await createQueryBuilder("Actors")
        .leftJoinAndSelect("Actors.Movies", "Movies")
        .leftJoinAndSelect("Movies.Authors", "Authors")
        .where("Actors.Id =:Id", { Id: options.Id })
        .where("Actors.IsDelete = false")
        .orderBy("Actors.CreatedAt", "DESC")
        .getOneOrFail()) as any;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Mutation(() => ResponeData)
  @UseMiddleware(AuthApiKey)
  async ActorDelete(
    @Arg("options") options: InputId
  ): Promise<ResponeData | any> {
    try {
      const Data = (await createQueryBuilder("Actors")
        .where("Actors.Id =:Id", { Id: options.Id })
        .getOneOrFail()) as any;
      if (!Data) throw new Error("Data not Found !");
      await createQueryBuilder("Actors")
        .update(Actors)
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
  async ActorCreate(
    @Arg("options") options: ActorBody
  ): Promise<ResponeData | any> {
    try {
      await createQueryBuilder("Actors")
        .insert()
        .into(Actors)
        .values([
          {
            ActorsName: options.ActorsName,
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
  async ActorUpdate(
    @Arg("options") options: InputId,
    @Arg("optionBody") optionBody: ActorBody
  ): Promise<boolean | any> {
    try {
      const Data = (await createQueryBuilder("Actors")
        .where("Id =:Id", { Id: options.Id })
        .getOneOrFail()) as any;
      if (!Data) throw new Error("Data not Found !");
      await createQueryBuilder("Actors")
        .update(Actors)
        .set({
          ActorsName: optionBody.ActorsName,
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
