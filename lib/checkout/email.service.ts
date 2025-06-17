import { Resend } from 'resend';
import { Order } from './types';

// Initialize Resend with environment variable validation
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration constants
const EMAIL_CONFIG = {
  FROM: process.env.FROM_EMAIL || 'no-reply@yourdomain.com',
  FALLBACK_TO: 'customer@yourdomain.com',
} as const;

/**
 * Generates HTML template for order confirmation email
 */
const generateOrderEmailTemplate = (order: Order): string => {
  const formatCurrency = (amount: number): string => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);

  const orderItemsHtml = order.orderItems
    .map(item => 
      `<li>${item.quantity} x ${item.productName || `Item ${item.productId}`} - ${formatCurrency(item.price)}</li>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .order-details { background-color: #fff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
          .total { font-size: 1.2em; font-weight: bold; color: #28a745; }
          ul { padding-left: 20px; }
          li { margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Thank You for Your Order!</h1>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p class="total"><strong>Total:</strong> ${formatCurrency(order.total)}</p>
        </div>
        
        <div class="order-details">
          <h2>Shipping Address</h2>
          <p>
            ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.zipCode}
          </p>
        </div>
        
        <div class="order-details">
          <h2>Order Items</h2>
          <ul>
            ${orderItemsHtml}
          </ul>
        </div>
        
        <p style="margin-top: 30px; color: #666; font-size: 0.9em;">
          If you have any questions about your order, please contact our customer support.
        </p>
      </body>
    </html>
  `;
};

/**
 * Validates order data before sending email
 */
const validateOrder = (order: Order): void => {
  if (!order.id) throw new Error('Order ID is required');
  if (!order.shippingAddress?.email) throw new Error('Customer email is required');
  if (!order.orderItems?.length) throw new Error('Order must contain at least one item');
};

/**
 * Sends order confirmation email to customer
 * @param order - The order object containing customer and order details
 * @throws {Error} When email sending fails or validation errors occur
 */
export const sendOrderConfirmationEmail = async (order: Order): Promise<void> => {
  try {
    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not configured');
    }

    // Validate order data
    validateOrder(order);

    const emailData = {
      from: EMAIL_CONFIG.FROM,
      to: order.shippingAddress.email,
      subject: `Order Confirmation #${order.id}`,
      html: generateOrderEmailTemplate(order),
      // Add text version for better email client compatibility
      text: `
        Thank You for Your Order!
        
        Order ID: ${order.id}
        Status: ${order.status}
        Total: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.total)}
        
        Shipping Address:
        ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
        ${order.shippingAddress.address}
        ${order.shippingAddress.city}, ${order.shippingAddress.zipCode}
        
        Order Items:
        ${order.orderItems.map(item => `- ${item.quantity} x ${item.productName || `Item ${item.productId}`} - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)}`).join('\n')}
      `.trim(),
    };

    const result = await resend.emails.send(emailData);
    
    // Log successful email send (optional - remove in production if not needed)
    console.log(`Order confirmation email sent successfully for order ${order.id}:`, result.data?.id);
    
  } catch (error) {
    // Enhanced error logging with more context
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Failed to send order confirmation email for order ${order?.id || 'unknown'}:`, {
      error: errorMessage,
      orderId: order?.id,
      customerEmail: order?.shippingAddress?.email,
      timestamp: new Date().toISOString(),
    });
    
    // Re-throw the error to allow calling code to handle it
    throw new Error(`Email service error: ${errorMessage}`);
  }
};

/**
 * Alternative function for sending order confirmation with retry logic
 * @param order - The order object
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 */
export const sendOrderConfirmationEmailWithRetry = async (
  order: Order, 
  maxRetries: number = 3
): Promise<void> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sendOrderConfirmationEmail(order);
      return; // Success - exit the function
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxRetries) {
        console.error(`Failed to send email after ${maxRetries} attempts for order ${order.id}`);
        break;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s...
      console.warn(`Email send attempt ${attempt} failed for order ${order.id}, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};