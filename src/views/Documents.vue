<template>
  <div class="documents-container">
    <h1>Document Upload</h1>
    <p class="description">Upload your documents to share with administrators</p>

    <!-- Upload Form -->
    <div class="upload-section">
      <h2>Upload New Document</h2>
      <div class="form-group">
        <label for="documentType">Document Type</label>
        <select id="documentType" v-model="newDocument.type" required>
          <option value="">Select document type</option>
          <option value="Resume">Resume</option>
          <option value="Transcript">Transcript</option>
          <option value="Certificate">Certificate</option>
          <option value="Letter">Recommendation Letter</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <input 
          type="text" 
          id="description" 
          v-model="newDocument.description" 
          placeholder="Brief description of the document"
          required
        />
      </div>

      <div class="form-group">
        <label for="fileUpload">File</label>
        <div class="file-upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
          <input 
            type="file" 
            id="fileUpload" 
            ref="fileInput" 
            @change="handleFileSelection" 
            style="display: none"
          />
          <div v-if="!newDocument.file" class="upload-placeholder">
            <i class="file-icon">📄</i>
            <p>Drag & drop your file here or click to browse</p>
            <p class="file-types">Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
          </div>
          <div v-else class="selected-file">
            <i class="file-icon">📄</i>
            <div class="file-info">
              <p class="file-name">{{ newDocument.file.name }}</p>
              <p class="file-size">{{ formatFileSize(newDocument.file.size) }}</p>
            </div>
            <button @click.stop="removeFile" class="remove-file">✕</button>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button 
          @click="uploadDocument" 
          :disabled="uploading || !isFormValid" 
          class="upload-btn"
        >
          {{ uploading ? 'Uploading...' : 'Upload Document' }}
        </button>
      </div>
    </div>

    <!-- Status Message -->
    <div v-if="message" :class="['status-message', messageType]">
      {{ message }}
    </div>

    <!-- Documents List -->
    <div class="documents-list">
      <h2>My Documents</h2>
      
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading your documents...</p>
      </div>

      <div v-else-if="documents.length === 0" class="no-documents">
        <p>You haven't uploaded any documents yet.</p>
      </div>

      <div v-else class="documents-table">
        <table>
          <thead>
            <tr>
              <th>Document Type</th>
              <th>File Name</th>
              <th>Description</th>
              <th>Upload Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in documents" :key="doc.id">
              <td>{{ doc.documentType }}</td>
              <td>{{ doc.fileName }}</td>
              <td>{{ doc.description }}</td>
              <td>{{ formatDate(doc.uploadDate) }}</td>
              <td>
                <span :class="['status-badge', doc.status.toLowerCase()]">
                  {{ doc.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import documentServices from '../services/documentServices';
import Utils from '../config/utils';

// State
const documents = ref([]);
const loading = ref(true);
const uploading = ref(false);
const message = ref('');
const messageType = ref('');
const fileInput = ref(null);

const newDocument = ref({
  type: '',
  description: '',
  file: null
});

// Computed properties
const isFormValid = computed(() => {
  return newDocument.value.type && 
         newDocument.value.description && 
         newDocument.value.file;
});

// Methods
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelection = (event) => {
  const file = event.target.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const validateAndSetFile = (file) => {
  // Check file size (10MB max)
  const maxSizeInBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    message.value = 'File size exceeds the 10MB limit';
    messageType.value = 'error';
    return;
  }

  // Check file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    message.value = 'Unsupported file type. Please upload PDF, DOC, DOCX, JPG, or PNG files';
    messageType.value = 'error';
    return;
  }

  newDocument.value.file = file;
  message.value = '';
};

const removeFile = () => {
  newDocument.value.file = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const uploadDocument = async () => {
  if (!isFormValid.value) return;

  message.value = '';
  uploading.value = true;

  try {
    const user = Utils.getStore('user');
    if (!user) {
      message.value = 'You must be logged in to upload documents';
      messageType.value = 'error';
      return;
    }

    // Show a loading message
    message.value = 'Uploading your document...';
    messageType.value = 'info';

    // Add a small delay to show the loading state (for demonstration)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await documentServices.uploadDocument(
      user.id,
      newDocument.value.file,
      newDocument.value.type,
      newDocument.value.description
    );

    // Check if we got a success response
    if (response && response.success) {
      message.value = response.message || 'Document uploaded successfully!';
      messageType.value = 'success';
      
      // Add the newly uploaded document to the list (for immediate display)
      if (response.document) {
        documents.value = [response.document, ...documents.value];
      }
      
      // Reset form
      newDocument.value = {
        type: '',
        description: '',
        file: null
      };
      
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      
      // Optionally refresh documents list from server
      // If you uncomment this, comment out the line that adds to documents.value above
      // await fetchDocuments();
    } else {
      message.value = 'Something went wrong while uploading the document.';
      messageType.value = 'error';
    }
  } catch (error) {
    console.error('Error uploading document:', error);
    message.value = error.response?.data?.message || 'Failed to upload document. Please try again.';
    messageType.value = 'error';
  } finally {
    uploading.value = false;
  }
};

const fetchDocuments = async () => {
  loading.value = true;
  try {
    const user = Utils.getStore('user');
    if (user) {
      const response = await documentServices.getStudentDocuments(user.id);
      documents.value = response;
    } else {
      message.value = 'You must be logged in to view your documents';
      messageType.value = 'error';
      documents.value = [];
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    message.value = 'Failed to load your documents';
    messageType.value = 'error';
    
    // For development, use mock data if API fails
    documents.value = [
      {
        id: 1,
        studentId: 1,
        fileName: "resume.pdf",
        documentType: "Resume",
        description: "My professional resume",
        uploadDate: "2023-04-10T15:30:00",
        status: "Pending"
      },
      {
        id: 2,
        studentId: 1,
        fileName: "transcript.pdf",
        documentType: "Transcript",
        description: "Official transcript",
        uploadDate: "2023-04-05T10:15:00",
        status: "Approved"
      }
    ];
  } finally {
    loading.value = false;
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Lifecycle hooks
onMounted(() => {
  fetchDocuments();
});
</script>

<style scoped>
.documents-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

h1 {
  font-size: 2.5rem;
  color: #263238;
  margin-bottom: 0.5rem;
  text-align: center;
}

.description {
  text-align: center;
  font-size: 1.1rem;
  color: #546e7a;
  margin-bottom: 2rem;
}

.upload-section {
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.upload-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #1976d2;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #455a64;
}

.form-group input[type="text"],
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cfd8dc;
  border-radius: 4px;
  font-size: 1rem;
}

.file-upload-area {
  border: 2px dashed #cfd8dc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.file-upload-area:hover {
  border-color: #1976d2;
}

.upload-placeholder {
  color: #78909c;
}

.file-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.file-types {
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.selected-file {
  display: flex;
  align-items: center;
}

.file-info {
  margin-left: 1rem;
  flex-grow: 1;
  text-align: left;
}

.file-name {
  font-weight: 500;
  margin: 0;
  color: #455a64;
}

.file-size {
  font-size: 0.8rem;
  color: #78909c;
  margin: 0.25rem 0 0 0;
}

.remove-file {
  background: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.form-actions {
  text-align: right;
}

.upload-btn {
  background-color: #1976d2;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-btn:hover {
  background-color: #1565c0;
}

.upload-btn:disabled {
  background-color: #cfd8dc;
  cursor: not-allowed;
}

.status-message {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.status-message.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-message.info {
  background-color: #e3f2fd;
  color: #1565c0;
}

.status-message.error {
  background-color: #ffebee;
  color: #c62828;
}

.documents-list {
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.documents-list h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #1976d2;
  font-size: 1.5rem;
}

.documents-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eceff1;
}

th {
  font-weight: 600;
  color: #455a64;
  background-color: #f5f5f5;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.pending {
  background-color: #fff8e1;
  color: #ff8f00;
}

.status-badge.approved {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-badge.rejected {
  background-color: #ffebee;
  color: #c62828;
}

.loading-container {
  text-align: center;
  padding: 2rem 0;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #1976d2;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-documents {
  text-align: center;
  padding: 2rem 0;
  color: #78909c;
}

@media (max-width: 768px) {
  .upload-section, .documents-list {
    padding: 1rem;
  }
  
  th, td {
    padding: 0.5rem;
  }
}
</style> 