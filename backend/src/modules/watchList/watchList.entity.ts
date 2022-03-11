import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AlgorithmTrade } from "../algorithmTesting/algorithmTesting.entity";

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

  @Column({ nullable: true })
  @Field()
  source: string;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  pricePercentChange?: number;

  @OneToMany(() => AlgorithmTrade, (trade) => trade.instrument)
  trades: AlgorithmTrade[];
}
