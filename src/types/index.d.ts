export interface DataPoint<T = string | number | Date> {
  x: T; // x-axis value, can be a category, numeric value or date
  y: number | null; // y-axis value
}

export interface ChartSeries<T = string | number | Date> {
  name: string; // name of the series
  color?: string; // optional color for the series
  values: DataPoint<T>[]; // array of data points
}

export type ChartData<T = string | number | Date> = ChartSeries<T>[];

interface XAxisOptions {
  enabled?: boolean;
}

interface YAxisOptions {
  enabled?: boolean;
}

interface AxisOptions {
  yAxis?: YAxisOptions;
  xAxis?: XAxisOptions;
}

export interface ChartOptions {
  width: number;
  height: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  animationDuration?: number;
}

export interface BarChartOptions extends ChartOptions, AxisOptions {
  displayType?: "stacked" | "grouped";
}
