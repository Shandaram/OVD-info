<template>
  <MainHeader />
  <div class="main-cont">
    <router-view />  
  </div>

</template>

<script>
import MainHeader from "./components/MainHeader";

export default {
  name: 'App', 
  components: {
    MainHeader
  }
}
</script>

<style>
.russo-one-regular {
  font-family: "Russo One", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.ysabeau-infant-regular {
  font-family: "Ysabeau Infant", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: bold;
}

h1 {
  font-size: 70px;
  margin-bottom: 2vw;
}
.placeholder {
  position: relative;
}
.placeholder img {
  opacity: 0.5;
}
.placeholder p{
  font-size: 40px;
  text-transform: uppercase;
  position: absolute;
  text-align: center;
  width: 100%;
  top: 35%;
  z-index: 50;
}


body {
  background-color: var(--background);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;

}

a {
  text-decoration: none;
  color: var(--color);
}

#app {
  font-family: "Roboto", sans-serif; 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color);
  width: 100%;
}

.main-cont {

  width: 80vw;
  margin: 0 auto;

}

.chart-cont {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
