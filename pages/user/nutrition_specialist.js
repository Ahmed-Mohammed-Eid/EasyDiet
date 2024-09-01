import {useEffect} from "react";
import classes from "@/styles/pages/user/Nutritio_specialist.module.scss";
import Head from "next/head";
// COMPONENTS
import DoctorCard from "@/components/pages/user/DoctorCard";
// REDUX
import {useDispatch, useSelector} from "react-redux";
import {onInputChange} from "@/redux/slices/user/nutritionspecialist_slice";
// HELPERS
import axios from "axios";
import {toast} from "react-toastify";
import {extractTokenFromCookie} from "@/helpers/extractToken";
// LANGUAGE
import {useTranslation} from "react-i18next";

const Nutrition_specialist = () => {

    // LANGUAGE
    const {t} = useTranslation('nutrition_specialist')

    //REDUX
    const dispatch = useDispatch();
    const {specialists} = useSelector(state => state.nutrition_specialist)

    // EFFECT TO GET THE PACKAGES WHEN PAGE LOAD
    useEffect(() => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        // LOGIC
        try {
            axios.get(`https://api.easydietkw.com/api/v1/get/specialists`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    dispatch(onInputChange({key: 'specialists', value: res.data.specialists}))
                })
        } catch (err) {
            toast.error(err.response?.data?.message || err.message)
        }

    }, [dispatch])

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Nutrition Specialist</title>
                <meta name="description" content="Sign in to EasyDiet and access our diverse menu of delicious, healthy meals that are perfect for people who are looking to maintain a healthy lifestyle. Our team of experienced chefs use fresh, locally-sourced ingredients to prepare each meal. Join our community of satisfied customers who have reported feeling more energized and healthier after consuming our meals. EasyDiet: Providing Healthy Meals for Over 5 Years "/>
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
                    {specialists && specialists.map((cur) => {
                        return (
                            <DoctorCard
                                key={cur._id}
                                name={cur.fullName}
                                image={cur.userImage}
                                nutrition_specialistId={cur._id}
                                phone={cur.phoneNumber}
                            />
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Nutrition_specialist;

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
