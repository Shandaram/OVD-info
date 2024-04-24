<template>
  <div>
    <TitleBox title="Stories" imgLink="story.png" scope="2002-2024" filter="currently incarcerated, named, age specified, city specified, persecution start date specified, has a story that was told"
      description="This page allows you to see the people behind the data points, and read their stories. Filters are available if you wish to narrow down your search to a specific group of individuals or to locate a particular person by name. Only individuals currently imprisoned are included in this list, as they are in critical need of attention. We encourage you to consider <a target='_blank' class='intext-link' href='https://en.ovdinfo.org/write-letters'>writing letters</a> to them or supporting organizations like <a target='_blank' class='intext-link' href='https://donate.ovd.legal/en#page=en'>OVDinfo</a>, which assists political prisoners. They are the reason why these stories could be told. "
      instruction="Below, you can specify the age range (when prosecution started), and the timeframe, enter a city of persecution or select it from the dropdown menu, and choose a penal facility. Additionally, a dropdown allows you to group results by gender. It's essential to note that all the filters operate with an AND logic, meaning only entries matching all specified values will be displayed."/>
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