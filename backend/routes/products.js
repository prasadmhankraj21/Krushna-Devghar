const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/products - list all products with filtering & search
router.get('/', (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, marbleType, sort, featured } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (marbleType && marbleType !== 'All') {
      query += ' AND marble_type LIKE ?';
      params.push(`%${marbleType}%`);
    }

    if (featured === 'true' || featured === '1') {
      query += ' AND featured = 1';
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR marble_type LIKE ? OR category LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else {
      query += ' ORDER BY id DESC';
    }

    const products = db.prepare(query).all(...params);

    // Parse images json
    const formatted = products.map(p => {
      let images = [];
      try {
        images = p.images ? JSON.parse(p.images) : [];
      } catch (e) {
        images = [p.image_url];
      }
      return {
        ...p,
        images
      };
    });

    res.json({ success: true, count: formatted.length, products: formatted });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving products.' });
  }
});

// GET /api/products/categories - Distinct categories with counts
router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM products 
      GROUP BY category 
      ORDER BY count DESC
    `).all();

    res.json({ success: true, categories });
  } catch (error) {
    console.error('Fetch categories error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving categories.' });
  }
});

// GET /api/products/:id - Single product details
router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    let images = [];
    try {
      images = product.images ? JSON.parse(product.images) : [];
    } catch (e) {
      images = [product.image_url];
    }

    // Get related products in same category
    const related = db.prepare('SELECT * FROM products WHERE category = ? AND id != ? LIMIT 4')
      .all(product.category, product.id)
      .map(p => ({
        ...p,
        images: p.images ? JSON.parse(p.images || '[]') : [p.image_url]
      }));

    res.json({
      success: true,
      product: {
        ...product,
        images
      },
      related
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving product.' });
  }
});

// POST /api/products - (Admin only) Add new product
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const {
      title,
      category,
      price,
      original_price,
      marble_type,
      dimensions,
      weight,
      finish,
      stock,
      description,
      image_url,
      images,
      featured
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ success: false, message: 'Title, category, and price are required.' });
    }

    const imagesJson = Array.isArray(images) && images.length > 0 
      ? JSON.stringify(images) 
      : JSON.stringify([image_url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80']);

    const insert = db.prepare(`
      INSERT INTO products (
        title, category, price, original_price, marble_type,
        dimensions, weight, finish, stock, description,
        image_url, images, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      title.trim(),
      category.trim(),
      Number(price),
      original_price ? Number(original_price) : Number(price) * 1.25,
      marble_type || 'Natural Makrana Stone',
      dimensions || 'Custom Size',
      weight || '25 kg',
      finish || 'Hand Carved & Mirror Polished',
      stock !== undefined ? Number(stock) : 10,
      description || '',
      image_url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      imagesJson,
      featured ? 1 : 0
    );

    const newId = Number(result.lastInsertRowid);
    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(newId);

    res.status(201).json({
      success: true,
      message: 'Product added successfully!',
      product: {
        ...newProduct,
        images: JSON.parse(newProduct.images || '[]')
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error creating product.' });
  }
});

// PUT /api/products/:id - (Admin only) Update product
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const id = req.params.id;
    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const {
      title,
      category,
      price,
      original_price,
      marble_type,
      dimensions,
      weight,
      finish,
      stock,
      description,
      image_url,
      images,
      featured
    } = req.body;

    const imagesJson = Array.isArray(images) 
      ? JSON.stringify(images) 
      : (image_url ? JSON.stringify([image_url]) : undefined);

    db.prepare(`
      UPDATE products SET
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        price = COALESCE(?, price),
        original_price = COALESCE(?, original_price),
        marble_type = COALESCE(?, marble_type),
        dimensions = COALESCE(?, dimensions),
        weight = COALESCE(?, weight),
        finish = COALESCE(?, finish),
        stock = COALESCE(?, stock),
        description = COALESCE(?, description),
        image_url = COALESCE(?, image_url),
        images = COALESCE(?, images),
        featured = COALESCE(?, featured)
      WHERE id = ?
    `).run(
      title ? title.trim() : null,
      category ? category.trim() : null,
      price !== undefined ? Number(price) : null,
      original_price !== undefined ? Number(original_price) : null,
      marble_type || null,
      dimensions || null,
      weight || null,
      finish || null,
      stock !== undefined ? Number(stock) : null,
      description !== undefined ? description : null,
      image_url || null,
      imagesJson || null,
      featured !== undefined ? (featured ? 1 : 0) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json({
      success: true,
      message: 'Product updated successfully!',
      product: {
        ...updated,
        images: JSON.parse(updated.images || '[]')
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error updating product.' });
  }
});

// DELETE /api/products/:id - (Admin only) Delete product
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const id = req.params.id;
    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting product.' });
  }
});

module.exports = router;
