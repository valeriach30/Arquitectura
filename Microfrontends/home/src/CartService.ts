export interface CartItem {
  id: string;
  name: string;
  driver: string;
  team: string;
  category: "Car" | "Merchandise" | "Collectibles" | "Racing Gear";
  price: number;
  picture: string;
  description: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

class CartService {
  private static instance: CartService;
  private cart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  };
  private listeners: Array<(cart: Cart) => void> = [];

  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  constructor() {
    // Load cart from localStorage on initialization
    this.loadCart();
  }

  // Subscribe to cart changes
  subscribe(listener: (cart: Cart) => void): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notify all listeners of cart changes
  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.cart));
  }

  // Load cart from localStorage
  private loadCart() {
    try {
      const savedCart = localStorage.getItem("f1-cart");
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }

  // Save cart to localStorage
  private saveCart() {
    try {
      localStorage.setItem("f1-cart", JSON.stringify(this.cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }

  // Calculate totals
  private calculateTotals() {
    this.cart.totalItems = this.cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    this.cart.totalPrice = this.cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // Add product to cart
  addToCart(product: any, quantity: number = 1): void {
    const existingItemIndex = this.cart.items.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex >= 0) {
      // Product already exists, update quantity
      this.cart.items[existingItemIndex].quantity += quantity;
    } else {
      // New product, add to cart
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        driver: product.driver,
        team: product.team,
        category: product.category,
        price: product.price,
        picture: product.picture,
        description: product.description,
        quantity: quantity,
      };
      this.cart.items.push(cartItem);
    }

    this.calculateTotals();
    this.saveCart();
    this.notifyListeners();
  }

  // Remove product from cart
  removeFromCart(productId: string): void {
    this.cart.items = this.cart.items.filter((item) => item.id !== productId);
    this.calculateTotals();
    this.saveCart();
    this.notifyListeners();
  }

  // Update quantity of item in cart
  updateQuantity(productId: string, quantity: number): void {
    const itemIndex = this.cart.items.findIndex(
      (item) => item.id === productId
    );
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.cart.items[itemIndex].quantity = quantity;
        this.calculateTotals();
        this.saveCart();
        this.notifyListeners();
      }
    }
  }

  // Clear cart
  clearCart(): void {
    this.cart = {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };
    this.saveCart();
    this.notifyListeners();
  }

  // Get current cart
  getCart(): Cart {
    return { ...this.cart };
  }

  // Get cart item count
  getItemCount(): number {
    return this.cart.totalItems;
  }

  // Get cart total price
  getTotalPrice(): number {
    return this.cart.totalPrice;
  }
}

export default CartService;
