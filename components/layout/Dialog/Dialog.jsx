// components/Dialog.js

import React from 'react';
import styles from './Dialog.module.scss';

const Dialog = ({isOpen, onClose, children}) => {
    const dialogClassName = isOpen ? `${styles.dialog} ${styles.open}` : styles.dialog;

    return (
        <div className={dialogClassName}>
            <div className={styles.overlay} onClick={onClose}></div>
            <div className={styles.content}>{children}</div>
        </div>
    );
};

export default Dialog;
