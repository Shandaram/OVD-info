<template>
  <div v-if="responseData">
    <div class="chart-cont">
      <div ref="chartPlot"></div>
      <div id="chartPlot"></div>
    </div>
  </div>
  <div v-else>
    <p>Loading the plot...</p>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
import { mapActions, mapGetters } from "vuex";


export default {
  data() {
    return {
      chart: null,
      fullData: null
    };
  },
  computed: {
    ...mapGetters(["responseData"]),
  },
  methods: {
    ...mapActions(["fetchDataFromAPI"]),
    async getData() {
      try {
        this.fullData = await this.fetchDataFromAPI();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async renderData() {
      try {
        const filledData = this.fullData.data;
        const filteredData = filledData.filter(item => item.verdict_imprisonment_term != null);
        filteredData.forEach(item => {
          if (item.verdict_imprisonment_term > 10000) {
            item.verdict_imprisonment_term = 12 * 20

          }
          if (item.verdict_imprisonment_term < 2) {
            item.verdict_imprisonment_term = 1

          }
          item.verdict_imprisonment_term = item.verdict_imprisonment_term / 12;
          item.persecution_started = new Date(item.persecution_started);

        });
        // Define the year to filter
        const persecutionStartedYearToFilter = 2010; // Change to the desired year

        // Filter data based on persecution_started_year
        const filteredDataByYear = filteredData.filter(item => item.persecution_started.getFullYear() >= persecutionStartedYearToFilter);

        // console.log(filteredData);
        return filteredDataByYear;
      } catch (error) {
        console.error("Error rendering data:", error);
      }
    },
    updateChart(filteredData) {

      const maxYValue = d3.max(filteredData, d => d.verdict_imprisonment_term);
      const startDate = new Date(2009, 0, 1); // January 1, 2002
      const endDate = new Date(2024, 11, 31); // December 31, 2024
      const chart = Plot.plot({
        width: 1000,
        height: 928,

        y: {
          type: "linear",
          domain: [0, maxYValue],
          label: "Sentence in years"
        },
        x: {
          domain: [startDate, endDate],
          label: null
        },
        color: {
          scheme: "Reds",
          range: [0, 2],
          legend: true,
        },
        grid: true,

        marks: [
          Plot.hexagon(
            filteredData,
            Plot.hexbin(
              { fill: "count" },
              {
                binWidth: 12,
                x: "persecution_started",
                y: "verdict_imprisonment_term",
                fill: "#ccc",
                stroke: "#000",
                strokeWidth: 0.75,
                tip: {
                  format: {
                    name: true,
                    stroke: false,
                  },

                },
                title: (d) => {
                  return `Date: ${d3.timeFormat("%d %b %Y")(d.persecution_started)}\nName: ${d.name_en}\nTerm: ${d.verdict_imprisonment_term.toFixed(2)} years`;
                },

              }
            )
          ),
          Plot.crosshair(filteredData, { x: "persecution_started", y: "verdict_imprisonment_term" }),
          Plot.tip(
            [`Alexei Navalny was sentenced to 19 years in prison in 2021, but was killed on 16th of February, 2024, aged 47, in FKU IK-3, Kharp.`],
            { x: new Date("2021-01-01"), y: 19, dy: -4, dx: 4, anchor: "bottom" }
          ),
        ]
      })

      return chart;
    }

  },
  mounted() {
    this.getData()
      .then(() => {
        return this.renderData();
      })
      .then((filledData) => {
        const chart = this.updateChart(filledData);
        this.chart = chart;
        document.getElementById("chartPlot").appendChild(chart);
      })
      .catch((error) => {
        console.error("Error rendering data:", error);
      });
  },

};
</script>


<style scoped></style>