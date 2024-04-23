<template>
  <div>
    <TitleBox title="Correctional Cartography" filter="were imprisoned, prison listed" />
    <DataMap />
  </div>
</template>

<script>
import DataMap from "../components/DataMap.vue"
import TitleBox from "../components/TitleBox.vue"

export default {
  name: "AboutView",
  components: {
    DataMap,
    TitleBox
  }
};
</script>
