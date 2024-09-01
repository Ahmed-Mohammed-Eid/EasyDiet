import React from 'react';
import styles from '@/styles/pages/global/License.module.scss';
import Head from "next/head";
// TRANSLATIONS
import {useTranslation} from "react-i18next";

const License = () => {

    // TEXTS
    const {t} = useTranslation('license');

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | License</title>
                <meta name="description" content="At EasyDiet, we are committed to providing our customers with transparency and trust. Our license page provides all the necessary legal information, including our licensing and registration details, as well as our terms and conditions and privacy policy. We understand the importance of trust and security when it comes to your personal information and are committed to protecting your privacy. Our privacy policy outlines how we collect, use, and store your data, ensuring that you are fully informed about our practices. At EasyDiet, we believe that transparency is key, and our license page is just one way we are working to build trust with our customers. Thank you for choosing EasyDiet for your healthy meal needs."/>
                <meta name="keywords" content="healthy meals, meal delivery, fresh ingredients, locally-sourced, convenient meal options, energy-boosting, nutritious food, easy ordering, delicious and healthy, meal plans"/>
                <meta name="author" content="EasyDiet"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta name="robots" content="index, follow"/>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta name="language" content="English"/>
                <meta name="revisit-after" content="2 days"/>
                <meta name="generator" content="EasyDiet"/>
                <meta name="og:title" content="EasyDiet"/>
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://easydietkw.com/" />
                <meta property="og:image" content="/easyDietLogo.png" />
                <meta property="og:site_name" content="EasyDiet" />
                <meta property="og:description" content="EasyDiet has been offering healthy meal options for over 5 years. With a diverse menu of delicious and locally-sourced ingredients, their experienced chefs provide convenient and energizing meals. Experience a healthier lifestyle with EasyDiet." />
            </Head>
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>{t('title')}</h1>
                <div className={styles.rules}>
                    <ol>
                        <li>{t('list1')}</li>
                        <li>{t('list2')}</li>
                        <li>{t('list3')}</li>
                        <li>{t('list4')}</li>
                        <li>{t('list5')}</li>
                        <li>{t('list6')}</li>
                    </ol>
                    <h2>{t('title2')}</h2>
                    <ol>
                        <li>{t('list7')}</li>
                        <li>{t('list8')}</li>
                        <li>{t('list9')}</li>
                        <li>{t('list10')}</li>
                        <li>{t('list11')}</li>
                        <li>{t('list12')}</li>
                    </ol>
                    <h2>{t('title3')}</h2>
                    <p>{t('text')}</p>
                </div>
            </div>
        </div>
        </>
    );
};

export default License;