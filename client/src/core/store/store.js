import { makeObservable, observable, action } from "mobx";
import { login as loginAPI } from "../API/auth";
export class Store {
  constructor() {
    this.user = {
      type: "professor",
      authenticated: false,
    };
    this.loading = false;
    makeObservable(this, {
      user: observable,
      loading: observable,
      setLoading: action,
      login: action,
    });
  }
  login(email, password) {
    try {
      const res = loginAPI(email, password);
    } catch (err) {}
  }
  setLoading(state) {}
}

export default new Store();
