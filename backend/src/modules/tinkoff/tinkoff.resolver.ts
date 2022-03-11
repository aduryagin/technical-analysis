import { Resolver } from "@nestjs/graphql";
import { TinkoffService } from "./tinkoff.service";
import { WatchListService } from "../watchList/watchList.service";

@Resolver()
export class TinkoffResolver {
  constructor(
    private readonly tinkoffService: TinkoffService,
    private readonly watchListService: WatchListService
  ) {}
}
