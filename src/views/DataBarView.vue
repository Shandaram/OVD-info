<template>
  <div>
    <TitleBox title="Arrests and imprisonment" imgLink="bar4.png" scope="2010-2024" filter="specified imprisonment term" />
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