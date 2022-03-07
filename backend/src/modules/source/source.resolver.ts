import { Args, Query, Mutation, Resolver } from "@nestjs/graphql";
import { Source } from "./source.entity";
import { SourceService } from "./source.service";
import { AddSourceInput, UpdateSourceInput } from "./source.types";

@Resolver()
export class SourceResolver {
  constructor(private readonly sourceService: SourceService) {}

  @Mutation(() => Source)
  async addSource(
    @Args("input", { type: () => AddSourceInput }) input: AddSourceInput
  ) {
    return this.sourceService.addSource(input);
  }

  @Mutation(() => Source)
  async updateSource(
    @Args("input", { type: () => UpdateSourceInput })
    input: UpdateSourceInput
  ) {
    return this.sourceService.updateSource(input);
  }

  @Mutation(() => Boolean)
  async removeSource(@Args("id") id: number) {
    await this.sourceService.removeSource(id);
    return true;
  }

  @Query(() => [Source])
  async sources() {
    return this.sourceService.sources();
  }
}
