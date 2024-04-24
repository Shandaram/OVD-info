<template>
  <div>
    <TitleBox
      title="Correctional Cartography"
      filter="were imprisoned, prison listed"
      description="This map visualizes the movement of individuals resulting from incarceration. Utilizing decimal degrees and a TopoJSON file, it maps cities where prosecutions occurred and prisons where individuals were sent. The red indicates directionality, with brighter shades indicating proximity to the penal facility. The data is dynamically updated via the <a target='_blank' class='intext-link' href='https://observablehq.com/d/3dfc2fcf987505cb'>OVDinfo API</a>. However, currently, the coordinates of prisons are approximations hosted on a private server. Consequently, if new individuals are added to the API but their penal facility or city is not included, they will not be plotted. I am looking for a solution to automate coordinate generation."
      instruction="Below, you can specify the distance range, timeframe of persecution, enter a city of persecution or select it from the dropdown menu, and choose a penal facility. Additionally, a checkbox allows you to filter out cases of individuals who have completed their sentences. 
      It's essential to note that all the filters operate with an AND logic, meaning only entries matching all specified values will be displayed. "
    />

    <DataMap />
  </div>
</template>

<script>
import DataMap from "../components/DataMap.vue";
import TitleBox from "../components/TitleBox.vue";

export default {
  name: "AboutView",
  components: {
    DataMap,
    TitleBox,
  },
};
</script>
