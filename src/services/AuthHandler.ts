import { firebaseAuth } from "../firebase-service";

class AuthHandler {
  services: [];
  
  constructor() {
    this.services = [];
  }

  addService(service) {
    this.services.push(service);
  }

  initialize() {
    firebaseAuth.onAuthStateChanged(user => {
      this.services.forEach(service => service.setUser(user));
    });
  }
}

export const authHandler = new AuthHandler();
