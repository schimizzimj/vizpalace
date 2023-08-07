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
