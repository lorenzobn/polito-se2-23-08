import { client } from "./api";

export const login = async (email, password) => {
  try {
    const res = await client.post("login", { email, password });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};
