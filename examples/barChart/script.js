import { createBarChart } from "../../src/core/charts/barChart";
import { data } from "./data";

const chartOptions = {
  chartDimensions: {
    width: 650,
    height: 400,
    margin: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    },
  },
  xAxis: {
    title: "Letter",
  },
};

createBarChart(document.getElementById("barChart"), data, chartOptions);
