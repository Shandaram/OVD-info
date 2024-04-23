import { createStore } from 'vuex';
import dataModule from './modules/data';

export default createStore({
  modules: {
    data: dataModule
  }
});

