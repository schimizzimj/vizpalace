import { createScatterPlot } from "../../src/core/charts/scatterPlot";
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

createScatterPlot(document.getElementById("scatterPlot"), data, chartOptions);

const setDataset1Button = document.getElementById("setDataset1");
const setDataset2Button = document.getElementById("setDataset2");

setDataset1Button.addEventListener("click", () => {
  createScatterPlot(document.getElementById("scatterPlot"), data, chartOptions);
});

setDataset2Button.addEventListener("click", () => {
  createScatterPlot(
    document.getElementById("scatterPlot"),
    data2,
    chartOptions
  );
});
