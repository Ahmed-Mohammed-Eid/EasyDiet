import {useEffect, useState} from "react";
import classes from '@/styles/pages/admin/edit_package.module.scss'
import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";
//IMPORTS
import Spinner from "@/components/layout/spinner/Spinner";
//REDUX
import wrapper from "@/redux/store";
import  {onInputChange, setAll} from "@/redux/slices/Admin/editCustompackage-slice";
import {useDispatch, useSelector} from "react-redux";
//HELPERS
import {toast} from "react-toastify";
import axios from "axios";
import {extractTokenFromCookie} from "@/helpers/extractToken";
// LANGUAGE
import {useTranslation} from "react-i18next";

const EditPackage = ({bundle}) => {
    // ROUTER
    const router = useRouter();

    // LANGUAGE
    const {t} = useTranslation('editPackage');

    // STATES
    const [loading, setLoading] = useState(false);

    // REDUX
    const dispatch = useDispatch();
    const {
        bundleId,
        name,
        nameEn,
        realTime,
        packagePrice,
        numberOfMeals,
        numberOfSnacks,
        fridayIncluded,
        breakfast,
        lunch,
        dinner,
    } = useSelector(state => state.edit_customPackage)

    useEffect(() => {

        if (bundle) {
            dispatch(setAll({
                bundleId: bundle._id,
                name: bundle.bundleName,
                nameEn: bundle.bundleNameEn,
                realTime: bundle.bundlePeriod,
                packagePrice: bundle.bundlePrice,
                numberOfMeals: bundle.mealsNumber,
                numberOfSnacks: bundle.snacksNumber,
                fridayIncluded: bundle.fridayOption,
                breakfast: bundle.mealsType.includes('افطار'),
                lunch: bundle.mealsType.includes('غداء'),
                dinner: bundle.mealsType.includes('عشاء'),
            }))
        }
    }, [dispatch, bundle])

    // SUBMIT HANDLER
    const submitHandler = async (e) => {
        // STOP RELOADING
        e.preventDefault();
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        if (!bundleId || !name || !nameEn || !realTime || !packagePrice || !numberOfMeals || !numberOfSnacks) {
            toast.error(t('all fields required'));
            return
        }

        // Set the loading state for the spinner
        setLoading(true);

        const editMeal_Obj = {
            bundleId: bundleId,
            bundleName: name,
            bundleNameEn: nameEn,
            mealsNumber: numberOfMeals,
            breakfast: breakfast ? 'on' : 'off',
            lunch: lunch ? 'on' : 'off',
            dinner: dinner ? 'on' : 'off',
            snacksNumber: numberOfSnacks,
            bundlePeriod: realTime,
            fridayOption: fridayIncluded,
            bundlePrice: packagePrice,
            customBundle: true,
        }


        // Send Create Request to the server
        await axios.put(`https://api.easydietkw.com/api/v1/edit/bundle`, editMeal_Obj, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                // SET THE STATE
                setLoading(false);
                // DO WHAT I WANT
                toast.success(res.data.message || `Custom Package Updated Successfully`);
                router.push(`/admin/packages/custom`)
                    .then(() => {

                    })
            })
            .catch(err => {
                // SET THE STATE
                setLoading(false);
                // DO WHAT I WANT
                toast.error(err?.response?.data?.message || err?.message);
            })
    }

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Edit Package</title>
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
                    <p>{t("underTitle")} ({name})</p>
                    <form onSubmit={submitHandler}>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'package_name'}>{t("name")}</label>
                                <input
                                    type={'text'}
                                    name={'package_name'}
                                    id={'package_name'}
                                    placeholder={'EX: FIT PACKAGE'}
                                    value={name}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'name',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'name_en'}>{t("nameEn")}</label>
                                <input
                                    type={'text'}
                                    name={'name_en'}
                                    id={'name_en'}
                                    placeholder={'Fit Package'}
                                    value={nameEn}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'nameEn',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={[classes.InputGroup, classes.MultiSelect].join(' ')}>
                                <label htmlFor={'package_real_time'}>{t("timeReal")}</label>
                                <input
                                    type={'number'}
                                    name={'package_real_time'}
                                    id={'package_real_time'}
                                    placeholder={'EX: 30'}
                                    min={5}
                                    onBlur={(event) => {
                                        event.target.value < 5 && (event.target.value = 5)
                                    }}
                                    value={realTime}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'realTime',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'package_price'}>{t("price")}</label>
                                <input
                                    type={'number'} step={'.25'}
                                    name={'package_price'}
                                    min={'0'}
                                    id={'package_price'}
                                    placeholder={'EX: 15.5 KWD'}
                                    value={packagePrice}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'packagePrice',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'number_of_meals'}>{t("numberOfMeals")}</label>
                                <input
                                    type={'number'}
                                    name={'number_of_meals'}
                                    min={'0'}
                                    id={'number_of_meals'}
                                    placeholder={'EX: 5'}
                                    value={numberOfMeals}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'numberOfMeals',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'Snacks_meals'}>{t("numberOfSnacks")}</label>
                                <input
                                    type={'number'}
                                    name={'Snacks_meals'}
                                    min={'0'}
                                    id={'Snacks_meals'}
                                    placeholder={'EX: 2'}
                                    value={numberOfSnacks}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'numberOfSnacks',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <div className={classes.togglerInput}>
                                    <label htmlFor="package_friday_included">{t("fridays")}</label>
                                    <div className={classes.toggler}>
                                        <input
                                            type="checkbox"
                                            id="package_friday_included"
                                            name="package_friday_included"
                                            checked={fridayIncluded}
                                            onChange={(event) => {
                                                dispatch(onInputChange({
                                                    key: 'fridayIncluded',
                                                    value: event.target.checked
                                                }))
                                            }}
                                        />
                                        <div className={classes.slider}></div>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.InputGroup}>
                                <div className={classes.checkboxRow}>
                                    <label className={classes.checkbox}>
                                        <input type="checkbox" checked={breakfast}
                                               onChange={(event) => {
                                                   dispatch(onInputChange({
                                                       key: 'breakfast',
                                                       value: event.target.checked
                                                   }))
                                               }}
                                        />
                                        <span className={classes.checkmark}></span>
                                        {t("breakfast")}
                                    </label>
                                    <label className={classes.checkbox}>
                                        <input type="checkbox" checked={lunch}
                                               onChange={(event) => {
                                                   dispatch(onInputChange({
                                                       key: 'lunch',
                                                       value: event.target.checked
                                                   }))
                                               }}
                                        />
                                        <span className={classes.checkmark}></span>
                                        {t("lunch")}
                                    </label>
                                    <label className={classes.checkbox}>
                                        <input type="checkbox" checked={dinner}
                                               onChange={(event) => {
                                                   dispatch(onInputChange({
                                                       key: 'dinner',
                                                       value: event.target.checked
                                                   }))
                                               }}
                                        />
                                        <span className={classes.checkmark}></span>
                                        {t("dinner")}
                                    </label>
                                </div>
                            </div>

                        </div>
                        <div className={classes.NavigationContainer}>
                            <button type={'submit'}>
                                <span>
                                    {loading ? <Spinner size={2} color={`#ffffff`}/> : t("create")}
                                </span>
                                <Image src={'/images/Send_Icon.svg'} alt={'Send'} width={20} height={20}/>
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}
export default EditPackage

