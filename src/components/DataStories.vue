<template>
    <div v-if="this.filteredData">
        <!-- select citizenship -->
        <!-- checkbox health -->
        <!-- checkbox torture -->

        <!-- Slider to determine age range filter -->
        <div class="slider-container first">
            <div class="sliderange">
                <input type="range" class="sliderMap" v-model="smallAge" min="10" max="100" step="10"
                    @input="updateValue('small', $event, smallAge, bigAge)" />
                <input type="range" class="sliderMap" v-model="bigAge" min="10" max="100" step="10"
                    @input="updateValue('big', $event, smallAge, bigAge)" />

                <div id="ticks-container-range">
                    <!-- Space for generated ticks -->
                </div>
            </div>

        </div>

        <!-- Slider to determine timeframe filter -->
        <div class="slider-container">
            <div class="sliderange">
                <input type="range" class="sliderMap" v-model="startYear" :min="minYear" :max="maxYear"
                    @input="updateValue('small', $event, startYear, endYear)" />
                <input type="range" class="sliderMap" v-model="endYear" :min="minYear" :max="maxYear"
                    @input="updateValue('big', $event, startYear, endYear)" />
                <div id="ticks-container-time">
                    <!-- Space for generated ticks -->
                </div>
            </div>

        </div>
        <div class="controls-cont">
            <div v-if="this.filteredData" class="text-cont">
                <p><span>Age when prosecution started: </span>&nbsp;{{ smallAge }} - {{ bigAge }} years</p>
                <p><span>Year: </span>&nbsp;{{ startYear }} - {{ endYear }}</p>
                <p><span>People: </span>&nbsp;{{ this.filteredData.length }}
                    ({{ (this.filteredData.length * 100 / this.lengthArray).toFixed(0) }} %)</p>
            </div>



            <div class="dropdown-container">
                <!-- Input for name -->
                <label for="nameInput">Name:</label>
                <input type="text" id="nameInput" v-model="nameInput" placeholder="Enter name or surname">
                <button @click="clearInput('nameInput')">Clear</button>
                <!-- Dropdown with gender -->
                <label for="genderInput">Gender:</label>
                <select id="genderInput" v-model="genderInput">
                    <option disabled selected value="">Choose gender</option>
                    <option value="all">Show all</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                </select>
                <button @click="clearInput('genderInput')">Clear</button>
            </div>
            <div class="dropdown-container second">
                <!-- Dropdown with cities -->
                <label for="cityInput">City of origin:</label>
                <input type="text" id="cityInput" v-model="cityOptions" placeholder="Enter city name">
                <select id="cityOptions" v-model="cityOptions">
                    <option disabled selected value="">Choose city name</option>
                    <option value="all">Show all</option>
                    <option v-for="cityName in sortedCityNames" :key="cityName" :value="cityName">{{ cityName
                        }}</option>
                </select>
                <button @click="clearInput('cityOptions')">Clear</button>
            </div>
            <!-- Dropdown with prisons -->
            <div class="dropdown-container lower">
                <label for="prisonOptions">Facility:</label>
                <select id="prisonOptions" v-model="prisonOptions">
                    <option disabled selected value="">Choose facility name</option>
                    <option value="allPrisons">Show all</option>
                    <option v-for="prisonName in sortedPrisonNames" :key="prisonName" :value="prisonName">{{ prisonName
                        }}</option>
                </select>
                <button @click="clearInput('prisonOptions')">Clear</button>
            </div>
        </div>

        <div class="stories-cont">
            <div class="case" v-for="(item, index) in this.filteredData" :key="index">
               
                    <div class="title-cont">

                        <p> {{ index + 1 }}</p>
                        <h2>{{ item.name_en }}</h2>
                        <div style="background: var(--grey); height: 2px; width: 100%; border-bottom: 2px var(--background) dashed;"></div>
                        <div v-if="item.case_name_en" class="tag"> {{ item.case_name_en }}</div>
                    </div>

                    <div class="info-box">
                        <div class="hor-cont-box">
                            <div class="hor-cont">
                                <p>Prosecution started:</p>
                                <p>{{ formatDate(item.persecution_started) }}</p>
                            </div>
                        </div>
                        <div class="hor-cont-box">
                            <div class="hor-cont">
                                <p>Age when prosecution started:</p>
                                <p>{{ item.age_persecution_began }}</p>
                            </div>
                            <div class="hor-cont">
                                <p>City:</p>
                                <p>{{ item.persecution_city_en[0] }}<span v-if="item.persecution_region_en">, {{
        item.persecution_region_en[0] }} </span></p>
                            </div>
                            <div v-if="item.persecution_occupation_en" class="hor-cont">
                                <p>Occupation: </p>
                                <p>{{ item.persecution_occupation_en[0] }}</p>
                            </div>
                        </div>
                        <!-- 

