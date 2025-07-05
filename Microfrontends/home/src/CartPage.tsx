import React, { useState, useEffect } from "react";
import CartService, { Cart, CartItem } from "./CartService";

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });
  const cartService = CartService.getInstance();

  useEffect(() => {
    // Load initial cart
    const initialCart = cartService.getCart();
    setCart(initialCart);

    // Subscribe to cart changes
    const unsubscribe = cartService.subscribe((updatedCart: Cart) => {
      setCart(updatedCart);
    });

    return unsubscribe;
  }, [cartService]);

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    cartService.updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    cartService.removeFromCart(productId);
  };

  const handleClearCart = () => {
    if (window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      cartService.clearCart();
    }
  };

  const handleCheckout = () => {
    alert(`¡Gracias por tu compra! Total: $${cart.totalPrice.toFixed(2)} 🏁`);
    cartService.clearCart();
  };

  const getTeamColor = (team: string) => {
    if (team.includes("Red Bull")) return "text-blue-600";
    if (team.includes("Ferrari")) return "text-red-600";
    if (team.includes("Mercedes")) return "text-cyan-600";
    if (team.includes("McLaren")) return "text-orange-600";
    if (team.includes("Alpine")) return "text-pink-600";
    if (team.includes("Aston Martin")) return "text-green-600";
    if (team.includes("Haas")) return "text-gray-600";
    if (team.includes("Williams")) return "text-blue-400";
    if (team.includes("AlphaTauri")) return "text-indigo-600";
    if (team.includes("Formula 1")) return "text-purple-600";
    return "text-gray-600";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Car":
        return "bg-red-100 text-red-800";
      case "Merchandise":
        return "bg-blue-100 text-blue-800";
      case "Collectibles":
        return "bg-purple-100 text-purple-800";
      case "Racing Gear":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 mb-8">
            ¡Agrega algunos productos increíbles de F1!
          </p>
          <button
            onClick={() => (window.location.href = "http://localhost:3000")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🛒 Mi Carrito F1</h1>
        <button
          onClick={() => (window.location.href = "http://localhost:3000")}
          className="text-gray-600 hover:text-red-600 transition-colors"
        >
          ← Continuar Comprando
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Cart Items */}
        <div className="lg:col-span-7">
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-4 py-6 sm:px-6">
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-gray-200">
                  {cart.items.map((item: CartItem) => (
                    <li key={item.id} className="py-6 flex">
                      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                        <img
                          src={item.picture}
                          alt={item.name}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>

                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                item.category
                              )}`}
                            >
                              {item.category}
                            </span>
                            <span
                              className={`text-sm ${getTeamColor(item.team)}`}
                            >
                              {item.team}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-gray-600 flex items-center">
                            <span className="mr-1">🏎️</span>
                            {item.driver}
                          </p>
                        </div>

                        <div className="flex-1 flex items-end justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <label
                              htmlFor={`quantity-${item.id}`}
                              className="text-gray-600"
                            >
                              Cantidad:
                            </label>
                            <select
                              id={`quantity-${item.id}`}
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateQuantity(
                                  item.id,
                                  parseInt(e.target.value)
                                )
                              }
                              className="border border-gray-300 rounded px-2 py-1"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                            <span className="text-gray-600">
                              × ${item.price}
                            </span>
                          </div>

                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="font-medium text-red-600 hover:text-red-500"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
          <h2 className="text-lg font-medium text-gray-900">
            Resumen del Pedido
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-base font-medium text-gray-900">
                Subtotal ({cart.totalItems} productos)
              </dt>
              <dd className="text-base font-medium text-gray-900">
                ${cart.totalPrice.toFixed(2)}
              </dd>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900">Envío</dt>
              <dd className="text-base font-medium text-gray-900">Gratis 🚚</dd>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-lg font-bold text-gray-900">Total</dt>
              <dd className="text-lg font-bold text-gray-900">
                ${cart.totalPrice.toFixed(2)}
              </dd>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleCheckout}
              className="w-full bg-red-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Proceder al Checkout 🏁
            </button>

            <button
              onClick={handleClearCart}
              className="w-full bg-gray-200 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Vaciar Carrito
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Envío gratuito en todos los pedidos 🏎️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
