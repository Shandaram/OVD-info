<template>
  <div>
    <TitleBox title="Stories" imgLink="temp.png" scope="2002-2024" filter="incarcerated, named, age specified, city specified, persecution start date specified, has a story that was told"
      description="to be filled" />
<DataStories/>
  </div>
</template>

<script>
import TitleBox from "../components/TitleBox.vue"
import DataStories from "../components/DataStories.vue"


export default {
  components: {
    TitleBox,
    DataStories
  }


};
</script>