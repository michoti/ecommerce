# Cart Management Module

A comprehensive, framework-agnostic TypeScript cart management module designed for e-commerce applications. This module provides robust cart functionality with features like inventory sync, price validation, discount handling, and data persistence.

## Features

-   ✅ **Framework Independent**: Works with any JavaScript/TypeScript framework
-   ✅ **Type-Safe**: Full TypeScript support with comprehensive type definitions
-   ✅ **State Management**: Built-in Zustand store for reactive state management
-   ✅ **Inventory Sync**: Real-time synchronization with backend inventory
-   ✅ **Price Validation**: Automatic price change detection and handling
-   ✅ **Discount System**: Support for percentage, fixed, and shipping discounts
-   ✅ **Race Condition Protection**: Mutex-based locking for concurrent operations
-   ✅ **Multiple Storage Options**: localStorage, sessionStorage, and IndexedDB support
-   ✅ **Data Persistence**: Session and user-based cart persistence
-   ✅ **Validation**: Comprehensive cart and item validation
-   ✅ **Error Handling**: Detailed error reporting and recovery
-   ✅ **React Hooks**: Ready-to-use React hooks for easy integration
-   ✅ **Event System**: Extensible event system for custom integrations

## Installation

```bash
# Install dependencies
npm install zustand

# The module is designed to be copied into your project
# Copy the entire cart-module folder to your project
```

## Quick Start

### Basic Usage

```typescript
import { CartManager, DEFAULT_CART_CONFIG } from "./cart-module";

// Create cart manager with default configuration
const cartManager = CartManager.create({
	api: {
		baseUrl: "https://your-api-endpoint.com/api/cart",
		apiKey: "your-api-key",
	},
	userId: "user-123", // optional
	sessionId: "session-456", // optional
});

// Add item to cart
await cartManager.addItem("product-123", 2);

// Get current cart
const cart = cartManager.getCart();
console.log(cart);

// Apply discount
await cartManager.applyDiscount("SAVE20");

// Prepare for checkout
const checkoutCart = await cartManager.prepareCheckout();
```

### With React Hooks

```typescript
import { useCart, initializeCartManager } from "./cart-module";

// Initialize cart manager (do this once in your app)
initializeCartManager({
	api: {
		baseUrl: "/api/cart",
		apiKey: process.env.CART_API_KEY,
	},
	userId: currentUser?.id,
	sessionId: sessionId,
});

// Use in components
function CartComponent() {
	const {
		cart,
		itemsCount,
		totals,
		isLoading,
		addItem,
		removeItem,
		updateQuantity,
		applyDiscount,
		clearCart,
	} = useCart();

	const handleAddItem = async () => {
		await addItem("product-123", 1);
	};

	if (isLoading) return <div>Loading cart...</div>;

	return (
		<div>
			<h2>Cart ({itemsCount} items)</h2>
			<div>Total: ${totals?.total.toFixed(2)}</div>

			{cart?.items.map((item) => (
				<div key={item.id}>
					<span>
						{item.name} x {item.quantity}
					</span>
					<button onClick={() => removeItem(item.id)}>Remove</button>
				</div>
			))}

			<button onClick={handleAddItem}>Add Item</button>
			<button onClick={clearCart}>Clear Cart</button>
		</div>
	);
}
```

## Configuration

### Cart Configuration

```typescript
interface CartConfig {
	maxItems: number; // Maximum items in cart
	maxQuantityPerItem: number; // Maximum quantity per item
	sessionTimeout: number; // Session timeout in minutes
	enableInventorySync: boolean; // Enable inventory synchronization
	enablePriceValidation: boolean; // Enable price validation
	taxRate: number; // Tax rate percentage
	currency: string; // Currency code
	defaultShippingCost: number; // Default shipping cost
}
```

### API Configuration

```typescript
interface CartApiConfig {
	baseUrl: string; // API base URL
	apiKey?: string; // Optional API key
	timeout: number; // Request timeout in milliseconds
}
```

### Storage Configuration

```typescript
interface StorageConfig {
	storageType: "localStorage" | "sessionStorage" | "indexedDB";
	keyPrefix: string; // Storage key prefix
	encryptionEnabled: boolean; // Enable data encryption
	compressionEnabled: boolean; // Enable data compression
}
```

## API Reference

### CartManager

The main class that orchestrates all cart operations.

