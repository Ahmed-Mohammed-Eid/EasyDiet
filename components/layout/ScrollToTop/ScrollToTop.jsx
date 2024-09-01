import React, { useState, useEffect } from 'react';
import styles from './ScrollToTop.module.scss';

const ScrollToTop = ({ parentRef }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {

        const element = parentRef.current;

        const handleScroll = () => {
            const scrollTop = parentRef.current.scrollTop;

            if (scrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        element.addEventListener('scroll', handleScroll);
        return () => element.removeEventListener('scroll', handleScroll);
    }, [parentRef]);

    const scrollToTop = () => {
        parentRef.current.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div>
            {isVisible && (
                <div className={styles.scrollToTop} onClick={scrollToTop}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4L4 11H8V19H16V11H20L12 4Z" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default ScrollToTop;
