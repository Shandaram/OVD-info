<template>
  <div class="main-home">
    <h1>Russian political prisoners</h1>
    <h1 class="years">2002-2024</h1>
    <video v-if="isChrome" src="../assets/orel.webm" mute autoplay loop></video>
    <img v-else src="../assets/temp.png" alt="">

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
.main-home {

  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;


}

h1 {
  font-family: "Russo One", sans-serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 80%;
  font-size: 100px;
}

h1.years {
  color: rgb(221, 221, 221);
  font-size: 180px;
}

video, img {
  position: absolute;
  top: 20%;
  left: calc(50% - 300px);
  width: 600px;
  height: auto;
  z-index: 3;
}
</style>