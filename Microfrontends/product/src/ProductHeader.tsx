import React, { useState, useEffect } from "react";
// @ts-ignore
import CartService, { Cart } from "home/CartService";

const ProductHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });
  const [cartService] = useState(() => CartService.getInstance());

  useEffect(() => {
    // Load initial cart
    setCart(cartService.getCart());

    // Subscribe to cart changes
    const unsubscribe = cartService.subscribe((updatedCart: Cart) => {
      setCart(updatedCart);
    });

    return unsubscribe;
  }, [cartService]);

  const handleCartClick = () => {
    // Navigate to cart page in home microfrontend
    window.location.href = "http://localhost:3000/cart";
  };

  const handleLogoClick = () => {
    // Navigate to home page
    window.location.href = "http://localhost:3000";
  };

  const navigationItems = [
    { label: "Home", href: "http://localhost:3000" },
    { label: "Cars & Models", href: "http://localhost:3000#cars" },
    { label: "Team Merchandise", href: "http://localhost:3000#merchandise" },
    { label: "Collectibles", href: "http://localhost:3000#collectibles" },
    { label: "Racing Gear", href: "http://localhost:3000#gear" },
    { label: "About", href: "http://localhost:3000#about" },
  ];

  return (
    <header className="bg-black shadow-lg sticky top-0 z-50 border-b-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={handleLogoClick}
              className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-white rounded-full mr-3 flex items-center justify-center">
                <span className="bg-white font-bold text-sm">🏎️</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                F1<span className="text-red-600">Store</span>
              </h1>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-900"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Cart and CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleCartClick}
              className="relative text-gray-300 hover:text-red-500 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 8.32a2 2 0 001.97 2.68h9.42a2 2 0 001.97-2.68L16 13"
                />
              </svg>
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {cart.totalItems}
                </span>
              )}
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-lg">
              Shop Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={handleCartClick}
              className="text-gray-300 hover:text-red-500 transition-colors duration-200 relative"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 8.32a2 2 0 001.97 2.68h9.42a2 2 0 001.97-2.68L16 13"
                />
              </svg>
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {cart.totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-red-500 focus:outline-none focus:text-red-500"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-800">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-red-500 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Shop Now
                </button>
                <button
                  onClick={() => {
                    handleCartClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 8.32a2 2 0 001.97 2.68h9.42a2 2 0 001.97-2.68L16 13"
                    />
                  </svg>
                  Carrito ({cart.totalItems})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ProductHeader;
