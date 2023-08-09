import { assert, expect, test, describe, beforeEach, afterEach } from "vitest";
import { createBarChart } from "../../../src/core/charts/barChart";
import { BarChartOptions, ChartData } from "../../../src/types";

describe("barChart", () => {
  let container: HTMLDivElement;
  let data: ChartData;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("single series", () => {
    beforeEach(() => {
      data = [
        {
          name: "Test",
          values: [
            { x: "foo", y: 10 },
            { x: "bar", y: 20 },
            { x: "baz", y: 30 },
          ],
        },
      ];
    });

    test("it should render a bar chart", () => {
      createBarChart(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const bars = svg.querySelectorAll("rect");
      expect(bars.length).toBe(3);
    });

    test("it should use custom width and height", () => {
      const config = {
        chartDimensions: {
          width: 100,
          height: 100,
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      };
      createBarChart(container, data, config);

      const svg = container.querySelector("svg");
      assert(svg);
      expect(svg.getAttribute("width")).toBe("100");
      expect(svg.getAttribute("height")).toBe("100");
    });

    test("it should use custom margins", () => {
      const config = {
        chartDimensions: {
          width: 100,
          height: 100,
          margin: { top: 10, right: 10, bottom: 10, left: 10 },
        },
      };
      createBarChart(container, data, config);

      const { width, margin, height } = config.chartDimensions;

      const svg = container.querySelector("svg");
      assert(svg);
      expect(svg.getAttribute("width")).toBe(
        `${width + margin.left + margin.right}`
      );
      expect(svg.getAttribute("height")).toBe(
        `${height + margin.top + margin.bottom}`
      );
    });

    test("it display the x axis by default", () => {
      createBarChart(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const xAxis = svg.querySelector(".x-axis");
      assert(xAxis);
    });

    test("it should not display the x axis when disabled", () => {
      createBarChart(container, data, {
        xAxis: {
          enabled: false,
        },
      });

      const svg = container.querySelector("svg");
      assert(svg);

      const xAxis = svg.querySelector(".x-axis");
      expect(xAxis).toBeNull();
    });

    test("should not display the x axis title by default", () => {
      createBarChart(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const xAxis = svg.querySelector(".x-axis");
      assert(xAxis);

      const title = svg.querySelector(".x-axis-title");
      expect(title).toBeNull();
    });

    test("should display the x axis title when defined", () => {
      createBarChart(container, data, {
        xAxis: {
          title: "Test",
        },
      });

      const svg = container.querySelector("svg");
      assert(svg);

      const xAxis = svg.querySelector(".x-axis");
      assert(xAxis);

      const title = svg.querySelector(".x-axis-title");
      assert(title);
      expect(title.textContent).toBe("Test");
    });

    test("should display the y axis by default", () => {
      createBarChart(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const yAxis = svg.querySelector(".y-axis");
      assert(yAxis);
    });

    test("should not display the y axis when disabled", () => {
      createBarChart(container, data, {
        yAxis: {
          enabled: false,
        },
      });

      const svg = container.querySelector("svg");
      assert(svg);

      const yAxis = svg.querySelector(".y-axis");
      expect(yAxis).toBeNull();
    });

    test("should not display the y axis title by default", () => {
      createBarChart(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const yAxis = svg.querySelector(".y-axis");
      assert(yAxis);

      const title = svg.querySelector(".y-axis-title");
      expect(title).toBeNull();
    });

    test("should display the y axis title when defined", () => {
      createBarChart(container, data, {
        yAxis: {
          title: "Test",
        },
      });

      const svg = container.querySelector("svg");
      assert(svg);

      const yAxis = svg.querySelector(".y-axis");
      assert(yAxis);

      const title = svg.querySelector(".y-axis-title");
      assert(title);
      expect(title.textContent).toBe("Test");
    });

    test("it should look visually correct", async () => {
      createBarChart(container, data, { animationDuration: 0 });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = container.innerHTML;
      expect(result).toMatchSnapshot();
    });
  });

  describe("multiple series", () => {
    let config: Partial<BarChartOptions> = {
      displayType: "grouped",
    };

    beforeEach(() => {
      data = [
        {
          name: "Test 1",
          values: [
            { x: "foo", y: 10 },
            { x: "bar", y: 20 },
            { x: "baz", y: 30 },
          ],
        },
        {
          name: "Test 2",
          values: [
            { x: "foo", y: 20 },
            { x: "bar", y: 30 },
            { x: "baz", y: 40 },
          ],
        },
      ];
    });

    describe("stacked", () => {
      beforeEach(() => {
        config = {
          displayType: "stacked",
        };
      });

      test("it should render a bar chart", () => {
        createBarChart(container, data, config);

        const svg = container.querySelector("svg");
        assert(svg);

        const bars = svg.querySelectorAll("rect");
        expect(bars.length).toBe(6);
      });

      test("it should look visually correct", async () => {
        createBarChart(container, data, { animationDuration: 0 });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const result = container.innerHTML;
        expect(result).toMatchSnapshot();
      });
    });

    describe("grouped", () => {
      test("it should render a bar chart", () => {
        createBarChart(container, data, {});

        const svg = container.querySelector("svg");
        assert(svg);

        const bars = svg.querySelectorAll("rect");
        expect(bars.length).toBe(6);
      });

      test("it should look visually correct", async () => {
        createBarChart(container, data, { animationDuration: 0 });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const result = container.innerHTML;
        expect(result).toMatchSnapshot();
      });
    });
  });
});
