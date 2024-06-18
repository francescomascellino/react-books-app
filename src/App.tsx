import { useState } from 'react';
import './assets/css/App.css'
import Book from './components/Book'
// import Counter from './components/Counter'
import Navbar from './components/Navbar';
import Login from './components/Login'

function App() {

  const [loginCheck, setLoginCheck] = useState(false);

  return (
    <>

      {/* <Counter /> */}

      <Navbar />
      <Login setLoginCheck={setLoginCheck} loginCheck={loginCheck} />
      <Book loginCheck={loginCheck} />

    </>
  )
}

export default App
