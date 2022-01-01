import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Instrument {
  @PrimaryGeneratedColumn()
  @Field({ nullable: true })
  id: number;

  @Column()
  @Field()
  ticker: string;

  @Column()
  @Field()
  figi: string;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  pricePercentChange?: number;
}
