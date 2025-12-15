import fetcher from "@/lib/fetcher";

export const addMaterial = (data: any) => fetcher("/inventory/newmat", "POST", data);
export const getMaterials = () => fetcher("/inventory/materials", "GET");
