import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Actors } from "./Actors";
import { Authors } from "./Authors";

@ObjectType()
@Entity()
export class Movies extends BaseEntity {
  @Field()
  @Column({ type: "char", length: 60 })
  @PrimaryColumn()
  @PrimaryGeneratedColumn("uuid")
  Id!: string;
  @Field()
  @Column({ unique: true })
  MovieTitle!: string;
  @Field()
  @Column({ type: "text" })
  MovieDesc!: string;
  @Field()
  @ManyToOne(() => Authors, (ct) => ct.Movies)
  Authors!: Authors;
  @Field()
  @ManyToOne(() => Actors, (ct) => ct.Movies)
  Actors!: Actors;
  @Field()
  @CreateDateColumn()
  CreatedAt: Date;
  @Field()
  @UpdateDateColumn()
  UpdatedAt: Date;
}
