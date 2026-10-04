import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { BEDSHEETS_CATALOG } from './src/data/products';
import { INITIAL_ORDERS } from './src/data/orders';
import { INITIAL_SITE_CONTENT } from './src/data/siteContent';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Persistent Database Directory & File
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store_db.json');

interface StoreDatabase {
  products: any[];
  orders: any[];
  siteContent: any;
}

function initDatabase(): StoreDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.products)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading store_db.json, re-initializing defaults:', err);
  }

  // Seed default data
  const initialDb: StoreDatabase = {
    products: BEDSHEETS_CATALOG,
    orders: INITIAL_ORDERS,
    siteContent: INITIAL_SITE_CONTENT,
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  } catch (writeErr) {
    console.error('Error writing initial store_db.json:', writeErr);
  }

  return initialDb;
}

let db = initDatabase();

function saveDatabase(): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persisting database:', err);
  }
}

async function startServer() {
  const app = express();

  // Support large base64 image uploads for custom photos and variants
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const IMAGES_DIR = path.join(__dirname, 'public', 'images');
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  // Serve uploaded and static images statically
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use('/images', express.static(IMAGES_DIR));
  app.use('/src/assets/images', express.static(path.join(__dirname, 'src', 'assets', 'images')));

  // Dedicated JPG Photo Endpoint: ALWAYS returns a real JPEG image with proper headers
  app.get(['/photo/:id', '/photo/:id.jpg'], (req, res) => {
    let id = req.params.id || '';
    if (id.endsWith('.jpg')) {
      id = id.slice(0, -4);
    }

    const filenamesToTry = [
      id,
      `${id}.jpg`,
      `${id}.png`,
      `${id}.jpeg`,
    ];

    const dirsToSearch = [
      path.join(__dirname, 'public', 'images'),
      path.join(__dirname, 'public', 'uploads'),
      path.join(__dirname, 'src', 'assets', 'images'),
    ];

    for (const dir of dirsToSearch) {
      for (const fn of filenamesToTry) {
        const fullPath = path.join(dir, fn);
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
          res.setHeader('Content-Type', fn.endsWith('.png') ? 'image/png' : 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.sendFile(fullPath);
        }
      }
    }

    // Match by product ID in database or catalog
    const product = db.products.find((p) => p.id === id);
    if (product && product.image) {
      const imgPath = product.image.replace(/^\/(?:src\/assets\/images|images|uploads)\//, '');
      for (const dir of dirsToSearch) {
        const fullPath = path.join(dir, imgPath);
        if (fs.existsSync(fullPath)) {
          res.setHeader('Content-Type', 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.sendFile(fullPath);
        }
      }
    }

    // Fallback to first sheet
    const defaultSheet = path.join(__dirname, 'public', 'images', 'exact_sheet1_pink_rose_1790997736396.jpg');
    if (fs.existsSync(defaultSheet)) {
      res.setHeader('Content-Type', 'image/jpeg');
      return res.sendFile(defaultSheet);
    }

    res.status(404).send('Photo not found');
  });

  // App configuration endpoint so client knows public URL
  app.get('/api/config', (_req, res) => {
    const publicUrl = process.env.APP_URL || '';
    res.json({ appUrl: publicUrl });
  });

  // Dedicated image upload API that converts base64 to static disk file
  app.post('/api/upload', (req, res) => {
    try {
      const { image } = req.body;
      if (!image || typeof image !== 'string') {
        return res.status(400).json({ error: 'Image data is required' });
      }

      if (image.startsWith('/uploads/') || image.startsWith('http://') || image.startsWith('https://')) {
        return res.json({ url: image });
      }

      // Parse data URL: data:image/jpeg;base64,...
      const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      let ext = 'jpg';
      let base64Data = image;

      if (matches) {
        ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        base64Data = matches[2];
      }

      const filename = `sheet_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, filename);

      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
      const publicUrl = `/uploads/${filename}`;
      res.json({ url: publicUrl });
    } catch (err: any) {
      console.error('Failed to process image upload:', err);
      res.status(500).json({ error: 'Failed to save image' });
    }
  });

  /* ------------------- REST API ROUTES ------------------- */

  // Products API
  app.get('/api/products', (_req, res) => {
    res.json(db.products);
  });

  app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    if (!newProduct || !newProduct.name) {
      return res.status(400).json({ error: 'Product name is required' });
    }
    if (!newProduct.id) {
      newProduct.id = `sheet-${Date.now().toString(36)}`;
    }
    db.products.unshift(newProduct);
    saveDatabase();
    res.status(201).json(newProduct);
  });

  app.put('/api/products', (req, res) => {
    if (Array.isArray(req.body)) {
      db.products = req.body;
      saveDatabase();
      return res.json(db.products);
    }
    res.status(400).json({ error: 'Invalid products payload' });
  });

  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const updated = req.body;
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    db.products[index] = { ...db.products[index], ...updated };
    saveDatabase();
    res.json(db.products[index]);
  });

  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const beforeCount = db.products.length;
    db.products = db.products.filter((p) => p.id !== id);
    if (db.products.length === beforeCount) {
      return res.status(404).json({ error: 'Product not found' });
    }
    saveDatabase();
    res.json({ success: true, id });
  });

  // Orders API
  app.get('/api/orders', (_req, res) => {
    res.json(db.orders);
  });

  app.post('/api/orders', (req, res) => {
    const newOrder = req.body;
    if (!newOrder || !newOrder.id) {
      return res.status(400).json({ error: 'Invalid order data' });
    }
    db.orders.unshift(newOrder);
    saveDatabase();
    res.status(201).json(newOrder);
  });

  app.put('/api/orders', (req, res) => {
    if (Array.isArray(req.body)) {
      db.orders = req.body;
      saveDatabase();
      return res.json(db.orders);
    }
    res.status(400).json({ error: 'Invalid orders payload' });
  });

  app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const updated = req.body;
    const index = db.orders.findIndex((o) => o.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    db.orders[index] = { ...db.orders[index], ...updated };
    saveDatabase();
    res.json(db.orders[index]);
  });

  app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    db.orders = db.orders.filter((o) => o.id !== id);
    saveDatabase();
    res.json({ success: true, id });
  });

  // Site Content API
  app.get('/api/content', (_req, res) => {
    res.json(db.siteContent);
  });

  app.put('/api/content', (req, res) => {
    db.siteContent = req.body;
    saveDatabase();
    res.json(db.siteContent);
  });

  // Reset database back to default factory settings
  app.post('/api/reset', (_req, res) => {
    db = {
      products: BEDSHEETS_CATALOG,
      orders: INITIAL_ORDERS,
      siteContent: INITIAL_SITE_CONTENT,
    };
    saveDatabase();
    res.json({ success: true, message: 'Factory reset completed' });
  });

  /* ------------------- FRONTEND / VITE INTEGRATION ------------------- */

  if (!isProduction) {
    // Development mode: attach Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets from dist
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cotton Nest Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
