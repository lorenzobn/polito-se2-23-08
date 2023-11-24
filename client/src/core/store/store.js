import { makeObservable, observable, action } from "mobx";
import {
  login as loginAPI,
  fetchSelf as fetchSelfAPI,
  loginVerification as loginVerificationAPI,
} from "../API/auth";
import {
  getProposals as getProposalsAPI,
  searchProposal as searchProposalAPI,
  getReceivedApplications as getReceivedApplicationsAPI,
  getMyApplications as getMyApplicationsAPI,
  postProposals as postProposalsAPI,
  getProposal as getProposalAPI,
  getProposalsByTeacherId as getProposalsByTeacherIdAPI,
} from "../API/proposals";
import { createApplication as createApplicationAPI } from "../API/applications";
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
  async login() {
    try {
      const res = await loginAPI();
      if (res.status === 200) {
        window.location.href = res.data.redirectUrl;
      } else {
      }
    } catch (err) {
      toast.error("Error on login");
    }
  }
  async loginVerification(token) {
    try {
      const res = await loginVerificationAPI(token);
      console.log(res);
      if (res.status === 200) {
        // window.location.href = res.data.redirectUrl;
      } else {
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

  async getProposalsByTeacherId(keyword) {
    try {
      const res = await getProposalsByTeacherIdAPI();
      return res.data.data;
    } catch (err) {
      return [];
    }
  }

  async searchProposal(keyword) {
    try {
      const res = await searchProposalAPI(keyword);
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

  async createApplication(application) {
    try {
      const res = await createApplicationAPI(application);
      toast.success("Application created");
      return res.data.data;
    } catch (err) {
      toast.error('Cannot create applicaton')
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

  async postProposals(title, type, description, requiredKnowledge, notes, level, programme, deadline , status, keywords) {
    try {
      const res = await postProposalsAPI(title, type, description, requiredKnowledge, notes, level, programme, deadline , status, keywords);
      return res.data.data;
    } catch (err) {
      return [];
    }
  }

  async getProposal(proposalId) {
    try {
      const res = await getProposalAPI(proposalId);
      return res.data.data;
    } catch (err) {
      return [];
    }
  }

  setLoading(state) {}
}

export default new Store();
