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
    // Other modules, if needed
  },
  plugins: [createPersistedState()],

  state() {
    return {
      parts: [
        {
          id: "1",
          title: "M3 engine",
          description: "This engine is super awesome and goes vroom vroom!",
          condition: "brand new, never used",
          price: "$1000",
          location: "San Luis Obispo, CA",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/78/BMW_M3_Coup%C3%A9_Motor.JPG",
        },
        {
          id: "2",
          title: "Actually Cool Rare Engine - 1 of a kind",
          description: "This engine is super awesome and goes vroom vroom!",
          condition: "brand new, never used",
          price: "$1000",
          location: "San Luis Obispo, CA",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/78/BMW_M3_Coup%C3%A9_Motor.JPG",
        },
        {
          id: "3",
          title: "M3 engine",
          description: "This engine is super awesome and goes vroom vroom!",
          condition: "brand new, never used",
          price: "$1000",
          location: "San Luis Obispo, CA",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/78/BMW_M3_Coup%C3%A9_Motor.JPG",
        },
        {
          id: "4",
          title: "M3 engine",
          description: "This engine is super awesome and goes vroom vroom!",
          condition: "brand new, never used",
          price: "$1000",
          location: "San Luis Obispo, CA",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/78/BMW_M3_Coup%C3%A9_Motor.JPG",
        },
        {
          id: "5",
          title: "M3 engine",
          description: "This engine is super awesome and goes vroom vroom!",
          condition: "brand new, never used",
          price: "$1000",
          location: "San Luis Obispo, CA",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/78/BMW_M3_Coup%C3%A9_Motor.JPG",
        },
        {
          id: "6",
          title: "M3 engine",
          description: "This engine is super awesome and goes vroom vroom!",
          condition: "brand new, never used",
          price: "$1000",
          location: "San Luis Obispo, CA",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/78/BMW_M3_Coup%C3%A9_Motor.JPG",
        },
        // {
        //   id: "7",
        //   title: "M3 engine",
        //   description: "This engine is super awesome and goes vroom vroom!",
        //   condition: "brand new, never used",
        //   price: "$1000",
        //   location: "San Luis Obispo, CA",
        //   imageUrl:
        //     "https://upload.wikimedia.org/wikipedia/commons/7/78/BMW_M3_Coup%C3%A9_Motor.JPG",
        // },
      ],
      offers: [
        {
          id: "1",
          shopName: "O'Reilly Auto Shop",
          deal: "50% off oil change",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/a/a5/O%27Reilly_Auto_Parts_Logo.svg",
        },
        {
          id: "2",
          shopName: "Something different",
          deal: "50% off oil change",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/a/a5/O%27Reilly_Auto_Parts_Logo.svg",
        },
        // Add more parts as needed
      ],
    };
  },
  getters: {
    parts: (state) => state.parts,
    part: (state) => (partId: any) => {
      return state.parts.find((part) => part.id === partId);
    },
    offers: (state) => state.offers,
    offer: (state) => (offerId: any) => {
      return state.offers.find((offer) => offer.id === offerId);
    },
  },
});

export default store;
