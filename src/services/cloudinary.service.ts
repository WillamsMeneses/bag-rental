import { api } from './api';

export const cloudinaryService = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ data: { url: string } }>('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data.url;
  },

  uploadImages: async (files: File[]): Promise<string[]> => {
    return Promise.all(files.map((f) => cloudinaryService.uploadImage(f)));
  },
};