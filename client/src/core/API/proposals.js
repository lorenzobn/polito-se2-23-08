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

export const updateProposal = async (id, updates) => {
  try {
    const res = await client.put("/thesis-proposals/" + id, updates);
    return res;
  } catch (err) {
    throw err;
  }
};



/*export const copyProposal = async (proposalId) => {
  try {
    console.log("ciao");
    const res = await client.post("/thesis-proposals/" + proposalId + "/copy");
    return res;
  } catch (err) {
    throw err;
  }
};

*/

export const copyProposal = async (
  
  
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
) => {
  try {
    
    const res = await client.post("/thesis-proposals/" + proposalId , {
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
      coSupervisors,
    });
    
    return res;
    
  } catch (err) {
  console.log(err.message);
    throw err;

  }
};







export const deleteProposal = async (id) => {
  try {
    const res = await client.put("/thesis-proposals/" + id + "/deleted")
      .then((response) => {
      return response
      })
      .catch((reason) => {
        return {code: reason.response.status, msg: reason.response.data.msg}
      });
    return res;
  } catch (err) {
    throw err;
  }
};

export const archiveProposal = async (id) => {
  try {
    const res = await client.put("/thesis-proposals/" + id + "/archived")
      .then((response) => {
      return response
      })
      .catch((reason) => {
        return {code: reason.response.status, msg: reason.response.data.msg}
      });
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
        programme: keyword,
      },
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const postProposals = async (
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
) => {
  try {
    const res = await client.post("/thesis-proposals", {
      title,
      type,
      description,
      requiredKnowledge,
      notes,
      level,
      programme,
      deadline,
      keywords,
      coSupervisors,
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

export const getExternalCoSupervisors = async () => {
  try {
    const res = await client.get("/ext-cosupervisors");
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
