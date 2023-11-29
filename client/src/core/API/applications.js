import { client } from "./api";

export const createApplication = async (application) => {
  try {
    const res = await client.post("/my-applications", application, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const getReceivedApplicationsByThesisId = async (proposalId) => {
  try {
    const res = await client.get(`/received-applications/${proposalId}`);
    return res;
  } catch (err) {
    throw err;
  }
};

export const putApplicationStatus = async (proposalId, status) => {
  try {
    const res = await client.put(`/received-applications/${proposalId}` , {
      status: status,
    });
    return res;
  } catch(err){
    return err;
  }
}

export const checkApplication = async (thesisId) => {
  try {
    const res = await client.get(`/check-application/${thesisId}`);
    return res;
  } catch (err) {
    throw err;
  }
};

export const checkApplied = async (thesisId) => {
  try {
    const res = await client.get(`/check-application/${thesisId}`);
    return res;
  } catch (err) {
    throw err;
  }
};