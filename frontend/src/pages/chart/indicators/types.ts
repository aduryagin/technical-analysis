import { TechnicalIndicatorTemplate } from "klinecharts";

export type ExtendedTechnicalIndicatorTemplate = TechnicalIndicatorTemplate & {
  options?: any;
  paneId?: any;
  label?: string;
};
