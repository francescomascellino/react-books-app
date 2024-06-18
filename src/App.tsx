import { useState } from 'react';
import './App.css'
import Book from './components/Book'
// import Counter from './components/Counter'
import Login from './components/Login'

function App() {

  const [loginCheck, setLoginCheck] = useState(false);

  return (
    <>

      {/* <Counter /> */}

      <Login setLoginCheck={setLoginCheck} loginCheck={loginCheck} />
      <Book loginCheck={loginCheck} />

    </>
  )
}

export default App
