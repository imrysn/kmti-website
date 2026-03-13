/**
 * Global Intersection Observer for efficient image lazy loading.
 * Replaces the native `loading="lazy"` which can be overly eager on mobile.
 */

import { useEffect, useState } from 'react';

// Single global observer to save memory
let observer: IntersectionObserver | null = null;
const callbacks = new Map<Element, (isIntersecting: boolean) => void>();

function getObserver() {
    if (typeof window === 'undefined') return null;
    
    if (!observer) {
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const callback = callbacks.get(entry.target);
                    if (callback && entry.isIntersecting) {
                        callback(true);
                        // Once intersected, we aggressively stop observing
                        observer?.unobserve(entry.target);
                        callbacks.delete(entry.target);
                    }
                });
            },
            {
                root: null,
                rootMargin: '200px', // Load images slightly before they enter the screen
                threshold: 0.01
            }
        );
    }
    return observer;
}

export function useIntersectionObserver(
    ref: React.RefObject<HTMLElement | null>,
    isEager: boolean
) {
    const [isInView, setIsInView] = useState(isEager);

    useEffect(() => {
        if (isEager || isInView) return;

        const target = ref.current;
        if (!target) return;

        const obs = getObserver();
        if (obs) {
            callbacks.set(target, setIsInView);
            obs.observe(target);
        }

        return () => {
            if (target && obs) {
                obs.unobserve(target);
                callbacks.delete(target);
            }
        };
    }, [ref, isEager, isInView]);

    return isInView;
}

// ---------------------------------------------------------
// Legacy pause/resume compatibility for 3D Viewer
// ---------------------------------------------------------

let paused = false;

export function pauseImageQueue() {
    paused = true;
}

export function resumeImageQueue() {
    paused = false;
}

export { paused };
