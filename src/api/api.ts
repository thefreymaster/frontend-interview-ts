import { Vendors } from "./mockResponse";

export const getVendors = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Vendors);
    }, 1000);
  });
};

export const api = {
  vendors: getVendors,
};
