import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class ResponeData {
  @Field()
  Message: string;
}
@InputType()
export class InputId {
  @Field()
  Id: string;
}
@InputType()
export class MovieBody {
  @Field()
  MovieTitle: string;
  @Field()
  MovieDesc: string;
  @Field()
  Authors: string;
  @Field()
  Actors: string;
}

@InputType()
export class ActorBody {
  @Field()
  ActorsName: string;
}
@InputType()
export class AuthorBody {
  @Field()
  AuthorsName: string;
}