#### Methods

-   `addItem(productId, quantity, variantId?, attributes?)` - Add item to cart
-   `removeItem(itemId)` - Remove item from cart
-   `updateQuantity(itemId, quantity)` - Update item quantity
-   `clearCart()` - Clear entire cart
-   `applyDiscount(code)` - Apply discount code
-   `removeDiscount(discountId)` - Remove discount
-   `selectShipping(option)` - Select shipping option
-   `syncWithServer()` - Sync cart with server
-   `validateCart()` - Validate cart against inventory
-   `prepareCheckout()` - Prepare cart for checkout
-   `mergeCarts(sessionCartId, userCartId)` - Merge carts
-   `getShippingOptions()` - Get available shipping options

#### Events

The CartManager emits various events that you can listen to:

```typescript
cartManager.on("itemAdded", (data) => {
	console.log("Item added:", data);
});

cartManager.on("cartCleared", () => {
	console.log("Cart was cleared");
});

cartManager.on("error", (error) => {
	console.error("Cart error:", error);
});
```

### React Hooks

#### useCart()

Main hook for cart operations.

```typescript
const {
	cart, // Current cart state
	isLoading, // Loading state
	isSubmitting, // Submitting state
	errors, // Current errors
	warnings, // Current warnings
	itemsCount, // Total items count
	isEmpty, // Whether cart is empty
	totals, // Cart totals
	// ... operations
	addItem,
	removeItem,
	updateQuantity,
	// ... etc
} = useCart();
```

#### useCartItem(itemId)

Hook for individual item operations.

```typescript
const {
	item, // Cart item
	increaseQuantity, // Increase quantity by 1
	decreaseQuantity, // Decrease quantity by 1
	setQuantity, // Set specific quantity
	remove, // Remove item
	isSubmitting, // Submitting state
} = useCartItem("item-123");
```

#### useCartTotals()

Hook for cart totals and calculations.

```typescript
const {
	totals, // Raw totals object
	itemCount, // Total item count
	uniqueItemCount, // Unique item count
	subtotalFormatted, // Formatted subtotal string
	totalFormatted, // Formatted total string
	hasSavings, // Whether there are savings
	hasDiscount, // Whether discount is applied
	freeShipping, // Whether shipping is free
} = useCartTotals();
```

#### useCartValidation()

Hook for cart validation.

```typescript
const {
	validate, // Validate cart function
	isValidating, // Validation state
	hasValidationErrors, // Whether there are errors
	stockErrors, // Stock-related errors
	priceErrors, // Price-related errors
	availabilityErrors, // Availability errors
	discountErrors, // Discount errors
	clearAllErrors, // Clear all errors
} = useCartValidation();
```

#### useCartDiscounts()

Hook for discount management.

```typescript
const {
	discountCode, // Current discount code input
	setDiscountCode, // Set discount code
	appliedDiscounts, // Applied discounts array
	hasDiscounts, // Whether discounts are applied
	totalDiscount, // Total discount amount
	applyCode, // Apply discount function
	removeCode, // Remove discount function
	isApplying, // Applying state
	discountErrors, // Discount-related errors
} = useCartDiscounts();
```

#### useCartShipping()

Hook for shipping management.

```typescript
const {
	shippingOptions, // Available shipping options
	selectedShipping, // Selected shipping option
	shippingCost, // Current shipping cost
	freeShipping, // Whether shipping is free
	loadShippingOptions, // Load options function
	selectOption, // Select option function
	isLoadingOptions, // Loading state
} = useCartShipping();
```

#### useCartCheckout()

Hook for checkout preparation.

```typescript
const {
	canCheckout, // Whether checkout is possible
	prepare, // Prepare checkout function
	isPreparingCheckout, // Preparation state
	checkoutErrors, // Checkout-related errors
	checkoutData, // Prepared checkout data
} = useCartCheckout();
```

## Advanced Usage

### Custom Validation

```typescript
import { CartValidationService } from "./cart-module";

const validationService = new CartValidationService(cartConfig);

// Custom validation logic
const customValidation = async (cart, inventory) => {
	const errors = await validationService.validateCart(cart, inventory);

	// Add custom validation
	if (cart.items.some((item) => item.price > 1000)) {
		errors.push({
			type: "PRICE_CHANGED",
			message: "High-value items require special handling",
		});
	}

	return errors;
};
```

