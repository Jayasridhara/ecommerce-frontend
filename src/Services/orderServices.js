import protectedInstance from "../instance/protectedInstance";

export const getSellerReports = async () => {
  const { data } = await protectedInstance.get("/orders/seller-reports");
  return data;
};

export const getMyOrders = async () => {
  const { data } = await protectedInstance.get("/orders/my");
  return data;
};
