import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'; // Import the Provider component
import store  from './redux/store.js'; // Import your configured Redux store

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Provider store={store}> {/* Wrap App with Provider and pass the Redux store */}
      <App />
    </Provider>
  </StrictMode>,
)
