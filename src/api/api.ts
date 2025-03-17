import axios from "axios";

const pixels = async () => {
  const res = await axios.get("/api/v1/pixels")
  return res.data;
};

export const api = {
  pixels,
};
