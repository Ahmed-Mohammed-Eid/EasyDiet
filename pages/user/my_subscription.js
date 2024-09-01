import {useEffect, useState, useRef} from "react";
import classes from "@/styles/pages/user/my_subscription.module.scss";
import Head from "next/head";
import {useRouter} from "next/router";
// REDUX
import {useDispatch} from "react-redux";
// HELPERS
import axios from "axios";
import {toast} from "react-toastify";
import {extractTokenFromCookie} from "@/helpers/extractToken";
// COMPONENTS
import DayItem from "@/components/pages/user/DayItem";
import MySubscription from "@/components/pages/user/MySubscription/MySubscription";
import GasLoader from "@/components/layout/GasLoader/gasLoader";
import ScrollToTop from "@/components/layout/ScrollToTop/ScrollToTop";
import Spinner from "@/components/layout/spinner/Spinner";
import Dialog from "@/components/layout/Dialog/Dialog";
// LANGUAGE
import {useTranslation} from "react-i18next";
import i18n from "@/i18n";
import Image from "next/image";

const My_Subscription = () => {
    // ROUTER
    const router = useRouter();

    //REDUX
    const dispatch = useDispatch();

    // LANGUAGE
    const {t} = useTranslation('mySubscription');

    //STATES
    const [packageInfo, setPackageInfo] = useState({
        bundleName: '',
        bundleNameEn: '',
        bundleDays: '',
        startDate: '',
        endDate: '',
        remainingDays: '',
        bundleImageMale: '',
        bundleImageFemale: '',
        clientGender: '',
        subscriptionId: '',
        clientId: '',
        subscribed: '',
        bundleId: '',
        hasPreviousSubscribtion: false
    });
    const [loading, setLoading] = useState(false);
    const [packageDays, setPackageDays] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [realPackageDays, setRealPackageDays] = useState({
        start: '',
        end: ''
    });

    // REFS
    const scrollableRef = useRef(null);

    // EFFECT TO GET THE PACKAGES WHEN PAGE LOAD
    useEffect(() => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);
        // LOGIC
        try {
            axios.get(`https://api.easydietkw.com/api/v1/client/plan/details`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    setPackageInfo({
                        bundleName: res.data.bundleName,
                        bundleNameEn: res.data.bundleNameEn,
                        bundleDays: res.data.bundleDays,
                        startDate: res.data.startDate,
                        endDate: res.data.endDate,
                        remainingDays: res.data.remainingDays,
                        bundleImageMale: res.data.bundleImageMale,
                        bundleImageFemale: res.data.bundleImageFemale,
                        clientGender: res.data.clientGender,
                        subscriptionId: res.data.subscriptionId,
                        clientId: res.data.clientId,
                        subscribed: res.data.subscriped,
                        bundleId: res.data.bundleId,
                        hasPreviousSubscribtion: res.data.hasPreviousSubscribtion
                    })

                    setRealPackageDays({
                        start: res.data.startDate,
                        end: res.data.endDate
                    })

                    setPackageDays(res.data.planDays || [])
                })
        } catch (err){
            toast.error(err.response?.data?.message || err.message)
        }

    }, [dispatch])

    function getDayName(date) {
        let daysOfWeek = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعه", "السبت"];

        if (i18n.language.includes('en')) {
            daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        }

        const dayIndex = new Date(date).getDay();
        return daysOfWeek[dayIndex];
    }

    function isDateAfterTwoDays(date) {
        const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000; // Calculate two days in milliseconds
        const now = new Date(); // Get the current date and time
        const targetDate = new Date(date); // Create a new date object from the input date string

        return targetDate.getTime() - now.getTime() >= twoDaysInMilliseconds;
    }

    // CALCULATE THE DAYS
    function countDays(start, end, includeFriday) {
        const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
        const currentDate = new Date(); // Get the current date

        // Convert the start and end dates to UTC to ensure consistent calculations
        const startDate = new Date(start.toUTCString());
        const endDate = new Date(end.toUTCString());

        // Adjust the start date to the beginning of the day
        startDate.setUTCHours(0, 0, 0, 0);

        // Adjust the end date to the end of the day
        endDate.setUTCHours(23, 59, 59, 999);

        let count = 0;
        let daysUntilNow = 0;

        while (startDate <= endDate) {
            if (!includeFriday && startDate.getUTCDay() === 5) {
                // If it's Friday, and we don't want to include it, skip to the next day
                startDate.setTime(startDate.getTime() + oneDay);
                continue;
            }

            count++;
            if (startDate <= currentDate) {
                daysUntilNow++;
            }
            startDate.setTime(startDate.getTime() + oneDay);
        }

        return {
            count,
            daysUntilNow
        };
    }

    // CALCULATE THE REMAINING DAYS
    const {count, daysUntilNow} = countDays(new Date(realPackageDays.start), new Date(realPackageDays.end), false);

    const handlePrint = () => {
        const token = extractTokenFromCookie(document.cookie);
        setLoading(true);
        axios.get(`https://api.easydietkw.com/api/v1/get/contract`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                clientId: packageInfo.clientId,
            }
        })
            .then(res => {
                const url = res.data.url;
                setTimeout(() => {

                    window.open(url, '_blank');
                    setLoading(false);
                }, 1000)
            })
            .catch(err => {
                console.log(err)
                setLoading(false);
                toast.error(i18n.language.includes('en') ? 'Something went wrong, please try again later' : 'حدث خطأ ما، يرجى المحاولة مرة أخرى')
            })
    }


    // RENEW SUBSCRIPTION
    const submitHandler = async () => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        try {
            axios.get(`https://api.easydietkw.com/api/v1/payment/url`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    bundleId: packageInfo.bundleId,
                    startingAt: '',
                }
            })
                .then(res => {
                    window.location.href = res.data.result
                })
        } catch (e) {
            toast.error(e.response?.data?.message || e.message)
        }
    }


    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | My Subscription</title>
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
            <main className={classes.Main} ref={scrollableRef}>
                <div className={classes.Container}>
                    {
                        packageInfo?.bundleName && packageDays.length > 0 ? (
                            <>
                                <div className={classes.Top} data-title={t("title1")}>
                                    {(realPackageDays?.start && realPackageDays?.end) && (
                                        <div className={classes.DateAndActionsContainer}>
                                            <div className={classes.ButtonsContainer}>
                                                <button className={classes.ContractButton} onClick={handlePrint}>
                                                    <Image src={'/images/printer.png'} alt={'Add Icon'} width={18}
                                                           height={18}/>
                                                    {i18n.language.includes('en') ? "Print Contract" : "طباعة العقد"}
                                                    {loading && <Spinner size={1} color={'#FFFFFF'}/>}
                                                </button>
                                                <button className={classes.RenewButton} onClick={() => {
                                                    setShowDialog(true)
                                                }}>
                                                    <Image src={'/images/refresh.svg'} alt={'Add Icon'} width={18}
                                                           height={18}/>
                                                    {i18n.language.includes('en') ? "Renew" : "تجديد الاشتراك"}
                                                </button>
                                            </div>
                                            <div className={classes.LoaderContainer}>
                                                <GasLoader availableDays={count - daysUntilNow}
                                                           totalDays={packageDays.length}/>
                                            </div>
                                        </div>
                                    )}
                                    <div className={classes.Top_Container}>
                                        <div className={classes.PackageDetails}>
                                            <div className={classes.ImagePart}>
                                                <div className={classes.PackageImage}>
                                                    <Image
                                                        src={(packageInfo.clientGender === "Male" ? packageInfo?.bundleImageMale : packageInfo?.bundleImageFemale) || '/images/no_image.webp'}
                                                        alt={"no image"} width={100}
                                                        height={100}/>
                                                </div>
                                                <div className={classes.PackageName}>
                                                    <span className={classes.NameTitle}>{t("name")}</span>
                                                    <h3 className={classes.NameContent}>{i18n.language.includes('en') ? packageInfo.bundleNameEn : packageInfo.bundleName}</h3>
                                                </div>
                                            </div>
                                            <div className={classes.UserDetails} onClick={() => {
                                                router.push('/user/my_status')
                                            }}>
                                                <Image
                                                    src={(packageInfo.clientGender === "Male" ? '/fitness.jpg' : '/fitness_woman.jpg')}
                                                    alt={'status'} width={100} height={100}/>
                                                <p>{i18n.language.includes('en') ? 'STATUS CARD' : "كارت المتابعة"}</p>
                                            </div>
                                        </div>
                                        <div className={classes.PackageTime}>
                                            <div className={classes.Top_Item}>
                                                <h3>{t("time")}</h3>
                                                <span>{packageDays.length} {t("days")}</span>
                                            </div>
                                            <div className={classes.Top_Item}>
                                                <h3>{t("start")}</h3>
                                                <span>{new Date(packageInfo.startDate).toLocaleDateString(i18n.language.includes('en') ? 'en-US' : "ar-EG", {
                                                    day: "numeric",
                                                    month: 'long'
                                                })}</span>
                                            </div>
                                            <div className={classes.Top_Item}>
                                                <h3>{t("end")}</h3>
                                                <span>{new Date(packageInfo.endDate).toLocaleDateString(i18n.language.includes('en') ? 'en-US' : "ar-EG", {
                                                    day: "numeric",
                                                    month: 'long'
                                                })}</span>
                                            </div>
                                            <div className={classes.Top_Item}>
                                                <h3>{i18n.language.includes('en') ? 'MEMBERSHIP ID' : 'رقم العضوية'}</h3>
                                                <span>{packageInfo.subscriptionId}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.Bottom} data-title={t("title2")}>
                                    <div className={classes.Days_Container}>
                                        {packageDays && packageDays.map((item) => {
                                            return (
                                                <DayItem key={item._id} ID={item._id} Daydate={item.date}
                                                         title={getDayName(item.date)}
                                                         Editable={isDateAfterTwoDays(item.date)}
                                                         isSelected={item.submitted}
                                                         editText={i18n.language.includes('en') ? 'Edit' : "تعديل"}
                                                         date={new Date(item.date).toLocaleDateString(i18n.language.includes('en') ? 'en-US' : "ar-EG", {
                                                             day: 'numeric',
                                                             month: 'long'
                                                         })}
                                                />
                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : <MySubscription
                            hasPreviousSubscribtion={packageInfo.hasPreviousSubscribtion}
                            bundleId={packageInfo.bundleId} />}
                </div>
                <ScrollToTop parentRef={scrollableRef}/>
            </main>
            <Dialog isOpen={showDialog} onClose={() => {
                setShowDialog(false)
            }}>
                {/*RENEW PACKAGE CONTENT 01. THE SAME PACKAGE 02. ANOTHER PACKAGE*/}
                <div>
                    <div className={classes.DialogTitle}>
                        <h3>{i18n.language.includes('en') ? 'Renew' : 'تجديد الباقة'}</h3>
                    </div>
                    <div className={classes.DialogContent}>
                        <button className={classes.AnotherPackage} onClick={() => {
                            router.push('/user/packages')
                        }}>
                            {i18n.language.includes('en') ? 'Choose Another package' : 'اختيار باقة اخرى'}
                        </button>
                        <button className={classes.TheSamePackage} onClick={() => {
                            if(packageInfo.subscribed) {
                                submitHandler()
                            }
                        }}>
                            <Image src={'/images/refresh.svg'} alt={'Add Icon'} width={16} height={16}/>
                            {i18n.language.includes('en') ? 'Renew the same package' : 'تجديد نفس الباقة'}
                        </button>
                    </div>
                </div>
            </Dialog>
        </>

)
}

export default My_Subscription;

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
