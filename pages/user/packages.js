import {useEffect, useState} from "react";
import classes from '@/styles/pages/user/packages.module.scss'
import Head from "next/head";
// IMPORTS
// import PackageCard from "@/components/pages/dashboard/Package_card/PackageCard_User";
import PackageCard from "@/components/layout/packageCard/PackageCard";
// HELPERS
import {extractTokenFromCookie} from "@/helpers/extractToken";
import axios from "axios";
import {toast} from "react-toastify";
// REDUX
import {useDispatch, useSelector} from "react-redux";
import {onInputChange} from '@/redux/slices/user/packages';
import {onInputChange as onInputInSubscriptionChange} from '@/redux/slices/user/subscription_info'
// LANGUAGE
import {useTranslation} from "react-i18next";


const Packages = () => {

    // LANGUAGE
    const {t} = useTranslation('bundles');

    //REDUX
    const dispatch = useDispatch();
    const {packages} = useSelector(state => state.packages_user);

    // States
    const [authenticationStatus, setAuthenticationStatus] = useState({
        isAuthenticated: false,
        hasProfile: false
    })

    useEffect(() => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        if (token) {
            axios.get(`https://api.easydietkw.com/api/v1/get/verify/token`, {
                params: {
                    token: token,
                }
            })
                .then(res => {
                    dispatch(onInputInSubscriptionChange({key: 'userId', value: res.data.decodedToken.userId}))
                    setAuthenticationStatus({
                        isAuthenticated: true,
                        hasProfile: res.data.hasProfile || false
                    })
                })
                .catch(err => console.log(err))
        }

    }, [dispatch])

    // EFFECT TO GET THE PACKAGES WHEN PAGE LOAD
    useEffect(() => {
        // LOGIC
        try {
            axios.get(`https://api.easydietkw.com/api/v1/client/bundles`)
                .then(res => {
                    dispatch(onInputChange({key: 'packages', value: res.data.bundles}))
                })
        } catch (err) {
            toast.error(err.response?.data?.message || err.message)
        }

    }, [dispatch])

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Packages</title>
                <meta name="description" content="Discover EasyDiet's healthy meal options that have been satisfying customers for over five years. Our experienced chefs prepare each meal with fresh, locally-sourced ingredients to ensure that you get the best quality and flavor. Choose EasyDiet for convenient and delicious meals that leave you feeling energized and healthy."/>
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
            <div className={classes.Main}>
                <h1>{t("title")}</h1>

                <div className={classes.Bottom}>
                    {packages && packages.map((cur) => {
                        return (
                            <PackageCard
                                ID={cur._id}
                                key={cur._id}
                                showOnly={false}
                                type={'user'}
                                name={cur.bundleName}
                                nameEn={cur.bundleNameEn}
                                textOnCardEn={cur.timeOnCardEn}
                                textOnCard={cur.timeOnCard}
                                meals={cur.mealsNumber}
                                price={cur.bundlePrice}
                                snacks={cur.snacksNumber}
                                fridays={cur.fridayOption}
                                offers={cur.bundleOffer}
                                time={cur.timeOnCard}
                                mealsType={cur.mealsType}
                                authenticationStatus={authenticationStatus}
                            />
                        )
                    })}
                </div>
            </div>
        </>
    )
}
export default Packages