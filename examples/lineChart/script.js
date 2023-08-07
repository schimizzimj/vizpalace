import { createLineChart } from "../../src/core/charts/lineChart";
import { data } from "./data";

const chartOptions = {
  width: 500,
  height: 500,
  margin: {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
  },
};

createLineChart(document.getElementById("lineChart"), data, chartOptions);
