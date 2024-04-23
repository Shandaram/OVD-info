<template>
  <div>
    <TitleBox title="Prison Sentences Over Time" imgLink="bar4.png" scope="2010-2024" filter="specified imprisonment term"
      description="This graph shows how the duration of prison sentences and the amount of people convicted change over time. Each dot represents a person, with their first verdict date determining their position on the graph. The hexagons group these dots based on both sentence length and the passage of time. The colour intensity within each bin indicates the density of data points, with darker shades suggesting higher concentrations.
<br><br>
You'll also notice two lines marking the start of Russian aggression in Ukraine. Hover over the hexagons to see who was convicted on a given date and their sentences. This visual helps us understand how prison terms have evolved over the last 14 years.
" />
    <DataPlot />
  </div>
</template>

<script>
import TitleBox from "../components/TitleBox.vue"
import DataPlot from '../components/DataPlot.vue';


export default {
  components: {
    TitleBox,
    DataPlot
  }


};
</script>