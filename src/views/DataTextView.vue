<template>
  <div>
    <TitleBox title="Political Articles and Frequency" imgLink="article4.png" api="https://api.repression.info/v1/articles"
      filter="10 or more people prosecuted"
      description="This visualization highlights the most common articles resulting in convictions of political prisoners. Each line represents the frequency of convictions associated with a particular article. To enhance clarity, I've grouped the articles into five sections, If you have suggestions for better grouping systems, please let me know at <b>anokhink@tcd.ie</b>.
<br><br>
I've shortened some article names to fit them into the radial graph, but hovering over them reveals the full and accurate information. Additionally, for readability, I've merged the count of convicted people of unnamed sections of articles with other named sections in the same group. Keep in mind that this visualization is designed for general understanding rather than legal precision.
" />
    <DataArticles />
  </div>
</template>

<script>
import DataArticles from "../components/DataArticles.vue"
import TitleBox from "../components/TitleBox.vue"

export default {
  name: "AboutView",
  components: {
    DataArticles,
    TitleBox
  }
};
</script>
<style scoped>

@media only screen and (max-width: 600px) {
  .chart-cont {
    margin-top: 10vh;
  }

}
</style>