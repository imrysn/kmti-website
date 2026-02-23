/**
 * Global image request queue with concurrency limit.
 *
 * On 3G networks, firing 40+ simultaneous image requests saturates the pipe.
 * This queue ensures at most MAX_CONCURRENT images download at the same time.
 * Images are processed in order of enqueue (roughly viewport order).
 *
 * Usage:
 *   enqueueImage(src, () => setReadyToLoad(true));
 */

const MAX_CONCURRENT = 3; // 3G sweet spot: enough parallelism, not overwhelming

let active = 0;
const queue: Array<() => void> = [];

function pump() {
    while (active < MAX_CONCURRENT && queue.length > 0) {
        const next = queue.shift()!;
        active++;
        next();
    }
}

/**
 * Enqueue an image load slot. When a slot is available, `onReady` is called,
 * which should trigger the actual src assignment. Call `releaseSlot` when the
 * image finishes loading or errors.
 *
 * @returns A cancel function — call it if the component unmounts before loading.
 */
export function enqueueImage(onReady: () => void): () => void {
    let cancelled = false;

    const task = () => {
        if (cancelled) {
            // Slot was claimed but component unmounted — release immediately
            releaseSlot();
            return;
        }
        onReady();
    };

    queue.push(task);
    pump();

    return () => {
        cancelled = true;
        // If still in queue (not yet started), remove it
        const idx = queue.indexOf(task);
        if (idx !== -1) {
            queue.splice(idx, 1);
        }
    };
}

/**
 * Call this when an image finishes loading or errors, to free up a slot.
 */
export function releaseSlot() {
    active = Math.max(0, active - 1);
    pump();
}
