import api from './api';

export const uploadResumeFile = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export const analyzeResumeText = async (fileName, extractedText) => {
  const response = await api.post('/resume/analyze', { fileName, extractedText });
  return response.data;
};

export const getHistoryList = async () => {
  const response = await api.get('/resume/history');
  return response.data;
};

export const getAnalysisDetails = async (id) => {
  const response = await api.get(`/resume/${id}`);
  return response.data;
};

export const deleteAnalysisItem = async (id) => {
  const response = await api.delete(`/resume/${id}`);
  return response.data;
};
