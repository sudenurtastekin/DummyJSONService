import { useState } from 'react'
import './App.css'
import Recipes from './routes/Recipes'
import Products from './routes/Products'
import Post from './routes/Post'

function App() {
  const [page, setPage] = useState(<Recipes />);

  return (
    <div className="container">
      <ul className='nav'>
        <li><a href="#" onClick={() => setPage(<Recipes />)}>Recipes</a></li>
        <li><a href="#" onClick={() => setPage(<Products setPage={setPage} />)}>Products</a></li>
        <li><a href="#" onClick={() => setPage(<Post setPage={setPage} />)}>Post</a></li>
      </ul>
      <hr />
      {page}
    </div>
  )
}

export default App