import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Edit3, Trash2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';
import { resolveThumbnail, formatProductPrice, LOCAL_THUMBNAIL_FALLBACK } from '../lib/productUtils';

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export function ProductCard({ product, isAdmin, onEdit, onDelete }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(() => resolveThumbnail(product));
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgSrc(resolveThumbnail(product));
    setImgFailed(false);
  }, [product.imageUrl, product.checkoutUrl]);

  const priceInfo = formatProductPrice(product.price, product.priceUsd, product.checkoutUrl);

  const handleImageError = () => {
    if (imgSrc !== LOCAL_THUMBNAIL_FALLBACK) {
      setImgSrc(LOCAL_THUMBNAIL_FALLBACK);
    } else {
      setImgFailed(true);
    }
  };

  return (
    <article
      id={`product-card-${product.id}`}
      className="product-card max-w-[360px] mx-auto w-full rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between group hover:border-[#2E5EFF]/40 transition-all duration-300"
    >
      <div>
        {/* THUMBNAIL CONTAINER */}
        <div className="relative h-40 sm:h-44 w-full rounded-lg sm:rounded-xl overflow-hidden mb-4 bg-[#05060A] border border-[#1E2333] group-hover:border-[#2E5EFF]/30 transition-colors">
          {!imgFailed ? (
            <img
              src={imgSrc}
              alt={product.title}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={handleImageError}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#12141F] text-[#8A90A6]">
              <ImageIcon className="w-8 h-8 mb-1.5 opacity-40 text-[#2E5EFF]" />
              <span className="text-[11px] font-medium text-center">Digital AI Publication</span>
            </div>
          )}

          {/* Gradient overlay at the bottom for smooth blending */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1018]/80 via-transparent to-transparent pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
            {/* Category Tag */}
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#16C79A] bg-[#05060A]/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-[#16C79A]/30 shadow-sm">
              {product.category || 'AI Workflow Guide'}
            </span>

            {/* Selar Verified Tag */}
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-white/90 bg-[#05060A]/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-[#16C79A]" />
              <span>Selar</span>
            </span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="font-display text-base sm:text-lg font-bold text-[#F5F6FA] tracking-tight leading-snug group-hover:text-white transition-colors">
          {product.title}
        </h3>

        {/* Product Description */}
        <p className="mt-2 text-xs sm:text-sm text-[#8A90A6] leading-relaxed line-clamp-3">
          {product.description}
        </p>
      </div>

      {/* Card Footer: Pricing & Actions */}
      <div className="mt-4 pt-3.5 border-t border-[#1E2333] flex flex-col gap-3">
        
        {/* Price display with NGN and USD translation */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#8A90A6]">
              Instant Access
            </span>
            <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
              <span className="font-display text-xl sm:text-2xl font-extrabold text-[#F5F6FA] tracking-tight">
                {priceInfo.primary}
              </span>
              <span className="text-[11px] font-mono font-semibold text-[#16C79A] bg-[#16C79A]/10 border border-[#16C79A]/20 px-1.5 py-0.5 rounded-md">
                {priceInfo.usdTranslation}
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <a
          id={`buy-btn-${product.id}`}
          href={product.checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3.5 bg-[#2E5EFF] hover:bg-[#254dd6] active:scale-[0.98] text-white font-semibold rounded-lg text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(46,94,255,0.3)] hover:shadow-[0_0_20px_rgba(46,94,255,0.5)] cursor-pointer"
        >
          <span>Get it on Selar</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </a>

        {/* Admin Actions */}
        {isAdmin && onEdit && onDelete && (
          <div className="flex items-center justify-between pt-2 border-t border-[#1E2333] text-xs">
            <span className="text-[#8A90A6] font-mono text-[10px]">Owner Control</span>
            <div className="flex items-center gap-2">
              <button
                id={`edit-product-${product.id}`}
                onClick={() => onEdit(product)}
                className="flex items-center gap-1 text-[#8A90A6] hover:text-[#2E5EFF] transition-colors p-1 cursor-pointer text-xs"
                title="Edit product"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                id={`delete-product-${product.id}`}
                onClick={() => onDelete(product.id)}
                className="flex items-center gap-1 text-[#8A90A6] hover:text-rose-400 transition-colors p-1 cursor-pointer text-xs"
                title="Delete product"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
