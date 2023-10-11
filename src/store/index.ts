import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      parts: [
        {
          id: "1",
          title: "M3 engine",
          description: "brand new, never used",
          price: "$1000",
          distance: "12 miles",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/78/BMW_M3_Coup%C3%A9_Motor.JPG",
        },
        {
          id: "2",
          title: "M3 engine",
          description: "brand new, never used",
          price: "$1000",
          distance: "12 miles",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/78/BMW_M3_Coup%C3%A9_Motor.JPG",
        },
        {
          id: "3",
          title: "M3 engine",
          description: "brand new, never used",
          price: "$1000",
          distance: "12 miles",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/78/BMW_M3_Coup%C3%A9_Motor.JPG",
        },
        {
          id: "4",
          title: "M3 engine",
          description: "brand new, never used",
          price: "$1000",
          distance: "12 miles",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/78/BMW_M3_Coup%C3%A9_Motor.JPG",
        },
        {
          id: "5",
          title: "M3 engine",
          description: "brand new, never used",
          price: "$1000",
          distance: "12 miles",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/78/BMW_M3_Coup%C3%A9_Motor.JPG",
        },
        {
          id: "6",
          title: "M3 engine",
          description: "brand new, never used",
          price: "$1000",
          distance: "12 miles",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/78/BMW_M3_Coup%C3%A9_Motor.JPG",
        },
        {
          id: "7",
          title: "M3 engine",
          description: "brand new, never used",
          price: "$1000",
          distance: "12 miles",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/78/BMW_M3_Coup%C3%A9_Motor.JPG",
        },
      ],
      offers: [
        {
          id: "1",
          shopName: "O'Reilly Auto Shop",
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
    offers: (state) => state.offers,
  },
});

export default store;
