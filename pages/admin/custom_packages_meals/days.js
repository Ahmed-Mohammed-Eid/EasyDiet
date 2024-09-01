import {useEffect, useState} from "react";
import classes from '@/styles/pages/admin/selectedDays.module.scss';
import Head from "next/head";
import Image from "next/image";
//HELPERS
import axios from "axios";
import {extractTokenFromCookie} from "@/helpers/extractToken";
import {toast} from "react-toastify";
// LANGUAGE
import i18n from "@/i18n";
import Spinner from "@/components/layout/spinner/Spinner";

const Days = ({role}) => {

    // STATES
    const [days, setDays] = useState([]);
    const [deleteLoader, setDeleteLoader] = useState(false);

    // DELETE HANDLER
    const deleteDateHandler = (selectedDay) => {
        const token = extractTokenFromCookie(document.cookie);

        // SET DYNAMIC URL BASED ON THE ROLE
        let url = `https://api.easydietkw.com/api/v1/delete/menu/day`;
        if (role === 'manager') {
            url = `https://api.easydietkw.com/api/v1/manager/delete/menu/day`;
        }

        if (window.confirm(i18n.language.includes('en') ? `Are you sure you want to delete the meals of this day?` : `هل أنت متأكد أنك تريد حذف وجبات هذا اليوم؟`)) {

            setDeleteLoader(true)
            axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    date: selectedDay
                }
            })
                .then(_ => {
                    setDeleteLoader(false)
                    toast.success(i18n.language.includes('en') ? `Day Meals Deleted Successfully` : `تم حذف وجبات اليوم بنجاح`)
                    // GET THE DAYS AGAIN
                    getDaysHandler()
                })
                .catch(err => {
                    setDeleteLoader(false)
                    // SHOW ERROR
                    toast.error(err.response?.data?.message || err.message)
                })
        }
    }


    const getDaysHandler = () => {
        const token = extractTokenFromCookie(document.cookie);


        // SET DYNAMIC URL BASED ON THE ROLE
        let url = `https://api.easydietkw.com/api/v1/get/menu`;
        if (role === 'manager') {
            url = `https://api.easydietkw.com/api/v1/manager/get/menu`;
        }

        // LOGIC OF GETTING DAYS
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                // Set the Days
                setDays(res.data.menu)
            })
            .catch(err => {
                // Show a notification with the error
                toast.error(err.response?.data?.message || err.message)
            })

    }

    // EFFECT TO GET THE DAYS
    useEffect(() => {
        getDaysHandler()
    }, []);

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Users</title>
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
                <div className={classes.Container}>
                    <div className={classes.Top}>

                    </div>
                    <div className={classes.Bottom}>
                        <table className={classes.table}>
                            <thead>
                            <tr>
                                <th>{i18n.language.includes('en') ? `DAY` : `اليوم`}</th>
                                <th>{i18n.language.includes('en') ? `BREAKFAST` : `الفطور`}</th>
                                <th>{i18n.language.includes('en') ? `LUNCH` : `الغداء`}</th>
                                <th>{i18n.language.includes('en') ? `DINNER` : `العشاء`}</th>
                                <th>{i18n.language.includes('en') ? `SNACK` : `الوجبات الخفيفة`}</th>
                                <th>{i18n.language.includes('en') ? `ACTIONS` : `إجراءات`}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {(days && days.length > 0) && days.map((day) => {
                                return (
                                    <tr className={classes.row} key={day._id}>
                                        <td>{new Date(day.date).toLocaleDateString((i18n.language.includes('en') ? `en-US` : 'ar-EG'), {
                                            day: "numeric",
                                            year: 'numeric',
                                            month: 'long',
                                        })}</td>
                                        <td className={classes.ClientName}>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}>
                                                {day?.breakfast && day.breakfast.map((meal) => {
                                                    return (
                                                        <p key={meal.mealId._id}>{i18n.language.includes('en') ? meal.mealId.mealTitleEn : meal.mealId.mealTitle}</p>
                                                    )
                                                })}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}>
                                                {day?.lunch && day.lunch.map((meal) => {
                                                    return (
                                                        <p key={meal.mealId._id}>{i18n.language.includes('en') ? meal.mealId.mealTitleEn : meal.mealId.mealTitle}</p>
                                                    )
                                                })}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}>
                                                {day?.dinner && day.dinner.map((meal) => {
                                                    return (
                                                        <p key={meal.mealId._id}>{i18n.language.includes('en') ? meal.mealId.mealTitleEn : meal.mealId.mealTitle}</p>
                                                    )
                                                })}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}>
                                                {day?.snack && day.snack.map((meal) => {
                                                    return (
                                                        <p key={meal.mealId._id}>{i18n.language.includes('en') ? meal.mealId.mealTitleEn : meal.mealId.mealTitle}</p>
                                                    )
                                                })}
                                            </div>
                                        </td>
                                        <td className={classes.Actions}>
                                            <button className={classes.Delete}
                                                    onClick={() => deleteDateHandler(day.date)}>
                                                <Image src={'/images/Delete_Icon.svg'} alt={'Delete'} width={14}
                                                       height={14}/> {i18n.language.includes('en') ? 'delete' : 'حذف'}
                                                {deleteLoader && <Spinner color={'#ff0000'} size={1}/>}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    )
}
export default Days

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

    if (!tokenInfo || (tokenInfo.role !== 'admin' && tokenInfo.role !== 'manager') || tokenInfo.active === false) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }


    return {
        props: {role: tokenInfo.role}
    };
};