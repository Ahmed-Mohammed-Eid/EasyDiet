import React, {useEffect} from 'react'
import Head from 'next/head'
import {useRouter} from "next/router";
import Image from "next/image";
import Link from "next/link";
// LANGUAGE
import {useTranslation} from "react-i18next";
import i18n from "@/i18n";

// HELPERS
import {extractTokenFromCookie} from "@/helpers/extractToken";
import axios from "axios";

// REDUX
import {useDispatch, useSelector} from "react-redux";
import {setAll} from "@/redux/slices/user/home-slice";

//STYLE
import classes from '@/styles/pages/global/home.module.scss'
// COMPONENTS
import MobileStoreButton from "@/components/layout/MobileStoreButton";


export default function Home({isAuthenticated, userData}) {
    // ROUTER
    const router = useRouter();
    // LANGUAGE
    const {t} = useTranslation('home');

    // REDUX
    const dispatch = useDispatch();
    const {
        subscriptionId,
        has_subscription,
        subscriptionEndDate,
        subscriptionStartDate,
        clientName,
        clientNameEn,
        bundleId,
        bundleName,
        bundleNameEn
    } = useSelector(state => state.home);

    // Helpers Functions
    const toggleLanguage = () => {
        let htmlTag;
        let bodyTag;
        if (document) {
            htmlTag = document.querySelector('html');
            bodyTag = document.body;
        }

        if (i18n.language.includes('en')) {
            if (htmlTag) {
                htmlTag.setAttribute('lang', 'ar');
                htmlTag.setAttribute('dir', 'rtl');
                bodyTag.classList.add('ARABIC');
            }
            i18n.changeLanguage('ar')
        } else {
            if (htmlTag) {
                htmlTag.setAttribute('lang', 'en')
                htmlTag.setAttribute('dir', 'ltr');
                bodyTag.classList.remove('ARABIC');
            }
            i18n.changeLanguage('en');
        }
    }

    // EFFECT TO GET THE USER DATA IF THE USER IS AUTHENTICATED AND THE USER DATA ROLE IS CLIENT
    useEffect(() => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        if (isAuthenticated && userData?.decodedToken?.role === "client") {
            axios.get(`https://api.easydietkw.com/api/v1/client/profile?clientId=${userData?.decodedToken?.userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    dispatch(setAll({
                        subscriptionId: res.data.client?.subscriptionId,
                        has_subscription: res.data.client?.subscriped,
                        subscriptionEndDate: res.data.client?.subscripedBundle?.endingDate,
                        subscriptionStartDate: res.data.client?.subscripedBundle?.startingDate,
                        clientName: res.data.client?.clientName,
                        clientNameEn: res.data.client?.clientNameEn || res.data.client?.clientName,
                        bundleId: res.data.client?.subscripedBundle?.bundleId?._id,
                        bundleName: res.data.client?.subscripedBundle?.bundleId?.bundleName,
                        bundleNameEn: res.data.client?.subscripedBundle?.bundleId?.bundleNameEn,
                    }))
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [dispatch, isAuthenticated, userData?.decodedToken?.role, userData?.decodedToken?.userId]);


    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet</title>
                <meta name="description"
                      content="EasyDiet has been offering healthy meal options for over 5 years. With a diverse menu of delicious and locally-sourced ingredients, their experienced chefs provide convenient and energizing meals. Experience a healthier lifestyle with EasyDiet."/>
                <meta name="keywords"
                      content="healthy meals, meal delivery, fresh ingredients, locally-sourced, convenient meal options, energy-boosting, nutritious food, easy ordering, delicious and healthy, meal plans, EasyDiet, Easy Diet, EasyDiet Dubai, EasyDiet UAE, EasyDiet Abu Dhabi, EasyDiet Sharjah, EasyDiet Ajman, EasyDiet Fujairah, EasyDiet Ras Al Khaimah, EasyDiet Umm Al Quwain, EasyDiet Al Ain, EasyDiet Al Gharbia, EasyDiet Al Dhafra, EasyDiet Al Ruwais, EasyDiet Al Wathba, EasyDiet Al Khazna, EasyDiet Al Khatim, EasyDiet Al Mirfa, EasyDiet Al Sila, EasyDietKw, EasyDiet-kw, EasyDiet-kw.com, easydietkw.com"/>
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
            <div className={classes?.Container}>
                <div className={classes?.Main}>
                    <div className={classes?.Right}>
                        <div className={classes?.Logo} onClick={() => router.push('/')}>
                            <Image src={'/easyDietLogo-text.png'} alt={'logo'} width={104.5} height={100}/>
                        </div>

                        {/* APP LINKS BUTTONS FOR GOOGLE PLAY AND APP STORE*/}
                        <div className={classes?.AppLinks}>
                            <MobileStoreButton
                                store="android"
                                url="https://play.google.com/store/apps/details?id=com.easydiet.kw"
                                linkProps={{title: 'Android Store Button'}}
                                height={54}
                                width={180}
                            />
                            <MobileStoreButton
                                store="ios"
                                url="https://apps.apple.com/us/app/easydiet/id6467135145?platform=iphone"
                                linkProps={{ title: 'iOS Store Button' }}
                                width={180}
                                height={54}
                            />
                        </div>

                        {(!isAuthenticated || userData?.decodedToken?.role !== "client") && (
                            <div className={classes?.Content}>
                                <h1 className={classes?.Header}>{t('title')}</h1>
                                <p className={classes?.Paragraph}>
                                    {t('paragraph')}
                                </p>
                                <button className={[classes?.Button, classes.AtMini].join(' ')}
                                        onClick={() => router.push('/user/packages')}>
                                    {t('button')}
                                </button>
                                <button className={[classes?.Button, classes.MenuButton].join(' ')}
                                        onClick={() => router.push('/user/menu')}>
                                    {t('menuButton')}
                                </button>
                            </div>)}
                        {/*  ADD ANOTHER CODE IF THERE IS A LOGIN AND THE USER IS A CLIENT  */}
                        {(isAuthenticated && userData?.decodedToken?.role === "client" && has_subscription) && (
                            <div className={[classes?.Content, classes?.Exist].join(' ')}>
                                <h1 className={classes?.Header}>{t("welcome")} &#34;{i18n.language.includes('en') ? (clientNameEn || clientName) : clientName}&#34;</h1>
                                <p className={classes?.Paragraph}>
                                    {t("message1")} <span
                                    className={'Colored'}>&#34;{i18n.language.includes('en') ? (bundleNameEn || bundleName) : bundleName}&#34;</span> {t("message2")}
                                    <span
                                        className={'Colored'}>&#34;{new Date(subscriptionStartDate).toLocaleDateString(i18n.language.includes('en') ? 'en-US' : 'ar-EG', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}&#34;</span>
                                    {t("message3")}
                                    <span className={'Colored'}>
                                        &#34;{new Date(subscriptionEndDate).toLocaleDateString(i18n.language.includes('en') ? 'en-US' : 'ar-EG', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}&#34;
                                    </span>,
                                    {t("message4")}
                                </p>
                                <button className={classes?.Button}
                                        onClick={() => router.push('/user/my_subscription')}>
                                    {t("buttonUser")}
                                </button>
                            </div>
                        )}
                        {/*  ADD ANOTHER CODE IF THERE IS A LOGIN AND THE USER IS A CLIENT  */}
                        {(isAuthenticated && userData?.decodedToken?.role === "client" && !has_subscription) && (
                            <div className={[classes?.Content, classes?.Exist].join(' ')}>
                                <h1 className={classes?.Header}>{t("welcome")} &#34;{i18n.language.includes('en') ? (clientNameEn || clientName) : clientName}&#34;</h1>
                                <p className={classes?.Paragraph}>
                                    {t("youAreNotSubscribed")} <Link href={'/user/License'} target={'_blank'}
                                                                     className={"Colored"}>{t("terms")}</Link>
                                </p>
                                <button className={classes?.Button} onClick={() => router.push('/user/packages')}>
                                    {t("button")}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={classes?.Left}>
                        <div className={classes?.Language}>
                            <button onClick={toggleLanguage}>
                                {i18n?.language && i18n.language.includes('en') ? (
                                    <>
                                        <Image src={'/images/Arabic_Icon.svg'} alt={'Arabic icon'} width={30}
                                               height={20}/>
                                        <span style={{fontFamily: `var(--font-almarai)`}}>AR</span>
                                    </>
                                ) : (
                                    <>
                                        <Image src={'/images/English_Icon.svg'} alt={'Arabic icon'} width={30}
                                               height={20}/>
                                        <span>EN</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <div className={classes?.Buttons}>
                            <button title={t('login')} onClick={() => {
                                if (isAuthenticated && userData?.decodedToken?.role === 'admin') {
                                    router.push('/admin/dashboard')
                                } else if (isAuthenticated && userData?.decodedToken?.role === 'manager') {
                                    router.push('/admin/branch')
                                } else if (isAuthenticated && userData?.decodedToken?.role === 'diet specialist') {
                                    router.push('/doctor')
                                } else if (isAuthenticated && userData?.decodedToken?.role === 'client') {
                                    router.push('/user/my_subscription')
                                } else {
                                    router.push('/auth/login')
                                }
                            }}>
                                <Image src={'/images/Global/Login_Icon.svg'} alt={'login'} width={22} height={22}/>
                            </button>
                            <button title={t('aboutTitle')} onClick={() => router.push('/about')}>
                                <Image src={'/images/Global/About_Icon.svg'} alt={'login'} width={24} height={24}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
