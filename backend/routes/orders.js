const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// POST /api/orders - Create new order (Buy Now / Checkout)
router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city,
      state,
      pincode,
      payment_method,
      items,
      notes
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    if (!customer_name || !customer_phone || !shipping_address || !city || !pincode) {
      return res.status(400).json({ success: false, message: 'Customer name, phone, address, city, and pincode are required.' });
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      subtotal += Number(item.price) * Number(item.quantity);
    }

    // GST 12% for marble/granite carved stone products
    const gstRate = 0.12;
    const gst_amount = Math.round(subtotal * gstRate);
    const shipping_charges = 0; // Free nationwide insured crated delivery
    const total_amount = subtotal + gst_amount + shipping_charges;

    // Generate Order Number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const order_number = `MRB-2026-${randomSuffix}`;
    const transaction_id = `TXN_${Date.now().toString(36).toUpperCase()}_${Math.floor(100 + Math.random() * 900)}`;

    const insertOrder = db.prepare(`
      INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, city, state, pincode, total_amount, subtotal,
        gst_amount, shipping_charges, payment_method, payment_status,
        transaction_id, order_status, courier_name, tracking_number,
        current_location, estimated_delivery, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Estimated delivery in 5 to 7 days
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 7);
    const estDeliveryStr = estDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const orderRes = insertOrder.run(
      order_number,
      req.user.id,
      customer_name.trim(),
      customer_email || req.user.email,
      customer_phone.trim(),
      shipping_address.trim(),
      city.trim(),
      state ? state.trim() : 'India',
      pincode.trim(),
      total_amount,
      subtotal,
      gst_amount,
      shipping_charges,
      payment_method || 'UPI / Online Payment',
      'Paid',
      transaction_id,
      'Order Placed',
      'SafeXpress Heavy Freight Logistics',
      `SX-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      'Makrana Artisan Workshop, Rajasthan',
      estDeliveryStr,
      notes || 'Safe wooden crate packing requested.'
    );

    const orderId = Number(orderRes.lastInsertRowid);

    // Insert order items & reduce stock
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, title, price, quantity, image_url, marble_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const updateStock = db.prepare(`
      UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?
    `);

    for (const item of items) {
      insertItem.run(
        orderId,
        item.id || item.product_id,
        item.title,
        Number(item.price),
        Number(item.quantity),
        item.image_url || '',
        item.marble_type || 'Natural Marble'
      );

      if (item.id || item.product_id) {
        updateStock.run(Number(item.quantity), item.id || item.product_id);
      }
    }

    // Initial Tracking milestone
    db.prepare(`
      INSERT INTO tracking_history (order_id, status, location, notes)
      VALUES (?, ?, ?, ?)
    `).run(
      orderId,
      'Order Placed',
      'Makrana Artisan Workshop, Rajasthan',
      'Order placed successfully and payment verified. Order assigned to production artisan team.'
    );

    // Fetch complete created order with items
    const createdOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);
    const trackingHistory = db.prepare('SELECT * FROM tracking_history WHERE order_id = ? ORDER BY id ASC').all(orderId);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        ...createdOrder,
        items: orderItems,
        tracking_history: trackingHistory
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Server error creating order.' });
  }
});

// GET /api/orders/my - Customer's orders
router.get('/my', authenticateToken, (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC').all(req.user.id);

    const fullOrders = orders.map(order => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      const tracking = db.prepare('SELECT * FROM tracking_history WHERE order_id = ? ORDER BY id ASC').all(order.id);
      return {
        ...order,
        items,
        tracking_history: tracking
      };
    });

    res.json({ success: true, count: fullOrders.length, orders: fullOrders });
  } catch (error) {
    console.error('Fetch my orders error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving orders.' });
  }
});

// GET /api/orders/track/:orderNumber - Tracking lookup (Public / Authenticated)
router.get('/track/:orderNumber', (req, res) => {
  try {
    const orderNumber = req.params.orderNumber.trim();
    const order = db.prepare(`
      SELECT * FROM orders 
      WHERE order_number = ? OR tracking_number = ?
    `).get(orderNumber, orderNumber);

    if (!order) {
      return res.status(404).json({ success: false, message: 'No shipment found with this Order or Tracking number.' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    const tracking = db.prepare('SELECT * FROM tracking_history WHERE order_id = ? ORDER BY id ASC').all(order.id);

    res.json({
      success: true,
      order: {
        ...order,
        items,
        tracking_history: tracking
      }
    });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ success: false, message: 'Server error tracking order.' });
  }
});

// GET /api/orders/:id - Single order details with invoice data
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Role check: Only order owner or admin can view
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    const tracking = db.prepare('SELECT * FROM tracking_history WHERE order_id = ? ORDER BY id ASC').all(order.id);

    res.json({
      success: true,
      order: {
        ...order,
        items,
        tracking_history: tracking
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving order.' });
  }
});

module.exports = router;
