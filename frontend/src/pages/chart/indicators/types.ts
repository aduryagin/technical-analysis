import { TechnicalIndicatorTemplate } from "../../../KLineChart/types";

export type ExtendedTechnicalIndicatorTemplate = TechnicalIndicatorTemplate & {
  options?: any;
  paneId?: any;
  label?: string;
};
