<template>
  <div class="title-cont">
    <img :src="resolve_img_url(imgLink)" alt="" />
    <div class="t-text-cont">
      <h1>{{ title }}</h1>
      <div class="stats">
        <div class="stats-line one">
          <p>Scope: <span>&nbsp; {{ scope }}</span> </p>
          <p>Filter: <span>&nbsp; {{ filter }}</span> </p>
        </div>
        <div class="stats-line two">
          <p>API: <span>&nbsp; {{ api }} </span> </p>
          <p>Params: <span>&nbsp; {{ apiParams }}</span> </p>
        </div>
      </div>
      <p v-html="description"></p>
      <span style="color: var(--red)"> <i>Please note that the data may contain inaccuracies!</i></span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "Title",
    },
    description: {
      type: String,
      default: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },

    imgLink: {
      type: String,
      default: "map1.png",
    },
    scope: {
      type: String,
      default: "2002-2024",
    },
    filter: {
      type: String,
      default: "none",
    },
    api: {
      type: String,
      default: "https://api.repression.info/v1/data",
    },
    apiParams: {
      type: String,
      default: "en, full",
    }
  },
  methods: {
    resolve_img_url: function (path) {
      let images = require.context('@/assets/', false);
      return images('./' + path);
    }

  }
};
</script>

<style scoped>



.title-cont {
  display: grid;
  text-align: left;
  grid-template-columns: 1.5fr 2fr;
  justify-items: center;
  align-items: center;
  grid-gap: 5vw;
  padding: 0 2vw 8vw 2vw;
}

img {
  width: 100%;
}

.stats {
  display: grid;
  grid-template-rows: 1fr 1fr;
  background-color: var(--grey);
  border-top: 1px var(--grey) solid;
  border-bottom: 1px var(--grey) solid;
  align-items: center;
  gap: 1px;
}

.stats p {
  font-size: 16px;
  color: var(--grey);
  background-color: var(--background);
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  font-weight: bold;
}

.stats p:nth-child(2) {
  padding-left: 1vw;

}

.stats span {
  font-weight: normal
}

.stats-line {
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  gap: 1px;
  height: 100%;
}

.stats-line.two {
  grid-template-columns: 2fr 1fr;

}

@media only screen and (max-width: 600px) {
  .title-cont {
    grid-template-columns: 1fr;
    justify-items: center;
    align-items: center;
    grid-gap: 5vw;
    padding: 2vw;
  }

  .stats-line {
    grid-template-columns: 1fr;
  }

  .stats-line.two {
    grid-template-columns: 1fr;
  }
  .stats p:nth-child(2) {
  padding-left: 0;

}

}
</style>
