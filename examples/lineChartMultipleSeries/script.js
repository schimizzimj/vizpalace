import { createLineChart } from "../../src/core/charts/lineChart";
import { data, data2 } from "./data";

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
};

createLineChart(document.getElementById("lineChart"), data, chartOptions);

const setDataset1Button = document.getElementById("setDataset1");
const setDataset2Button = document.getElementById("setDataset2");

setDataset1Button.addEventListener("click", () => {
  createLineChart(document.getElementById("lineChart"), data, chartOptions);
});

setDataset2Button.addEventListener("click", () => {
  createLineChart(document.getElementById("lineChart"), data2, chartOptions);
});
