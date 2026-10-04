import { BedsheetProduct, BEDSHEETS_CATALOG } from '../data/products';
import { Order, INITIAL_ORDERS } from '../data/orders';
import { SiteContent, INITIAL_SITE_CONTENT } from '../data/siteContent';
import { compressImage } from '../utils/imageCompressor';

// Upload Image API: Compresses image and persists to server disk
export async function uploadImageApi(imageInput: string | File): Promise<string> {
  try {
    // 1. Compress image client-side to max 1280px to save bandwidth and ensure instant transmission
    const compressed = await compressImage(imageInput, 1280, 1280, 0.82);

    // 2. Upload to server to get permanent clean URL
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: compressed }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return data.url;
      }
    }
    return compressed;
  } catch (err) {
    console.warn('Upload API failed, falling back to compressed data URL:', err);
    if (typeof imageInput === 'string') return imageInput;
    return await compressImage(imageInput, 1280, 1280, 0.82);
  }
}

// Products API
export async function getProducts(): Promise<BedsheetProduct[]> {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        try {
          localStorage.setItem('cotton_nest_products', JSON.stringify(data));
        } catch {
          // Ignore localStorage quota errors on mobile
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend fetch failed, falling back to local storage:', err);
  }

  try {
    const cached = localStorage.getItem('cotton_nest_products');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  return BEDSHEETS_CATALOG;
}

export async function saveAllProducts(products: BedsheetProduct[]): Promise<void> {
  // Optimistic local update
  try {
    localStorage.setItem('cotton_nest_products', JSON.stringify(products));
  } catch {}

  try {
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products),
    });
  } catch (err) {
    console.error('Failed to sync products to server:', err);
  }
}

export async function addProduct(product: BedsheetProduct): Promise<BedsheetProduct> {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to post product to server:', err);
  }
  return product;
}

export async function updateSingleProduct(id: string, product: Partial<BedsheetProduct>): Promise<void> {
  try {
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
  } catch (err) {
    console.error('Failed to update product on server:', err);
  }
}

export async function removeProduct(id: string): Promise<void> {
  try {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.error('Failed to delete product on server:', err);
  }
}

// Orders API
export async function getOrders(): Promise<Order[]> {
  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        localStorage.setItem('cotton_nest_orders', JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend orders fetch failed, falling back to local storage:', err);
  }

  try {
    const cached = localStorage.getItem('cotton_nest_orders');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}

  return INITIAL_ORDERS;
}

export async function saveOrder(order: Order): Promise<void> {
  // Optimistic cache
  try {
    const cached = JSON.parse(localStorage.getItem('cotton_nest_orders') || '[]');
    localStorage.setItem('cotton_nest_orders', JSON.stringify([order, ...cached]));
  } catch {}

  try {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
  } catch (err) {
    console.error('Failed to post order to server:', err);
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  try {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch (err) {
    console.error('Failed to update order status on server:', err);
  }
}

export async function deleteOrder(orderId: string): Promise<void> {
  try {
    await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
  } catch (err) {
    console.error('Failed to delete order on server:', err);
  }
}

// Site Content API
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const res = await fetch('/api/content');
    if (res.ok) {
      const data = await res.json();
      if (data && data.company) {
        localStorage.setItem('cotton_nest_site_content', JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend content fetch failed, using cached content:', err);
  }

  try {
    const cached = localStorage.getItem('cotton_nest_site_content');
    if (cached) return JSON.parse(cached);
  } catch {}

  return INITIAL_SITE_CONTENT;
}

export async function saveSiteContentApi(content: SiteContent): Promise<void> {
  try {
    localStorage.setItem('cotton_nest_site_content', JSON.stringify(content));
  } catch {}

  try {
    await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
  } catch (err) {
    console.error('Failed to sync content to server:', err);
  }
}
