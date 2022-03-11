import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum SourceName {
  Tinkoff = "Tinkoff",
  Binance = "Binance",
}
registerEnumType(SourceName, {
  name: "SourceName",
});

@Entity()
@ObjectType()
export class Source {
  @PrimaryGeneratedColumn()
  @Field({ nullable: true })
  id: number;

  @Column()
  @Field()
  name: SourceName;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  key: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  secret: string;
}