//             // persecution_health_issues
//             //torture
//             //citizenship

//             // persecution_article_and_part_en -->
                        <div class="hor-cont-box">
                            <div v-if="item.persecution_location_en" class="hor-cont">
                                <p>Location:</p>
                                <p>{{ item.persecution_location_en }}</p>
                            </div>
                            <div v-if="item.persecution_person_state_en" class="hor-cont">
                                <p>Status:</p>
                                <p>{{ item.persecution_person_state_en }}</p>
                            </div>
                        </div>
                        <div class="hor-cont-box">
                            <div v-if="item.persecution_article_and_part_en" class="hor-cont">
                                <p>Article:</p>
    <p>{{ item.persecution_article_and_part_en.join(' | ') }}</p>
                            </div>
                            <div v-if="item.verdict_imprisonment_term" class="hor-cont">
                                <p>Term:</p>
                                <p>{{ (item.verdict_imprisonment_term / 12).toFixed(1)}} years</p>
                            </div>

                        </div>
                        <div v-if="item.verdict_essence_en" class="hor-cont-box">
                            <div class="hor-cont">
                                <p>Verdict:</p>
                                <p>{{ item.verdict_essence_en }}</p>
                            </div>
                        </div>
                        <div v-if="item.penal_facility_en && item.penal_facility_en.length > 0" class="hor-cont-box">
                            <div class="hor-cont">
                                <p>Facility:</p>
                                <p>{{ item.penal_facility_en[0] }}</p>
                            </div>
                        </div>
                    </div>
                    <h3>Story</h3>
                    <p>{{ item.story_en }}</p>
      
            </div>
        </div>

    </div>
    <div v-else>
        <p>Loading the stories...</p>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import debounce from "lodash/debounce";

