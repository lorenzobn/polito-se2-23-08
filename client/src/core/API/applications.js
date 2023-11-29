import { client } from "./api";

export const createApplication = async (application) => {
  try {
    const res = await client.post("/my-applications", {
      student_id: application.student_id,
      thesis_id: application.thesis_id,
      thesis_status: application.thesis_status,
      cv_uri: application.cv_uri,
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

export const putApplicationStatus = async (proposalId, status, student_id) => {
  try {
    const res = await client.put(`/received-applications/${proposalId}` , {
      status: status,
      //student_id: student_id,
    });
    console.log("res app:" , res);
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