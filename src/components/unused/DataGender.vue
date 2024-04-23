<template>
  <div class="chart-cont">
    <h2>Gendered</h2>
    <div ref="chart" class="chart"></div>
    <div id="chart" class="chart"></div>
  </div>
</template>

<script>
import * as Plot from "@observablehq/plot";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "DataGendered",
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    ...mapGetters(["responseData"]),
  },
  methods: {
    ...mapActions(["fetchDataFromAPI"]),
    async renderData() {
      try {
        const responseData = await this.fetchDataFromAPI();

        // Filter cases that started from 2014 to 2024
        const filteredCases = responseData.data.filter((item) => {
          const startDate = new Date(item.persecution_started);
          return (
            startDate.getFullYear() >= 2014 && startDate.getFullYear() <= 2024
          );
        });

        // Count cases for each month from 2014 to 2024
        const casesByMonth = [];
        for (let year = 2014; year <= 2024; year++) {
          const endMonth = year === 2024 ? 2 : 11;
          for (let month = 0; month <= endMonth; month++) {
            const casesForMonth = filteredCases.filter((item) => {
              const startDate = new Date(item.persecution_started);
              const startDateUTC = new Date(
                Date.UTC(
                  startDate.getFullYear(),
                  startDate.getMonth(),
                  startDate.getDate()
                )
              );

              return (
                startDateUTC.getUTCFullYear() === year &&
                startDateUTC.getUTCMonth() === month
              );
            });

            let countFemale = 0;
            let countMale = 0;
            casesForMonth.forEach((caseItem) => {
              if (caseItem.gender_en === "female") {
                countFemale++;
              } else if (caseItem.gender_en === "male") {
                countMale++;
              }
            });

            const startDateUTC = new Date(Date.UTC(year, month, 1));
            const yearFormatted = startDateUTC.getFullYear();
            const monthFormatted = startDateUTC.getMonth() + 1;
            const dayFormatted = startDateUTC.getDate();
            // Format month and day to ensure they have leading zeros if necessary
            const formattedMonth =
              monthFormatted < 10 ? `0${monthFormatted}` : monthFormatted;
            const formattedDay =
              dayFormatted < 10 ? `0${dayFormatted}` : dayFormatted;

            const formattedDate = `${yearFormatted}-${formattedMonth}-${formattedDay}`;

            casesByMonth.push(
              {
                date: formattedDate,
                cases: countFemale, // Count of female cases
                sex: "female", // Gender identifier
              },

              {
                date: formattedDate,
                cases: countMale, // Count of male cases
                sex: "male", // Gender identifier
              }
            );
          }
        }
        casesByMonth.forEach((dataPoint) => {
          dataPoint.date = new Date(dataPoint.date);
        }); 
        console.log(casesByMonth);
    
        return casesByMonth
        
      
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      
    },
  },
  mounted() {
    this.renderData()
      .then((casesByMonth) => {
        const chart = Plot.plot({
          x: {
            interval: "month",
            label: null,
            tickFormat: (d) => d.toLocaleString("en", { year: "numeric" }),

            tickRotate: -80,
          },
          y: {
            label: "Number of Cases",
            grid: true,
            domain: [
              0,
              Math.max(...casesByMonth.map((dataPoint) => dataPoint.cases)) +
                20,
            ],
            clamp: true,
          },
          color: {
            domain: ["male", "female"],
            range: ["#3b1f2b", "#db162f"],
          },
          marks: [
            Plot.barY(casesByMonth, {
              x: "date",
              y: "cases",
              title: "Cases by Month",
              fill: "sex",
            }),

            Plot.tip(casesByMonth, Plot.pointerX({x: "date", y: "cases"}))
          ],
          marginBottom: 80,
        });
        return chart;
      })
      .then((chart) => {
        document.getElementById("chart").appendChild(chart);
        // d3.select(this.$refs.chart).node().append(chart);
      });
  },
};
</script>

<style>
.chart-cont {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

svg {
  width: 90vw;
}
</style>
