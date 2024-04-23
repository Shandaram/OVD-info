// store/modules/data.js

import axios from "axios";

const state = {
  responseData: null,
};

const getters = {
  responseData: (state) => state.responseData,
};

const actions = {
  async fetchDataFromAPI({ commit }) {
    try {
      const response = await axios.get("https://api.repression.info/v1/data", {
        params: {
          language: "en",
          subset: "full",
        },
      });
      commit("SET_RESPONSE_DATA", response.data);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async fetchArticlesFromAPI({ commit }) {
    try {
      const response = await axios.get(
        "https://api.repression.info/v1/articles",
        {
          params: {
            language: "en",
            subset: "full",
          },
        }
      );
      commit("SET_RESPONSE_DATA", response.data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw error;
    }
  },
};

const mutations = {
  SET_RESPONSE_DATA(state, data) {
    state.responseData = data;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
