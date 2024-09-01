import Image from "next/image";
import classes from '@/styles/pages/global/about.module.scss';
import Head from "next/head";
import {useRouter} from "next/router";
// LANGUAGE
import {useTranslation} from "react-i18next";


const About = () => {
    const router = useRouter();

    // LANGUAGE
    const {t} = useTranslation('about')

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | About</title>
                <meta name="description" content="EasyDiet has been offering healthy meal options for over 5 years. With a diverse menu of delicious and locally-sourced ingredients, their experienced chefs provide convenient and energizing meals. Experience a healthier lifestyle with EasyDiet."/>
                <meta name="keywords" content="healthy meals, meal delivery, fresh ingredients, locally-sourced, convenient meal options, energy-boosting, nutritious food, easy ordering, delicious and healthy, meal plans, EasyDiet, Easy Diet, EasyDiet Dubai, EasyDiet UAE, EasyDiet Abu Dhabi, EasyDiet Sharjah, EasyDiet Ajman, EasyDiet Fujairah, EasyDiet Ras Al Khaimah, EasyDiet Umm Al Quwain, EasyDiet Al Ain, EasyDiet Al Gharbia, EasyDiet Al Dhafra, EasyDiet Al Ruwais, EasyDiet Al Wathba, EasyDiet Al Khazna, EasyDiet Al Khatim, EasyDiet Al Mirfa, EasyDiet Al Sila, EasyDietKw, EasyDiet-kw, EasyDiet-kw.com, easydietkw.com"/>
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
            <div className={classes.Container}>
                <main className={classes.Main}>
                    <div className={classes.Top}>
                        <div className={classes.Logo} onClick={() => router.push('/')}>
                            <Image src={'/easyDietLogo-text.png'} alt={'logo'} width={104.5} height={100}/>
                        </div>
                        <button className={classes.Go_Back} onClick={() => router.push('/')}>
                            <Image src={'/images/Auth/next-icon.svg'} alt={'go back to home'} width={25} height={25}/>
                        </button>
                    </div>
                    <div className={classes.Bottom}>
                        <h1 className={classes.Header}>{t("title")}</h1>
                        <div className={classes.Content}>
                            <div className={classes.Content_Text}>
                                <p>{t("p1")}</p>
                            </div>
                            <div className={classes.Content_Social}>
                                <button>
                                    <Image src={'/images/Global/Facebook_Icon.svg'} alt={'facebook account'} width={25} height={25} />
                                </button>
                                <button onClick={() => {
                                    window.open('http://wa.me/96541446776', '_blank')
                                }}>
                                    <Image src={'/images/Global/Whatsapp_Icon.svg'} alt={'Whatsapp account'} width={25} height={25} />
                                </button>
                                <button onClick={() => {
                                    window.open('https://twitter.com/easydietkw', '_blank')
                                }}>
                                    <Image src={'/images/Global/Twitter_Icon.svg'} alt={'twitter account'} width={25} height={25} />
                                </button>
                                <button onClick={() => {
                                    window.open('https://instagram.com/easy.diet_kw', '_blank')
                                }}>
                                    <Image src={'/images/Global/Instagram_Icon.svg'} alt={'instagram account'} width={25} height={25} />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default About;