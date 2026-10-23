const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

// ==========================================
// 1. CUSTOMER AUTHENTICATION (ग्राहक पोर्टल)
// ==========================================

// POST /api/auth/register - Strictly for Customers
router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone, address, city, state, pincode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please Sign In.' });
    }

    // Role is strictly 'user' for customers
    const role = 'user';
    const hashedPassword = bcrypt.hashSync(password, 10);
    const insert = db.prepare(`
      INSERT INTO users (name, email, password, role, phone, address, city, state, pincode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      name.trim(),
      cleanEmail,
      hashedPassword,
      role,
      phone || '',
      address || '',
      city || '',
      state || '',
      pincode || ''
    );

    const userId = Number(result.lastInsertRowid);
    const token = jwt.sign(
      { id: userId, email: cleanEmail, role, name: name.trim() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Krushna Devghar.',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        role,
        phone,
        address,
        city,
        state,
        pincode
      }
    });
  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// POST /api/auth/login - Strictly for Customers
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    // If an admin tries to log in through the customer door:
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Aapka account Admin/Owner account hai. Kripya Admin Portal (/admin/login) se login karein.'
      });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode
      }
    });
  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// ==========================================
// 2. OWNER ADMIN PORTAL (एडमिन / ओनर पोर्टल)
// ==========================================

// GET /api/auth/admin/status - Check if single admin account exists
router.get('/admin/status', (req, res) => {
  try {
    const admin = db.prepare("SELECT id, email, name FROM users WHERE role = 'admin' LIMIT 1").get();
    res.json({
      success: true,
      hasAdmin: !!admin,
      adminEmail: admin ? admin.email : null
    });
  } catch (error) {
    console.error('Error in /admin/status:', error);
    res.status(500).json({ success: false, message: 'Error checking admin status.' });
  }
});

// POST /api/auth/admin/setup - Create the ONE AND ONLY owner account
router.post('/admin/setup', (req, res) => {
  try {
    const existingAdmin = db.prepare("SELECT id, email FROM users WHERE role = 'admin' LIMIT 1").get();
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: `Admin account already exists for (${existingAdmin.email}). Only ONE owner account is permitted.`
      });
    }

    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, Gmail/Email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = bcrypt.hashSync(password, 10);

    const insert = db.prepare(`
      INSERT INTO users (name, email, password, role, phone, address, city, state, pincode)
      VALUES (?, ?, ?, 'admin', ?, 'Makrana Artisan Workshop', 'Makrana', 'Rajasthan', '341505')
    `);

    const result = insert.run(name.trim(), cleanEmail, hashedPassword, phone || '+91 98290 12345');
    const adminId = Number(result.lastInsertRowid);

    const token = jwt.sign(
      { id: adminId, email: cleanEmail, role: 'admin', name: name.trim() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Owner Admin account created successfully! You are now the exclusive owner.',
      token,
      user: {
        id: adminId,
        name: name.trim(),
        email: cleanEmail,
        role: 'admin',
        phone
      }
    });
  } catch (error) {
    console.error('Admin setup error:', error);
    res.status(500).json({ success: false, message: 'Error setting up admin account.' });
  }
});

// POST /api/auth/admin/login - Dedicated Admin Portal Login
router.post('/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    // STRICT CHECK: Must have role = 'admin'
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Yeh portal sirf Krushna Devghar ke Store Owner/Admin ke liye hai.'
      });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Admin authentication verified. Welcome to Owner Dashboard!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error during admin login.' });
  }
});

// ==========================================
// 3. COMMON PROFILE & ME
// ==========================================

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, role, phone, address, city, state, pincode, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving user data.' });
  }
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, phone, address, city, state, pincode } = req.body;
    db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          address = COALESCE(?, address),
          city = COALESCE(?, city),
          state = COALESCE(?, state),
          pincode = COALESCE(?, pincode)
      WHERE id = ?
    `).run(name, phone, address, city, state, pincode, req.user.id);

    const updatedUser = db.prepare('SELECT id, name, email, role, phone, address, city, state, pincode FROM users WHERE id = ?').get(req.user.id);
    res.json({ success: true, message: 'Profile updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
});

module.exports = router;
