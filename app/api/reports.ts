import fetcher from "@/lib/fetcher";

export const getReport = () => fetcher("/inventory/reports", "GET");
