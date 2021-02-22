export interface Candle {
  time: number;
  close: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface Cross {
  long: boolean;
  time: Candle["time"];
}
