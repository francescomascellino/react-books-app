# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

```bash
npm create vite @latest .
npm install mobx mobx-react-lite
npm install axios
npm install react-router-dom
```

## Uso di js-cookie

```bash
npm install js-cookie
```

```ts
import axios from 'axios';
import Cookies from 'js-cookie'; // Importare js-cookie

class AuthStore {
  token: string | null = Cookies.get('token') || null;
  userName: string | null = Cookies.get('userName') || null;
  error: string | null = null;

  async login(username: string, password: string) {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username, password });

      console.log(response);

      const token = response.data.access_token;
      this.token = token;

      // Set Cookie. Il token scadrà in 7 giorni
      Cookies.set('token', token, { expires: 7 });
      this.userName = username;

      // Set Cookie. Il token scadrà in 7 giorni
      Cookies.set('userName', this.userName, { expires: 7 });

      console.log('Token from store:', this.token);
      console.log('Username from store:', this.userName);

      this.error = null;

    } catch (error) {
      // Remove Cookie
      Cookies.remove('userName');
      this.userName = null;

      // Remove Cookie
      Cookies.remove('token');
      this.token = null;

      console.error('Login failed:', error);
      this.error = 'Invalid username or password!';
      throw error;
    }
  }

  logout() {
    this.error = null;
    this.token = null;
    this.userName = null;

    // Remove Cookie
    Cookies.remove('token');

    // Remove Cookie
    Cookies.remove('userName');
  }
}

const authStore = new AuthStore();
export default authStore;
```