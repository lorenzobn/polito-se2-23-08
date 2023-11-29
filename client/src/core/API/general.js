import { client } from "./api";

export const setVirtualClock = async (time) => {
  try {
    const res = await client.post("set-clock", { time });
    return res;
  } catch (err) {
    throw err;
  }
};

export const getVirtualClockValue = async () => {
  try {
    const res = await client.get("/");
    return res;
  } catch (err) {
    throw err;
  }
};
