import React, { useState, useRef, useCallback, useEffect } from 'react';
import './LazyImage.css';
import { enqueueImage, releaseSlot } from '../../../utils/imageQueue';

/**
 * How early to start pre-fetching images before they reach the viewport.
 *
 * "200px" = start loading when image is 200px below the visible area —
 * enough look-ahead so images are ready by scroll time, but still deferred
 * vs. loading everything at page load. Combined with the global 3-request
 * concurrency cap this keeps 3G connections from being overwhelmed.
 */
const PREFETCH_MARGIN = '200px';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000; // 1s → 2s → 4s



interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    /** Use 'eager' for critical above-the-fold images (e.g. the navbar logo). Default: 'lazy'. */
    loading?: 'lazy' | 'eager';
    /** CSS class applied to the outer wrapper div. */
    wrapperClassName?: string;
    /** Optional local fallback image URL if the main src fails. */
    fallbackSrc?: string;
    /** Optional React node to render instead of the default error UI. */
    fallbackNode?: React.ReactNode;
}

const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    loading = 'lazy',
    className = '',
    wrapperClassName = '',
    style,
    fallbackSrc,
    fallbackNode,
    ...rest
}) => {
    /**
     * loadSrc: the URL currently assigned to <img src>.
     * null = not started yet (waiting for IntersectionObserver / queue).
     */
    const [loadSrc, setLoadSrc] = useState<string | null>(loading === 'eager' ? src : null);
    const [status, setStatus] = useState<'waiting' | 'loading' | 'retrying' | 'loaded' | 'broken'>(
        loading === 'eager' ? 'loading' : 'waiting'
    );

    const wrapperRef = useRef<HTMLDivElement>(null);
    const retriesRef = useRef(0);
    const triedFallbackRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cancelQueueRef = useRef<(() => void) | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    /** True only when a queue slot has been claimed for this image. */
    const slotTakenRef = useRef(false);

    // --- IntersectionObserver: watch until image is near the viewport ----------
    useEffect(() => {
        if (loading === 'eager') return; // skip — already loading immediately

        const el = wrapperRef.current;
        if (!el) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    // Entered the pre-fetch zone — disconnect observer and join the queue
                    observerRef.current?.disconnect();
                    cancelQueueRef.current = enqueueImage(() => {
                        slotTakenRef.current = true;
                        setStatus('loading');
                        setLoadSrc(src);
                    });
                }
            },
            { rootMargin: PREFETCH_MARGIN }
        );

        observerRef.current.observe(el);

        return () => {
            observerRef.current?.disconnect();
        };
    }, [src, loading]);

    // --- Cleanup on unmount ----------------------------------------------------
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (cancelQueueRef.current) cancelQueueRef.current();
        };
    }, []);

    // --- Image event handlers --------------------------------------------------
    const handleLoad = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (slotTakenRef.current) { releaseSlot(); slotTakenRef.current = false; }
        setStatus('loaded');
    }, []);

    const handleError = useCallback(() => {
        if (retriesRef.current >= MAX_RETRIES) {
            // If we have a fallback URL and haven't tried it yet, try now
            if (fallbackSrc && !triedFallbackRef.current) {
                triedFallbackRef.current = true;
                retriesRef.current = 0; // reset for the fallback
                setLoadSrc(fallbackSrc);
                setStatus('loading');
                return;
            }

            if (slotTakenRef.current) { releaseSlot(); slotTakenRef.current = false; }
            setStatus('broken');
            return;
        }
        setStatus('retrying');
        const delay = BASE_DELAY_MS * Math.pow(2, retriesRef.current); // 1s, 2s, 4s
        timerRef.current = setTimeout(() => {
            retriesRef.current += 1;
            // Cache-bust to force re-fetch if not already trying fallback
            if (!triedFallbackRef.current) {
                const base = src.split('?')[0];
                setLoadSrc(`${base}?_r=${retriesRef.current}`);
            } else {
                setLoadSrc(`${fallbackSrc}?_r=${retriesRef.current}`);
            }
            setStatus('loading');
        }, delay);
    }, [src, fallbackSrc]);

    // For eager images the slot is never enqueued, so no release needed on their
    // handleLoad — BUT we still want consistent state, so keep it simple.

    const isLoaded = status === 'loaded';
    const isBroken = status === 'broken';
    const isRetrying = status === 'retrying';
    const isWaiting = status === 'waiting';
    const isLoading = status === 'loading';

    return (
        <div className={`lazy-image-wrapper ${wrapperClassName}`} style={style} ref={wrapperRef}>
            {/* Skeleton shimmer while waiting / loading / retrying */}
            {(isWaiting || isLoading || isRetrying) && (
                <div className="lazy-image-skeleton" aria-hidden="true" />
            )}

            {/* Retrying spinner overlay */}
            {isRetrying && (
                <div className="lazy-image-retry-overlay" aria-hidden="true">
                    <div className="lazy-image-retry-spinner" />
                    <span>Retrying…</span>
                </div>
            )}

            {/* Broken state — all retries exhausted */}
            {isBroken && (
                fallbackNode ? <>{fallbackNode}</> : (
                    <div className="lazy-image-broken" aria-label={`Could not load: ${alt}`}>
                        <div className="lazy-image-broken-icon" style={{ fontSize: '3rem', lineHeight: 1 }}>
                            📡
                        </div>
                        <span className="lazy-image-broken-text">Image unavailable, please check your internet connection.</span>
                    </div>
                )
            )}

            {/* The actual image — hidden until loaded, not rendered at all when waiting */}
            {!isBroken && loadSrc && (
                <img
                    {...rest}
                    src={loadSrc}
                    alt={alt}
                    className={`lazy-image-img ${isLoaded ? 'lazy-image-visible' : 'lazy-image-hidden'} ${className}`}
                    onLoad={handleLoad}
                    onError={handleError}
                    decoding="async"
                    fetchPriority={loading === 'eager' ? 'high' : 'low'}
                />
            )}
        </div>
    );
};

export default LazyImage;
