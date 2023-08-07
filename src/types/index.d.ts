interface BarData {
  label: string;
  value: number;
}

interface LineData {
  date: Date;
  value: number;
}

interface ChartOptions {
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
