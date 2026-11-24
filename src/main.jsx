import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import './index.css'
import { SiteProvider } from './lib/site'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SiteProvider><MotionConfig reducedMotion="user"><App /></MotionConfig></SiteProvider>
    </BrowserRouter>
  </React.StrictMode>
)
