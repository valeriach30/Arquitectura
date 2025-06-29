import React, { useState, useEffect } from "react";
// @ts-ignore
import CartService from "home/CartService";

export interface Product {
  id: string;
  name: string;
  driver: string;
  team: string;
  category: "Car" | "Merchandise" | "Collectibles" | "Racing Gear";
  price: number;
  picture: string;
  description: string;
  inStock: boolean;
  featured: boolean;
}

interface ProductDetailProps {
  productId?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartService] = useState(() => CartService.getInstance());

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    } else {
      // Try to get product ID from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const idFromUrl = urlParams.get("id");
      if (idFromUrl) {
        fetchProduct(idFromUrl);
      } else {
        setError("No product ID provided");
        setLoading(false);
      }
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:8080/products/${id}`);

      if (!response.ok) {
        throw new Error(`Product not found (${response.status})`);
      }

      const productData = await response.json();
      setProduct(productData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch product");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
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

  const handleAddToCart = () => {
    if (product) {
      try {
        cartService.addToCart(product, quantity);

        // Show success message
        const cartInfo = cartService.getCart();
        alert(
          `¡${quantity} x ${product.name} agregado al carrito! 🛒\nTotal en carrito: ${cartInfo.totalItems} productos`
        );

        // Reset quantity to 1 after adding
        setQuantity(1);
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert(`Error al agregar al carrito. Intenta de nuevo.`);
      }
    }
  };

  const handleBackToProducts = () => {
    window.location.href = "http://localhost:3000"; // Navigate back to home
  };

  const handleGoToCart = () => {
    window.location.href = "http://localhost:3000/cart"; // Navigate to cart page
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-600 text-lg mb-4">⚠️ {error}</div>
          <button
            onClick={handleBackToProducts}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-gray-600 text-lg">Product not found</div>
          <button
            onClick={handleBackToProducts}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={handleBackToProducts}
        className="mb-6 flex items-center text-gray-600 hover:text-red-600 transition-colors"
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
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Products
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <img
              src={product.picture}
              alt={product.name}
              className="w-full h-96 md:h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-8">
            {/* Category & Team */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                  product.category
                )}`}
              >
                {product.category}
              </span>
              {product.featured && (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  ⭐ FEATURED
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* Team */}
            <p
              className={`text-lg font-semibold mb-2 ${getTeamColor(
                product.team
              )}`}
            >
              {product.team}
            </p>

            {/* Driver */}
            <p className="text-gray-600 mb-4 flex items-center">
              <span className="mr-2 text-lg">🏎️</span>
              <span className="font-medium">{product.driver}</span>
            </p>

            {/* Description */}
            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="text-4xl font-bold text-gray-900 mb-6">
              ${product.price}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity Selector & Add to Cart */}
            {product.inStock && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <label
                      htmlFor="quantity"
                      className="mr-3 text-sm font-medium text-gray-700"
                    >
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </button>
                </div>

                {/* Go to Cart Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleGoToCart}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors duration-200 border border-gray-300"
                  >
                    🛒 Ver Carrito
                  </button>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Product Details
              </h3>
              <dl className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Category:</dt>
                  <dd className="font-medium">{product.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Team:</dt>
                  <dd className="font-medium">{product.team}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Driver:</dt>
                  <dd className="font-medium">{product.driver}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Product ID:</dt>
                  <dd className="font-mono text-xs">{product.id}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
