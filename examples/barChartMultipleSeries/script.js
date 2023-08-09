import { createBarChart } from "../../src/core/charts/barChart";
import { data1, data2 } from "./data";

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
  displayType: "grouped",
};

createBarChart(document.getElementById("barChart"), data1, chartOptions);

const setDataset1Button = document.getElementById("setDataset1");
const setDataset2Button = document.getElementById("setDataset2");

setDataset1Button.addEventListener("click", () => {
  createBarChart(document.getElementById("barChart"), data1, chartOptions);
});

setDataset2Button.addEventListener("click", () => {
  createBarChart(document.getElementById("barChart"), data2, chartOptions);
});
