import {useEffect, useState} from "react";
import classes from '@/styles/pages/admin/defaultmeals.module.scss';
import Image from "next/image";
import Head from "next/head";
import {useRouter} from "next/router";
// IMPORTS
import MealCheckbox from "@/components/pages/dashboard/Meal_checkbox/MealCheckbox_custom_packages";
import Spinner from "@/components/layout/spinner/Spinner";
// HELPERS
import {extractTokenFromCookie} from "@/helpers/extractToken";
import {toast} from "react-toastify";
import axios from "axios";
// REDUX
import {useSelector, useDispatch} from "react-redux";
import {onInputChange, clearAll, onCheck} from '@/redux/slices/Admin/custom_packages_meals_slice';
// LANGUAGE
import {useTranslation} from "react-i18next";
import i18n from "@/i18n";

const DefaultMeals = ({role}) => {

    // LANGUAGE
    const {t} = useTranslation('defaultMeals');

    // ROUTER
    const router = useRouter();

    // STATES
    const [loading, setLoading] = useState(false);
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [meals, setMeals] = useState(null);


    // REDUX
    const dispatch = useDispatch();
    const {meals: selectedMeals, selectedDay,  checks: {All, Breakfast, Lunch, Dinner, Snacks}, activeTye} = useSelector(state => state.custom_packages_meals)



    useEffect(() => {
        const token = extractTokenFromCookie(document.cookie);

        // SET DYNAMIC URL BASED ON THE ROLE
        let url = `https://api.easydietkw.com/api/v1/meals/filter`;
        if (role === 'manager') {
            url = `https://api.easydietkw.com/api/v1/manager/meals/filter`;
        }

        try {
            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    mealsFilter: activeTye || 'all',
                }
            })
                .then(res => {
                    setMeals(res.data.meals);
                })
        }catch (err) {
            toast.error(err.response?.data?.message || err.message)
        }
    }, [role, activeTye]);

    // SUBMIT HANDLER
    const submitHandler = async () => {
        const token = extractTokenFromCookie(document.cookie);

        // CHECK IF THE USER SELECTED A DAY
        if (!selectedDay) {
            return toast.error(t('selectDay'))
        }

        // CHECK IF THE USER SELECTED MEALS LENGTH IS 0
        if (selectedMeals.length <= 0) {
            return toast.error(t('selectMeals'))
        }

        // SET THE LOADING TO TRUE
        setLoading(true);


        // SET DYNAMIC URL BASED ON THE ROLE
        let url = `https://api.easydietkw.com/api/v1/add/menu/day`;
        if (role === 'manager') {
            url = `https://api.easydietkw.com/api/v1/manager/add/menu/day`;
        }

        await axios.post(url, {
            date: selectedDay,
            mealsIds: selectedMeals,
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                // SET THE LOADING TO FALSE
                setLoading(false);

                // SHOW SUCCESS
                toast.success(res.data?.message || "Data has been added successfully");

                // CLEAR IT
                dispatch(clearAll())
            })
            .catch(err => {
                // SET THE LOADING TO FALSE
                setLoading(false);

                // SHOW ERROR
                toast.error(err.response?.data?.message || err.message)
            })
    }

    // DELETE HANDLER
    const deleteDateHandler = () => {
        const token = extractTokenFromCookie(document.cookie);

        // CHECK IF THE USER SELECTED A DAY
        if (!selectedDay) {
            return toast.error(i18n.language.includes(`en`)? `Please Select Date to delete` : `برجاء اختيار تاريخ للحذف`)
        }


        // SET DYNAMIC URL BASED ON THE ROLE
        let url = `https://api.easydietkw.com/api/v1/delete/menu/day`;
        if (role === 'manager') {
            url = `https://api.easydietkw.com/api/v1/manager/delete/menu/day`;
        }

        setDeleteLoader(true)
        axios.delete(url, {
            headers:{
                Authorization: `Bearer ${token}`
            },
            params:{
                date: selectedDay
            }
        })
            .then(_ => {
                setDeleteLoader(false)
                toast.success(i18n.language.includes('en') ? `Day Meals Deleted Successfully` : `تم حذف وجبات اليوم بنجاح`)

                // CLEAR IT
                dispatch(clearAll())
            })
            .catch(err => {
                setDeleteLoader(false)
                // SHOW ERROR
                toast.error(err.response?.data?.message || err.message)
            })
    }

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Custom Packages</title>
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
                <div className={classes.Container}>
                    <div className={classes.Top}>
                        <div className={classes.Filter}>
                            <div className={classes.container}>
                                <div className={classes.checkboxGroup}>
                                    <input onChange={() => {
                                    }} checked={All} type="checkbox" id="All" className={classes.checkbox}
                                           onClick={() => {
                                               dispatch(onCheck({
                                                   key: 'All',
                                                   value: true
                                               }))
                                               dispatch(onInputChange({key: 'activeTye', value: 'all'}))
                                           }}/>
                                    <label htmlFor="All" className={classes.label}>
                                        <span className={classes.labelText}>{i18n.language.includes('en') ? `All` : `الكل`}</span>
                                    </label>
                                </div>
                                <div className={classes.checkboxGroup}>
                                    <input onChange={() => {
                                    }} checked={Breakfast} type="checkbox" id="breakfast" className={classes.checkbox}
                                           onClick={() => {
                                               dispatch(onCheck({
                                                   key: 'Breakfast',
                                                   value: true
                                               }))
                                               dispatch(onInputChange({key: 'activeTye', value: 'breakfast'}))
                                           }}/>
                                    <label htmlFor="breakfast" className={classes.label}>
                                        <span className={classes.labelText}>{i18n.language.includes('en') ? `Breakfast` : `الفطور`}</span>
                                    </label>
                                </div>
                                <div className={classes.checkboxGroup}>
                                    <input onChange={() => {
                                    }} checked={Lunch} type="checkbox" id="lunch" className={classes.checkbox}
                                           onClick={() => {
                                               dispatch(onCheck({
                                                   key: 'Lunch',
                                                   value: true
                                               }))
                                               dispatch(onInputChange({key: 'activeTye', value: 'lunch'}))
                                           }}/>
                                    <label htmlFor="lunch" className={classes.label}>
                                        <span className={classes.labelText}>{i18n.language.includes('en') ? `Lunch` : `الغداء`}</span>
                                    </label>
                                </div>
                                <div className={classes.checkboxGroup}>
                                    <input onChange={() => {
                                    }} checked={Dinner} type="checkbox" id="dinner" className={classes.checkbox}
                                           onClick={() => {
                                               dispatch(onCheck({
                                                   key: 'Dinner',
                                                   value: true
                                               }))
                                               dispatch(onInputChange({key: 'activeTye', value: 'dinner'}))
                                           }}/>
                                    <label htmlFor="dinner" className={classes.label}>
                                        <span className={classes.labelText}>{i18n.language.includes('en') ? `Dinner` : `العشاء`}</span>
                                    </label>
                                </div>
                                <div className={classes.checkboxGroup}>
                                    <input onChange={() => {
                                    }} checked={Snacks} type="checkbox" id="snacks" className={classes.checkbox}
                                           onClick={() => {
                                               dispatch(onCheck({
                                                   key: 'Snacks',
                                                   value: true
                                               }))
                                               dispatch(onInputChange({key: 'activeTye', value: 'snack'}))
                                           }}/>
                                    <label htmlFor="snacks" className={classes.label}>
                                        <span className={classes.labelText}>{i18n.language.includes('en') ? `Snacks` : `وجبات خفيفة`}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className={classes.DayAndActions}>
                            <div className={classes.Day_container}>
                                <label htmlFor={'selectedDay'}>{t("day")}</label>
                                <input
                                    id={'selectedDay'}
                                    type={'date'}
                                    name={'dayMeals'}
                                    value={selectedDay}
                                    onChange={(event) => {
                                        dispatch(onInputChange({key: 'selectedDay', value: event.target.value}))
                                    }}
                                />
                            </div>
                            <div className={classes.ActionButtons_Container}>
                                {/*    DELETE BUTTON    */}
                                <button
                                    className={classes.Delete_Button}
                                    onClick={() => {
                                        deleteDateHandler();
                                    }}
                                >
                                    {i18n.language.includes('en') ? `Delete` : `حذف`} {deleteLoader && <Spinner size={1} color={'#FFFFFF'}/>}
                                </button>
                            </div>
                        </div>
                        <button onClick={() => {
                            router.push('/admin/custom_packages_meals/days')
                        }}>
                                {i18n.language.includes('en') ? `Selected days` : `الأيام المختارة`}
                        </button>
                    </div>
                    <div className={classes.Bottom}>
                        <table className={classes.table}>
                            <thead>
                            <tr>
                                <th>{i18n.language.includes('en') ? 'IMAGE' : 'الصورة'}</th>
                                <th>{i18n.language.includes('en') ? 'MEAL NAME' : 'اسم الوجبة'}</th>
                                <th>{i18n.language.includes('en') ? 'CATEGORY' : 'نوع الوجبة'}</th>
                                <th>{i18n.language.includes('en') ? 'SELECT' : 'اختيار'}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {meals && meals.map((cur) => {
                                return (
                                    <tr key={cur._id} className={classes.row}>
                                        <td>
                                            <div className={classes.UserImage}>
                                                <Image src={cur.imagePath}
                                                       alt={'User Image'} width={40} height={40}/>
                                            </div>
                                        </td>
                                        <td>{i18n.language.includes('en') ? cur.mealTitleEn : cur.mealTitle}</td>
                                        <td>{cur.mealType}</td>
                                        <td className={classes.Actions}>
                                            <MealCheckbox id={cur._id}/>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div className={classes.Buttons_Container}>
                        <button type={'submit'} className={classes.Submit} onClick={submitHandler}>
                            <span>
                                {loading ? <Spinner size={2} color={`#ffffff`}/> : t("button")}
                            </span>
                            <Image src={'/images/Send_Icon.svg'} alt={'Send'} width={20} height={20}/>
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
}
export default DefaultMeals;

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
