import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'; 
import DataBarView from '../views/DataBarView.vue'; 
import DataMapView from '../views/DataMapView.vue'; 
import DataTextView from '../views/DataTextView.vue'; 
import DataStoriesView from '../views/DataStoriesView.vue'; 

const routes = [
  {
    path: '/ovd',
    name: 'Home',
    component: HomeView,
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
  {
    path: '/stories',
    name: 'DataStories',
    component: DataStoriesView, 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
