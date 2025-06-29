import React, { useState } from "react";
import CartService from "./CartService";

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

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
}) => {
  const cartService = CartService.getInstance();

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

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product.id);
    } else {
      // Default navigation to product microfrontend
      window.open(`http://localhost:3002?id=${product.id}`, "_blank");
    }
  };

  const handleAddToCart = () => {
    cartService.addToCart(product, 1);
    // Still call the optional onAddToCart callback if provided
    if (onAddToCart) {
      onAddToCart(product);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer group flex flex-col h-full">
      {/* Product Image */}
      <div
        className="relative h-48 overflow-hidden flex-shrink-0"
        onClick={handleViewDetails}
      >
        <img
          src={product.picture}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {product.featured && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            ⭐ FEATURED
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">OUT OF STOCK</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category & Team */}
        <div className="flex justify-between items-center mb-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
              product.category
            )}`}
          >
            {product.category}
          </span>
          <span className={`text-xs font-medium ${getTeamColor(product.team)}`}>
            {product.team}
          </span>
        </div>

        {/* Product Name */}
        <h3
          className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-red-600 transition-colors"
          onClick={handleViewDetails}
        >
          {product.name}
        </h3>

        {/* Driver */}
        <p className="text-sm text-gray-600 mb-2 flex items-center">
          <span className="mr-1">🏎️</span>
          {product.driver}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Price & Actions - Always at bottom */}
        <div className="mt-auto">
          <div className="text-2xl font-bold text-gray-900 mb-3">
            ${product.price}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleViewDetails}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              View Details
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={!product.inStock}
              className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                product.inStock
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
