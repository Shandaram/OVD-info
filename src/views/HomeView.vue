<template>
  <div class="main-home">
    <h1>Russian political prisoners</h1>
    <h1 class="years">2002-2024</h1>
    <video v-if="isChrome" src="../assets/orel.webm" mute autoplay loop></video>
    <img v-else src="../assets/temp.png" alt="">
    <div class="about-text">
      <div>
        <h2>About</h2>
        <p> This project aims to make the invaluable data from  <a target='_blank' class='intext-link' href="https://observablehq.com/d/3dfc2fcf987505cb">OVDinfo API</a> more accessible and easy to understand for everyone.
           One of the key features is the Correctional Cartography map, which provides insights into the movement of individuals resulting from incarceration. The Sentences graph tracks the evolution of prison sentences over time, and the radial diagram focuses on the most 
           common articles leading to political convictions. These visualizations were created using <a target='_blank' href=”https://d3js.org” class='intext-link'  >D3.js</a> and <a target=”_blank” href=”https://observablehq.com/plot/” class='intext-link' > Observable Plot</a>. 
          3D models are made in Blender. </p>

      </div>
      <div>
        <h2>Contact</h2>

        <p>Trinity College Dublin, Interactive Digital Media MSc 2023-2024</p>
        <p> anokhink@tcd.ie
          <a target='_blank' class='intext-link' href='kseniiia.nl'>kseniiia.nl</a></p>
          <p> insta
          <a target='_blank' class='intext-link' href='https://www.instagram.com/_shandaram_/'>@_shandaram_</a></p>
          <p> 
          <a target='_blank' class='intext-link' href='https://github.com/Shandaram/prisoners-info'>GitHub</a></p>

      </div>
    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {
      isChrome: false
    };
  },
  mounted() {
    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  }
};
</script>

<style scoped>
.about-text {
  display: flex;
  gap: 38%;
  justify-content: space-between;
  justify-self: start;
  text-align: left;
  width: 100%;
  margin-top: 25vh;
}

.about-text > :nth-child(2) {
  text-align: right;
  
}
.about-text div {
width:28%;
  
}

.main-home {
  position: relative;
  display: grid;
  width: 100%;
  justify-content: center;
}

h1 {
  font-family: "Russo One", sans-serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 80%;
  font-size: 100px;
  margin-top: 1vh;
}

h1.years {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -3;
  color: var(--light-grey);
  font-size: 180px;
  width: 100%;
}


video {
  position: absolute;
  top: 20%;
  left: calc(50% - 23vw);
  width: 46vw;
  height: auto;
  z-index: 3;
}


img {
  position: absolute;
  top: 20%;
  left: calc(50% - 260px);
  width: 500px;
  height: auto;
  z-index: 3;
}

@media only screen and (max-width: 600px) {

  h1,
  h1.years {
    letter-spacing: 2px;
    line-height: 90%;
    font-size: 40px;
  }

  video,
  img {
    top: 20%;
    left: calc(50% - 56vw);
    width: 110vw;
  }

  .main-home {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: start;
    height: 100vh;
  }

  .about-text {
  display: flex;
  flex-direction: column;
  gap: 5vh;
  justify-content: space-between;
  justify-self: start;
  text-align: left;
  width: 100%;
  margin-top: 60vh;
}

.about-text div {
width:100%;
  
}
}
</style>