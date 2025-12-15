import fetcher from "@/lib/fetcher";

export const getStock = () => fetcher("/inventory/stock", "GET");
export const getFlow = () => fetcher("/inventory/flow", "GET");
