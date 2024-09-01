import {useEffect, useState} from "react";
import classes from '@/styles/pages/user/choose_starting_date.module.scss';
import Image from "next/image";
import Head from "next/head";
import {useRouter} from "next/router";
// COMPONENTS
import CustomSelectDays from "@/components/pages/user/custom-select-days";
import Spinner from "@/components/layout/spinner/Spinner";
// HELPERS
import axios from "axios";
import {extractTokenFromCookie} from "@/helpers/extractToken";
// REDUX
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {onInputChange} from "@/redux/slices/user/subscription_info";
// TRANSLATION
import {useTranslation} from "react-i18next";


const Choose_Starting_Date = () => {
    // ROUTER
    const router = useRouter();

    // STATE
    const [loading, setLoading] = useState(false);

    // GET THE ID OF THE PACKAGE FROM THE URL
    const {packageId: id_in_url} = router.query;

    //REDUX
    const dispatch = useDispatch();
    const {
        package: {id},
        selectedDay,
        selectedMonth
    } = useSelector(state => state.subscription_user);

    // EFFECTS
    // EFFECT TO CHECK UF THE ID IS EXIST
    useEffect(() => {
        if (!id && !id_in_url) {
            router.push('/user/packages')
        }

        dispatch(onInputChange({key: 'package', value: {id: id || id_in_url}}))
    }, [router, id, id_in_url, dispatch])

    // LANGUAGE
    const {t} = useTranslation('chooseStartingDate');

    // HANDLERS
    const submitHandler = async (event) => {
        // STOP RELOADING
        event.preventDefault();
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        setLoading(true)

        try {
            axios.get(`https://api.easydietkw.com/api/v1/payment/url`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    bundleId: id,
                    startingAt: createDate(selectedDay?.value, selectedMonth?.value),
                }
            })
                .then(res => {
                    setLoading(false)
                    window.location.href = res.data.result
                })
        } catch (e) {
            setLoading(false);
            toast.error(e.response?.data?.message || e.message)
        }
    }

    function createDate(day, month) {
        const year = new Date().getFullYear(); // get current year
        return new Date(year, month - 1, day);
    }


    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Choose Starting Day</title>
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
            <main className={classes.Main}>
                <div className={classes.FormContainer}>
                    <h1>{t("title")}</h1>
                    <form onSubmit={submitHandler}>
                        <div className={classes.InputsContainer}>
                            <div className={[classes.InputGroup].join(' ')}>
                                <CustomSelectDays dayText={t("startingDay")} monthText={t("startingMonth")}/>
                            </div>
                        </div>
                        <button type={'submit'}>
                            <span>
                                {loading ? <Spinner size={2} color={`#ffffff`}/> : t("button")}
                            </span>
                            <Image src={'/images/Send_Icon.svg'} alt={'Send'} width={20} height={20}/>
                        </button>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Choose_Starting_Date;

export const getServerSideProps = async (ctx) => {
    // GET THE TOKEN FROM THE REQUEST
    const {token} = ctx.req.cookies;

    let tokenInfo;
    if (token) {
        await axios.get(`https://api.easydietkw.com/api/v1/get/verify/token`, {
            params: {
                token: token,
            }
        })
            .then(res => tokenInfo = res.data.decodedToken)
            .catch(err => console.log(err))
    }

    if (!tokenInfo || tokenInfo.role !== 'client' || tokenInfo.active === false) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: {},
    };
};
