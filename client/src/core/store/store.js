import { makeObservable, observable, action } from "mobx";
import { login as loginAPI } from "../API/auth";
import {
  getProposals as getProposalsAPI,
  searchProposal as searchProposalAPI,
  getReceivedApplications as getReceivedApplicationsAPI,
  getProposal as getProposalAPI
} from "../API/proposals";
import { toast } from "react-toastify";
export class Store {
  constructor() {
    this.user = {
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
      console.log(res.status);
      if (res.status === 200) {
        // TODO: fix the following bad practice
        let type = password[0] === 's' ? 'student' : 'professor';
        this.user = {userId : password, type: 'student'};
        // save auth jwt to localstorage for subsequent requests
        localStorage.setItem("auth", res.data.token);
        toast.success("Logged in");
      } else {
        toast.error("Error on login");
      }
    } catch (err) {
      console.log(err);
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


  setLoading(state) { }
}

export default new Store();
