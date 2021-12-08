import typing
import strawberry
from binance import Client, ThreadedWebsocketManager, ThreadedDepthCacheManager
import os
from dotenv import load_dotenv

load_dotenv()

BINANCE_KEY = os.getenv("BINANCE_KEY")
BINANCE_SECRET = os.getenv("BINANCE_SECRET")

client = Client(BINANCE_KEY, BINANCE_SECRET)


@strawberry.type
class Candle:
    time: float
    open: float
    high: float
    low: float
    close: float
    volume: float


@strawberry.type
class Query:
    @strawberry.field
    def candles(self, ticker: str) -> typing.List[Candle]:
        klines = client.get_historical_klines(
            ticker, Client.KLINE_INTERVAL_1MINUTE, "1 day ago UTC"
        )

        return list(
            map(
                lambda item: Candle(
                    time=item[0],
                    open=float(item[1]),
                    high=float(item[2]),
                    low=float(item[3]),
                    close=float(item[4]),
                    volume=item[5],
                ),
                klines,
            )
        )


schema = strawberry.Schema(query=Query)
