import { client } from "./api";

export const createApplication = async (application) => {
    try {
      const res = await client.post("/my-applications" , {
        student_id: application.student_id,
        thesis_id: application.thesis_id,
        thesis_status: application.thesis_status,
        cv_uri: application.cv_uri
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
  }