import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ShapePoint } from "./shape.types";

@Entity()
@ObjectType()
export class Shape {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  ticker: string;

  @Column()
  @Field(() => [ShapePoint])
  points: string;
}
