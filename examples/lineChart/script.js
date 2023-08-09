import { createLineChart } from "../../src/core/charts/lineChart";
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
  animationDuration: 1000,
  xAxis: {
    title: "X Axis Title",
  },
  yAxis: {
    title: "Y Axis Title",
  },
};

createLineChart(document.getElementById("lineChart"), data, chartOptions);
