/**
 * Image queue pause/resume controls.
 *
 * These are used by Model3DViewerModal to throttle image loads while a heavy
 * GLB file is downloading. The actual per-image queueing has been removed —
 * images now use native browser lazy-loading. Only the pause/resume hooks
 * remain so ModelViewer can signal "heavy load in progress" if needed in
 * future optimizations.
 */

let paused = false;

/**
 * Pause image loading signals (currently a no-op placeholder).
 * Called by Model3DViewerModal when a 3D model starts loading.
 */
export function pauseImageQueue() {
    paused = true;
}

/**
 * Resume image loading signals.
 * Called by Model3DViewerModal when a 3D model finishes loading.
 */
export function resumeImageQueue() {
    paused = false;
}

// Keep paused accessible for potential future use
export { paused };
