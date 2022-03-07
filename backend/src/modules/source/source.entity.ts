import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Source {
  @PrimaryGeneratedColumn()
  @Field({ nullable: true })
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  key: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  secret: string;
}
