import { client } from "./api";

export const login = async (email, password) => {
  try {
    const res = await client.post("login", { email, password });
    return res;
  } catch (err) {
    throw err;
  }
};

export const fetchSelf = async () => {
  try {
    const res = await client.get("self");
    return res;
  } catch (err) {
    throw err;
  }
};
