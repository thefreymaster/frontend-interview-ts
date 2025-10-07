import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

export const useVendors = () =>
  useQuery({
    queryKey: ["vendors"],
    queryFn: api.vendors.get,
  });
