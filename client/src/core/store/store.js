import { makeObservable, observable, action } from "mobx";
import { login as loginAPI } from "../API/auth";
import { getProposals as getProposalsAPI } from "../API/proposals";
import { toast } from "react-toastify";
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
  async login(email, password) {
    try {
      const res = await loginAPI(email, password);
      console.log(res);
      if (res.status === 200) {
        this.user = res.data.data.user;
        // save auth jwt to localstorage for subsequent requests
        localStorage.setItem("auth", res.data.data.token);

        toast.success("Logged in");
      } else {
        toast.error("Error on login");
      }
    } catch (err) {
      toast.error("Error on login");
    }
  }

  async getProposals(email, password) {
    try {
      const res = await getProposalsAPI();
      console.log(res);
    } catch (err) {}
  }

  setLoading(state) {}
}

export default new Store();
