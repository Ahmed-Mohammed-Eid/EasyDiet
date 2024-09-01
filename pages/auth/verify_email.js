import {useEffect, useState} from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/router";
//STYLE
import classes from '@/styles/pages/verify_email.module.scss'
// HELPERS
import axios from "axios";
import {toast} from "react-toastify";
// Language
import {useTranslation} from "react-i18next";
// IMPORTS
import Spinner from "@/components/layout/spinner/Spinner";
// REDUX
import {useSelector, useDispatch} from "react-redux";
import {onInputChange} from '@/redux/slices/Auth/resetPasswordSlice';

export default function VerifyEmail({isAuthenticated}) {

    // ROUTER
    const router = useRouter();
    // LANGUAGE
    const {t} = useTranslation('verifyEmail');


    // EFFECT TO REDIRECT TO HOME IF THE USER IS AUTHENTICATED
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/')
        }
    }, [isAuthenticated, router]);


    // STATES
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    // REDUX
    const dispatch = useDispatch();
    const {email, code} = useSelector(state => state.resetPassword);

    useEffect(()=> {

        if(!email){
            router.push('/auth/reset_password');
        }

    }, [email, router])

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        await axios.post("https://api.easydietkw.com/api/v1/verify/code", {
            email: email,
            code: code
        })
            .then(res => {
                setLoading(false);

                // Show success message
                toast.success(res.data.message);
                // REDIRECT TO NEW PASSWORD PAGE
                router.push('/auth/new_password')
            })
            .catch(err => {
                setLoading(false)
                // Show error message
                toast.error(err.response?.data?.message || err.message || "Something went wrong");
            })
    };

    // RESEND EMAIL HANDLER
    const resendCodeHandler = async () => {
        setResendLoading(true);

        await axios.post("https://api.easydietkw.com/api/v1/forgot/password", {
            email: email
        })
            .then(res => {
                setResendLoading(false);
                // Show success message
                toast.success(res.data.message);
            })
            .catch(err => {
                setResendLoading(false)
                // Show error message
                toast.error(err.response?.data?.message || err.message || "Something went wrong");
            })
    }


    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Verify Email</title>
                <meta name="description" content="Verify your email in EasyDiet and access our diverse menu of delicious, healthy meals that are perfect for people who are looking to maintain a healthy lifestyle. Our team of experienced chefs use fresh, locally-sourced ingredients to prepare each meal. Join our community of satisfied customers who have reported feeling more energized and healthier after consuming our meals. EasyDiet: Providing Healthy Meals for Over 5 Years "/>
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
            <div className={classes?.Container}>
                <div className={classes?.Main}>
                    <div className={classes?.Right}>
                        <div className={classes?.Logo} onClick={() => router.push('/')}>
                            <Image src={'/easyDietLogo-text.png'} alt={'logo'} width={104.5} height={100}/>
                        </div>
                        <form className={classes.Form} onSubmit={handleFormSubmit}>
                            <h2 className={classes.Heading_2}>{t("title")}</h2>
                            <button type={'button'} className={classes.Resend_Code} onClick={resendCodeHandler}>
                                <span>{resendLoading ? <Spinner size={2} color={`#A71523`}/> : t("resendButton")}</span>
                            </button>
                            <div className={classes.Input_Group}>
                                <div className={classes.InputBorderContainer}>
                                    <input
                                        type={'number'}
                                        id={'CODE'}
                                        name={'CODE'}
                                        placeholder={t("placeholder1")}
                                        onChange={(event) => {
                                            dispatch(onInputChange({key: 'code', value: event.target.value}))
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={classes.Form_buttons}>
                                <div className={classes.Links}>
                                    <Link href={'/auth/login'}>
                                        {t("link1")}
                                    </Link>
                                </div>
                                <div className={classes.Buttons_Container}>
                                    <button
                                        className={[classes.Create_button].join(' ')}
                                        type={'submit'}>
                                        <span>{loading ? <Spinner size={2} color={`#A71523`}/> : t("createButton")}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className={classes?.Left}>
                        <p>EASYDEIT</p>
                    </div>
                </div>
            </div>
        </>
    )
}
