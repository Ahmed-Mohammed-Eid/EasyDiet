import {useEffect, useState} from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";

//STYLE
import classes from '@/styles/pages/login.module.scss'
// HELPERS
import axios from "axios";
import {toast} from "react-toastify";
// Language
import {useTranslation} from "react-i18next";
// COMPONENTS
import Spinner from "@/components/layout/spinner/Spinner";

export default function Login({isAuthenticated}) {

    // ROUTER
    const router = useRouter();

    // EFFECT TO REDIRECT TO HOME IF THE USER IS AUTHENTICATED
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/')
        }
    }, [isAuthenticated, router]);

    // STATE
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // LANGUAGE
    const {t} = useTranslation('login');

    // EFFECT TO SET THE TOKEN AND REDIRECT THE USER
    useEffect(() => {
        const token = router.query.token;
        const hasProfile = router.query.hasProfile;

        if (token && document) {
            document.cookie = `token=${token}; path=/;`;

            if (hasProfile === 'true') {
                router.push(`/user/my_subscription`).then(() => router.reload())
            } else {
                router.push(`/user/profile`).then(() => router.reload())
            }
        }
    }, [router]);


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // CHECK THE VALIDATION
        if (!username || !password) {
            toast.error('Please fill all inputs');
            return;
        }

        setLoading(true)

        await axios.post(
            "https://api.easydietkw.com/api/v1/login",
            {
                username: username,
                password: password,
            }
        )
            .then(res => {
                setLoading(false);
                document.cookie = `token=${res.data.token}; path=/;`;

                // Redirect based on the user's role
                if (res.data.user.role === "admin") {
                    router.push(`/admin/dashboard`)
                        .then(() => router.reload())
                } else if (res.data.user.role === "client") {
                    if(localStorage.getItem('selectedPackageId')){
                        router.push(`/user/choose_starting_date?packageId=${JSON.parse(localStorage.getItem('selectedPackageId'))}`)
                            .then(() => router.reload())
                    }else{
                        router.push(`/user/my_subscription`)
                            .then(() => router.reload())
                    }
                } else if (res.data.user.role === "manager") {
                    router.push(`/admin/branch`)
                        .then(() => router.reload())
                } else if (res.data.user.role === "diet specialist") {
                    router.push(`/doctor`)
                        .then(() => router.reload())
                }

                // Show success message
                toast.success(res.data.message);
            })
            .catch(err => {
                setLoading(false)
                // Show error message
                toast.error(err.response?.data?.message || err.message || "Invalid username or password");
            })
    };


    // GOOGLE HANDLER
    const googleHandler = () => {
        axios.get('https://api.easydietkw.com/api/v1/auth/google')
            .then(res => {
                if (res.data?.authUrl) {
                    window.location.href = res.data.authUrl
                } else {
                    toast.error('Something is wrong with the auth url')
                }
            })
            .catch(err => {
                toast.error(err.response?.data?.message || err.message)
            })
    }


    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Login</title>
                <meta name="description"
                      content="Sign in to EasyDiet and access our diverse menu of delicious, healthy meals that are perfect for people who are looking to maintain a healthy lifestyle. Our team of experienced chefs use fresh, locally-sourced ingredients to prepare each meal. Join our community of satisfied customers who have reported feeling more energized and healthier after consuming our meals. EasyDiet: Providing Healthy Meals for Over 5 Years "/>
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
            <div className={classes?.Container}>
                <div className={classes?.Main}>
                    <div className={classes?.Right}>
                        <div className={classes?.Logo} onClick={() => router.push('/')}>
                            <Image src={'/easyDietLogo-text.png'} alt={'logo'} width={104.5} height={100}/>
                        </div>
                        <form className={classes.Form} onSubmit={handleFormSubmit}>
                            <h2 className={classes.Heading_2}>{t("title")}</h2>
                            <div className={classes.Input_Group}>
                                <div className={classes.InputBorderContainer}>
                                    <input
                                        onChange={(e) => setUsername(e.target.value)}
                                        type={'text'}
                                        id={'email'}
                                        placeholder={t("placeholder1")}
                                        name={'email'}/>
                                </div>
                            </div>
                            <div className={classes.Input_Group}>
                                <div className={classes.InputBorderContainer}>
                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        type={'password'}
                                        id={'password'}
                                        placeholder={t("placeholder2")}
                                        name={'password'}/>
                                </div>
                            </div>
                            <div className={classes.Form_buttons}>
                                <div className={classes.Links}>
                                    <Link href={'/auth/register'}>
                                        {t("link1")}
                                    </Link>
                                    <Link href={'/auth/reset_password'}>
                                        {t("link2")}
                                    </Link>
                                </div>
                                <div className={classes.Buttons_Container}>
                                    <button type={'button'} className={classes.Google_button} onClick={googleHandler}>
                                        <span><Image src={'/images/Auth/google-icon.svg'} alt={'Create User'} width={30}
                                                     height={30}/></span>
                                    </button>
                                    <button
                                        className={[classes.Create_button].join(' ')}
                                        type={'submit'}>
                                        <span>
                                            {loading ? <Spinner size={2} color={`#A71523`}/> : t("button")}
                                        </span>
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