import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { Product, CreateProductRequest, UpdateProductRequest } from "./types";
import { products as initialProducts } from "./products";

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with real database in production)
let products: Product[] = [...initialProducts];

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "F1 Products API",
    version: "1.0.0",
    endpoints: {
      "GET /products": "Get all products",
      "GET /products/:id": "Get product by ID",
      "GET /products/category/:category": "Get products by category",
      "GET /products/team/:team": "Get products by team",
      "GET /products/featured": "Get featured products",
      "POST /products": "Create new product",
      "PUT /products/:id": "Update product",
      "DELETE /products/:id": "Delete product",
    },
  });
});

// GET all products with optional filters
app.get("/products", (req, res) => {
  const { category, team, driver, inStock, featured, minPrice, maxPrice } =
    req.query;

  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === (category as string).toLowerCase()
    );
  }

  if (team) {
    filteredProducts = filteredProducts.filter((p) =>
      p.team.toLowerCase().includes((team as string).toLowerCase())
    );
  }

  if (driver) {
    filteredProducts = filteredProducts.filter((p) =>
      p.driver.toLowerCase().includes((driver as string).toLowerCase())
    );
  }

  if (inStock !== undefined) {
    filteredProducts = filteredProducts.filter(
      (p) => p.inStock === (inStock === "true")
    );
  }

  if (featured !== undefined) {
    filteredProducts = filteredProducts.filter(
      (p) => p.featured === (featured === "true")
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= parseFloat(minPrice as string)
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= parseFloat(maxPrice as string)
    );
  }

  res.json({
    products: filteredProducts,
    total: filteredProducts.length,
    filters: { category, team, driver, inStock, featured, minPrice, maxPrice },
  });
});

// GET product by ID
app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

// GET products by category
app.get("/products/category/:category", (req, res) => {
  const { category } = req.params;
  const filteredProducts = products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );

  res.json({
    products: filteredProducts,
    total: filteredProducts.length,
    category: category,
  });
});

// GET products by team
app.get("/products/team/:team", (req, res) => {
  const { team } = req.params;
  const filteredProducts = products.filter((p) =>
    p.team.toLowerCase().includes(team.toLowerCase())
  );

  res.json({
    products: filteredProducts,
    total: filteredProducts.length,
    team: team,
  });
});

// GET featured products
app.get("/products/featured", (req, res) => {
  const featuredProducts = products.filter((p) => p.featured);

  res.json({
    products: featuredProducts,
    total: featuredProducts.length,
  });
});

// POST create new product
app.post("/products", (req, res) => {
  const productData: CreateProductRequest = req.body;

  // Basic validation
  if (
    !productData.name ||
    !productData.driver ||
    !productData.team ||
    !productData.category ||
    !productData.price ||
    !productData.picture
  ) {
    return res.status(400).json({
      error:
        "Missing required fields: name, driver, team, category, price, picture",
    });
  }

  const newProduct: Product = {
    id: uuidv4(),
    name: productData.name,
    driver: productData.driver,
    team: productData.team,
    category: productData.category,
    price: productData.price,
    picture: productData.picture,
    description: productData.description || "",
    inStock: productData.inStock ?? true,
    featured: productData.featured ?? false,
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

// PUT update product
app.put("/products/:id", (req, res) => {
  const productIndex = products.findIndex((p) => p.id === req.params.id);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const updateData: UpdateProductRequest = req.body;
  const updatedProduct = { ...products[productIndex], ...updateData };

  products[productIndex] = updatedProduct;

  res.json(updatedProduct);
});

// DELETE product
app.delete("/products/:id", (req, res) => {
  const productIndex = products.findIndex((p) => p.id === req.params.id);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];

  res.json({
    message: "Product deleted successfully",
    product: deletedProduct,
  });
});

// GET product statistics
app.get("/stats", (req, res) => {
  const stats = {
    totalProducts: products.length,
    inStockProducts: products.filter((p) => p.inStock).length,
    featuredProducts: products.filter((p) => p.featured).length,
    categoryCounts: {
      Car: products.filter((p) => p.category === "Car").length,
      Merchandise: products.filter((p) => p.category === "Merchandise").length,
      Collectibles: products.filter((p) => p.category === "Collectibles")
        .length,
      "Racing Gear": products.filter((p) => p.category === "Racing Gear")
        .length,
    },
    averagePrice:
      products.reduce((sum, p) => sum + p.price, 0) / products.length,
    priceRange: {
      min: Math.min(...products.map((p) => p.price)),
      max: Math.max(...products.map((p) => p.price)),
    },
  };

  res.json(stats);
});

app.listen(port, () => {
  console.log(
    `🏎️  F1 Products API server listening at http://localhost:${port}`
  );
  console.log(`📊 API Documentation available at http://localhost:${port}`);
});
