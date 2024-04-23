<template>
    <div class="content-cont" v-if="responseData">
        <div class="chart-cont">
            <!-- Slider to determine distance range filter -->
            <div class="slider-container">
                <div class="sliderange">
                    <input type="range" class="sliderMap" v-model="smallValue" :max="maxValue"
                        @input="updateValue('small', $event)" />
                    <input type="range" class="sliderMap" v-model="bigValue" :max="maxValue"
                        @input="updateValue('big', $event)" />
                    <div class="ticks-container">
                        <!-- Space for generated ticks -->
                    </div>
                </div>
                <div class="text-cont">
                    <p><span>Distance: </span>&nbsp;{{ smallValue }} km - {{ bigValue }} km</p>
                    <p><span>People: </span>&nbsp;{{ this.longDistancePrisons.length }}
                        ({{ (this.longDistancePrisons.length * 100 / this.lengthArray).toFixed(0) }} %)</p>
                </div>
            </div>
            <!-- Dropdown with cities -->
            <div class="dropdown-container">
                <label for="cityInput">City of origin:</label>
                <input type="text" id="cityInput" v-model="cityOptions" placeholder="Enter city name">
                <select id="cityOptions" v-model="cityOptions">
                    <option disabled selected value="">Choose city name</option>
                    <option value="all">Show all</option>
                    <!-- Populate select options dynamically -->
                </select>
                <button @click="clearInput('cityOptions')">Clear</button>
                <!-- Checkbox to filter out only those currently incarcerated -->
                <div class="checkbox-container">
                    <label for="inPrisonCheck">Currently incarcerated</label>
                    <input type="checkbox" id="inPrisonCheck" v-model="inPrisonCheck">
                </div>
            </div>
            <!-- Dropdown with prisons -->
            <div class="dropdown-container lower">
                <label for="prisonOptions">Prison:</label>
                <select id="prisonOptions" v-model="prisonOptions">
                    <option disabled selected value="">Choose prison name</option>
                    <option value="allPrisons">Show all</option>
                </select>
                <button @click="clearInput('prisonOptions')">Clear</button>
            </div>
            <!-- The map -->
            <div ref="chartMap" class="chart"></div>
            <div id="chartMap" class="chart"></div>
        </div>
    </div>
    <div v-else class="placeholder">
        <p>Loading the map...</p>
        <img src="../assets/placeholderMap.png" alt="empty map of Russia">
    </div>
</template>

<script>
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { mapActions, mapGetters } from "vuex";
import * as topojson from "topojson-client";
import russia from "../assets/russia.json";
import cities from "../assets/city_locations.json";
import facilities from "../assets/facilities_locations.json";
import { svg } from "htl";
import debounce from "lodash/debounce";

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

