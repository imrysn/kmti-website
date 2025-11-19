/**
 * Utility to prevent text selection and copy events on non-interactive elements
 * while keeping interactive elements (links, buttons, inputs) functional
 */

/**
 * Checks if an element is an interactive element that should allow text selection
 */
const isInteractiveElement = (element: HTMLElement | null): boolean => {
  if (!element) return false;

  const tagName = element.tagName.toLowerCase();
  const interactiveTags = ['a', 'button', 'input', 'textarea', 'select', 'label'];
  
  if (interactiveTags.includes(tagName)) {
    return true;
  }

  // Check for contenteditable elements
  const contentEditable = element.getAttribute('contenteditable');
  if (contentEditable === 'true' || contentEditable === '') {
    return true;
  }

  // Check if element is inside an interactive element
  const closestInteractive = element.closest('a, button, input, textarea, select, label, [contenteditable="true"], [contenteditable=""]');
  if (closestInteractive) {
    return true;
  }

  return false;
};

/**
 * Prevents copy events on non-interactive elements
 */
export const preventCopyOnNonInteractive = (event: ClipboardEvent): void => {
  const target = event.target as HTMLElement;
  
  // Allow copy in interactive elements
  if (isInteractiveElement(target)) {
    return;
  }

  // Prevent copy on non-interactive elements
  event.preventDefault();
};

/**
 * Prevents context menu (right-click) copy on non-interactive elements
 */
export const preventContextMenuOnNonInteractive = (event: MouseEvent): void => {
  const target = event.target as HTMLElement;
  
  // Allow context menu in interactive elements
  if (isInteractiveElement(target)) {
    return;
  }

  // Prevent context menu on non-interactive elements
  event.preventDefault();
};

/**
 * Initializes text selection prevention handlers
 * Call this once when the app loads
 */
export const initTextSelectionPrevention = (): (() => void) => {
  // Prevent copy events (Ctrl+C, Cmd+C)
  const handleCopy = (event: ClipboardEvent) => {
    preventCopyOnNonInteractive(event);
  };

  // Prevent context menu on non-interactive elements
  const handleContextMenu = (event: MouseEvent) => {
    preventContextMenuOnNonInteractive(event);
  };

  // Add event listeners
  document.addEventListener('copy', handleCopy);
  document.addEventListener('contextmenu', handleContextMenu);

  // Return cleanup function
  return () => {
    document.removeEventListener('copy', handleCopy);
    document.removeEventListener('contextmenu', handleContextMenu);
  };
};

