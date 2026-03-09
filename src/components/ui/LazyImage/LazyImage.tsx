import React, { useState, useCallback, useRef } from 'react';
import './LazyImage.css';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    /** Use 'eager' for critical above-the-fold images (e.g. the navbar logo). Default: 'lazy'. */
    loading?: 'lazy' | 'eager';
    /** CSS class applied to the outer wrapper div (only rendered when this is provided). */
    wrapperClassName?: string;
    /** Optional local fallback image URL if the main src fails. */
    fallbackSrc?: string;
    /** Optional React node to render instead of the img when all sources fail. */
    fallbackNode?: React.ReactNode;
}

const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    loading = 'lazy',
    className = '',
    wrapperClassName,
    style,
    fallbackSrc,
    fallbackNode,
    ...rest
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isBroken, setIsBroken] = useState(false);
    const triedFallbackRef = useRef(false);

    const handleLoad = useCallback(() => {
        setIsLoaded(true);
    }, []);

    const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        if (fallbackSrc && !triedFallbackRef.current) {
            triedFallbackRef.current = true;
            (e.currentTarget as HTMLImageElement).src = fallbackSrc;
            return;
        }
        setIsBroken(true);
    }, [fallbackSrc]);

    // When broken and a fallbackNode is provided, render it (wrapped if needed)
    if (isBroken && fallbackNode) {
        if (wrapperClassName) {
            return <div className={`lazy-image-wrapper ${wrapperClassName}`}>{fallbackNode}</div>;
        }
        return <>{fallbackNode}</>;
    }

    const img = (
        <img
            {...rest}
            src={src}
            alt={alt}
            loading={loading}
            decoding="async"
            fetchPriority={loading === 'eager' ? 'high' : 'low'}
            className={`lazy-image-img ${isLoaded ? 'lazy-image-visible' : 'lazy-image-hidden'} ${className}`}
            onLoad={handleLoad}
            onError={handleError}
            style={wrapperClassName ? undefined : style}
        />
    );

    if (wrapperClassName) {
        return (
            <div className={`lazy-image-wrapper ${wrapperClassName}`} style={style}>
                {img}
            </div>
        );
    }

    return img;
};

export default LazyImage;
