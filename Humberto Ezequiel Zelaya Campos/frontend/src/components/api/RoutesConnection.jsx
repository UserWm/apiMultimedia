import axios from 'axios';

const API_URL = 'http://localhost:3000'; 

export const getAllMusic = async () => {
  try {
    const response = await axios.get(`${API_URL}/music`);
    return response.data;
  } catch (error) {
    console.error("Error fetching music:", error);
    throw error;
  }
};

export const getMusicById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/music/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching music with id ${id}:`, error);
    throw error;
  }
};

export const createMusic = async (musicData, files) => {
  const formData = new FormData();
  formData.append('nameMusic', musicData.nameMusic);
  formData.append('artist', musicData.artist);
  formData.append('musicGenre', musicData.musicGenre);
  formData.append('price', musicData.price);
  formData.append('imagen', files.imagen);
  formData.append('music', files.music);

  try {
    const response = await axios.post(`${API_URL}/music`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating music:", error);
    throw error;
  }
};

export const updateMusic = async (id, musicData, files) => {
  const formData = new FormData();
  formData.append('nameMusic', musicData.nameMusic);
  formData.append('artist', musicData.artist);
  formData.append('musicGenre', musicData.musicGenre);
  formData.append('price', musicData.price);
  if (files.imagen) formData.append('imagen', files.imagen);
  if (files.music) formData.append('music', files.music);

  try {
    const response = await axios.put(`${API_URL}/music/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating music with id ${id}:`, error);
    throw error;
  }
};

export const deleteMusic = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/music/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting music with id ${id}:`, error);
    throw error;
  }
};