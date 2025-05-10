import { httpClient } from "../config/AxiosHelper";

/**
 * Uploads a file to the server
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - A promise that resolves to the file information
 */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const response = await httpClient.post("/api/v1/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}; 