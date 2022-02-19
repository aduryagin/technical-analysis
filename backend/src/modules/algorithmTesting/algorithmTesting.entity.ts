import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Instrument } from "../watchList/watchList.entity";

export enum TradeType {
  Long = "LONG",
  Short = "SHORT",
}
registerEnumType(TradeType, {
  name: "TradeType",
});

@Entity()
@ObjectType()
export class AlgorithmTrade {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @ManyToOne(() => Instrument, (instrument) => instrument.trades)
  @Field(() => Instrument)
  instrument: Instrument;

  @Column()
  @Field()
  price: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  closePrice: number;

  @Column()
  @Field()
  interval: string;

  @Column()
  @Field()
  type: TradeType;

  @Column()
  @Field()
  closed: boolean;

  @Column()
  @Field()
  date: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  closeDate: string;

  @Field()
  pricePercentChange?: number;
}
