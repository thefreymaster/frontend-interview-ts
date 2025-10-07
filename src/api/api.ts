import { Vendors } from "./mockResponse";

export const get = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Vendors);
    }, 1000);
  });
};

export const api = {
  vendors: { get },
};
