import https from "./https";

// export const fetchLogs = async () => {
//     try {
//         const response = await http.get("/logs");
//         return response.data;
//     }
//     catch (error) {
//         console.log("Fetching Logs Error:", error);
//     }
// }

export const getLogs= async (platform: string) => {
  try {
    const response = await https.get(`/Analytics/posts?platform=${platform}`);    

    // console.log("logs details: ",response.data);
    
    return response.data;
  } catch (error) {
    console.error("Fetching platform Error:", error);
    throw error;
  }
};

// To refresh post details if updated
export const getRefreshLog = async (platform: string) => {
  // platform
  try {
    const response = await https.get(`/Analytics/posts?platform=${platform}&fresh=true`);    

    console.log("Refreshed logs details: ",response.data);
    
    return response.data;
  } catch (error) {
    console.error("Fetching platform Error:", error);
    throw error;
  }
};


// Analytics Page api
// https://campzeo-v1-oym2.vercel.app/api/Analytics/post-details/74?fresh=true
export const getAnalytics = async (postId: number) => {
  try {
    const response = await https.get(`/Analytics/post-details/${postId}?fresh=true`);    

    // console.log("Analytics page details: ",response.data);   
    return response.data;
  } 
  catch (error) {
    console.error("Fetching platform Error:", error);
    throw error;
  }
};





// logs refresh api 
// https://campzeo-v1-oym2.vercel.app/api/Analytics/posts?platform=FACEBOOK&fresh=true

// /Analytics/posts?platform=${platform}


// refresh button api : https://campzeo-v1-oym2.vercel.app/api/Analytics/posts?platform=FACEBOOK&fresh=true
