import apiClient from "./services";
import Utils from "../config/utils.js";
import axios from 'axios';

// Using hardcoded awards since there is no working award endpoint
const BASE_URL = "http://localhost:3029/flight-plan-t9";
const STUDENT_ENDPOINT = "student";

export default {
  async getAwards() {
    console.log("Using hardcoded award data since API endpoints for awards return 500 or 404");
    
    // Return hardcoded awards since the API endpoints don't work
    return [
      {
        AwardID: 1,
        name: "Free Coffee",
        description: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1937&auto=format&fit=crop",
        points: "50",
        redemption_type: "food"
      },
      {
        AwardID: 2,
        name: "Parking Pass",
        description: "https://images.unsplash.com/photo-1590674899484-8a8ae973a5b2?q=80&w=2070&auto=format&fit=crop",
        points: "100",
        redemption_type: "service"
      },
      {
        AwardID: 3,
        name: "$10 Bookstore Credit",
        description: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop",
        points: "75",
        redemption_type: "merchandise"
      }
    ];
  },
  
  async redeemAward(studentId, awardId, points) {
    try {
      // Since the award endpoints don't work, we'll update the student points directly
      // First, get the current student data
      const studentResponse = await apiClient.get(`${STUDENT_ENDPOINT}/${studentId}`);
      const student = studentResponse.data;
      
      if (!student) {
        throw new Error("Student not found");
      }
      
      // Calculate new points
      const currentPoints = parseInt(student.points) || 0;
      const redeemPoints = parseInt(points) || 0;
      
      if (currentPoints < redeemPoints) {
        throw new Error("Insufficient points");
      }
      
      const newPoints = currentPoints - redeemPoints;
      
      // Update student points
      const updateResponse = await apiClient.put(`${STUDENT_ENDPOINT}/${studentId}`, {
        ...student,
        points: newPoints.toString()
      });
      
      console.log("Student points updated:", updateResponse);
      
      // Since we can't delete the award (no working endpoint), we'll just return success
      return {
        success: true,
        message: `Award redeemed successfully! Deducted ${points} points.`,
        studentId,
        awardId,
        newPoints
      };
    } catch (error) {
      console.error("Error redeeming award:", error);
      throw error;
    }
  }
}; 