import axios, { AxiosResponse } from 'axios';

class TutorService {
  async uploadCertifications(obj: FormData): Promise<any>{
    try {
      const response: AxiosResponse = await axios.post("http://localhost:8000/api/upload_certification", obj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error; 
    }
  }

  async getCertifications(id: number):Promise<any>{
    try {
      const response: AxiosResponse = await axios.get("http://localhost:8000/api/view_certifications/" + id);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error; 
    }
  }
}

export default new TutorService();