export default {
    data() {
        return {
            fullData: [],
            filteredData: [],
            lengthArray: 0,
            limit: 50,
            smallAge: 10,
            bigAge: 100,
            startYear: 2002,
            endYear: 2024,
            minYear: 2002,
            maxYear: 2024,
            nameInput: '',
            genderInput: '',
            cityOptions: '',
            prisonOptions: '',

        };
    },
    computed: {
        ...mapGetters(["responseData"]),

    },
    methods: {
        ...mapActions(["fetchDataFromAPI"]),
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }

            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(date);
        },
        updateValue(slider, event, smallVal, bigVal) {
            const newValue = parseInt(event.target.value, 10);
            if (slider === "small") {
                this[smallVal] = newValue;
                if (this[smallVal] > this[bigVal]) {
                    this[bigVal] = this[smallVal];
                }
            } else if (slider === "big") {
                this[bigVal] = newValue;
                if (this[bigVal] < this[smallVal]) {
                    this[smallVal] = this[bigVal];
                }
            }
        },
        // Generate tick on the distance range input
        generateTicks() {
            const containerRange = document.querySelector('#ticks-container-range');
            const containerTime = document.querySelector('#ticks-container-time');

            for (let i = 10; i <= 90; i += 10) {
                const tick = document.createElement('div');
                tick.classList.add('tick');
                tick.style.position = 'absolute';
                tick.style.left = `${(i / 90) * 100}%`;
                tick.style.width = '1px';
                tick.style.background = 'grey';
                tick.style.height = '100%';
                tick.style.backgroundColor = '#000';
                containerRange.appendChild(tick);

                const text = document.createElement('div');
                text.classList.add('tick-text');
                text.textContent = i + 10;
                text.style.fontSize = '10px';
                text.style.position = 'absolute';
                text.style.bottom = '-15px';
                text.style.left = '50%';
                text.style.transform = 'translateX(-50%)';
                tick.appendChild(text);
            }

            for (let i = 1; i <= 22; i++) {
                const tick = document.createElement('div');
                tick.classList.add('tick');
                tick.style.position = 'absolute';
                tick.style.left = `${(i / 22) * 100}%`;
                tick.style.width = '1px';
                tick.style.background = 'grey';
                tick.style.height = '100%';
                tick.style.backgroundColor = '#000';
                containerTime.appendChild(tick);

                const text = document.createElement('div');
                text.classList.add('tick-text');
                text.textContent = 2002 + i;
                text.style.fontSize = '10px';
                text.style.position = 'absolute';
                text.style.bottom = '-15px';
                text.style.left = '50%';
                text.style.transform = 'translateX(-50%)';
                tick.appendChild(text);
            }
        },

        // Clear input 
        clearInput(options) {
            this[options] = '';
        },
        async getData() {
            try {
                this.fullData = await this.fetchDataFromAPI();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        async renderData(
            smallAge,
            bigAge,
            cityOptions,
            prisonOptions,
            startYear,
            endYear,
            nameInput,
            genderInput
        ) {
            try {

                let filteredData = this.fullData.data.filter(item =>
                    item.story_en != null &&
                    item.age_persecution_began != null &&
                    item.persecution_city_en !== undefined &&
                    item.persecution_city_en.length > 0 &&
                    item.persecution_imprisoned !== undefined &&
                    item.persecution_imprisoned === true &&
                    item.persecution_started !== undefined
                );
                filteredData = [...new Set(filteredData.map(item => item.name_en))].map(name_en => filteredData.find(item => item.name_en === name_en));

                //Initial Scope
                let initialDataScope = 0;
                for (let i = 0; i < filteredData.length; i++) {
                    initialDataScope++
                }
                this.lengthArray = initialDataScope

                // Set prisons 
                const prisonList = new Set();
                for (let i = 0; i < filteredData.length; i++) {
                    if (filteredData[i].penal_facility_en && filteredData[i].penal_facility_en.length > 0) {
                        prisonList.add(filteredData[i].penal_facility_en[0]);
                    }
                }
                const uniquePrisons = [...prisonList];
                this.sortedPrisonNames = uniquePrisons.sort();

                // Set cities 
                const cityList = new Set();
                for (let i = 0; i < filteredData.length; i++) {
                    if (filteredData[i].persecution_city_en && filteredData[i].persecution_city_en.length > 0) {
                        cityList.add(filteredData[i].persecution_city_en[0]);
                    }
                }
                const uniqueCities = [...cityList];
                this.sortedCityNames = uniqueCities.sort();

                console.log(nameInput)
                console.log(cityOptions)
                console.log(prisonOptions)
                // Filter by name
                if (nameInput) {
                    filteredData = filteredData.filter(item =>
                        item.name_en.toLowerCase().includes(nameInput.toLowerCase())
                    );
                }

                // Filter by age range
                filteredData = filteredData.filter(item =>
                    item.age_persecution_began >= smallAge && item.age_persecution_began <= bigAge
                );

                // Filter by timeframe
                filteredData = filteredData.filter(item =>
                    new Date(item.persecution_started).getFullYear() >= startYear &&
                    new Date(item.persecution_started).getFullYear() <= endYear
                );

                // Filter by city of origin
                if (cityOptions) {
                    filteredData = filteredData.filter(item =>
                        item.persecution_city_en[0].toLowerCase().includes(cityOptions.toLowerCase())
                    );
                }

                // Filter by prison
                if (prisonOptions) {
                    filteredData = filteredData.filter(item =>
                        item.penal_facility_en && // Check if item.penal_facility_en is defined
                        item.penal_facility_en.length > 0 && // Check if item.penal_facility_en is not empty
                        item.penal_facility_en[0].toLowerCase().includes(prisonOptions.toLowerCase())
                    );
                }

                // Filter by gender
                if (genderInput) {
                    filteredData = filteredData.filter(item =>
                        item.gender_en &&
                        (genderInput === "" || genderInput === "all" || item.gender_en.toLowerCase() === genderInput.toLowerCase())

                    );
                }


                    // Sort the filtered data by persecution started date
                    filteredData.sort((a, b) => {
                        const dateA = new Date(a.persecution_started);
                        const dateB = new Date(b.persecution_started);
                        return dateA - dateB;
                    });
                this.filteredData = filteredData;
                return this.filteredData;
            } catch (error) {
                console.error("Error rendering data:", error);
            }
        },

        updateData(
            smallAge,
            bigAge,
            cityOptions,
            prisonOptions,
            startYear,
            endYear,
            nameInput,
            genderInput
        ) {
            this.renderData(
                smallAge,
                bigAge,
                cityOptions,
                prisonOptions,
                startYear,
                endYear,
                nameInput,
                genderInput
            )
                .then(filteredData => {
                    this.filteredData = filteredData;
                })
                .catch(error => {
                    console.error("Error updating data:", error);
                });
        },



    },
    mounted() {
        this.getData()
            .then(() => {
                return this.renderData(
                    this.smallAge,
                    this.bigAge,
                    this.cityOptions,
                    this.prisonOptions,
                    this.startYear,
                    this.endYear,
                    this.nameInput,
                    this.genderInput
                );
            })
            .then(() => {
                this.generateTicks();
                this.updateData(this.smallAge,
                    this.bigAge,
                    this.cityOptions,
                    this.prisonOptions,
                    this.startYear,
                    this.endYear,
                    this.nameInput,
                    this.genderInput);

            })
            .catch((error) => {
                console.error("Error rendering data:", error);
            });
    },
    watch: {
        smallAge: debounce(function (newValue) {
            this.updateData(newValue, this.bigAge, this.cityOptions, this.prisonOptions, this.startYear, this.endYear, this.nameInput, this.genderInput);
        }, 10),
        bigAge: debounce(function (newValue) {
            this.updateData(this.smallAge, newValue, this.cityOptions, this.prisonOptions, this.startYear, this.endYear, this.nameInput, this.genderInput);
        }, 10),
        cityOptions: debounce(function (newValue) {
            this.updateData(this.smallAge, this.bigAge, newValue, this.prisonOptions, this.startYear, this.endYear, this.nameInput, this.genderInput);
        }, 10),
        prisonOptions: debounce(function (newValue) {
            this.updateData(this.smallAge, this.bigAge, this.cityOptions, newValue, this.startYear, this.endYear, this.nameInput, this.genderInput);
        }, 10),
        startYear: debounce(function (newValue) {
            this.updateData(this.smallAge, this.bigAge, this.cityOptions, this.prisonOptions, newValue, this.endYear, this.nameInput, this.genderInput);
        }, 10),
        endYear: debounce(function (newValue) {
            this.updateData(this.smallAge, this.bigAge, this.cityOptions, this.prisonOptions, this.startYear, newValue, this.nameInput, this.genderInput);
        }, 10),
        nameInput: debounce(function (newValue) {
            this.updateData(this.smallAge, this.bigAge, this.cityOptions, this.prisonOptions, this.startYear, this.endYear, newValue, this.genderInput);
        }, 10),
        genderInput: debounce(function (newValue) {
            this.updateData(this.smallAge, this.bigAge, this.cityOptions, this.prisonOptions, this.startYear, this.endYear, this.nameInput, newValue);
        }, 10),
    },



};
</script>


