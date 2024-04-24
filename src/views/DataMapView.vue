<template>
  <div>
    <TitleBox
      title="Correctional Cartography"
      filter="were imprisoned, prison listed"
      description="This map visualizes the movement of individuals resulting from incarceration. 
      Utilizing decimal degrees and a TopoJSON file, it maps cities where prosecutions occurred and prisons where individuals were sent. 
      The arrows lead from the city of residence of the convicted individual to the place where they are sent to serve their sentence. The data is dynamically updated via the <a target='_blank' class='intext-link' href='https://observablehq.com/d/3dfc2fcf987505cb'>OVDinfo API</a>. However, currently, the coordinates of prisons are approximations hosted on a private server. Consequently, if new individuals are added to the API but their penal facility or city is not included, they will not be plotted. I am looking for a solution to automate coordinate generation."
      instruction="
      Below, you can set the distance of the place of serving the sentence from the city of residence of the convicted individual, and the time period you are interested in. To achive that hover the cursor over the vertical marks of the sliders (they will turn burgundy) and drag them. You can also select/write the city of residence of the convicted individual, the correctional institution, and exclude from the sample those who have already been released. 
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
