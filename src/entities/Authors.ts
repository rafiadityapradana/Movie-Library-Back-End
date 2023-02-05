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
export class Authors extends BaseEntity {
  @Field()
  @Column({ type: "char", length: 60 })
  @PrimaryColumn()
  @PrimaryGeneratedColumn("uuid")
  Id!: string;
  @Field()
  @Column({ unique: true })
  AuthorsName!: string;
  @Field(() => [Movies])
  @OneToMany(() => Movies, (pro) => pro.Authors)
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
