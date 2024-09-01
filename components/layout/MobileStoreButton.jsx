import React from 'react';

const imageLinks = {
    ios: '/apple-store.png',
    android: '/google-play.png',
};

const MobileStoreButton = ({ store, url, height = 75, width = 255, linkStyles, linkProps, ...props }) => {
    const defaultLinkStyles = {
        background: `url(${imageLinks[store]}) no-repeat`,
        // MAKE THE BACKGROUND IMAGE FIT THE DIV
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        display: 'inline-block',
        overflow: 'hidden',
        textDecoration: 'none',
        height: '100%',
        width: '100%',
        padding: '5px',
        ...linkStyles,
    };

    return (
        <div style={{ height, width, display: 'inline-block' }} {...props}>
            <a
                style={defaultLinkStyles}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                {...linkProps}
            >
                &nbsp;
            </a>
        </div>
    );
};

export default MobileStoreButton;
