import { action, makeObservable, observable } from "mobx";
import axios from 'axios';

class AuthStore {
  token: string | null = localStorage.getItem('token') || null;
  userName: string | null = localStorage.getItem('userName') || null;
  error: string | null = null;

  constructor() {
    makeObservable(this, {
      token: observable,
      userName: observable,
      login: action,
      logout: action,
    });
  }

  async login(username: string, password: string) {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username, password });

      console.log(response);

      const token = response.data.access_token;
      this.token = token;
      localStorage.setItem('token', token);


      this.userName = username;
      localStorage.setItem('userName', this.userName);

      console.log('Token from store:', this.token);
      console.log('Username from store:', this.userName);

      this.error = null;

    } catch (error) {
      localStorage.removeItem('userName');
      this.userName = null;
      localStorage.removeItem('token');
      this.token = null;
      console.error('Login failed:', error);
      this.error = 'Invalid username or password!';
      throw error;
    }
  }

  logout() {
    this.error = null;
    this.token = null;
    localStorage.removeItem('token');
    this.userName = null;
    localStorage.removeItem('userName');
  }

}

const authStore = new AuthStore();
export default authStore;