export default {
    data() {
        return {
            chart: null,
            smallValue: 0,
            bigValue: 7050,
            maxValue: 7050,
            longDistancePrisons: [],
            prisonsWithCoordinates: [],
            lengthArray: 0,
            cityOptions: '',
            prisonOptions: '',
            inPrisonCheck: false,
        };
    },
    computed: {
        ...mapGetters(["responseData"]),
    },
    methods: {
        ...mapActions(["fetchDataFromAPI"]),
        // Controling the values of min and max
        updateValue(slider, event) {
            const newValue = parseInt(event.target.value, 10);
            if (slider === "small") {
                this.smallValue = newValue;
                if (this.smallValue > this.bigValue) {
                    this.bigValue = this.smallValue;
                }
            } else if (slider === "big") {
                this.bigValue = newValue;
                if (this.bigValue < this.smallValue) {
                    this.smallValue = this.bigValue;
                }
            }
        },
        // Generate tick on the distance range input
        generateTicks() {
            const container = document.querySelector('.ticks-container');
            const totalDistance = 7000;
            const tickInterval = 500;

            for (let i = 500; i <= totalDistance; i += tickInterval) {
                const tick = document.createElement('div');
                tick.classList.add('tick');
                tick.style.position = 'absolute';
                tick.style.left = `${(i / totalDistance) * 100}%`;
                tick.style.width = '1px';
                tick.style.background = 'grey';
                tick.style.height = '100%';
                tick.style.backgroundColor = '#000';
                container.appendChild(tick);

                const text = document.createElement('div');
                text.classList.add('tick-text');
                text.textContent = i;
                text.style.fontSize = '10px';
                text.style.position = 'absolute';
                text.style.bottom = '-15px';
                text.style.left = '50%';
                text.style.transform = 'translateX(-50%)';
                tick.appendChild(text);
                container.appendChild(tick);
            }
        },
        // Clear input 
        clearInput(options) {
            this[options] = '';
        },
        // Load data
        async getData() {
            try {
                this.responseData = await this.fetchDataFromAPI();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        // Format the data and update it based on user input
        async renderData(smallvalue, bigValue, cityOptions, inPrisonCheck, prisonOptions) {
            try {
                const responseData = this.responseData
                // Count all people after first filter 
                const initialDataScope = [];
                for (let i = 0; i < responseData.data.length; i++) {
                    if (
                        responseData.data[i].penal_facility_en &&
                        responseData.data[i].penal_facility_en.length > 0 &&
                        responseData.data[i].persecution_city_en &&
                        responseData.data[i].persecution_city_en.length > 0
                    ) {
                        initialDataScope.push(responseData.data[i])
                    }
                }
                this.lengthArray = initialDataScope.length

                // City options
                const cityNames = cities.map(city => city.name);
                const sortedCityNames = cityNames.slice().sort();
                const selectElement = document.getElementById("cityOptions");


                sortedCityNames.forEach(cityName => {
                    const option = document.createElement("option");
                    option.text = cityName;
                    option.value = cityName;
                    selectElement.appendChild(option);
                });


                // Prison options
                const prisonNames = []
                for (let i = 0; i < facilities.length; i++) {
                    prisonNames.push(facilities[i].name);
                }

                const sortedPrisonNames = prisonNames.map(name => name).sort();
                const selectElementP = document.getElementById("prisonOptions");
                sortedPrisonNames.forEach(prisonName => {
                    const option = document.createElement("option");
                    option.text = prisonName;
                    option.value = prisonName;
                    selectElementP.add(option);
                });
                const prisonsWithCoordinates = [];
                for (let i = 0; i < responseData.data.length; i++) {
                    if (
                        responseData.data[i].penal_facility_en &&
                        responseData.data[i].penal_facility_en.length > 0 &&
                        responseData.data[i].persecution_city_en &&
                        responseData.data[i].persecution_city_en.length > 0 &&
                        (cityOptions === "" || cityOptions === "all" || responseData.data[i].persecution_city_en[0].toLowerCase() === cityOptions.toLowerCase()) &&
                        (inPrisonCheck === false || responseData.data[i].persecution_imprisoned === true) &&
                        (prisonOptions === "" || prisonOptions === "allPrisons" || responseData.data[i].penal_facility_en[0].includes(prisonOptions))
                    ) {
                        const cityName = responseData.data[i].persecution_city_en[0];
                        const facilityName = responseData.data[i].penal_facility_en[0];

                        let latitude, longitude, facLatitude, facLongitude;

                        for (let j = 0; j < cities.length; j++) {
                            if (cityName == cities[j].name) {
                                latitude = cities[j].latitude;
                                longitude = cities[j].longitude;
                            }
                        }

                        for (let j = 0; j < facilities.length; j++) {
                            if (facilityName == facilities[j].name) {
                                facLatitude = facilities[j].latitude;
                                facLongitude = facilities[j].longitude;

                            }
                        }

                        const distance = getDistanceFromLatLonInKm(
                            latitude,
                            longitude,
                            facLatitude,
                            facLongitude
                        );

                        prisonsWithCoordinates.push({
                            id: responseData.data[i].person_id,
                            name: responseData.data[i].name_en,
                            region: responseData.data[i].persecution_region_iso,
                            inPrison: responseData.data[i].persecution_imprisoned,
                            startYear: responseData.data[i].persecution_started_year,
                            term: responseData.data[i].persecution_ended_year - responseData.data[i].persecution_started_year,
                            city: cityName,
                            sentence: responseData.data[i].verdict_imprisonment_term / 12,
                            latitude: latitude,
                            longitude: longitude,
                            distance: distance,
                            facility: facilityName,
                            facLatitude: facLatitude,
                            facLongitude: facLongitude,
                        });
                    }
                }

                const longDistancePrisons = prisonsWithCoordinates.filter((d) => {
                    return d.distance >= smallvalue && d.distance <= bigValue;
                });
                this.longDistancePrisons = longDistancePrisons
                return longDistancePrisons;
            } catch (error) {
                console.error("Error fetching prison data:", error);
            }
        },
        // Update and create the chat 
        updateChart(longDistancePrisons) {
            const width = 1200;
            const height = 600;

            const chart = Plot.plot({
                width: width,
                height: height,
                tooltip: {
                    frameAnchor: "bottom-left"
                },
                projection: ({ width, height }) =>
                    d3
                        .geoAlbers()
                        .rotate([-105, 0])
                        .center([-10, 65])
                        .parallels([52, 64])
                        .scale(800)
                        .translate([width / 2, height / 2]),

                marks: [
                    () => svg`<defs>
      <linearGradient id="gradient" gradientTransform="rotate(90)">
        <stop offset="0%" stop-color="#8890d0" />
        <stop offset="85%" stop-color="red" />
      </linearGradient>
    </defs>`,
                    () => svg`<defs>
      <linearGradient id="gradient2" gradientTransform="rotate(90)">
        <stop offset="0%" stop-color="red" />
        <stop offset="85%" stop-color="#8890d0" />
      </linearGradient>
    </defs>`,
                    Plot.geo(topojson.feature(russia, russia.objects.subunits), {
                        stroke: "#A59E9E",
                        fill: "#152036",
                        strokeWidth: 0.5,
                    }),
                    Plot.dot(longDistancePrisons, {
                        x: "longitude",
                        y: "latitude",
                        fill: "black",
                        r: 2,
                    }),
                    Plot.dot(longDistancePrisons, {
                        x: "facLongitude",
                        y: "facLatitude",
                        fill: "red",
                        r: 2,
                    }),
                    Plot.arrow(longDistancePrisons, {
                        x1: "longitude",
                        y1: "latitude",
                        x2: "facLongitude",
                        y2: "facLatitude",
                        inPrison: "inPrison",
                        bend: true,
                        headLength: 12,
                        strokeWidth: 1.2,
                        stroke: (d) => {
                            if (d.facLongitude - d.longitude > 0) {
                                return "url(#gradient)";
                            } else {
                                return "url(#gradient2)";
                            }
                        },
                        channels: {
                            name: "name",
                            inPrison: "inPrison"
                        },
                        tip: {
                            format: {
                                name: true,
                                inPrison: true,
                                stroke: false,
                            },
                            dy: -100,
                        },
                        title: (d) => {
                            let titleText = "";
                            if (d.inPrison) {
                                if (d.startYear !== undefined && d.sentence !== undefined) {
                                    titleText = `${d.name} from ${d.city} was arrested in ${d.startYear} and is now serving ${d.sentence.toFixed(0)} years in ${d.facility} ${d.distance.toFixed(0)} km away from home.`;
                                } else if (d.sentence !== undefined) {
                                    titleText = `${d.name} from ${d.city} is now in ${d.facility} ${d.distance.toFixed(0)} km away from home.`;

                                } else if (d.startYear !== undefined) {
                                    titleText = `${d.name} from ${d.city} was arrested in ${d.startYear} and is now serving ${d.sentence.toFixed(0)} years in ${d.facility} ${d.distance.toFixed(0)} km away from home.`;

                                } else {
                                    titleText = `${d.name} from ${d.city} is now in ${d.facility} ${d.distance.toFixed(0)} km away from home.`;
                                }
                            } else {
                                if (d.startYear !== undefined) {
                                    titleText = `${d.name} from ${d.city} was arrested in ${d.startYear}, and served ${d.term} years in ${d.facility} ${d.distance.toFixed(0)} km away from home.`;
                                } else {
                                    titleText = `${d.name} from ${d.city} was sent to ${d.facility} ${d.distance.toFixed(0)} km away from home.`;
                                }
                            }
                            return titleText;
                        }
                    }),
                    Plot.arrow(longDistancePrisons, Plot.pointer({
                        x1: "longitude",
                        y1: "latitude",
                        x2: "facLongitude",
                        y2: "facLatitude",
                        bend: true,
                        headLength: 12,
                        stroke: "#ffc446",
                    })),

                ],
            });

            return chart;
        },
        updateDist(smallValue, bigValue, cityOptions, inPrisonCheck, prisonOptions) {
            this.renderData(smallValue, bigValue, cityOptions, inPrisonCheck, prisonOptions)
                .then((longDistancePrisons) => {
                    const chart = this.updateChart(longDistancePrisons);
                    this.longDistancePrisons = longDistancePrisons
                    document.getElementById("chartMap").innerHTML = "";
                    document.getElementById("chartMap").appendChild(chart);
                })
                .catch((error) => {
                    console.error("Error rendering data:", error);
                });
        },

    },
    mounted() {
        this.getData()
            .then(() => {
                return this.renderData(this.smallValue, this.bigValue, this.cityOptions, this.inPrisonCheck, this.prisonOptions);
            })
            .then((longDistancePrisons) => {
                this.generateTicks();
                const chart = this.updateChart(longDistancePrisons);
                this.chart = chart;
                document.getElementById("chartMap").appendChild(chart);
            })
            .catch((error) => {
                console.error("Error rendering data:", error);
            });
    },
    watch: {
        smallValue: debounce(function (newValue) {
            this.updateDist(newValue, this.bigValue, this.cityOptions, this.inPrisonCheck, this.prisonOptions);
        }, 1),
        bigValue: debounce(function (newValue) {
            this.updateDist(this.smallValue, newValue, this.cityOptions, this.inPrisonCheck, this.prisonOptions);
        }, 10),
        cityOptions: debounce(function (newValue) {
            this.updateDist(this.smallValue, this.bigValue, newValue, this.inPrisonCheck, this.prisonOptions);
        }, 10),
        inPrisonCheck: debounce(function (newValue) {
            this.updateDist(this.smallValue, this.bigValue, this.cityOptions, newValue, this.prisonOptions);
        }, 10),
        prisonOptions: debounce(function (newValue) {
            this.updateDist(this.smallValue, this.bigValue, this.cityOptions, this.inPrisonCheck, newValue);
        }, 10),
    },
};
</script>

<style scoped>
/* select */
.dropdown-container {
    background-color: var(--dark-blue);
    display: grid;
    text-align: left;
    grid-template-columns: 0.5fr 1fr 1fr 0.5fr 1fr;
    width: 100%;
    border: 1px var(--dark-blue) solid;
    border-bottom: 2px var(--dark-blue) solid;
    gap: 1px;
    align-items: center;
}

.dropdown-container * {
    height: calc(100% - 14px);
    background-color: var(--background);
    padding: 8px 5px;
    display: flex;
    align-items: center;
}

.dropdown-container button {
    padding: 0;
    font: inherit;
    cursor: pointer;
    background-color: var(--dark-blue);
    color: var(--background);
    margin: 0;
    width: 100%;
    height: 100%;
    border: none;
    justify-content: center;
    align-self: center;
    text-align: center;
}

.dropdown-container button:hover {
    background-color: var(--red);
}

input[type=text] {
    background-color: var(--light-grey);
    border: none;
    font-size: 16px;
}

.text-cont {
    position: relative;
    background-color: black;
    width: 100%;
    display: grid;
    text-align: left;
    grid-template-columns: 2fr 1fr;
    border: 1px black solid;
    gap: 1px;
    align-items: center;
    left: -1px;
}

.text-cont p {
    height: calc(100% - 10px);
    background-color: var(--background);
    padding: 5px;
    display: flex;
    align-items: center;
}

.text-cont p span {
    font-weight: bold;
}

label {
    font-weight: bold;
}

.content-cont {
    display: grid;
    width: 100%;
}

.dropdown-container.lower {
    grid-template-columns: 0.5fr 3fr 0.5fr;
    border-top: 1px transparent solid;
}

#chart {
    margin: 0 0 10vh 0;
}

.chart path {
    color: rgb(202, 202, 202);
}

.ticks-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 20px;
}

