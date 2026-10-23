const db = require('./database');
const bcrypt = require('bcryptjs');

function seedDatabase() {
  console.log('Seeding initial data with updated categories: Marble Mandir, Vrindavan Shrines, Other Marble Products...');

  // 1. Create or ensure users
  const adminCheck = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@marbles.com');
  if (!adminCheck) {
    const hashedAdminPassword = bcrypt.hashSync('admin123', 10);
    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password, role, phone, address, city, state, pincode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertUser.run(
      'Royal Marbles Admin',
      'admin@marbles.com',
      hashedAdminPassword,
      'admin',
      '+91 98290 12345',
      'Makrana Industrial Area, Phase 2',
      'Makrana',
      'Rajasthan',
      '341505'
    );
    console.log('Admin user created: admin@marbles.com / admin123');
  }

  const customerCheck = db.prepare('SELECT id FROM users WHERE email = ?').get('customer@gmail.com');
  let customerId;
  if (!customerCheck) {
    const hashedCustomerPassword = bcrypt.hashSync('customer123', 10);
    const insertCustomer = db.prepare(`
      INSERT INTO users (name, email, password, role, phone, address, city, state, pincode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const res = insertCustomer.run(
      'Rajesh Sharma',
      'customer@gmail.com',
      hashedCustomerPassword,
      'user',
      '+91 98765 43210',
      'Flat 402, Royal Palms Residency, MG Road',
      'Mumbai',
      'Maharashtra',
      '400001'
    );
    customerId = Number(res.lastInsertRowid);
    console.log('Sample customer created: customer@gmail.com / customer123');
  } else {
    customerId = customerCheck.id;
  }

  // 2. Clear old products and seed new ones matching the user's exact 3 categories
  db.prepare('DELETE FROM products').run();

  const insertProduct = db.prepare(`
    INSERT INTO products (
      title, category, price, original_price, marble_type,
      dimensions, weight, finish, stock, description,
      image_url, images, featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    // --- CATEGORY 1: Marble Mandir ---
    {
      title: 'Grand Makrana Pure White Marble Home Mandir',
      category: 'Marble Mandir',
      price: 85000,
      original_price: 105000,
      marble_type: 'Grade-A Makrana Pure White Marble',
      dimensions: '60" Height x 36" Width x 24" Depth',
      weight: '210 kg',
      finish: 'Intricate Floral Jali Carving & High Gloss Mirror Polish',
      stock: 5,
      description: 'Handcrafted from 100% genuine Makrana white marble by master sculptors in Rajasthan. Features high-elevation dome, carved pilasters, bell hangings, spacious sanctum sanctorum with LED spot lighting provision, and dual smooth-glide drawers for puja samagri.',
      image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      ]),
      featured: 1
    },
    {
      title: 'Designer Makrana Marble Mandir for Contemporary Homes',
      category: 'Marble Mandir',
      price: 52000,
      original_price: 64000,
      marble_type: 'First Quality Makrana Albeta Marble',
      dimensions: '42" Height x 28" Width x 18" Depth',
      weight: '120 kg',
      finish: 'Backlit Translucent Marble Screen with Gold Inlay',
      stock: 8,
      description: 'Elegant contemporary home temple designed for modern apartments and villas. Features sleek clean pillars, warm gold leaf accents, illuminated sacred Om back panel, and heavy wooden crate packaging for safe transit.',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      ]),
      featured: 1
    },
    {
      title: 'Traditional Shikhar Gopuram Royal Marble Mandir',
      category: 'Marble Mandir',
      price: 125000,
      original_price: 155000,
      marble_type: 'Makrana Dungri White Marble',
      dimensions: '78" Height x 48" Width x 30" Depth',
      weight: '340 kg',
      finish: 'Multi-Tier Shikhar Domes & Hand Sculpted Base',
      stock: 3,
      description: 'A grand architectural mandir with multiple shikhars (pyramidal spires), carved elephants at base, detailed archways, and sacred temple iconography. Custom crating with steel strapping.',
      image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
      ]),
      featured: 1
    },

    // --- CATEGORY 2: Vrindavan Shrines ---
    {
      title: 'Vrindavan Shrines - Makrana Heritage Carved Temple',
      category: 'Vrindavan Shrines',
      price: 92000,
      original_price: 115000,
      marble_type: 'Pure Makrana White Marble',
      dimensions: '64" Height x 40" Width x 24" Depth',
      weight: '240 kg',
      finish: 'Vrindavan Braj Style Intricate Jali & Meenakari Highlights',
      stock: 4,
      description: 'Inspired by the sacred temple architecture of Vrindavan and Mathura. Crafted with delicate fluted pillars, lotus finials, and detailed sanctum archways. Blessed with timeless pure white Makrana marble stone that never loses its luster.',
      image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
      ]),
      featured: 1
    },
    {
      title: 'Vrindavan Shrines - Divine Radha Krishna Sanctum Mandir',
      category: 'Vrindavan Shrines',
      price: 76000,
      original_price: 95000,
      marble_type: 'Makrana Crystalline White Marble',
      dimensions: '54" Height x 34" Width x 22" Depth',
      weight: '185 kg',
      finish: 'Braj Flora & Peacock Feather Hand-Carvings',
      stock: 6,
      description: 'Dedicated Vrindavan shrine with exquisite motifs of Kadamba trees, flutes, and sacred lotus arches. Treated with stone sealant and delivered in custom wooden crate with shock absorbers.',
      image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
      ]),
      featured: 1
    },

    // --- CATEGORY 3: Other Marble Products ---
    {
      title: 'Luxury Handcrafted Marble Table Watch / Desk Clock',
      category: 'Other Marble Products',
      price: 6800,
      original_price: 9200,
      marble_type: 'Italian Carrara & Makrana White Blend',
      dimensions: '14" Height x 9" Width x 5" Depth',
      weight: '7.5 kg',
      finish: 'Brass Gold Roman Dial with Polished Solid Marble Stand',
      stock: 20,
      description: 'An executive heirloom desk timepiece carved out of solid natural marble stone, fitted with precision silent quartz clock movement with brass Roman numerals.',
      image_url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80'
      ]),
      featured: 1
    },
    {
      title: 'Imperial Green Onyx Marble Decorative Carved Urli Bowl',
      category: 'Other Marble Products',
      price: 9500,
      original_price: 12500,
      marble_type: 'Translucent Natural Green Onyx',
      dimensions: '16" Diameter x 6" Height',
      weight: '12 kg',
      finish: 'Petal Hand-Carved Rim with Satin Polish',
      stock: 15,
      description: 'Stunning natural green onyx with delicate amber veins. Ideal for floating fresh flower petals and candles in living room foyers or puja rooms.',
      image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
      ]),
      featured: 0
    },
    {
      title: 'Black Galaxy Premium Granite Round Coffee Table Top',
      category: 'Other Marble Products',
      price: 28000,
      original_price: 35000,
      marble_type: 'Original Andhra Black Galaxy Granite',
      dimensions: '36" Diameter x 1.25" Thickness',
      weight: '62 kg',
      finish: 'Full Bullnose Edge with Diamond Mirror Polish',
      stock: 10,
      description: 'Deep obsidian black natural granite studded with sparkling golden and copper bronzite flakes. Stain-resistant, heat-resistant, and weatherproof.',
      image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
      ]),
      featured: 0
    },
    {
      title: 'Royal Makrana Marble Elephant Chowki Pair with Gold Work',
      category: 'Other Marble Products',
      price: 22000,
      original_price: 29000,
      marble_type: 'Makrana Marble with Gold Foil Art',
      dimensions: '15" Height x 12" Length Each (Pair of 2)',
      weight: '28 kg (Pair)',
      finish: 'Intricate Royal Howdah & Jewel Carvings',
      stock: 7,
      description: 'A majestic pair of royal elephants adorned with celebratory howdahs and floral bells. Suitable for puja rooms and decorative pedestals.',
      image_url: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=800&q=80'
      ]),
      featured: 0
    }
  ];

  for (const p of products) {
    insertProduct.run(
      p.title,
      p.category,
      p.price,
      p.original_price,
      p.marble_type,
      p.dimensions,
      p.weight,
      p.finish,
      p.stock,
      p.description,
      p.image_url,
      p.images,
      p.featured
    );
  }
  console.log(`Successfully seeded ${products.length} products under categories: Marble Mandir, Vrindavan Shrines, Other Marble Products.`);

  // 3. Ensure sample trackable order exists
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  if (orderCount === 0 && customerId) {
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, city, state, pincode, total_amount, subtotal,
        gst_amount, shipping_charges, payment_method, payment_status,
        transaction_id, order_status, courier_name, tracking_number,
        current_location, estimated_delivery, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const orderRes = insertOrder.run(
      'MRB-2026-8942',
      customerId,
      'Rajesh Sharma',
      'customer@gmail.com',
      '+91 98765 43210',
      'Flat 402, Royal Palms Residency, MG Road',
      'Mumbai',
      'Maharashtra',
      '400001',
      95200,
      85000,
      10200,
      0,
      'UPI / Online Payment',
      'Paid',
      'TXN_UPI_9821839210',
      'In Transit',
      'SafeXpress Heavy Freight Logistics',
      'SX-MAK-9923841',
      'Jaipur Regional Logistics Hub (Central Warehouse)',
      '27 Oct 2026',
      'Secure wooden crate with 5-layer thermocol cushioning for heavy marble mandir.'
    );

    const sampleOrderId = Number(orderRes.lastInsertRowid);

    db.prepare(`
      INSERT INTO order_items (order_id, product_id, title, price, quantity, image_url, marble_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      sampleOrderId,
      1,
      'Grand Makrana Pure White Marble Home Mandir',
      85000,
      1,
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'Grade-A Makrana Pure White Marble'
    );

    const insertTracking = db.prepare(`
      INSERT INTO tracking_history (order_id, status, location, notes, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertTracking.run(
      sampleOrderId,
      'Order Placed',
      'Makrana Artisan Workshop, Rajasthan',
      'Order confirmed and payment verified via UPI. Assigned to Master Craftsman Suresh Ji.',
      '2026-10-21 10:30:00'
    );
    insertTracking.run(
      sampleOrderId,
      'Crafting & Inspection',
      'Makrana Artisan Workshop, Rajasthan',
      'Final carving touches and 100% quality inspection completed. Mirror polish applied.',
      '2026-10-22 14:15:00'
    );
    insertTracking.run(
      sampleOrderId,
      'Dispatched',
      'Makrana Dispatch Depot',
      'Packed inside reinforced fumigated wooden crate with shock-absorbing foam. Handed to freight carrier SafeXpress.',
      '2026-10-23 09:00:00'
    );
    insertTracking.run(
      sampleOrderId,
      'In Transit',
      'Jaipur Regional Logistics Hub (Central Warehouse)',
      'Consignment scanned at Jaipur hub. Loaded onto specialized air-suspension truck en route to Mumbai.',
      '2026-10-23 18:45:00'
    );

    console.log('Sample order MRB-2026-8942 and tracking timeline seeded.');
  }

  console.log('Database seeding complete!');
}

seedDatabase();