### Custom Storage

```typescript
import { CartStorageService } from "./cart-module";

const storageService = new CartStorageService({
	storageType: "indexedDB",
	keyPrefix: "myapp_cart_",
	encryptionEnabled: true,
	compressionEnabled: true,
});

// Custom storage operations
await storageService.saveCart(cart);
const loadedCart = await storageService.loadCart(cartId);
```

### Event Handling

```typescript
const cartManager = CartManager.create(config);

// Listen to specific events
cartManager.on("itemAdded", ({ productId, quantity }) => {
	analytics.track("Item Added to Cart", {
		product_id: productId,
		quantity: quantity,
	});
});

cartManager.on("checkoutPrepared", ({ cart }) => {
	analytics.track("Checkout Started", {
		cart_value: cart.totals.total,
		item_count: cart.items.length,
	});
});

cartManager.on("error", (error) => {
	errorReporting.captureException(error);
});
```

### Race Condition Handling

The module automatically handles race conditions using mutex locks:

```typescript
// These operations are automatically serialized
await Promise.all([
	cartManager.addItem("product-1", 1),
	cartManager.addItem("product-2", 2),
	cartManager.updateQuantity("item-1", 5),
]);
```

### Inventory Synchronization

```typescript
// Manual sync
const syncResult = await cartManager.syncWithServer();

if (!syncResult.success) {
	console.log("Sync errors:", syncResult.errors);
	console.log("Sync warnings:", syncResult.warnings);
}

// Auto-sync is enabled by default and runs every minute
// Disable with autoSync: false in config
```

## Error Handling

The module provides comprehensive error handling:

```typescript
const { errors, hasErrors, clearErrors } = useCart();

// Handle different error types
errors.forEach((error) => {
	switch (error.type) {
		case "INSUFFICIENT_STOCK":
			showNotification(`Only ${error.expectedValue} items available`);
			break;
		case "PRICE_CHANGED":
			showPriceChangeDialog(error);
			break;
		case "PRODUCT_UNAVAILABLE":
			showProductUnavailableMessage(error);
			break;
		case "DISCOUNT_INVALID":
			showDiscountErrorMessage(error);
			break;
	}
});

// Clear errors when handled
clearErrors();
```

## Best Practices

### 1. Initialize Once

Initialize the cart manager once in your application:

```typescript
// app.ts or main.ts
import { initializeCartManager } from "./cart-module";

initializeCartManager({
	api: { baseUrl: process.env.CART_API_URL },
	userId: getCurrentUser()?.id,
	sessionId: getSessionId(),
});
```

### 2. Handle Errors Gracefully

Always handle errors in cart operations:

```typescript
const handleAddToCart = async (productId: string, quantity: number) => {
	try {
		await addItem(productId, quantity);
		showSuccessMessage("Item added to cart");
	} catch (error) {
		showErrorMessage("Failed to add item to cart");
		console.error(error);
	}
};
```

### 3. Validate Before Checkout

Always validate the cart before proceeding to checkout:

```typescript
const handleCheckout = async () => {
	const errors = await validateCart();

	if (errors.length > 0) {
		showValidationErrors(errors);
		return;
	}

	const checkoutCart = await prepareCheckout();
	navigateToCheckout(checkoutCart);
};
```

### 4. Monitor Performance

Monitor cart operations for performance:

```typescript
cartManager.on("itemAdded", ({ productId, quantity }) => {
	performance.mark("cart-item-added");
	analytics.track("Cart Item Added", { productId, quantity });
});
```

### 5. Clean Up Resources

Clean up the cart manager when your application unmounts:

```typescript
// In React
useEffect(() => {
	return () => {
		cartManager.destroy();
	};
}, []);
```

## Troubleshooting

### Common Issues

1. **Cart not persisting**: Check storage configuration and browser support
2. **API errors**: Verify API endpoints and authentication
3. **Validation failures**: Check inventory sync and price validation settings
4. **Race conditions**: The module handles these automatically, but ensure you're not bypassing the CartManager

### Debug Mode

Enable debug logging:

```typescript
const cartManager = CartManager.create({
	...config,
	debug: true, // Enable debug logging
});
```

## Contributing

This module is designed to be copied and customized for your specific needs. Feel free to modify the code to fit your requirements.

## License

This module is provided as-is for educational and commercial use.
