import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

const MERCHANTS = "MERCHANTS";

export const useMerchants = () =>
  useQuery({
    queryKey: [MERCHANTS],
    queryFn: api.merchants.get,
  });
