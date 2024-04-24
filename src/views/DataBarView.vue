<template>
  <div>
    <TitleBox title="Prison Sentences Over Time" imgLink="bar4.png" scope="2010-2024" filter="specified imprisonment term"
      description="This graph shows how the duration of prison sentences and the amount of people convicted change over time.
      Each hexagon represents a grouping of individuals, positioned along the X-axis based on their first verdict date and along the Y-axis based on their sentence length. The intensity of color indicates the density of data points, with darker shades indicating larger group sizes. This visual helps us understand how prison terms have evolved over the last 14 years."
      instruction="The lines mark the start of Russian aggression in Ukraine. Hover over the hexagons to see who was convicted on a given date and their sentences." />
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