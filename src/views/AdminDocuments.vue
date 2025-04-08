<template>
  <div class="admin-documents-container">
    <h1>Document Management</h1>
    <p class="description">Review and manage student uploaded documents</p>

    <!-- Filter Controls -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label for="statusFilter">Filter by Status</label>
          <select id="statusFilter" v-model="filters.status">
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="typeFilter">Filter by Type</label>
          <select id="typeFilter" v-model="filters.type">
            <option value="all">All Types</option>
            <option value="Resume">Resume</option>
            <option value="Transcript">Transcript</option>
            <option value="Certificate">Certificate</option>
            <option value="Letter">Recommendation Letter</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="searchFilter">Search</label>
          <input 
            type="text" 
            id="searchFilter" 
            v-model="filters.search" 
            placeholder="Search by student name or description"
          />
        </div>
      </div>
    </div>

    <!-- Status Message -->
    <div v-if="message" :class="['status-message', messageType]">
      {{ message }}
    </div>

    <!-- Documents List -->
    <div class="documents-section">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading documents...</p>
      </div>

      <div v-else-if="filteredDocuments.length === 0" class="no-documents">
        <p>No documents match your filter criteria.</p>
      </div>

      <div v-else class="documents-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Document Type</th>
              <th>File Name</th>
              <th>Description</th>
              <th>Upload Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in filteredDocuments" :key="doc.id">
              <td>{{ doc.studentName || `Student #${doc.studentId}` }}</td>
              <td>{{ doc.documentType }}</td>
              <td>
                <a :href="doc.fileUrl" target="_blank" class="file-link">
                  {{ doc.fileName }}
                </a>
              </td>
              <td>{{ doc.description }}</td>
              <td>{{ formatDate(doc.uploadDate) }}</td>
              <td>
                <span :class="['status-badge', doc.status.toLowerCase()]">
                  {{ doc.status }}
                </span>
              </td>
              <td class="actions-cell">
                <button 
                  v-if="doc.status === 'Pending'"
                  @click="approveDocument(doc.id)" 
                  class="action-btn approve"
                  :disabled="processing"
                >
                  Approve
                </button>
                <button 
                  v-if="doc.status === 'Pending'"
                  @click="rejectDocument(doc.id)" 
                  class="action-btn reject"
                  :disabled="processing"
                >
                  Reject
                </button>
                <span v-else class="status-message">Already processed</span>
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
import documentServices, { getDocuments } from '../services/documentServices';
import Utils from '../config/utils';

// State
const documents = ref([]);
const loading = ref(true);
const processing = ref(false);
const message = ref('');
const messageType = ref('');

const filters = ref({
  status: 'all',
  type: 'all',
  search: ''
});

// Computed
const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    // Status filter
    if (filters.value.status !== 'all' && doc.status !== filters.value.status) {
      return false;
    }
    
    // Type filter
    if (filters.value.type !== 'all' && doc.documentType !== filters.value.type) {
      return false;
    }
    
    // Search filter
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase();
      const searchFields = [
        doc.studentName || '',
        doc.description || '',
        doc.fileName || ''
      ];
      
      return searchFields.some(field => field.toLowerCase().includes(searchTerm));
    }
    
    return true;
  });
});

// Methods
const fetchDocuments = async () => {
  loading.value = true;
  try {
    const response = await getDocuments();
    if (response && response.documents) {
      documents.value = response.documents;
    } else {
      // If no documents from API, use mock data for testing
      documents.value = [
        { id: '1', title: 'Mock Transcript', type: 'transcript', status: 'pending', createdAt: new Date().toISOString() },
        { id: '2', title: 'Mock Certificate', type: 'certificate', status: 'approved', createdAt: new Date().toISOString() },
        { id: '3', title: 'Mock Resume', type: 'resume', status: 'rejected', createdAt: new Date().toISOString() }
      ];
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    message.value = 'Failed to load documents. Using mock data.';
    messageType.value = 'error';
    
    // Use mock data on error
    documents.value = [
      { id: '1', title: 'Mock Transcript', type: 'transcript', status: 'pending', createdAt: new Date().toISOString() },
      { id: '2', title: 'Mock Certificate', type: 'certificate', status: 'approved', createdAt: new Date().toISOString() },
      { id: '3', title: 'Mock Resume', type: 'resume', status: 'rejected', createdAt: new Date().toISOString() }
    ];
  } finally {
    loading.value = false;
  }
};

const approveDocument = async (documentId) => {
  await updateDocumentStatus(documentId, 'Approved');
};

const rejectDocument = async (documentId) => {
  await updateDocumentStatus(documentId, 'Rejected');
};

const updateDocumentStatus = async (documentId, status) => {
  processing.value = true;
  message.value = '';
  
  try {
    await documentServices.updateDocumentStatus(documentId, status);
    
    // Update the local document status
    const docIndex = documents.value.findIndex(d => d.id === documentId);
    if (docIndex !== -1) {
      documents.value[docIndex].status = status;
    }
    
    message.value = `Document ${status.toLowerCase()} successfully.`;
    messageType.value = 'success';
  } catch (error) {
    console.error(`Error updating document status:`, error);
    message.value = `Failed to ${status.toLowerCase()} document. Please try again.`;
    messageType.value = 'error';
  } finally {
    processing.value = false;
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

// Lifecycle hooks
onMounted(() => {
  // Temporarily disabled admin check for testing
  // const user = Utils.getStore("user");
  // if (!user || user.role !== 'admin') {
  //   message.value = 'You must be an administrator to access this page.';
  //   messageType.value = 'error';
  //   return;
  // }
  
  // Display testing message if no user
  const user = Utils.getStore("user");
  if (!user) {
    message.value = "You are viewing the Admin Documents page in test mode";
    messageType.value = "info";
  }
  
  fetchDocuments();
});
</script>

<style scoped>
.admin-documents-container {
  max-width: 1200px;
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

.filter-section {
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #455a64;
}

.filter-group input,
.filter-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cfd8dc;
  border-radius: 4px;
  font-size: 1rem;
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

.status-message.error {
  background-color: #ffebee;
  color: #c62828;
}

.documents-section {
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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

.file-link {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
}

.file-link:hover {
  text-decoration: underline;
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

.actions-cell {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-btn.approve {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.action-btn.approve:hover {
  background-color: #c8e6c9;
}

.action-btn.reject {
  background-color: #ffebee;
  color: #c62828;
}

.action-btn.reject:hover {
  background-color: #ffcdd2;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  .filter-group {
    min-width: 100%;
  }
  
  .documents-section {
    padding: 1rem;
  }
  
  th, td {
    padding: 0.5rem;
  }
  
  .actions-cell {
    flex-direction: column;
  }
}
</style> 