import protectedInstance from "../instance/protectedInstance";

export const getSellerReports = async () => {
  const { data } = await protectedInstance.get("/orders/seller-reports");
  return data;
};