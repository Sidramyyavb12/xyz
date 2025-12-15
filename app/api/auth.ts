import fetcher from "@/lib/fetcher";

export const login = (payload: { email: string; password: string }) => fetcher("/krixflow/inventory/login", "POST", payload);
