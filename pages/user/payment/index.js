import Image from 'next/image';
import {useState} from 'react';
import Head from "next/head";
import styles from '@/styles/pages/user/paymentMethod.module.scss';
// LANGUAGE
import {useTranslation} from "react-i18next";

const PaymentMethods = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    // LANGUAGE
    const {t} = useTranslation('paymentMethod');

    const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Submit payment method
    };

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Payment</title>
                <meta name="description"
                      content="Discover EasyDiet's healthy meal options that have been satisfying customers for over five years. Our experienced chefs prepare each meal with fresh, locally-sourced ingredients to ensure that you get the best quality and flavor. Choose EasyDiet for convenient and delicious meals that leave you feeling energized and healthy."/>
                <meta name="keywords"
                      content="healthy meals, meal delivery, fresh ingredients, locally-sourced, convenient meal options, energy-boosting, nutritious food, easy ordering, delicious and healthy, meal plans"/>
                <meta name="author" content="EasyDiet"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta name="robots" content="index, follow"/>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta name="language" content="English"/>
                <meta name="revisit-after" content="2 days"/>
                <meta name="generator" content="EasyDiet"/>
                <meta name="og:title" content="EasyDiet"/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://easydietkw.com/"/>
                <meta property="og:image" content="/easyDietLogo.png"/>
                <meta property="og:site_name" content="EasyDiet"/>
                <meta property="og:description"
                      content="EasyDiet has been offering healthy meal options for over 5 years. With a diverse menu of delicious and locally-sourced ingredients, their experienced chefs provide convenient and energizing meals. Experience a healthier lifestyle with EasyDiet."/>
            </Head>
            <div className={styles.paymentMethods}>
                <h1>{t("title")}</h1>
                <h2 className={styles.paymentValue}>{t("paymentValue")} 50.00 {t("price")}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.paymentMethodList}>
                        <div className={styles.paymentMethod}>
                            <input
                                type="radio"
                                id="paypal"
                                name="paymentMethod"
                                value="knet"
                                checked={selectedPaymentMethod === 'knet'}
                                onChange={handlePaymentMethodChange}
                                className={styles.paymentMethodInput}
                            />
                            <label htmlFor="paypal" className={styles.paymentMethodLabel}>
                                <Image src="/images/knet.jpg" alt="knet" width={50} height={50}/>
                            </label>
                        </div>
                        <div className={styles.paymentMethod}>
                            <input
                                type="radio"
                                id="visa"
                                name="paymentMethod"
                                value="visa"
                                checked={selectedPaymentMethod === 'visa'}
                                onChange={handlePaymentMethodChange}
                                className={styles.paymentMethodInput}
                            />
                            <label htmlFor="visa" className={styles.paymentMethodLabel}>
                                <Image
                                    src="/images/visa.jpg"
                                    alt="visa"
                                    width={50}
                                    height={50}
                                />
                            </label>
                        </div>
                        <div className={styles.paymentMethod}>
                            <input
                                type="radio"
                                id="mastercard"
                                name="paymentMethod"
                                value="mastercard"
                                checked={selectedPaymentMethod === 'mastercard'}
                                onChange={handlePaymentMethodChange}
                                className={styles.paymentMethodInput}
                            />
                            <label htmlFor="mastercard" className={styles.paymentMethodLabel}>
                                <Image
                                    src="/images/mastercard.jpg"
                                    alt="mastercard"
                                    width={50}
                                    height={50}
                                />
                            </label>
                        </div>
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        {t("button")}
                    </button>
                </form>
            </div>
        </>
    );
};

export default PaymentMethods;