<style scoped>
.hor-cont-box {
    display: flex;
    border-bottom: 1px solid var(--grey);
}
.hor-cont-box  *{
   padding: 5px;
}

.hor-cont {
    display: flex;
    width: 100%;
    border-right: 1px solid var(--grey);
}

.hor-cont> :nth-child(1) {
    font-weight: bold;

}

.info-box {
    border-top: 1px solid var(--grey);
    border-left: 1px solid var(--grey);
    background-color: white;

}
.case {
    width: 75%;
}

.stories-cont {
    text-align: left;
    width: 100%;
    display: grid;
    justify-items: center;
    align-items: center;
    gap: 10vh;
margin-top: 10vh;
}

.title-cont {
    display: grid;
    grid-template-columns: auto auto 1fr  auto;
    align-items: center;
    grid-gap: 1vw;
}

.controls-cont {
    display: grid;
    margin-top: 5vh;
    width: 100%;
    align-items: center;
    justify-items: center;
    border: 1px var(--dark-blue) solid;
    grid-template-rows: 1fr 1fr 1fr;
}

/* select */

.dropdown-container {
    background-color: var(--dark-blue);
    display: grid;
    text-align: left;
    grid-template-columns: 0.5fr 1fr 0.5fr 0.5fr 1fr 0.5fr;
    width: 100%;
    height: 100%;
    border-bottom: 1px var(--dark-blue) solid;
    column-gap: 1px;
    align-items: center;
}

