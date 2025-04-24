import apiClient from "./services"; // adjust path if needed

const REPORT_API = "/report";

const reportService = {
  // Create a new report
  submitReport(reportData) {
    return apiClient.post(REPORT_API, reportData);
  },

  // Get all reports (admin view)
  getAllReports() {
    return apiClient.get(REPORT_API);
  }
};

export default reportService;
