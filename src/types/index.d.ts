export interface BarData {
  label: string;
  value: number;
}

export interface LineData {
  date: Date;
  value: number;
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
