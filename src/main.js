import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';

const app = createApp(App);

// Register the Vuex store
app.use(store);
app.use(router);

// Mount the app to the element with id 'app'
app.mount('#app');





