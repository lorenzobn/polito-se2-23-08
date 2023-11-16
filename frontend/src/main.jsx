import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { StoreProvider } from './core/store/Provider.jsx'
import store from './core/store/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <App/>
    </StoreProvider>
  </React.StrictMode>,
)
