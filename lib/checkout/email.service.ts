import { Resend } from 'resend';
import { Order } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (order: Order): Promise<void> => {
  try {
    await resend.emails.send({
      from: 'no-reply@yourdomain.com',
      to: order.shippingAddress.email || 'customer@yourdomain.com',
      subject: `Order Confirmation #${order.id}`,
      html: `
        <h1>Thank You for Your Order!</h1>
        <p>Order ID: ${order.id}</p>
        <p>Status: ${order.status}</p>
        <p>Total: $${order.total.toFixed(2)}</p>
        <h2>Shipping Address</h2>
        <p>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
        <p>${order.shippingAddress.address}</p>
        <p>${order.shippingAddress.city}, ${order.shippingAddress.zipCode}</p>
        <h2>Order Items</h2>
        <ul>
          ${order.orderItems.map((item) => `<li>${item.quantity} x Item ${item.productId} - $${item.price.toFixed(2)}</li>`).join('')}
        </ul>
      `,
    });
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    throw error;
  }
};