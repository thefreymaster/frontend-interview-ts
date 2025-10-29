import { Merchants } from "./mockResponse";

export const get = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Merchants);
    }, 1000);
  });
};

export const api = {
  merchants: { get },
};
