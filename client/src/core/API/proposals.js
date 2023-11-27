import { client } from "./api";

export const getProposals = async () => {
  try {
    const res = await client.get("thesis-proposals");
    return res;
  } catch (err) {
    throw err;
  }
};

export const getProposalsByTeacherId = async () => {
  try {
    const res = await client.get("my-thesis-proposals");
    return res;
  } catch (err) {
    throw err;
  }
};

export const getReceivedApplications = async () => {
  try {
    const res = await client.get("/received-applications");
    return res;
  } catch (err) {
    throw err;
  }
};

export const getMyApplications = async () => {
  try {
    const res = await client.get("/my-applications");
    return res;
  } catch (err) {
    throw err;
  }
};

export const searchProposal = async (keyword) => {
  try {
    const res = await client.get("/thesis-proposals/search", {
      params: {
        title: keyword,
        type: keyword, 
        description: keyword, 
        required_knowledge: keyword, 
        notes: keyword, 
        level: keyword, 
        programme: keyword
      }
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const postProposals = async (title, type, description, requiredKnowledge, notes, level, programme, deadline , status, keywords) => {
  try {
    const res = await client.post("/thesis-proposals" , {
      title,
      type,
      description,
      requiredKnowledge,
      notes,
      level,
      programme,
      deadline,
      status,
      keywords,
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const getProposal = async (proposalId) => {
  try {
    const res = await client.get(`thesis-proposals/${proposalId}`);
    return res;
  } catch (err) {
    throw err;
  }
};

export const getAllGroups = async () => {
  try {
    const res = await client.get("/groups");
    return res;
  } catch (err) {
    throw err;
  }
};

export const getCoSupervisors = async () => {
  try {
    const res = await client.get("/cosupervisors");
    return res;
  } catch (err) {
    throw err;
  }
};

export const getAllCds = async () => {
  try {
    const res = await client.get("/cds");
    return res;
  } catch (err) {
    throw err;
  }
};

export const getAllProgrammes = async () => {
  try {
    const res = await client.get("/programmes");
    return res;
  } catch (err) {
    throw err;
  }
};
