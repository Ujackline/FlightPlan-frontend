<template>
    <div class="report-form-container">
      <h2>Report a Problem or Ask a Question</h2>
      <form @submit.prevent="submitReport" class="report-form">
        <label for="type">Type</label>
        <select v-model="report.type" required>
          <option disabled value="">Please select one</option>
          <option>Bug</option>
          <option>Question</option>
          <option>Suggestion</option>
        </select>
  
        <label for="message">Message</label>
        <textarea
          id="message"
          v-model="report.message"
          placeholder="Describe the issue or ask your question..."
          required
        ></textarea>
  
        <button type="submit">Submit</button>
  
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import reportService from "../services/reportServices"; // ✅

  
  export default {
    data() {
      return {
        report: {
          type: "",
          message: "",
        },
        successMessage: "",
      };
    },
    methods: {
        async submitReport() {
  try {
    await reportService.submitReport(this.report);
    this.successMessage = "Thank you! Your report has been submitted.";
    this.report = { type: "", message: "" };
  } catch (error) {
    console.error("Error submitting report:", error);
    this.successMessage = "Oops! Something went wrong.";
  }
}

    },
  };
  </script>
  
  <style scoped>
  .report-form-container {
    max-width: 600px;
    margin: auto;
    padding: 1.5rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .report-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .report-form label {
    font-weight: bold;
  }
  
  .report-form select,
  .report-form textarea,
  .report-form button {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
  }
  
  .report-form button {
    background-color: #2b7a78;
    color: white;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .report-form button:hover {
    background-color: #205e5c;
  }
  
  .success-message {
    color: green;
    font-weight: 500;
  }
  </style>
  