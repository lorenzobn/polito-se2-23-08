import { client } from "./api";

export const loginVerification = async (token) => {
  try {
    const res = await client.post("sso/verification", { token });
    return res;
  } catch (err) {
    throw err;
  }
};

export const login = async () => {
  try {
    const res = await client.get("login");
    return res;
  } catch (err) {
    throw err;
  }
};

export const logout = async () => {
  try {
    const res = await client.post("logout");
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
