import { client } from "./api";

export const getNotifications = async () => {
  try {
    const res = await client.get("notifications");
    return res;
  } catch (err) {
    throw err;
  }
};

export const markNotificationAsSeen = async (id) => {
  try {
    const res = await client.put(`notifications/${id}`);
    return res;
  } catch (err) {
    throw err;
  }
};
