import https from "./https";


export const getUser = async () => {
  try {
    const response = await https.get(`user/me`);    
    // console.log("user details: ",response.data);   
    return response.data;
  } 
  catch (error) {
    console.error("Fetching platform Error:", error);
    throw error;
  }
};


export const getCampaigns = async () => {
  try {
    const response = await https.get(`/campaigns?page=1&limit=10`);    
    // console.log("campaigns details: ",response.data);   
    return response.data;
  } 
  catch (error) {
    console.error("Fetching platform Error:", error);
    throw error;
  }
};


export const getContacts = async () => {
  try {
    const response = await https.get(`/contacts?page=1&limit=10`);    
    // console.log("Contacts details: ",response.data);   
    return response.data;
  } 
  catch (error) {
    console.error("Fetching platform Error:", error);
    throw error;
  }
};


