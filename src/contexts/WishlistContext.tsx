'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/app/api/axiosClient';

interface WishlistItemProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
}

interface WishlistItem {
  id: string;
  created_at: string;
  electrodomesticos: WishlistItemProduct | null;
  repuestos: WishlistItemProduct | null;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  toggleWishlist: (productId: string, productType: 'electrodomestico' | 'repuesto') => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setIsLoading(true);
        const { data } = await apiClient.get<WishlistItem[]>('/wishlist');
        setWishlistItems(data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const isItemInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => 
      item.electrodomesticos?.id === productId || item.repuestos?.id === productId
    );
  };

  const toggleWishlist = async (productId: string, productType: 'electrodomestico' | 'repuesto') => {
    if (isItemInWishlist(productId)) {
      const originalWishlist = [...wishlistItems];
      const newWishlist = originalWishlist.filter(item => 
        item.electrodomesticos?.id !== productId && item.repuestos?.id !== productId
      );
      setWishlistItems(newWishlist);

      try {
        await apiClient.delete(`/wishlist/${productId}?productType=${productType}`);
      } catch (error) {
        console.error('Error removing, reverting UI', error);
        setWishlistItems(originalWishlist);
      }
    } else {
      const optimisticItem: WishlistItem = {
        id: `optimistic-${Date.now()}`,
        created_at: new Date().toISOString(),
        electrodomesticos: productType === 'electrodomestico' ? { 
          id: productId,
          name: '',
          slug: '',
          price: 0,
          image_url: ''
        } : null,
        repuestos: productType === 'repuesto' ? { 
          id: productId,
          name: '',
          slug: '',
          price: 0,
          image_url: ''
        } : null,
      };
      setWishlistItems(prevItems => [...prevItems, optimisticItem]);

      try {
        await apiClient.post('/wishlist', { productId, productType });
      } catch (error: any) {
        console.error('Error adding, reverting UI', error);
        if (error.response?.status !== 409) {
          setWishlistItems(prevItems => prevItems.filter(item => item.id !== optimisticItem.id));
        }
      }
    }
  };

  const value = {
    wishlistItems,
    isLoading,
    toggleWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};