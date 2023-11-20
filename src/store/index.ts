import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  modules: {
    tabs: {
      namespaced: true,
      state: {
        selectedTab: "parts", // Initial value
      },
      mutations: {
        setSelectedTab(state, tab) {
          state.selectedTab = tab;
        },
      },
    },
    eventTabs: {
      namespaced: true,
      state: {
        selectedTab: "recommended", // Initial value
      },
      mutations: {
        setSelectedTab(state, tab) {
          state.selectedTab = tab;
        },
      },
    },
    // Other modules, if needed
  },
  plugins: [createPersistedState()],
});

export default store;
