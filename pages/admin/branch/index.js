import {useEffect} from "react";
import classes from '@/styles/pages/admin/branch_manager.module.scss';
import Head from "next/head";
import Image from "next/image";
// HELPERS
import {extractTokenFromCookie} from "@/helpers/extractToken";
import axios from "axios";
import {toast} from "react-toastify";
// REDUX
import {useDispatch, useSelector} from "react-redux";
import {onCheck, onInputChange} from '@/redux/slices/Admin/branchManager-slice';
// LANGUAGE
import {useTranslation} from "react-i18next";
import i18n from "@/i18n";

const Branch_Manager = ({role}) => {

    // LANGUAGE
    const {t} = useTranslation('branch')

    //REDUX
    const dispatch = useDispatch();
    const {meals, selectedDay, checks: {All, Breakfast, Lunch, Dinner, Snacks}, activeTye} = useSelector(state => state.branch);


    async function handleSuccess(clientID, dateID, meal_ID) {
        const token = extractTokenFromCookie(document.cookie);


        // SET DYNAMIC URL BASED ON THE ROLE
        let url = `https://api.easydietkw.com/api/v1/set/meal/delivered`;
        if (role === 'manager') {
            url = `https://api.easydietkw.com/api/v1/manager/set/meal/delivered`;
        }

        // GET THE EMPLOYEES
        axios.put(url, {
            clientId: clientID,
            dateId: dateID,
            dayMealId: meal_ID,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                // UPDATE THE STATE OF MEALS TO REMOVE THE MEAL THAT HAS BEEN DELIVERED
                // GET COPY OF THE MEALS
                const mealsCopy = [...meals];
                // GET THE INDEX OF THE MEAL THAT HAS BEEN DELIVERED
                const clientIndex = mealsCopy.findIndex(meal => meal.clientId === clientID);
                // GET THE CLIENT THAT HAS BEEN DELIVERED
                const client = mealsCopy[clientIndex];
                // FILTER THE MEALS OF THE CLIENT TO REMOVE THE DELIVERED MEAL
                const filteredMeals = client.dayMeals.filter(meal => meal._id !== meal_ID);
                // CREATE A NEW CLIENT OBJECT WITH UPDATED dayMeals
                // REPLACE THE CLIENT OBJECT IN mealsCopy ARRAY
                mealsCopy[clientIndex] = {...client, dayMeals: filteredMeals};
                // UPDATE THE MEALS IN REDUX
                dispatch(onInputChange({key: 'meals', value: mealsCopy}));
                // SHOW SUCCESS MESSAGE
                toast.success(res.data?.message || 'Meal has been delivered successfully');
            })
            .catch(err => {
                toast.error(err.response?.data?.message || err.message);
            })
    }


    // EFFECT TO GET THE MEALS DATA WHEN THE PAGE LOADS
    useEffect(() => {

        // GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);


        // SET DYNAMIC URL BASED ON THE ROLE
        let url = `https://api.easydietkw.com/api/v1/today/delivery/meals`;
        if (role === 'manager') {
            url = `https://api.easydietkw.com/api/v1/manager/delivery/meals`;
        }

        // GET THE DATA FROM THE API
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                mealsFilter: activeTye || 'all',
                mealsDate: selectedDay
            }
        })
            .then(res => {
                // SET THE MEALS IN REDUX
                dispatch(onInputChange({key: 'meals', value: res.data.clients}))
            })
            .catch(err => {
                toast.error(err.response?.data?.message || err.message);
            })

    }, [dispatch, activeTye, role, selectedDay]);

    // HANDLE THE PRINTING OF THE MEALS
    function handlePrint() {

        // GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        // SET DYNAMIC URL BASED ON THE ROLE
        let url = `https://api.easydietkw.com/api/v1/print/labels`;
        if (role === 'manager') {
            url = `https://api.easydietkw.com/api/v1/manager/print/labels`;
        }

        // GET THE DATA FROM THE API
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                mealFilter: activeTye || 'all',
                mealsDate: selectedDay
            }
        })
            .then(res => {
                // OPEN THE PRINT WINDOW
                window.open(res.data.url, '_blank');
            })
            .catch(err => {
                toast.error(err.response?.data?.message || err.message);
            })
    }

    const handleDeliveredAll = () => {
        // GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);
        axios.put(`https://api.easydietkw.com/api/v1/set/all/meals/delivered`, {
            clients: meals
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                // CLEAR THE MEALS IN REDUX
                dispatch(onInputChange({key: 'meals', value: []}));
                // SHOW SUCCESS MESSAGE
                toast.success(res.data?.message || 'All meals have been delivered successfully');
            })
            .catch(err => {
                console.log(err.response?.data?.message || err.message);
                toast.error(err.response?.data?.message || err.message);
            })

    }

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Branch</title>
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
                                        <span className={classes.labelText}>{t("all")}</span>
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
                                        <span className={classes.labelText}>{t("breakfast")}</span>
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
                                        <span className={classes.labelText}>{t("lunch")}</span>
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
                                        <span className={classes.labelText}>{t("dinner")}</span>
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
                                        <span className={classes.labelText}>{t("snacks")}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className={classes.Day_container}>
                            <label htmlFor={'selectedDay'}>{(i18n.language.includes('en') ? "Choose Day:" : "اليوم:")}</label>
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

                        <div className={classes.Print}>
                            <button onClick={handlePrint}>
                                <Image src={'/images/printer.png'} alt={'Add Icon'} width={18} height={18}/>
                                <span>{t("print")}</span>
                            </button>
                            <button className={classes.ArrivedAll} onClick={handleDeliveredAll}>
                                <span>{i18n.language.includes('en') ? 'Delivered All' : 'توصيل الكل'}</span>
                            </button>
                        </div>

                    </div>
                    <div className={classes.Bottom}>
                        <table className={classes.table}>
                            <thead>
                            <tr>
                                <th>{i18n.language.includes('en') ? 'MEMBERSHIP ID' : 'رقم العضوية'}</th>
                                <th>{i18n.language.includes('en') ? 'NAME' : 'الاسم'}</th>
                                <th>{i18n.language.includes('en') ? 'MOBILE' : 'الهاتف'}</th>
                                <th>{i18n.language.includes('en') ? 'MEAL' : 'الوجبة'}</th>
                                <th>{i18n.language.includes('en') ? 'TYPE' : 'النوع'}</th>
                                <th>{i18n.language.includes('en') ? 'ACTIONS' : 'الإجراءات'}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {meals && meals.map((user) => {
                                if (user?.dayMeals?.length > 0) {
                                    return user?.dayMeals?.map((meal) => {
                                        if (meal !== null) {
                                            return (
                                                <tr className={classes.row} key={meal?._id}>
                                                    <td>{user?.subscriptionId}</td>
                                                    <td className={classes.ClientName}>{user?.clientNameEn || user?.clientName}</td>
                                                    <td>{user?.phoneNumber}</td>
                                                    <td>{meal?.title}</td>
                                                    <td><span
                                                        className={[classes.SubscriptionButton]}>{meal?.mealType}</span>
                                                    </td>
                                                    <td className={classes.Actions}>
                                                        <button className={classes.Delete}
                                                                onClick={() => handleSuccess(user.clientId, user.dateId, meal._id)}>
                                                            {i18n.language.includes('en') ? 'Delivered' : 'تم التوصيل'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })
                                }
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>

    )
}

export default Branch_Manager;

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
