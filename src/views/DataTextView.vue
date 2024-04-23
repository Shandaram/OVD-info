<template>
  <div>
    <TitleBox title="Articles and prosecution" imgLink="article4.png" api="https://api.repression.info/v1/articles"
      filter="10 or more people prosecuted" />
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