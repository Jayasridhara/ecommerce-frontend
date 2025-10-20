import protectedInstance from "../instance/protectedInstance";

export const getSellerReports = async () => {
  const { data } = await protectedInstance.get("/orders/seller-reports");
  return data;
};

export const getMyOrders = async () => {
  const { data } = await protectedInstance.get("/orders/my");
  return data;
};

//update order status by seller
export const updateOrderStatusBySeller=async(orderId,status)=>{
  try{
    const response = await protectedInstance.patch('/orders/seller-status', {
      orderId,
      status
    });
    return response.data;
  }
  catch(err){
    console.error("Error updating order status by seller:",err);
    throw err;
  }
}