import React, { useEffect, useRef, useState } from 'react';
import styles from './Loader.module.scss';
import i18n from "@/i18n";

const Loader = ({ totalDays, availableDays }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    const [progress, setProgress] = useState(0);
    const animationRef = useRef();

    useEffect(() => {
        const progressValue = (availableDays / totalDays) * 100;
        let start = 0;

        const animate = () => {
            setProgress(start);
            start += 1;

            if (start <= progressValue) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [totalDays, availableDays]);

    return (
        <div className={styles.loaderContainer}>
            <svg className={styles.loader} viewBox="0 0 200 200">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0077ff" stopOpacity="1" />
                        <stop offset="100%" stopColor="#954ade" stopOpacity="1" />
                        <animate attributeName="stop-color" dur="2s" repeatCount="indefinite">
                            <stop offset="0%" stopColor="#954ade" stopOpacity="1">
                                <animate attributeName="offset" dur="2s" values="0;1;0" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" stopColor="#0077ff" stopOpacity="1">
                                <animate attributeName="offset" dur="2s" values="0;1;0" repeatCount="indefinite" />
                            </stop>
                        </animate>
                    </linearGradient>
                </defs>
                <circle
                    className={styles['loader-background']}
                    cx="100"
                    cy="100"
                    r={radius}
                    strokeDasharray={`${circumference} ${circumference}`}
                />
                <circle
                    className={styles['loader-progress']}
                    cx="100"
                    cy="100"
                    r={radius}
                    strokeDasharray={`${progress / 100 * circumference} ${circumference}`}
                />
            </svg>
            <div className={styles.textContainer}>
                <span className={styles.text}>{i18n.language.includes('en') ? 'Remaining' : "الباقي"}</span>
                <span className={styles.text}>{`${availableDays} ${i18n.language.includes('en') ? 'Days' : "يوم"}`}</span>
            </div>
        </div>
    );
};

export default Loader;
