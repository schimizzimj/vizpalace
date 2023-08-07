import { createBarChart } from "../../src/core/charts/barChart";
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

createBarChart(document.getElementById("barChart"), data, chartOptions);
