import { makeObservable, observable, action } from "mobx";
import {
  login as loginAPI,
  fetchSelf as fetchSelfAPI,
  loginVerification as loginVerificationAPI,
  logout as logoutAPI,
} from "../API/auth";
import {
  getProposals as getProposalsAPI,
  searchProposal as searchProposalAPI,
  getReceivedApplications as getReceivedApplicationsAPI,
  getMyApplications as getMyApplicationsAPI,
  postProposals as postProposalsAPI,
  getProposal as getProposalAPI,
  getProposalsByTeacherId as getProposalsByTeacherIdAPI,
  getAllGroups as getAllGroupsAPI,
  getCoSupervisors as getCoSupervisorsAPI,
  getAllCds as getAllCdSAPI,
  getAllProgrammes as getAllProgrammesAPI,
  getExternalCoSupervisors as getExtCoSupervisorsAPI,
  updateProposal as updateProposalAPI,
  deleteProposal as deleteProposalAPI,
  archiveProposal as archiveProposalAPI,
  copyProposal as copyProposalAPI,
} from "../API/proposals";
import {
  checkApplied as checkAppliedAPI,
  createApplication as createApplicationAPI,
  getReceivedApplicationsByThesisId as getReceivedApplicationsByThesisIdAPI,
  putApplicationStatus as putApplicationStatusAPI,
  checkApplication as checkApplicationAPI,
  downloadCV as downloadCVAPI,
  getStudentCareer as getStudentCareerAPI,
} from "../API/applications";
import {
  getVirtualClockValue as getVirtualClockValueAPI,
  setVirtualClock as setVirtualClockAPI,
} from "../API/general";
import {
  getNotifications as getNotificationsAPI,
  markNotificationAsSeen as markNotificationAsSeenAPI,
} from "../API/notifications";
import { toast } from "react-toastify";
export class Store {
  constructor() {
    this.theme = localStorage.getItem("theme");
    this.time = new Date();
    this.user = {
      id: "",
      role: "",
      authenticated: false,
      notifications: [],
    };
    this.loading = false;
    makeObservable(this, {
      theme: observable,
      time: observable,
      user: observable,
      loading: observable,
      setLoading: action,
      login: action,
      setVirtualClock: action,
      getVirtualClockValue: action,
      toggleTheme: action,
      getNotifications: action,
      markNotificationAsSeen: action,
      deleteProposal: action,
      archiveProposal: action,
    });
  }

  toggleTheme = () => {
    this.theme === "dark"
      ? (localStorage.setItem("theme", "light"),
        (this.theme = "light"),
        (document.body.style.backgroundColor = "white"))
      : ((this.theme = "dark"),
        localStorage.setItem("theme", "dark"),
        (document.body.style.backgroundColor = "#00284b"));
  };

  async setVirtualClock(time) {
    try {
      const res = await setVirtualClockAPI(time);
      this.getVirtualClockValue();
    } catch (err) {
      toast.error("Error on login");
    }
  }

