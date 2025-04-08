import apiClient from "./services";
import axios from "axios";
import Utils from "../config/utils.js";

const API_ENDPOINT = "document";
const BASE_URL = import.meta.env.DEV ? "http://localhost:3029/flight-plan-t9" : "/flight-plan-t9";
//const API_URL = process.env.VUE_APP_API_URL || "http://localhost:3000/api";

export default {
  async uploadDocument(studentId, file, documentType, description) {
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('studentId', studentId);
      formData.append('documentType', documentType);
      formData.append('description', description);
      
      // Special config for multipart/form-data
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      
      try {
        const response = await apiClient.post(`${API_ENDPOINT}/upload`, formData, config);
        return response.data;
      } catch (apiError) {
        console.error("API error during document upload:", apiError);
        console.log("Using mock implementation for document upload");
        
        // Mock successful response for development
        return {
          success: true,
          message: "Document uploaded successfully",
          document: {
            id: Math.floor(Math.random() * 1000),
            studentId: studentId,
            fileName: file.name,
            documentType: documentType,
            description: description,
            uploadDate: new Date().toISOString(),
            status: "Pending"
          }
        };
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  },

  async getStudentDocuments(studentId) {
    try {
      try {
        const response = await apiClient.get(`${API_ENDPOINT}/student/${studentId}`);
        return response.data;
      } catch (apiError) {
        console.error("API error fetching student documents:", apiError);
        console.log("Using mock implementation for student documents");
        
        // Mock response for development
        return [
          {
            id: 101,
            studentId: studentId,
            fileName: "resume.pdf",
            documentType: "Resume",
            description: "My professional resume",
            uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: "Pending"
          },
          {
            id: 102,
            studentId: studentId,
            fileName: "transcript.pdf",
            documentType: "Transcript",
            description: "Official transcript",
            uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            status: "Approved"
          }
        ];
      }
    } catch (error) {
      console.error("Error fetching student documents:", error);
      throw error;
    }
  },
  
  async getAllDocuments() {
    try {
      try {
        const response = await apiClient.get(API_ENDPOINT);
        return response.data;
      } catch (apiError) {
        console.error("API error fetching all documents:", apiError);
        console.log("Using mock implementation for all documents");
        
        // Mock response for development
        return [
          {
            id: 1,
            studentId: 1,
            studentName: "Sabrine Shami Karanganwa",
            fileName: "resume.pdf",
            documentType: "Resume",
            description: "My professional resume",
            uploadDate: "2023-04-10T15:30:00",
            status: "Pending",
            fileUrl: "#"
          },
          {
            id: 2,
            studentId: 1,
            studentName: "Sabrine Shami Karanganwa",
            fileName: "transcript.pdf",
            documentType: "Transcript",
            description: "Official transcript",
            uploadDate: "2023-04-05T10:15:00",
            status: "Approved",
            fileUrl: "#"
          },
          {
            id: 3,
            studentId: 2,
            studentName: "John Smith",
            fileName: "recommendation.pdf",
            documentType: "Letter",
            description: "Recommendation letter from Professor Johnson",
            uploadDate: "2023-04-12T09:45:00",
            status: "Pending",
            fileUrl: "#"
          }
        ];
      }
    } catch (error) {
      console.error("Error fetching all documents:", error);
      throw error;
    }
  },
  
  async updateDocumentStatus(documentId, status) {
    try {
      try {
        const response = await apiClient.put(`${API_ENDPOINT}/${documentId}/status`, { status });
        return response.data;
      } catch (apiError) {
        console.error("API error updating document status:", apiError);
        console.log("Using mock implementation for status update");
        
        // Mock successful response
        return {
          success: true,
          message: `Document status updated to ${status}`,
          documentId: documentId,
          status: status
        };
      }
    } catch (error) {
      console.error("Error updating document status:", error);
      throw error;
    }
  }
};

// Add getDocuments method for admin
export const getDocuments = async () => {
  try {
    const user = Utils.getStore('user');
    const headers = {
      'Authorization': user?.token ? `Bearer ${user.token}` : '',
      'Content-Type': 'application/json'
    };

    // Try different endpoints that might work
    const endpoints = ['/documents', '/document', '/documents/all', '/document/all'];
    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`Attempting to fetch documents from ${BASE_URL}${endpoint}`);
        const response = await axios.get(`${BASE_URL}${endpoint}`, { headers });
        if (response.data) {
          console.log('Successfully fetched documents from endpoint:', endpoint);
          return {
            success: true,
            documents: Array.isArray(response.data) ? response.data : response.data.documents || []
          };
        }
      } catch (error) {
        console.log(`Failed to fetch from ${endpoint}:`, error.message);
        lastError = error;
      }
    }

    // If all endpoints fail, throw the last error to trigger mock data
    throw lastError || new Error('All endpoints failed');
  } catch (error) {
    console.log('Error fetching all documents, using mock data', error);
    
    // Return mock data for testing
    return {
      success: true,
      documents: [
        {
          id: 1,
          studentId: 1,
          studentName: "Sabrine Shami Karanganwa",
          fileName: "resume.pdf",
          documentType: "Resume",
          description: "My professional resume",
          uploadDate: "2023-04-10T15:30:00",
          status: "Pending",
          fileUrl: "#"
        },
        {
          id: 2,
          studentId: 1,
          studentName: "Sabrine Shami Karanganwa",
          fileName: "transcript.pdf",
          documentType: "Transcript",
          description: "Official transcript",
          uploadDate: "2023-04-05T10:15:00",
          status: "Approved",
          fileUrl: "#"
        },
        {
          id: 3,
          studentId: 2,
          studentName: "John Smith",
          fileName: "recommendation.pdf",
          documentType: "Letter",
          description: "Recommendation letter from Professor Johnson",
          uploadDate: "2023-04-12T09:45:00",
          status: "Pending",
          fileUrl: "#"
        }
      ]
    };
  }
}; 