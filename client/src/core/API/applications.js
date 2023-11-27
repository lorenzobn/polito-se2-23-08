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

export const checkApplication = async (thesisId) => {
  try {
    const res = await client.get(`/check-application/${thesisId}`);
    return res;
  } catch (err) {
    throw err;
  }
};
