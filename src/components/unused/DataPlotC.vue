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
      fullData: null // Define a data property to store the fetched data
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

        // Filter out data points where verdict_imprisonment_term is null or undefined
        const filteredData = filledData.filter(item => item.verdict_imprisonment_term != null);

        // Convert verdict_imprisonment_term to the appropriate format (e.g., numeric or date)
        filteredData.forEach(item => {

          // Convert verdict_imprisonment_term to a numeric value if it's not already
          if (item.verdict_imprisonment_term > 10000) {
            item.verdict_imprisonment_term = 12 * 20

          }
          if (item.verdict_imprisonment_term < 2) {
            item.verdict_imprisonment_term = 1

          }
          item.verdict_imprisonment_term = item.verdict_imprisonment_term / 12;
          // Convert verdict_imprisonment_term to a Date object if it's in a date string format
          item.persecution_started = new Date(item.persecution_started);

        });


        filteredData.sort((a, b) => a.persecution_started - b.persecution_started);
        console.log(filteredData);
        return filteredData;
      } catch (error) {
        console.error("Error rendering data:", error);
      }
    },
    updateChart(filteredData) {

      // const maxYValue = d3.max(filteredData, d => d.verdict_imprisonment_term);
      const startDate = new Date(2002, 0, 1); // January 1, 2002
      const endDate = new Date(2024, 11, 31); // December 31, 2024
      const chart = Plot.plot({

        width: 1000,
        height: 928,
        color: {
          scheme: "BuRd", range: [0, 1.5],
          legend: true,
        },

        y: {
          type: "linear",
    
        },
        x: {
          domain: [startDate, endDate]
        },
        marks: [
          Plot.ruleY([0]),
          Plot.dot(filteredData, { 
            x: "persecution_started", 
            y: "verdict_imprisonment_term", 
            stroke: "verdict_imprisonment_term",
            tip: true,
            title: (d)=> `hello ${d.age}`
           }),
          Plot.lineY(filteredData, Plot.windowY(100, { x: "persecution_started", y: "age_persecution_began", tip: true }))
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