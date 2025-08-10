import { AuthProvider } from '../auth/auth-context';
import { CartProvider } from '../cart/cart-context'; // Import the new CartProvider
import Header from '../components/Header';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider> {/* Add the CartProvider here */}
            <Header />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
