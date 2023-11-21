import { makeObservable, observable, action } from "mobx";
import { login as loginAPI, fetchSelf as fetchSelfAPI } from "../API/auth";
import {
  getProposals as getProposalsAPI,
  searchProposal as searchProposalAPI,
  getReceivedApplications as getReceivedApplicationsAPI,
  getMyApplications as getMyApplicationsAPI,
  postProposals as postProposalsAPI,
  getProposal as getProposalAPI,
  getProposalsByTeacherId as getProposalsByTeacherIdAPI
} from "../API/proposals";
import { toast } from "react-toastify";
export class Store {
  constructor() {
    this.user = {
      id: "",
      type: "",
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
        // this object contains all user data that must be saved in the localStorage, including its id (s123, t123, etc...)
        this.user = res.data;
        // save auth jwt to localstorage for subsequent requests
        localStorage.setItem("auth", res.data.token);
        localStorage.setItem("type", res.data.type);
        toast.success("Logged in");
      } else {
        console.log("Oh NOOOO");
        toast.error("Error on login");
      }
    } catch (err) {
      toast.error("Error on login");
    }
  }

  async fetchSelf() {
    try {
      const res = await fetchSelfAPI();
      if (res?.status === 200) {
        // still authenticated
        this.user = res.data.data;
        this.user.authenticated = true;
      } else {
        // TODO let user know that they are logged out (maybe because token is expired or whatever)
      }
    } catch (err) {
      return [];
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

  async getProposalsByTeacherId(email, password) {
    try {
      const res = await getProposalsByTeacherIdAPI();
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

  async getMyApplications(email, password) {
    try {
      const res = await getMyApplicationsAPI();
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
