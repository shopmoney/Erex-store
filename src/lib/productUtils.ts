import { Product } from '../types';

export const SELAR_DEFAULT_THUMBNAIL = 'https://files.selar.co/product-images/2026/products/godwinobinnaemejuobi/the-ultimate-guide-to-usi-selar.com-6a6e5d3f1f66b.png';
export const LOCAL_THUMBNAIL_FALLBACK = '/assets/selar-guide-cover.webp';

/**
 * Resolves the best thumbnail image for a product.
 * Supports explicit imageUrl, local fast-cached copy, or auto-detection from Selar links.
 */
export function resolveThumbnail(product: Partial<Product>): string {
  if (product.imageUrl && product.imageUrl.trim()) {
    return product.imageUrl.trim();
  }

  const url = product.checkoutUrl?.toLowerCase() || '';
  if (url.includes('4d987177xw') || url.includes('selar.co') || url.includes('selar.com')) {
    return LOCAL_THUMBNAIL_FALLBACK;
  }

  // Generic fallback cover
  return LOCAL_THUMBNAIL_FALLBACK;
}

export const NGN_TO_USD_RATE = 1400; // Benchmark rate: 1,400 NGN = $1 USD

/**
 * Automatically calculates USD equivalent from a Naira value in real-time.
 */
export function calculateUsdFromNgn(nairaInput: string): string {
  const clean = (nairaInput || '').replace(/[^0-9.]/g, '');
  const num = parseFloat(clean);
  if (!num || isNaN(num) || num <= 0) return '';
  const usd = (num / NGN_TO_USD_RATE).toFixed(2);
  return `$${usd}`;
}

/**
 * Formats the product pricing with primary currency (NGN) and USD translation.
 */
export function formatProductPrice(priceStr: string, priceUsdStr?: string, checkoutUrl?: string): {
  primary: string;
  usdTranslation: string;
} {
  const clean = (priceStr || '').trim();

  // If clean is empty or not provided
  if (!clean) {
    return {
      primary: '₦3,500 NGN',
      usdTranslation: '~$2.50 USD'
    };
  }

  // If explicit USD translation is passed
  if (priceUsdStr && priceUsdStr.trim()) {
    const usdVal = priceUsdStr.replace(/[^0-9.]/g, '');
    const cleanPrimary = clean.startsWith('₦')
      ? clean
      : clean.toUpperCase().includes('NGN')
      ? clean
      : `₦${clean} NGN`;

    return {
      primary: cleanPrimary,
      usdTranslation: `~$${usdVal || '2.50'} USD`
    };
  }

  // Extract number from Naira string
  const numericMatch = clean.replace(/,/g, '').match(/\d+(\.\d+)?/);
  if (numericMatch) {
    const num = parseFloat(numericMatch[0]);
    const usdVal = (num / NGN_TO_USD_RATE).toFixed(2);
    
    // Format Naira with commas
    const formattedNgn = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(num);

    return {
      primary: clean.toUpperCase().includes('NGN') || clean.startsWith('₦') ? clean : `${formattedNgn} NGN`,
      usdTranslation: `~$${usdVal} USD`
    };
  }

  return {
    primary: clean,
    usdTranslation: '~$2.50 USD'
  };
}
