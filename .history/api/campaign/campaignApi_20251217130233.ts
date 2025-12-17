import axios from "axios";
import { BASE_URL } from "../config";

// ---------------------- Types ---------------------- //
export interface CampaignData {
  id?: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;  
  contactIds: number[];
}

export interface CampaignPostData {
  subject: string;
  message: string;
  type: string;
  mediaUrls?: string[];
  scheduledPostTime: string; 
}

export type AuthToken = string;

// ---------------------- Campaign APIs ---------------------- //

// Create a new campaign
export const createCampaignApi = async (data: CampaignData, token: AuthToken) => {
  try {
    const response = await axios.post(`${BASE_URL}/campaigns`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.data; 
  } catch (error: any) { 
    console.error("Create Campaign API Error:", error.response || error.message);
    throw error;
  }
};

// Get campaigns with pagination & search
export const getCampaignsApi = async (
  token: AuthToken,
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  try {
    const params: any = { page, limit };
    if (search) params.search = search;

    const response = await axios.get(`${BASE_URL}/campaigns`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    console.log("campaigns details:");
    
    return response.data; 
  } catch (error: any) {
    console.error("Get Campaigns API Error:", error.response || error.message);
    throw error;
  }
};

// Get single campaign by ID
export const getCampaignByIdApi = async (id: number, token: AuthToken) => {
  try {
    const response = await axios.get(`${BASE_URL}/campaigns/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; 
  } catch (error: any) {
    console.error("Get Campaign By ID API Error:", error.response || error.message);
    throw error;
  }
};

// Update campaign by ID
export const updateCampaignApi = async (id: number, data: CampaignData, token: AuthToken) => {
  try {
    const response = await axios.put(`${BASE_URL}/campaigns/${id}`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Update Campaign API Error:", error.response || error.message);
    throw error;
  }
};


// Delete campaign 
export const deleteCampaignApi = async (id: number, token: AuthToken) => {
  try {
    const response = await axios.delete(`${BASE_URL}/campaigns/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; 
  } catch (error: any) {
    console.error("Delete Campaign API Error:", error.response || error.message);
    throw error;
  }
};

// ---------------------- Campaign Posts APIs ---------------------- //

// Get posts for a specific campaign
export const getPostsByCampaignIdApi = async (campaignId: number, token: AuthToken) => {
  try {
    const response = await axios.get(`${BASE_URL}/campaigns/${campaignId}/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; 
  } catch (error: any) {
    console.error("Get Posts By Campaign ID API Error:", error.response || error.message);
    throw error;
  }
};

// Create a post for a specific campaign
export const createPostForCampaignApi = async (
  campaignId: number,
  data: CampaignPostData,
  token: AuthToken
) => {
  try {
    const response = await axios.post(`${BASE_URL}/campaigns/${campaignId}/posts`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.data; 
  } catch (error: any) {
    console.error("Create Post API Error:", error.response || error.message);
    throw error;
  }
};
