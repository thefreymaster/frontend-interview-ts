import axios from "axios";

const pixels = () => axios.get("/pixels");

export const api = {
  pixels,
};
