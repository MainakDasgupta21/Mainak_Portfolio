import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'lenis/dist/lenis.css'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import PortfolioContextProvider from './context/PortfolioContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <PortfolioContextProvider>
      <App />
    </PortfolioContextProvider>
  </BrowserRouter>,
)
