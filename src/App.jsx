import { BrowserRouter, Routes, Route } from 'react-router';
import SiteLayout from './components/SiteLayout.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import BookDetail from './pages/BookDetail.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import Cart from './pages/Cart.jsx';
import { CartProvider } from './context/CartContext.jsx';

export default function App() {
  return <CartProvider><BrowserRouter>
    <Routes><Route element={<SiteLayout />}>
      <Route index element={<Home />} />
      <Route path="catalogo" element={<Catalog />} />
      <Route path="categoria/:category" element={<Catalog />} />
      <Route path="libro/:id" element={<BookDetail />} />
      <Route path="nosotros" element={<About />} />
      <Route path="carrito" element={<Cart />} />
      <Route path="*" element={<NotFound />} />
    </Route></Routes>
  </BrowserRouter></CartProvider>;
}