  async getVirtualClockValue() {
    try {
      const res = await getVirtualClockValueAPI();
      if (res.status === 200) {
        this.time = new Date(res.data.virtual_time);
        return new Date(res.data.virtual_time);
      }
    } catch (err) {
      toast.error("Error on login");
    }
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
  async logout() {
    try {
      const res = await logoutAPI();
      if (res.status === 200) {
        this.user = this.user = {
          id: "",
          type: "",
          authenticated: false,
        };
        window.location.href = "/";
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  }
  async loginVerification(token) {
    try {
      const res = await loginVerificationAPI(token);

      if (res.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      toast.error("Error on login");
    }
  }

  async fetchSelf() {
    try {
      this.getVirtualClockValue();
      const res = await fetchSelfAPI();
      if (res?.status === 200) {
        // still authenticated
        this.user = res.data.data;
        this.user.authenticated = true;
      }
      if (res?.status === 401) {
        this.logout();
      }
      this.getNotifications();
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

  async getReceivedApplications() {
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
      toast.error("Cannot create applicaton");
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
  async downloadCV(applicationId) {
    try {
      const res = await downloadCVAPI(applicationId);
      console.log(res);
      const blob = new Blob([res.data]);
      const downloadUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();

      URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error in downloading file: ", err);
      return [];
    }
  }

  async postProposals(
    title,
    type,
    description,
    requiredKnowledge,
    notes,
    level,
    programme,
    deadline,
    keywords,
    coSupervisors
  ) {
    try {
      const res = await postProposalsAPI(
        title,
        type,
        description,
        requiredKnowledge,
        notes,
        level,
        programme,
        deadline,
        keywords,
        coSupervisors
      );
      return res.data;
    } catch (err) {
      return err;
    }
  }

  async getProposal(proposalId) {
    try {
      const res = await getProposalAPI(proposalId);
      return res.data;
    } catch (err) {
      return [];
    }
  }

  async copyProposal(
    proposalId,
    title,
    type,
    description,
    requiredKnowledge,
    notes,
    level,
    programme,
    deadline,
    keywords,
    coSupervisors
    )
     {
    console.log("sono in copy proposal. proposal id:", proposalId);
    try {
      const response = await getProposalAPI(proposalId);
      console.log("response: ", response.data.data[0]); //for debugging
      const proposal = response.data.data[0];

      const res = await copyProposalAPI(
        proposalId,
        title,
        type,
        description,
        requiredKnowledge,
        notes,
        level,
        programme,
        deadline,
        keywords,
        coSupervisors
        
      );

      return res.data;
    } catch (error) {
      console.log("errore in copy proposal: ", error.message);
    }
  }

  async getAllGroups() {
    try {
      const res = await getAllGroupsAPI();
      return res.data.data;
    } catch (err) {
      return [];
    }
  }

  async getCoSupervisors() {
    try {
      const res = await getCoSupervisorsAPI();
      return res.data.data;
    } catch (err) {
      return [];
    }
  }

  async getExternalCoSupervisors() {
    try {
      const res = await getExtCoSupervisorsAPI();
      return res.data.data;
    } catch (err) {
      return [];
    }
  }

  async getAllCds() {
    try {
      const res = await getAllCdSAPI();
      return res.data.data;
    } catch (err) {
      return [];
    }
  }

  async getAllProgrammes() {
    try {
      const res = await getAllProgrammesAPI();
      return res.data.data;
    } catch (err) {
      return [];
    }
  }

  async checkApplied(thesisId) {
    try {
      const res = await checkAppliedAPI(thesisId);
      return res.data.applied;
    } catch (err) {
      return [];
    }
  }

  async getReceivedApplicationsByThesisId(proposalId) {
    try {
      const res = await getReceivedApplicationsByThesisIdAPI(proposalId);
      return res.data.data;
    } catch (err) {
      return [];
    }
  }

  async getStudentCareer(proposalId) {
    try {
      const res = await getStudentCareerAPI(proposalId);
      return res.data.data;
    } catch (err) {
      return [];
    }
  }

  async applicationDecision(proposalId, status) {
    try {
      const res = await putApplicationStatusAPI(proposalId, status);
      return res;
    } catch (err) {
      return [];
    }
  }

  async checkApplication(thesisId) {
    try {
      const res = await checkApplicationAPI(thesisId);
      return res.data;
    } catch (err) {
      return [];
    }
  }
  async getNotifications() {
    try {
      const res = await getNotificationsAPI();
      this.user.notifications = res.data.data;
      this.user.notifications.reverse();
      return res.data;
    } catch (err) {
      return [];
    }
  }
  async markNotificationAsSeen(id) {
    try {
      const res = await markNotificationAsSeenAPI(id);
      this.getNotifications();
      return res.data;
    } catch (err) {
      return [];
    }
  }

  async updateProposal(id, updates) {
    console.log(updates);
    try {
      const res = await updateProposalAPI(id, updates);
      window.location.reload();
      return res.data;
    } catch (err) {
      return err;
    }
  }

  async deleteProposal(id) {
    try {
      const res = await deleteProposalAPI(id);
      return res;
    } catch (err) {
      return err;
    }
  }
  async archiveProposal(id) {
    try {
      const res = await archiveProposalAPI(id);
      return res;
    } catch (err) {
      return err;
    }
  }
  setLoading(state) {}
}
export default new Store();
