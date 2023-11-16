import { client } from "./api";

export const getProposals = async () => {
  const token = localStorage.getItem("auth");
  const headers = {
    auth: token,
  };
  console.log(headers);
  try {
    const res = await client.post("thesis-proposals", { headers });
    return res;
  } catch (err) {
    throw err;
  }
};
