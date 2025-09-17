import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import './style/design-system.css'
// import './style/modern-components.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {CartProvider} from "./store/CartContext.jsx";
import {WishlistProvider} from "./store/WishlistContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <WishlistProvider>
          <CartProvider>
              <App />
          </CartProvider>
      </WishlistProvider>
  </StrictMode>,
)
