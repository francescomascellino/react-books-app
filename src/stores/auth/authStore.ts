import { action, makeObservable, observable } from "mobx";
import axios from 'axios';

class AuthStore {
  token: string | null = localStorage.getItem('token') || null;
  userName: string | null = localStorage.getItem('userName') || null;
  error: string | null = null;
  loginStatus: boolean = !!localStorage.getItem('token'); // Imposta loginStatus su true se c'è un token in localStorage

  constructor() {
    makeObservable(
      this,
      {
        token: observable,
        userName: observable,
        login: action.bound,
        logout: action.bound,
        loginStatus: observable,
        setLoginStatus: action.bound,
      }
    );
  }

  setLoginStatus(value: boolean) {
    this.loginStatus = value;
    return this.loginStatus
  }

  async login(username: string, password: string) {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username, password });

      console.log(`Username: ${username}, Password: ${password}`);

      const token = response.data.access_token;
      this.token = token;
      localStorage.setItem('token', token);

      this.userName = username;
      localStorage.setItem('userName', this.userName);

      this.error = null;

      this.setLoginStatus(true);

      console.log('Token from store:', this.token);
      console.log('Username from store:', this.userName);
      return Promise.resolve(this.token);
    } catch (error) {
      localStorage.removeItem('userName');
      this.userName = null;
      localStorage.removeItem('token');
      this.token = null;
      this.error = 'Invalid username or password!';
      console.error('Login failed:', error);

      this.setLoginStatus(false);

      // throw error;
      return Promise.reject(error);
    }
  }

  logout() {
    this.error = null;
    this.token = null;
    localStorage.removeItem('token');
    this.userName = null;
    localStorage.removeItem('userName');
    this.setLoginStatus(false);
  }

}

const authStore = new AuthStore();
export default authStore;