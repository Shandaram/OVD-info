<template>
    <div class="chart-cont">
        <div ref="chart"></div>
        <div id="chart"></div>
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
        getAgeGroup(age) {
            if (age < 18) {
                return "< 18";
            } else if (age >= 18 && age <= 25) {
                return "18-25";
            } else if (age > 25 && age <= 35) {
                return "25-35";
            } else if (age > 35 && age <= 45) {
                return "35-45";
            } else if (age > 45 && age <= 55) {
                return "45-55";
            } else if (age > 55 && age <= 65) {
                return "55-65";
            } else if (age > 65 && age <= 75) {
                return "65-75";
            } else if (age > 75 && age <= 85) {
                return "75-85";
            } else if (age > 85) {
                return "> 85";
            } else {
                console.log("Age:", age); // Log the age value
            }
        },
        async renderData() {
            try {
                const filledData = this.fullData.data;
                const filteredData = filledData.filter(item => item.age_persecution_began !== null && !isNaN(item.age_persecution_began));
                filteredData.forEach(item => {
                    item.persecution_started = new Date(item.persecution_started);
                });

                // Group data by year
                const dataByYear = d3.group(filteredData, d => d.persecution_started.getFullYear());
                const countByAgePerYear = {};

                const allCategories = new Set();
                filteredData.forEach(d => allCategories.add(this.getAgeGroup(d.age_persecution_began)));

                dataByYear.forEach((yearData, year) => {
                    const dataByAgeGroup = d3.rollup(
                        yearData,
                        v => v.length,
                        d => this.getAgeGroup(d.age_persecution_began)
                    );

                    const counts = {};
                    // Iterate over all categories and check if they exist in dataByAgeGroup
                    allCategories.forEach(category => {
                        counts[category] = dataByAgeGroup.has(category) ? dataByAgeGroup.get(category) : 0;
                    });
                    countByAgePerYear[year] = counts;
                });

                const formattedData = [];
                for (const [year, counts] of Object.entries(countByAgePerYear)) {
                    // Assuming the date should be the first day of the year
                    const date = new Date(parseInt(year), 0, 1);
                    for (const [category, count] of Object.entries(counts)) {
                        formattedData.push({
                            date,
                            category,
                            count
                        });
                    }
                }


                // console.log(formattedData);

                return formattedData;
            } catch (error) {
                console.error("Error rendering data:", error);
            }
        },
        updateChart(filteredData, year) {
            const dataByYear = filteredData.filter(entry => entry.date.getFullYear() === year);

            const categoryOrder = {
                "> 85": 0,
                "75-85": 1,
                "65-75": 2,
                "55-65": 3,
                "45-55": 4,
                "35-45": 5,
                "25-35": 6,
                "18-25": 7,
                "< 18": 8
            };

            dataByYear.sort((a, b) => {
                return categoryOrder[a.category] - categoryOrder[b.category];
            });

            const chart = Plot.plot({
                x: {
                    axis: "top",
                    grid: true
                },
                y: {
                    label: null
                },
                marks: [
                    Plot.ruleX([0]),
                    Plot.barX(dataByYear, { x: "count", y: "category", sort: { y: categoryOrder } }),

                ]
            });

            return chart;
        },

        animateChart(filteredData) {
            let currentYear = 2009; // Start year
            const endYear = 2023; // End year
            const interval = 2000; // Interval in milliseconds between each year change
            const steps = 20; // Number of animation steps

            const animateTransition = () => {
                const chartContainer = document.getElementById('chart'); // Change 'chart' to the actual ID of your chart container
                chartContainer.innerHTML = ''; // Clear existing chart

                // Calculate the interpolation factor (0 to 1) based on current year and end year
                const interpolationFactor = (currentYear - 2009) / (endYear - 2009);

                // Calculate the current year to display based on interpolation factor
                const currentYearToDisplay = Math.floor(currentYear);

                // Update chart for the current year
                const chart = this.updateChart(filteredData, currentYearToDisplay, interpolationFactor);

                chartContainer.appendChild(chart); // Render updated chart

                currentYear += (endYear - 2009) / steps; // Increment year based on number of steps

                // Stop animation when reaching the end year
                if (currentYear > endYear) {
                    clearInterval(animationInterval);
                }
            };

            // Start animation
            const animationInterval = setInterval(animateTransition, interval / steps);
        },





    },
    mounted() {
        this.getData()
            .then(() => {
                return this.renderData();
            })
            .then((filledData) => {
                const initialChart = this.updateChart(filledData, 2009); // Render initial chart for 2023
                this.chart = initialChart;
                document.getElementById("chart").appendChild(initialChart);
                this.animateChart(filledData); // Start animation
            })
            .catch((error) => {
                console.error("Error rendering data:", error);
            });
    },

};
</script>


<style scoped></style>