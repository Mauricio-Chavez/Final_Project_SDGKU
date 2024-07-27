import axios, { AxiosResponse } from 'axios';
import useGlobalState from '../../context/GlobalState';

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

  async getCertifications(): Promise<any>{
    try {
      const { user } = useGlobalState.getState();
      console.log('user', user);
      if (!user || !user.id) {
        throw new Error('User is not logged in or missing user ID');
      }
      const response: AxiosResponse = await axios.get(`http://localhost:8000/api/view_certifications/${user.id}`);
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

  async getBookings(): Promise<any>{
    try {
      const { user } = useGlobalState.getState();
      console.log('user', user);
      if (!user || !user.id) {
        throw new Error('User is not logged in or missing user ID');
      }
      const response: AxiosResponse = await axios.get(`http://localhost:8000/api/meetings/${user.id}`);
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

  async createBooking(obj: any): Promise<any>{
    try {
      const response: AxiosResponse = await axios.post("http://localhost:8000/api/google-calendar/create-event", obj, {
        headers: {
          'Content-Type': 'application/json'
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
}

export default new TutorService();