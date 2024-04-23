import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'; 
import DataBarView from '../views/DataBarView.vue'; 
import DataMapView from '../views/DataMapView.vue'; 
import DataTextView from '../views/DataTextView.vue'; 

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/ovd',
    redirect: '/',
  },
  {
    path: '/sentences',
    name: 'DataBar',
    component: DataBarView, 
  },
  {
    path: '/prisoner-flow',
    name: 'DataMap',
    component: DataMapView, 
  },

  {
    path: '/articles',
    name: 'DataText',
    component: DataTextView, 
  },

  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