#cityOptions,
#prisonOptions {
    width: 100%;
    height: 103%;
    font-size: 16px;
    cursor: pointer;
    margin: 0;
    border: none;
    outline: none;
    background-color: white;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
}

#cityOptions:hover,
#prisonOptions:hover {
    background-color: var(--light-grey);
}

/* checkbox */
.checkbox-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: calc(100% - 14px);
    width: calc(100% - 1px);
}

.checkbox-container input[type="checkbox"] {
    height: calc(100% + 18px);
    width: 60px;
    -webkit-appearance: none;
    appearance: none;
    border: 1px solid var(--color);
    background-color: white;
    cursor: pointer;
    position: relative;
}

.checkbox-container input[type="checkbox"]:checked {
    background-color: white;
}

/* Cross when checked */
.checkbox-container input[type="checkbox"]:checked::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 2px;
    background-color: var(--dark-blue);
    transform: translate(-50%, -50%) rotate(45deg);
}

.checkbox-container input[type="checkbox"]:checked::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 2px;
    background-color: var(--dark-blue);
    transform: translate(-50%, -50%) rotate(-45deg);
}


/* slider */
.slider-container {
    display: flex;
    flex-direction: column;
    gap: 5vh;
    width: 100%;
}

.sliderange {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 3vh;
    margin-bottom: 5vh;
}

input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    pointer-events: all;
    width: 12px;
    height: 40px;
    z-index: 5;
    background-color: var(--dark-blue);
    border-radius: 5%;
    cursor: pointer;
}

input[type=range]::-webkit-slider-thumb:hover {
    background: var(--red);
}

input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 1px;
    width: 100%;
    position: absolute;
    background-color: #959595;
    pointer-events: none;
}
</style>
