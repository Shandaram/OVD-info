<template>
    <div class="chart-cont">
        <div ref="chartInd" class="chart"></div>
        <div id="chartInd" class="chart"></div>
    </div>
</template>

<script>
import * as Plot from "@observablehq/plot";
import { mapActions, mapGetters } from "vuex";

export default {
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

                const filteredData = filteredCases.filter(item => item.persecution_occupation_en !== null && item.persecution_occupation_en !== undefined && item.persecution_occupation_en[0].toLowerCase() !== "other");

                filteredData.forEach(item => {
                    item.persecution_started = new Date(item.persecution_started);
                });

                const occupationCounts = filteredData.reduce((counts, item) => {
                    const occupations = Array.isArray(item.persecution_occupation_en) ? item.persecution_occupation_en : [item.persecution_occupation_en];
                    occupations.forEach(occupation => {
                        counts[occupation] = (counts[occupation] || 0) + 1;
                    });
                    return counts;
                }, {});

                const sortedOccupations = Object.entries(occupationCounts)
                    .sort(([, countA], [, countB]) => countB - countA);


                const topOccupations = sortedOccupations.slice(0, 2).map(([occupation]) => occupation);

                const filteredDataTopOccupations = filteredData.filter(item => {
                    const occupations = Array.isArray(item.persecution_occupation_en) ? item.persecution_occupation_en : [item.persecution_occupation_en];
                    return occupations.some(occupation => topOccupations.includes(occupation));
                });


                // Group the filtered data by occupation and date (month and year)
                const occupationCountsByDate = filteredDataTopOccupations.reduce((counts, item) => {
                    const startDate = new Date(item.persecution_started);
                    const year = startDate.getFullYear();
                    const month = startDate.getMonth() + 1; // Adding 1 because getMonth() returns 0-based index

                    // Ensure occupation_en is an array, if not convert to array with single value
                    const occupations = Array.isArray(item.persecution_occupation_en) ? item.persecution_occupation_en : [item.persecution_occupation_en];

                    // Iterate over each occupation and update counts
                    occupations.forEach(occupation => {
                        const key = `${year}-${month.toString().padStart(2, '0')}`; // Format: "YYYY-MM"
                        const existingEntry = counts.find(entry => entry.date === key && entry.occupation === occupation);
                        if (existingEntry) {
                            existingEntry.count++; // Increment count if entry exists
                        } else {
                            counts.push({ date: key, occupation, count: 1 }); // Create new entry if not exists
                        }
                    });

                    return counts;
                }, []);
                occupationCountsByDate.forEach(item => {
                    const [year, month] = item.date.split('-');
                    const dateString = `${year}-${month}-01`;
                    const dateObject = new Date(dateString);
                    item.date = dateObject;
                });
                occupationCountsByDate.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateA - dateB;
                });
                console.log(occupationCountsByDate);

                return occupationCountsByDate;

            } catch (error) {
                console.error("Error fetching data:", error);
            }

        },
    },
    mounted() {
        this.renderData()
            .then((occupationCountsByDate) => {
                const chart = Plot.plot({

                    marginLeft: 60,
                    x: {
                        interval: "month",
                        label: null,
                        tickFormat: (d) => d.toLocaleString("en", { year: "numeric" }),
                        

                    },
                    y: { grid: true },
                    color: { legend: true, columns: 2 },
                    marks: [
                        Plot.areaY(occupationCountsByDate, { x: "date", y: "count", fill: "occupation", offset: "center"})
                    ]
                })

                //     y: {
                //       label: "Number of Cases",
                //       grid: true,
                //       domain: [
                //         0,
                //         Math.max(...casesByMonth.map((dataPoint) => dataPoint.cases)) +
                //           20,
                //       ],
                //       clamp: true,
                //     },
                //     color: {
                //       domain: ["male", "female"],
                //       range: ["#3b1f2b", "#db162f"],
                //     },
                //     marks: [
                //       Plot.barY(casesByMonth, {
                //         x: "date",
                //         y: "cases",
                //         title: "Cases by Month",
                //         fill: "sex",
                //       }),

                //       Plot.tip(casesByMonth, Plot.pointerX({x: "date", y: "cases"}))
                //     ],
                //     marginBottom: 80,

                return chart;
            })
            .then((chart) => {
                document.getElementById("chartInd").appendChild(chart);
                // d3.select(this.$refs.chart).node().append(chart);
            });
    },
};
</script>