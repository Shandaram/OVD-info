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
          item.first_verdict_date = new Date(item.first_verdict_date);

        });
        // Define the year to filter
        const persecutionStartedYearToFilter = 2010; // Change to the desired year

        // Filter data based on persecution_started_year
        const filteredDataByYear = filteredData.filter(item => item.first_verdict_date.getFullYear() >= persecutionStartedYearToFilter);

        // console.log(filteredData);
        return filteredDataByYear;
      } catch (error) {
        console.error("Error rendering data:", error);
      }
    },
    updateChart(filteredData) {

      const maxYValue = d3.max(filteredData, d => d.verdict_imprisonment_term);
      const startDate = new Date(2009, 7, 1); // January 1, 2002
      const endDate = new Date(2024, 6, 31); // December 31, 2024
      const chart = Plot.plot({
        width: 1400,
        height: 928,
        margin: 50,
        marginRight: 150,
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
          Plot.barX(filteredData, {
            x: new Date("2014-02-27"),
            fill: "#ACC2FF",
            interval: "day", 
            inset: 0 
          }),
          Plot.tip(
            [`On 27 February 2014, Russian special forces without insignia seized strategic sites across Crimea.`],
            { x: new Date("2014-02-27"), y: 27, dy: -8, fontSize: 14, anchor: "middle", stroke: "none" }
          ),
          Plot.barX(filteredData, {
            x: new Date("2022-02-24"),
            fill: "#3165F3",
            interval: "day", 
            inset: 0 
          }),
          Plot.tip(
            [`On 24 February 2022, Putin announced a "special military operation", and started a full scale invasion of Ukraine.`],
            { x: new Date("2022-02-24"), y: maxYValue, dy: -8, fontSize: 14, anchor: "middle", stroke: "none"  }
          ),
          Plot.hexagon(
            filteredData,
            Plot.hexbin(
              { fill: "count" },
              {
                binWidth: 14,
                x: "first_verdict_date",
                y: "verdict_imprisonment_term",
                fill: "#ccc",
                stroke: "#000",
                strokeWidth: 0.75,
                tip: {
                  format: {
                    name: true,
                    stroke: false,
                  },
                  fontSize: 14

                },
                title: (d) => {
                  return `Date: ${d3.timeFormat("%d %b %Y")(d.first_verdict_date)}\nName: ${d.name_en}\nTerm: ${d.verdict_imprisonment_term.toFixed(2)} years`;
                },

              }
            )
          ),
          Plot.crosshair(filteredData, { x: "first_verdict_date", y: "verdict_imprisonment_term" }),
          Plot.tip(
            [`Alexei Navalny was arrested \nin 2021 and sentenced to 19\nyears in prison in 2023.\nHe was killed on 16th of\nFebruary, 2024, aged 47,\nin FKU IK-3, Kharp.`],
            { x: new Date("2023-09-04"), y: 19, dy: -4, dx: 8, fontSize: 14, anchor: "left", stroke: "black"  }
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