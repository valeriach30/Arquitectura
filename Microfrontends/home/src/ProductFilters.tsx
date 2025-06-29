import React, { useState } from "react";

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  category: string;
  team: string;
  featured: boolean;
  inStock: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    team: "",
    featured: false,
    inStock: false,
  });

  const categories = ["Car", "Merchandise", "Collectibles", "Racing Gear"];
  const teams = [
    "Red Bull Racing",
    "Mercedes AMG F1",
    "Scuderia Ferrari",
    "McLaren F1 Team",
    "Alpine F1 Team",
  ];

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | boolean
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: "",
      team: "",
      featured: false,
      inStock: false,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        {/* Category Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Team Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Team</label>
          <select
            value={filters.team}
            onChange={(e) => handleFilterChange("team", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">All Teams</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Filter */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={filters.featured}
            onChange={(e) => handleFilterChange("featured", e.target.checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label
            htmlFor="featured"
            className="ml-2 text-sm font-medium text-gray-700"
          >
            ⭐ Featured Only
          </label>
        </div>

        {/* In Stock Filter */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="inStock"
            checked={filters.inStock}
            onChange={(e) => handleFilterChange("inStock", e.target.checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label
            htmlFor="inStock"
            className="ml-2 text-sm font-medium text-gray-700"
          >
            📦 In Stock Only
          </label>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
