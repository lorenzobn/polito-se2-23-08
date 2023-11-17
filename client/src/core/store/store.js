import { makeObservable, observable, action } from "mobx";
import { login as loginAPI } from "../API/auth";
import { getProposals as getProposalsAPI,
         searchProposal as searchProposalAPI,
         getReceivedApplications as getReceivedApplicationsAPI,
         postProposals as postProposalsAPI,
         getProposal as getProposalAPI } from "../API/proposals";
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
      console.log(res.status);
      console.log(res);
      console.log(res.data);
      if (res.status === 200) {
        console.log("HEYYY");
        this.user = res.data.user;
        // save auth jwt to localstorage for subsequent requests
        localStorage.setItem("auth", res.data.token);

        toast.success("Logged in");
      } else {
        console.log("Oh NOOOO"); 
        toast.error("Error on login");
      }
    } catch (err) {
      toast.error("Error on login");
    }
  }

  async getProposals(email, password) {
    try {
      const res = await getProposalsAPI();
      return res.data.data;
    } catch (err) {
      return [];
    }
  }

  async searchProposal(email, password) {
    try {
      const res = await searchProposalAPI();
      return res.data.data;
    } catch (err) {
      return [];
    }
  }

  async getReceivedApplications(email, password) {
    try {
      const res = await getReceivedApplicationsAPI();
      return res.data.data;
    } catch (err) {
      return [];
    }
  }

  async postProposals(email, password) {
    try {
      const res = await postProposalsAPI();
      return res.data.data;
    } catch (err) {
      return [];
    }
  }

  async getProposal(email, password) {
    try {
      const res = await getProposalAPI();
      return res.data.data;
    } catch (err) {
      return [];
    }
  }


  setLoading(state) {}
}

export default new Store();
