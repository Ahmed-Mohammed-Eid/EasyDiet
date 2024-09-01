import classes from '@/styles/pages/user/my_status.module.scss';
import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";
// HELPERS
import {useEffect, useState} from "react";
import {extractTokenFromCookie} from "@/helpers/extractToken";
import axios from "axios";
// LANGUAGE
import {useTranslation} from "react-i18next";

const My_Status = () => {
    //ROUTER
    const router = useRouter();

    // LANGUAGE
    const {t} = useTranslation('myStatus')

    // STATES
    const [messages, setMessages] = useState([]);
    const [userInfo, setUserInfo] = useState({
        weight: '',
        height: '',
    });

    // EFFECTS
    useEffect(() => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie)

        axios.get(`https://api.easydietkw.com/api/v1/my/messages`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                // SET THE MEALS IN THE STATE
                setMessages(res.data.messages);
                setUserInfo({
                    height: res.data.bmi.tall,
                    weight: res.data.bmi.weight
                })
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | My Status</title>
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
            <main className={classes.Main}>
                <div className={classes.FormContainer}>
                    <div className={classes.Top}>
                        <div className={classes.Left}>
                            <h1>{t("title")}</h1>
                        </div>
                        <div className={classes.Right} onClick={() => router.push('/user/my_subscription')}>
                            <button className={classes.Close}>
                                <Image src={'/images/Auth/next-icon.svg'} alt={'go back'} width={25} height={25}/>
                            </button>
                        </div>
                    </div>
                    <div className={classes.Bottom}>
                        <div className={classes.Bottom_P1}>
                            <div className={classes.P1_Item}>
                                <div>
                                    <p>{t("weight")}</p>
                                    <span>{userInfo?.weight || ''} {t("weightUnit")}</span>
                                </div>
                                <div className={classes.Image_Container}>
                                    <Image src={'/images/Global/weight.webp'} alt={'weight'} width={50} height={50}/>
                                </div>
                            </div>
                            <div className={classes.P1_Item}>
                                <div>
                                    <p>{t("height")}</p>
                                    <span>{userInfo?.height || ''} {t("heightUnit")}</span>
                                </div>
                                <div className={classes.Image_Container}>
                                    <Image src={'/images/Global/height.webp'} alt={'weight'} width={60} height={60}/>
                                </div>
                            </div>
                        </div>
                        <div className={classes.Bottom_P2}>
                            {messages && messages.map((message) => {
                                return (
                                    <div key={message._id} className={classes.Message}>
                                        <h3>{t("question")}</h3>
                                        <p>{message?.body}?</p>

                                        {(message?.reply) && (<div className={classes.Response}>
                                            <h4>{t("doctorResponse")} ({message?.specialistId?.fullName})</h4>
                                            <p>
                                                {message?.reply}
                                            </p>
                                        </div>)}
                                        {/*HEIGHT AND WEIGHT*/}
                                        {(message?.bodyBMI?.weight && message?.bodyBMI?.tall) && (<div className={classes.BODY_BMI}>
                                            <div className={classes.P1_Item}>
                                                <div>
                                                    <p>{t("weight")}</p>
                                                    <span>{message?.bodyBMI?.weight || ''} {t("weightUnit")}</span>
                                                </div>
                                                <div className={classes.Image_Container}>
                                                    <Image src={'/images/Global/weight.webp'} alt={'weight'} width={20} height={20}/>
                                                </div>
                                            </div>
                                            <div className={classes.P1_Item}>
                                                <div>
                                                    <p>{t("height")}</p>
                                                    <span>{message?.bodyBMI?.tall || ''} {t("heightUnit")}</span>
                                                </div>
                                                <div className={classes.Image_Container}>
                                                    <Image src={'/images/Global/height.webp'} alt={'weight'} width={25} height={25}/>
                                                </div>
                                            </div>
                                        </div>)}

                                        <div className={classes.Doctor}>
                                            <div className={classes.Doctor_Image_Container}>
                                                <Image src={message?.specialistId?.userImage || '/images/no_image.webp'}
                                                       alt={'Doctor image'} width={50}
                                                       height={50}/>
                                            </div>
                                            <div>
                                                <h4>{message?.specialistId?.fullName}</h4>
                                                <time>{new Date(message?.updatedAt).toLocaleDateString('en-US', {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: 'numeric',
                                                })}</time>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default My_Status;

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
