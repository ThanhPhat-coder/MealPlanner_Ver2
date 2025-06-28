import { useState, useEffect, useRef } from 'react';

export default function useScrollInfinite(items = [], options = {}) {
    const {
        enabled = true,
        threshold = 0.25, // Ngưỡng để trigger slide change (25% của slide width)
        transitionDuration = 400,
        autoScroll = false,
        autoScrollInterval = 4000
    } = options;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [prevTranslate, setPrevTranslate] = useState(0);
    
    const startXRef = useRef(0);
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const slideDimensionsRef = useRef({ width: 0, outerWidth: 0 });

    // Calculate slide dimensions
    const calculateSlideDimensions = () => {
        if (!trackRef.current || items.length === 0) return;
        
        const firstSlide = trackRef.current.children[0];
        if (!firstSlide) return;
        
        const slideWidth = firstSlide.offsetWidth;
        const styles = getComputedStyle(firstSlide);
        const slideMargin = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
        const slideOuterWidth = slideWidth + slideMargin;
        
        slideDimensionsRef.current = { width: slideWidth, outerWidth: slideOuterWidth };
        
        console.log('Slide dimensions:', { slideWidth, slideMargin, slideOuterWidth }); // Debug
        return { slideWidth, slideOuterWidth };
    };

    // Set slider position with transition
    const setSliderPosition = (translate = currentTranslate, withTransition = true) => {
        if (!trackRef.current) return;
        
        trackRef.current.style.transition = withTransition 
            ? `transform ${transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
            : 'none';
        trackRef.current.style.transform = `translateX(${translate}px)`;
        
        // Update card states based on position
        updateCardStates();
    };

    // Update card visual states (center-card, side-card classes)
    const updateCardStates = () => {
        if (!trackRef.current || items.length === 0) return;
        
        const slides = trackRef.current.children;
        const totalSlides = items.length;
        const actualIndex = ((currentIndex % totalSlides) + totalSlides) % totalSlides;
        
        Array.from(slides).forEach((slide, index) => {
            slide.classList.remove('center-card', 'side-card');
            
            // Handle both original slides and duplicate slides
            const slideIndex = index >= totalSlides ? index - totalSlides : index;
            
            if (slideIndex === actualIndex) {
                slide.classList.add('center-card');
            } else {
                slide.classList.add('side-card');
            }
        });
    };

    // Set position by index with centering
    const setPositionByIndex = (index = currentIndex) => {
        if (!containerRef.current || !trackRef.current) return;
        
        const { slideWidth, slideOuterWidth } = slideDimensionsRef.current;
        if (!slideWidth || !slideOuterWidth) return;
        
        // Center current slide with peek effect
        const containerWidth = containerRef.current.offsetWidth;
        const offset = (containerWidth - slideWidth) / 2;
        const translate = (index * -slideOuterWidth) + offset;
        
        setCurrentTranslate(translate);
        setPrevTranslate(translate);
        setSliderPosition(translate, true);
    };

    // Touch event handlers
    const handleTouchStart = (e) => {
        if (!enabled) return;
        
        setIsDragging(true);
        startXRef.current = e.touches[0].clientX;
        setSliderPosition(currentTranslate, false);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !enabled) return;
        e.preventDefault();
        
        const currentPosition = e.touches[0].clientX;
        const diff = currentPosition - startXRef.current;
        const newTranslate = prevTranslate + diff;
        
        setCurrentTranslate(newTranslate);
        setSliderPosition(newTranslate, false);
    };

    const handleTouchEnd = () => {
        if (!enabled) return;
        
        setIsDragging(false);
        const { slideOuterWidth } = slideDimensionsRef.current;
        
        if (!slideOuterWidth) {
            console.warn('No slideOuterWidth found');
            return;
        }
        
        const movedBy = currentTranslate - prevTranslate;
        const moveThreshold = slideOuterWidth * threshold;
        
        console.log('Touch end:', { movedBy, moveThreshold, currentIndex }); // Debug
        
        let newIndex = currentIndex;
        
        // Determine direction and update index
        if (Math.abs(movedBy) > moveThreshold) {
            if (movedBy < 0) {
                // Swipe left - next slide
                newIndex = currentIndex + 1;
            } else {
                // Swipe right - previous slide
                newIndex = currentIndex - 1;
            }
        }
        
        console.log('New index:', newIndex); // Debug
        setCurrentIndex(newIndex);
        
        // Handle infinite scroll reset
        const totalSlides = items.length;
        if (newIndex >= totalSlides) {
            setTimeout(() => {
                const resetIndex = newIndex - totalSlides;
                setCurrentIndex(resetIndex);
            }, 450);
        } else if (newIndex < 0) {
            setTimeout(() => {
                const resetIndex = totalSlides + newIndex;
                setCurrentIndex(resetIndex);
            }, 450);
        }
    };

    // Handle transition end for infinite scroll reset
    const handleTransitionEnd = () => {
        const totalSlides = items.length;
        
        if (currentIndex >= totalSlides) {
            const resetIndex = currentIndex - totalSlides;
            setCurrentIndex(resetIndex);
            setTimeout(() => setPositionByIndex(resetIndex), 16);
        } else if (currentIndex < 0) {
            const resetIndex = totalSlides + currentIndex;
            setCurrentIndex(resetIndex);
            setTimeout(() => setPositionByIndex(resetIndex), 16);
        }
    };

    // Initialize and handle dimension changes
    useEffect(() => {
        if (!enabled || items.length === 0) return;
        
        const initializeSlider = () => {
            calculateSlideDimensions();
            setPositionByIndex(0);
        };
        
        // Initialize after mount
        setTimeout(initializeSlider, 100);
        
        // Handle window resize
        const handleResize = () => {
            calculateSlideDimensions();
            setPositionByIndex(currentIndex);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [enabled, items.length, currentIndex]);

    // Auto scroll effect
    useEffect(() => {
        if (!autoScroll || !enabled || items.length === 0 || isDragging) return;
        
        const interval = setInterval(() => {
            setCurrentIndex(prev => prev + 1);
        }, autoScrollInterval);

        return () => clearInterval(interval);
    }, [autoScroll, enabled, items.length, isDragging, autoScrollInterval]);

    // Update position when currentIndex changes
    useEffect(() => {
        if (enabled && !isDragging) {
            setPositionByIndex(currentIndex);
        }
    }, [currentIndex, enabled, isDragging]);

    // Bind event listeners
    useEffect(() => {
        if (!enabled || !trackRef.current) return;
        
        const track = trackRef.current;
        
        track.addEventListener('touchstart', handleTouchStart, { passive: false });
        track.addEventListener('touchmove', handleTouchMove, { passive: false });
        track.addEventListener('touchend', handleTouchEnd);
        track.addEventListener('transitionend', handleTransitionEnd);
        
        return () => {
            track.removeEventListener('touchstart', handleTouchStart);
            track.removeEventListener('touchmove', handleTouchMove);
            track.removeEventListener('touchend', handleTouchEnd);
            track.removeEventListener('transitionend', handleTransitionEnd);
        };
    }, [enabled, items.length, currentIndex, currentTranslate, prevTranslate, isDragging]);

    // Public methods
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const nextSlide = () => {
        setCurrentIndex(prev => prev + 1);
    };

    const prevSlide = () => {
        setCurrentIndex(prev => prev - 1);
    };

    return {
        currentIndex,
        isDragging,
        containerRef,
        trackRef,
        goToSlide,
        nextSlide,
        prevSlide,
        // Computed values
        actualIndex: ((currentIndex % items.length) + items.length) % items.length,
        // For creating duplicate slides in infinite scroll
        infiniteItems: enabled ? [...items, ...items.slice(0, Math.min(3, items.length))] : items
    };
} 