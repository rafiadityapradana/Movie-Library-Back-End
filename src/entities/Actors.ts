import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Movies } from "./Movies";

@ObjectType()
@Entity()
export class Actors extends BaseEntity {
  @Field()
  @Column({ type: "char", length: 60 })
  @PrimaryColumn()
  @PrimaryGeneratedColumn("uuid")
  Id!: string;
  @Field()
  @Column({ unique: true })
  ActorsName!: string;
  @Field(() => [Movies])
  @OneToMany(() => Movies, (pro) => pro.Actors)
  Movies!: Movies[];
  @Field({ defaultValue: false })
  @Column({ default: false })
  IsDelete: boolean;
  @Field()
  @CreateDateColumn()
  CreatedAt: Date;
  @Field()
  @UpdateDateColumn()
  UpdatedAt: Date;
}
