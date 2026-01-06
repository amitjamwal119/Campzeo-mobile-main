// api/campaignApi.ts
import axios from "axios";
import { BASE_URL } from "../config";

export type AuthToken = string;

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

export interface AIContentRequest {
  prompt: string;
  context: { platform: string; existingContent: string };
  mode: string;
}

export interface AIVariation {
  subject: string;
  content: string;
}

export interface AIContentResponse {
  success: boolean;
  content: string;
  subject: string;
  variations: AIVariation[];
}

export interface AIImageRequest {
  prompt: string;
  count?: number;
}

export interface AIImageResponse {
  success: boolean;
  images?: string[];
  imagePrompt: string;
  message: string;
}

// ---------------------- Safe API Call Wrapper ---------------------- //
export const safeApiCall = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error: any) {
    console.error("API Call Error:", error.response?.data || error.message);
    return null;
  }
};

// ---------------------- Campaign APIs ---------------------- //

// Create a new campaign
export const createCampaignApi = (data: CampaignData, token: AuthToken) =>
  safeApiCall(async () => {
    const res = await axios.post(`${BASE_URL}/campaigns`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return res.data;
  });

// Get campaigns with pagination & search
export const getCampaignsApi = (token: AuthToken, page: number = 1, limit: number = 10, search: string = "") =>
  safeApiCall(async () => {
    const params: any = { page, limit };
    if (search) params.search = search;

    const res = await axios.get(`${BASE_URL}/campaigns`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return res.data;
  });

// Get single campaign by ID
export const getCampaignByIdApi = (id: number, token: AuthToken) =>
  safeApiCall(async () => {
    const res = await axios.get(`${BASE_URL}/campaigns/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  });

// Update campaign by ID
export const updateCampaignApi = (id: number, data: CampaignData, token: AuthToken) =>
  safeApiCall(async () => {
    const res = await axios.put(`${BASE_URL}/campaigns/${id}`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return res.data;
  });

// Delete campaign
export const deleteCampaignApi = (id: number, token: AuthToken) =>
  safeApiCall(async () => {
    const res = await axios.delete(`${BASE_URL}/campaigns/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  });

// ---------------------- Campaign Posts APIs ---------------------- //

// Get posts for a specific campaign
export const getPostsByCampaignIdApi = (campaignId: number, token: AuthToken) =>
  safeApiCall(async () => {
    const res = await axios.get(`${BASE_URL}/campaigns/${campaignId}/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  });

// Create a post for a specific campaign
export const createPostForCampaignApi = (campaignId: number, data: CampaignPostData, token: AuthToken) =>
  safeApiCall(async () => {
    const res = await axios.post(`${BASE_URL}/campaigns/${campaignId}/posts`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return res.data;
  });

// Update (Edit) a post for a specific campaign
export const updatePostForCampaignApi = (campaignId: number, postId: number, data: CampaignPostData, token: AuthToken) =>
  safeApiCall(async () => {
    const res = await axios.put(`${BASE_URL}/campaigns/${campaignId}/posts/${postId}`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return res.data;
  });

// Delete a post for a specific campaign
export const deletePostForCampaignApi = (campaignId: number, postId: number, token: AuthToken) =>
  safeApiCall(async () => {
    const res = await axios.delete(`${BASE_URL}/campaigns/${campaignId}/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  });

// ---------------------- AI Content Generation API ---------------------- //
export const generateAIContentApi = (data: AIContentRequest, token?: AuthToken) =>
  safeApiCall(async () => {
    const res = await axios.post(`${BASE_URL}/ai/generate-content`, data, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res.data;
  });

// ---------------------- AI Image Generation API ---------------------- //
export const generateAIImageApi = (data: AIImageRequest, token?: AuthToken) =>
  safeApiCall(async () => {
    const res = await axios.post(`${BASE_URL}/ai/generate-image`, data, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res.data;
  });
