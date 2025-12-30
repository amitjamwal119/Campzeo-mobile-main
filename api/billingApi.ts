
import https from "./https";

// user/me is in dashboardApi.ts - getUser
// https://www.campzeo.com/api/payments
// https://www.campzeo.com/api/subscription/current



// Post wali apis
// plan select krke post krne wali
// https://www.campzeo.com/api/razorpay/create-order
// Iska payload data {plan: "PROFESSIONAL", isSignup: false, metadata: {activationTiming: "DEFERRED"}}
// 
export const getUsage = async () => {
  try {
    const response = await https.get(`subscription/usage`);    
    // console.log("usage details: ",response.data);   
    return response.data;
  } 
  catch (error) {
    console.error("Fetching usage details Error:", error);
    throw error;
  }
};

export const getCurrentSubscription = async () => {
  try {
    const response = await https.get(`subscription/current`);    
    // console.log("Current Subscription details: ",response.data);   
    return response.data;
  } 
  catch (error) {
    console.error("Fetching Current Subscription details Error:", error);
    throw error;
  }
};


//payload: {autoRenew: true}
//     { "success": true,
//     "message": "Auto-renew enabled successfully",
//     "subscription": {
//         "id": 28,
//         "autoRenew": true
//     }
// }

export const updateAutoRenew = async (autoRenew: boolean) => {
  try {
    const response = await https.post(`subscription/auto-renew`, {
    autoRenew: autoRenew,
  });    
    // console.log("Auto renew details: ",response.data);   
    return response.data;
  } 
  catch (error) {
    console.error("Fetching Current Subscription details Error:", error);
    throw error;
  }
};


export const cancelSubscription = async (subscription: boolean, message: string) => {
  try {
    const response = await https.post(`subscription/cancel`, {
    immediate: subscription,
    reason: message
  });    
    // console.log("Auto renew details: ",response.data);   
    return response.data;
  } 
  catch (error) {
    console.error("Fetching Current Subscription details Error:", error);
    throw error;
  }
};


export const getPlans = async () => {
  try {
    const response = await https.get(`plans`);    
    console.log("Plans details: ",response.data);   
    return response.data;
  } 
  catch (error) {
    console.error("Fetching Plans details Error:", error);
    throw error;
  }
};


export const getPayments = async () => {
  try {
    const response = await https.get(`payments`);    
    // console.log("Payments details: ",response.data);   
    return response.data;
  } 
  catch (error) {
    console.error("Fetching Payments Error:", error);
    throw error;
  }
};


// Razorpay 


// https://www.campzeo.com/api/razorpay/create-order
// Payload data: {plan: "PROFESSIONAL", isSignup: false, metadata: {activationTiming: "IMMEDIATE"}}



// https://www.campzeo.com/api/razorpay/verify-payment
// Payload data:  {razorpay_order_id: "order_Rxn28HqAkbRug6", razorpay_payment_id: "pay_RxnCscIcQggBJl",…}
// isSignup
// : 
// false
// metadata
// : 
// {activationTiming: "IMMEDIATE"}
// plan
// : 
// "PROFESSIONAL"
// razorpay_order_id
// : 
// "order_Rxn28HqAkbRug6"
// razorpay_payment_id
// : 
// "pay_RxnCscIcQggBJl"
// razorpay_signature
// : 
// "2638aad9cc2bafb97955cd2578bd8d3c5c1d37ca44d0fb1c01036edfc9685278"

// post api after razorpay selection 
// https://www.campzeo.com/organisation?_rsc=1fyjd
