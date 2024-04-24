<template>
    <header>
        <router-link class="logo-link" to="/ovd">
            <img src="../assets/logo.png" class="box-animation left" alt="">
            <img src="../assets/logo.png" class="logo" alt="">
            <img src="../assets/logo.png" class="box-animation right" alt="">
       </router-link>
        <div class="block-r">
        <router-link to="/sentences" :class="{ active: $route.path === '/sentences' }">Sentences</router-link>
        <router-link to="/prisoner-flow" :class="{ active: $route.path === '/prisoner-flow' }">Map</router-link>
        <router-link to="/articles" :class="{ active: $route.path === '/articles' }">Articles</router-link>
        <router-link to="/stories" :class="{ active: $route.path === '/stories' }">Stories</router-link>
       
    </div>
    </header>
</template>

<script>

export default {

};
</script>


<style scoped>
header {
 
    display: grid;
    grid-template-columns: auto 3fr;
    grid-template-rows: auto;
    align-items: center;

    padding: 2vw 8vw;
    text-transform: lowercase;
    font-size: 22px;
    font-family: "Roboto", sans-serif; 
}

header a {
    background-color: transparent;
    padding: 0.5vw 1vw;
    border-bottom: 1.5px transparent solid;
}

header a:hover, header a.active {
    border-bottom: 1.5px var(--color) solid;
}

.block-r {
    display: flex;
    gap: 2vw;
    align-items: center;
    justify-self: end;
}

.logo-link {
    display: flex;
    position: relative;
}

.logo-link:hover {
    background-color: transparent;
    border-bottom: 1.5px transparent solid;
}

.logo {
    width: 25px;
    height: 25px;
    background-color: black;
    border-radius: 5px;
    z-index: 30;
}

.box-animation {
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: black;
    border-radius: 2px;
    top: 30%;
    transition: all 100ms ease-in;
}
.box-animation.left {
   left: 15px;
}

.logo-link:hover .box-animation.left {
   left: -3px;
}
.box-animation.right {
   right: 15px;
}
.logo-link:hover .box-animation.right {
   right: -3px;
}

@media only screen and (max-width: 900px) {
    header {
    padding: 2vw 7vw;
    font-size: 18px;
}
}

</style>