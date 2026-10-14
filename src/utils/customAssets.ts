import { useState, useEffect } from 'react';
import { ASSETS } from '../assets/branding';

const FOUNDER_PHOTO_STORAGE_KEY = 'codagram_founder_photo';
const BOOK_3D_STORAGE_KEY = 'codagram_book_3d_cover';
const ASSETS_CHANGE_EVENT = 'codagram_assets_changed';

export function getStoredFounderPhoto(): string {
  if (typeof window === 'undefined') return ASSETS.founderPhoto;
  try {
    const stored = localStorage.getItem(FOUNDER_PHOTO_STORAGE_KEY);
    return stored || ASSETS.founderPhoto;
  } catch {
    return ASSETS.founderPhoto;
  }
}

export function saveCustomFounderPhoto(dataUrl: string): void {
  try {
    localStorage.setItem(FOUNDER_PHOTO_STORAGE_KEY, dataUrl);
    window.dispatchEvent(new CustomEvent(ASSETS_CHANGE_EVENT));
  } catch (err) {
    console.error('Failed to save founder photo to localStorage', err);
  }
}

export function resetCustomFounderPhoto(): void {
  try {
    localStorage.removeItem(FOUNDER_PHOTO_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(ASSETS_CHANGE_EVENT));
  } catch (err) {
    console.error('Failed to reset founder photo', err);
  }
}

export function getStoredBookCover(): { is3d: boolean; url: string } {
  if (typeof window === 'undefined') return { is3d: true, url: ASSETS.shunya3dBook };
  try {
    const stored = localStorage.getItem(BOOK_3D_STORAGE_KEY);
    if (stored) {
      return { is3d: true, url: stored };
    }
  } catch {
    // fallback
  }
  return { is3d: true, url: ASSETS.shunya3dBook };
}

export function saveCustomBookCover(dataUrl: string): void {
  try {
    localStorage.setItem(BOOK_3D_STORAGE_KEY, dataUrl);
    window.dispatchEvent(new CustomEvent(ASSETS_CHANGE_EVENT));
  } catch (err) {
    console.error('Failed to save book cover', err);
  }
}

export function resetCustomBookCover(): void {
  try {
    localStorage.removeItem(BOOK_3D_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(ASSETS_CHANGE_EVENT));
  } catch (err) {
    console.error('Failed to reset book cover', err);
  }
}

// React Hook for dynamic asset subscription
export function useLiveAssets() {
  const [founderPhoto, setFounderPhoto] = useState<string>(getStoredFounderPhoto);
  const [bookCover, setBookCover] = useState<string>(() => getStoredBookCover().url);
  const [hasCustomFounder, setHasCustomFounder] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(FOUNDER_PHOTO_STORAGE_KEY);
    } catch {
      return false;
    }
  });
  const [hasCustomBook, setHasCustomBook] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(BOOK_3D_STORAGE_KEY);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      setFounderPhoto(getStoredFounderPhoto());
      setBookCover(getStoredBookCover().url);
      try {
        setHasCustomFounder(!!localStorage.getItem(FOUNDER_PHOTO_STORAGE_KEY));
        setHasCustomBook(!!localStorage.getItem(BOOK_3D_STORAGE_KEY));
      } catch {
        // ignore
      }
    };

    window.addEventListener(ASSETS_CHANGE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(ASSETS_CHANGE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    founderPhoto,
    bookCover,
    hasCustomFounder,
    hasCustomBook,
    defaultFounderPhoto: ASSETS.founderPhoto,
    default3dBook: ASSETS.shunya3dBook,
    default2dCover: ASSETS.shunyaCover,
    saveFounderPhoto: saveCustomFounderPhoto,
    resetFounderPhoto: resetCustomFounderPhoto,
    saveBookCover: saveCustomBookCover,
    resetBookCover: resetCustomBookCover,
  };
}