.dropdown-container.second {
    grid-template-columns: 0.5fr 1.5fr 1.5fr 0.5fr;
}

.dropdown-container.lower {
    grid-template-columns: 0.5fr 3fr 0.5fr;
    border: none;
}

.dropdown-container * {
    height: 100%;
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
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: var(--light-grey);
    border: none;
    font-size: 16px;
    border-radius: 0;

}

.text-cont {
    position: relative;
    background-color: var(--dark-blue);
    width: 100%;
    display: grid;
    text-align: left;
    grid-template-columns: 2fr 1fr 1fr;
    border-bottom: 1px var(--dark-blue) solid;
    gap: 1px;
    align-items: center;
}

.text-cont p {
    height: 100%;
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



#chart {
    margin: 0 0 10vh 0;
}

.chart path {
    color: rgb(202, 202, 202);
}


#cityOptions,
#prisonOptions, 
#genderInput {
    width: 100%;
    height: 100%;
    font-size: 16px;
    cursor: pointer;
    margin: 0;
    border: none;
    outline: none;
    background-color: white;
    border-radius: 0;
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
    height: 100%;
    width: 100%;

}

.checkbox-container input[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    height: calc(100%);
    width: 50px;
    padding-right: 0;
    border-radius: 0;
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


#ticks-container-range {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 20px;
}

#ticks-container-time {
    position: absolute;

    left: 0;
    right: 0;
    height: 20px;
}

.slider-container {
    display: flex;
    flex-direction: column;
    gap: 5vh;
    width: 100%;
    position: relative;

}

.slider-container.first {
    margin-bottom: 5vh;
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


@media only screen and (max-width: 900px) {
    .content-cont {
        margin-top: 5vh;
    }

    .text-cont {
        grid-template-columns: 1fr;
    }

    .dropdown-container {
        grid-template-columns: 1fr;
    }

    .dropdown-container.lower {
        grid-template-columns: 1fr;
    }

    .dropdown-container button {
        padding: 2vh 0;
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

    .hor-cont-box {
        flex-wrap: wrap;
    }

    .hor-cont {

        border-bottom: 1px solid var(--grey);
    }

}
</style>
