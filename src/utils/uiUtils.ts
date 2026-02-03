import React from 'react';

/**
 * Checks if the provided icon is a string representing an image URL or file path.
 * This helps distinguish between image paths and React Nodes (components/icons).
 * 
 * @param icon - The icon to check (string or ReactNode)
 * @returns true if icon is a string looking like an image path
 */
export const isImageIcon = (icon: string | React.ReactNode): icon is string => {
  if (typeof icon !== 'string') return false;

  const lowerIcon = icon.toLowerCase();
  return (
    lowerIcon.includes('.png') ||
    lowerIcon.includes('.jpg') ||
    lowerIcon.includes('.jpeg') ||
    lowerIcon.includes('.svg') ||
    lowerIcon.includes('.gif') ||
    lowerIcon.includes('.webp') ||
    icon.startsWith('/') ||
    icon.startsWith('http') ||
    icon.startsWith('data:')
  );
};
