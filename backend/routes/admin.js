const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Protect all admin routes
router.use(authenticateToken, requireAdmin);

// GET /api/admin/dashboard - High-level statistics
router.get('/dashboard', (req, res) => {
  try {
    const totalRevenueRow = db.prepare('SELECT SUM(total_amount) as total FROM orders WHERE payment_status = "Paid"').get();
    const totalRevenue = totalRevenueRow && totalRevenueRow.total ? totalRevenueRow.total : 0;

    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const totalCustomers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "user"').get().count;

    const pendingOrders = db.prepare(`
      SELECT COUNT(*) as count FROM orders 
      WHERE order_status NOT IN ('Delivered', 'Cancelled')
    `).get().count;

    const deliveredOrders = db.prepare(`
      SELECT COUNT(*) as count FROM orders 
      WHERE order_status = 'Delivered'
    `).get().count;

    // Recent 5 orders with items
    const recentOrders = db.prepare(`
      SELECT * FROM orders 
      ORDER BY id DESC LIMIT 5
    `).all().map(order => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return { ...order, items };
    });

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingOrders,
        deliveredOrders
      },
      recentOrders
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving dashboard metrics.' });
  }
});

// GET /api/admin/orders - All customer orders
router.get('/orders', (req, res) => {
  try {
    const { status, search } = req.query;

    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      query += ' AND order_status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (order_number LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ? OR customer_email LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY id DESC';

    const orders = db.prepare(query).all(...params).map(order => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      const tracking = db.prepare('SELECT * FROM tracking_history WHERE order_id = ? ORDER BY id ASC').all(order.id);
      return {
        ...order,
        items,
        tracking_history: tracking
      };
    });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Admin fetch orders error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving orders.' });
  }
});

// PUT /api/admin/orders/:id/status - Update tracking & order status
router.put('/orders/:id/status', (req, res) => {
  try {
    const orderId = req.params.id;
    const {
      order_status,
      courier_name,
      tracking_number,
      current_location,
      estimated_delivery,
      notes
    } = req.body;

    const existingOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    if (!existingOrder) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Update order table
    db.prepare(`
      UPDATE orders SET
        order_status = COALESCE(?, order_status),
        courier_name = COALESCE(?, courier_name),
        tracking_number = COALESCE(?, tracking_number),
        current_location = COALESCE(?, current_location),
        estimated_delivery = COALESCE(?, estimated_delivery),
        notes = COALESCE(?, notes)
      WHERE id = ?
    `).run(
      order_status || null,
      courier_name || null,
      tracking_number || null,
      current_location || null,
      estimated_delivery || null,
      notes || null,
      orderId
    );

    // Add entry to tracking_history
    const newStatus = order_status || existingOrder.order_status;
    const newLocation = current_location || existingOrder.current_location || 'Makrana Warehouse';
    const trackingNote = notes || `Status updated to ${newStatus}`;

    db.prepare(`
      INSERT INTO tracking_history (order_id, status, location, notes)
      VALUES (?, ?, ?, ?)
    `).run(orderId, newStatus, newLocation, trackingNote);

    // Fetch updated order
    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);
    const tracking = db.prepare('SELECT * FROM tracking_history WHERE order_id = ? ORDER BY id ASC').all(orderId);

    res.json({
      success: true,
      message: `Order #${updatedOrder.order_number} status updated to "${updatedOrder.order_status}"!`,
      order: {
        ...updatedOrder,
        items,
        tracking_history: tracking
      }
    });
  } catch (error) {
    console.error('Admin update status error:', error);
    res.status(500).json({ success: false, message: 'Server error updating order status.' });
  }
});

// GET /api/admin/customers - All registered users
router.get('/customers', (req, res) => {
  try {
    const customers = db.prepare(`
      SELECT 
        u.id, u.name, u.email, u.phone, u.city, u.state, u.created_at,
        COUNT(o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'user'
      GROUP BY u.id
      ORDER BY total_spent DESC
    `).all();

    res.json({ success: true, count: customers.length, customers });
  } catch (error) {
    console.error('Admin fetch customers error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving customers.' });
  }
});

module.exports = router;
