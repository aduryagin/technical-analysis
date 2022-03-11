import { Args, Query, Mutation, Resolver } from "@nestjs/graphql";
import { TinkoffService } from "../tinkoff/tinkoff.service";
import { Source } from "./source.entity";
import { SourceService } from "./source.service";
import { AddSourceInput, UpdateSourceInput } from "./source.types";

@Resolver()
export class SourceResolver {
  constructor(
    private readonly sourceService: SourceService,
    private readonly tinkoffService: TinkoffService
  ) {}

  @Mutation(() => Source)
  async addSource(
    @Args("input", { type: () => AddSourceInput }) input: AddSourceInput
  ) {
    const source = await this.sourceService.addSource(input);
    await this.tinkoffService.updateInstance();
    return source;
  }

  @Mutation(() => Source)
  async updateSource(
    @Args("input", { type: () => UpdateSourceInput })
    input: UpdateSourceInput
  ) {
    const result = await this.sourceService.updateSource(input);
    await this.tinkoffService.updateInstance();
    return result;
  }

  @Mutation(() => Boolean)
  async removeSource(@Args("id") id: number) {
    await this.sourceService.removeSource(id);
    await this.tinkoffService.updateInstance();
    return true;
  }

  @Query(() => [Source])
  async sources() {
    return this.sourceService.sources();
  }
}
