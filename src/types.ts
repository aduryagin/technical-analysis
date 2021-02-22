export interface Candle {
  time: number;
  close: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface Cross {
  bullish: boolean;
  time: Candle["time"];
}