export const getServerSideProps = wrapper.getServerSideProps(_ => async ({req, query}) => {
    // get the Auth
    const cookies = req.headers.cookie;
    const token = cookies.split('=');
    console.log('token!!!!!')
    console.log(cookies)
    console.log(token)
    //CHECK THE ROLE
    let tokenInfo;
    if (token) {
        await axios.get(`https://api.easydietkw.com/api/v1/get/verify/token`, {
            params: {
                token: token[1],
            }
        })
            .then(res => tokenInfo = res.data.decodedToken)
            .catch(err => console.log(err))
    }

    if (!tokenInfo || tokenInfo.role !== 'admin' || tokenInfo.active === false) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }


    // GET THE ID OF THE MEAL FROM THE URL
    const {ID} = query;
    let bundle;

    if (ID) {
        // GET THE MEAL FROM THE SERVER
        await axios.get(`https://api.easydietkw.com/api/v1/get/bundle?bundleId=${ID}`, {
            headers: {
                'Authorization': `Bearer ${token[1]}`
            }
        })
            .then(res => {
                bundle = res.data.bundle
            })
            .catch(err => {
                // SET THE STATE
                console.log(err.message)
            })
    }

    // Your code here
    let propsObj = {};
    if (bundle) {
        propsObj = {bundle}
    }

    return {
        props: propsObj
    }

});