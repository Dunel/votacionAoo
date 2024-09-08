import axios from "axios";

export const recovery = async (data) => {
  try {
    const res = await axios.post(
      `https://node.appcorezulia.lat/api/login/recovery`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      console.log("antes: ", error.response.data);
      throw new Error(error.response.data);
    }
    throw new Error(error);
  }
};

export const Passwordrecovery = async (data, token) => {
  try {
    console.log({Authorization: `Bearer ${token}`});
    const res = await axios.put(
      `https://node.appcorezulia.lat/api/login/recovery/password`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      },
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      console.log("antes: ", error.response.data);
      throw new Error(error.response.data);
    }
    throw new Error(error);
  }
};
