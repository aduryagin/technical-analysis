import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AlgorithmTrade } from "../algorithmTesting/algorithmTesting.entity";
import { SourceName } from "../source/source.entity";

@Entity()
@ObjectType()
export class Instrument {
  @PrimaryGeneratedColumn()
  @Field({ nullable: true })
  id: number;

  @Column()
  @Field()
  source: SourceName;

  @Column({ nullable: true })
  @Field({ nullable: true })
  ticker?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  figi?: string;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  pricePercentChange?: number;

  @OneToMany(() => AlgorithmTrade, (trade) => trade.instrument)
  trades: AlgorithmTrade[];
}
