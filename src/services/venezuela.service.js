import axios from "axios";

export const fetchEstados = async (token) => {
    try {
      const res = await axios.get(
        `https://node.appcorezulia.lat/api/venezuela/estados`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  export const fetchMunicipios = async (estado, token) => {
    try {
      const res = await axios.get(
        `https://node.appcorezulia.lat/api/venezuela/estados/${estado}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  export const fetchParroquias = async (municipio, token) => {
    try {
      const res = await axios.get(
        `https://node.appcorezulia.lat/api/venezuela/municipio/${municipio}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      //console.log(res.data);
      //setParroquias([])
      return res.data
    } catch (error) {
      console.log(error);
    }
  };