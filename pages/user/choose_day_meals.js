import {useEffect, useRef, useState} from "react";
import classes from "@/styles/pages/user/choose_day_meals.module.scss";
import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";
// COMPONENTS
import Overlay from "@/components/pages/dashboard/ChangeUser_Name/overlay";
import MealCard_User from "@/components/pages/user/MealCard_Add";
import SelectedMeals from "@/components/pages/user/SelectedMeals";
import Stepper from "@/components/pages/user/Stepper/Stepper";
import ScrollToTop from "@/components/layout/ScrollToTop/ScrollToTop";
import Spinner from "@/components/layout/spinner/Spinner";
// REDUX
import {useDispatch, useSelector} from "react-redux";
import {onInputChange, resetSelectedMeals} from '@/redux/slices/user/daymeals_slice';
// HELPERS
import axios from "axios";
import {toast} from "react-toastify";
import {extractTokenFromCookie} from "@/helpers/extractToken";
// LANGUAGE
import {useTranslation} from "react-i18next";
import i18n from "@/i18n";

const Choose_Day_Meals = () => {
    //ROUTER
    const router = useRouter();

    // LANGUAGE
    const {t} = useTranslation('chooseDayMeals');

    //STATES
    const [overlay, setOverlay] = useState(false);
    const [mealType, setMealType] = useState('');
    const [availableMeals, setAvailableMeals] = useState('');
    const [availableSnacks, setAvailableSnacks] = useState('');
    const [dateIdFromURL, setDateIdFromURL] = useState('');
    const [packageAvailableMeals, setPackageAvailableMeals] = useState([]);
    const scrollableRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [effectRenderNumber, setEffectRenderNumber] = useState(0);

    //REDUX
    const dispatch = useDispatch();
    const {meals, date, dateId, selectedMeals} = useSelector(state => state.daymeals_user);

    // EFFECT TO GET THE PACKAGES WHEN PAGE LOAD
    useEffect(() => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        // GET THE DATE ID FROM THE URL
        const {dateId: dateIdQuery} = router.query;
        setDateIdFromURL(dateIdQuery);

        if (dateIdQuery || dateId) {

            // LOGIC
            try {
                axios.get(`https://api.easydietkw.com/api/v1/filter/menu/meals`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        mealType: mealType || 'الكل',
                        dateId: dateId || dateIdQuery
                    }
                })
                    .then(res => {
                        dispatch(onInputChange({key: 'meals', value: res.data.filter}));

                        setPackageAvailableMeals(res.data.bundleMealsTypes);

                        if (!mealType) {
                            setMealType(res.data.bundleMealsTypes[0])
                        }

                        if (Number(res.data.numberOfMeals) === 0 && Number(res.data.numberOfSnacks) === 0) {
                            setAvailableMeals(Number(res.data.defaultMealsNumber));
                            setAvailableSnacks(Number(res.data.defaultSnacksNumber));
                            setIsEditing(true)
                            // SET SELECTED MEALS
                            const selectedMealsInDB = res.data?.selectedMeals.map(meal => {
                                return {
                                    image: meal.imagePath,
                                    name: meal.mealTitle,
                                    id: meal._id,
                                    number: 1,
                                    mealType: meal.mealType
                                }
                            })

                            if (effectRenderNumber === 0) {
                                dispatch(onInputChange({key: 'selectedMeals', value: selectedMealsInDB}));
                                setEffectRenderNumber(1);
                            }
                        } else {
                            setAvailableMeals(res.data.numberOfMeals);
                            setAvailableSnacks(res.data.numberOfSnacks)
                        }
                    })
                    .catch(err => {
                        toast.error(err.response?.data?.message || err.message)
                    })
            } catch (err) {
                toast.error(err.response?.data?.message || err.message)
            }
        }

    }, [dispatch, dateId, router, mealType, effectRenderNumber])

    // HIDE OVERLAY
    const hideOverlay = () => {
        setOverlay(false)
    }

    //RESET MEALS HANDLER
    const resetMealsHandler = () => {
        dispatch(onInputChange({key: 'selectedMeals', value: []}));
        let theType;
        if (packageAvailableMeals.includes("افطار") && !mealType) {
            theType = "افطار"
        } else if (packageAvailableMeals.includes("غداء") && !mealType) {
            theType = "غداء"
        } else if (packageAvailableMeals.includes("عشاء") && !mealType) {
            theType = "عشاء"
        } else if (packageAvailableMeals.includes("سناك") && !mealType) {
            theType = "سناك"
        }
        setMealType(theType);
    }

    //SUBMIT HANDLER
    const submitHandler = (event) => {
        //STOP RELOADING
        event.preventDefault();

        // SET LOADING TO TRUE
        setLoading(true);

        // Check if All is selected
        /*
        * if selectedMeals.length === 0 then the user didn't select any meal and send a message based on the meal type in ar and en
        * and if the type is breakfast then the user can choose only one meal and if is the type is lunch and the package has a dinner then the user can choose minimum 1 meal and maximum the number of meals - 2
        */

        if (selectedMeals.length === 0 && mealType === 'افطار') {
            setLoading(false)
            return toast.error(i18n.language.includes('en') ? 'Please Select a breakfast meal' : 'الرجاء اختيار وجبة الفطور')
        } else if (selectedMeals.length === 0 && mealType === 'غداء') {
            setLoading(false)
            return toast.error(i18n.language.includes('en') ? 'Please Select a lunch meat' : 'الرجاء اختيار وجبة الغداء')
        } else if (selectedMeals.length === 0 && mealType === 'عشاء') {
            setLoading(false)
            return toast.error(i18n.language.includes('en') ? 'Please Select a dinner meal' : 'الرجاء اختيار وجبة العشاء')
        } else if (selectedMeals.length === 0 && mealType === 'سناك') {
            setLoading(false)
            return toast.error(i18n.language.includes('en') ? 'Please Select a snack' : 'الرجاء اختيار سناك')
        } else if (selectedMeals.length > 1 && mealType === 'افطار') {
            setLoading(false)
            return toast.error(i18n.language.includes('en') ? 'Please Select only one breakfast meal' : 'الرجاء اختيار وجبة واحدة فقط للفطور')
        } else if (selectedMeals.length === 1 && mealType === 'افطار' && packageAvailableMeals.includes('غداء')) {
            if (packageAvailableMeals.includes("غداء")) {
                setMealType('غداء')
                // Scroll to top of the scrollable div smoothly
                scrollableRef.current.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                setLoading(false)
                return;
            }
        } else if (selectedMeals.length === 1 && mealType === 'افطار' && !packageAvailableMeals.includes('غداء') && packageAvailableMeals.includes('عشاء')) {
            if (packageAvailableMeals.includes("عشاء")) {
                setMealType('عشاء')
                // Scroll to top of the scrollable div smoothly
                scrollableRef.current.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                setLoading(false)
                return;
            }
        } else if (selectedMeals.length === 1 && mealType === 'افطار' && !packageAvailableMeals.includes('غداء') && !packageAvailableMeals.includes('عشاء') && packageAvailableMeals.includes('سناك')) {
            if (packageAvailableMeals.includes("سناك")) {
                setMealType('سناك')
                // Scroll to top of the scrollable div smoothly
                scrollableRef.current.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                setLoading(false)
                return;
            }
        } else if (selectedMeals.length === 1 && mealType === 'غداء' && packageAvailableMeals.includes('افطار')) {
            setLoading(false)
            return toast.error(i18n.language.includes('en') ? 'Please Select a lunch meat' : 'الرجاء اختيار وجبة الغداء')
        } else if (selectedMeals.length === 1 && mealType === 'عشاء' && packageAvailableMeals.includes('افطار')) {
            setLoading(false)
            return toast.error(i18n.language.includes('en') ? 'Please Select a dinner meal' : 'الرجاء اختيار وجبة العشاء')
        } else if (selectedMeals.length === 1 && mealType === 'سناك') {
            setLoading(false)
            return toast.error(i18n.language.includes('en') ? 'Please Select a snack' : 'الرجاء اختيار سناك')
        } else if (selectedMeals.length >= availableMeals && mealType === 'غداء' && packageAvailableMeals.includes('عشاء')) {
            setLoading(false)
            return toast.error(i18n.language.includes('en') ? 'The Lunch meals number is more than expected' : 'عدد وجبات الغداء اكثر من المتوقع')
        } else if (selectedMeals.length > 1 && selectedMeals.length < availableMeals && mealType === 'غداء') {
            if (packageAvailableMeals.includes('عشاء')) {
                setMealType('عشاء')
                // Scroll to top of the scrollable div smoothly
                scrollableRef.current.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                setLoading(false)
                return;
            }
        } else if (selectedMeals.length >= 1 && selectedMeals.length < availableMeals && mealType === 'غداء' && !packageAvailableMeals.includes('افطار')) {
            if (packageAvailableMeals.includes('عشاء')) {
                setMealType('عشاء')
                // Scroll to top of the scrollable div smoothly
                scrollableRef.current.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                setLoading(false)
                return;
            }
        } else if (selectedMeals.length < availableMeals && mealType === 'عشاء') {
            setLoading(false)
            return toast.error(i18n.language.includes('en') ? `There is/are ${Number(availableMeals) - selectedMeals.length} Meal/s not selected yet` : `هناك ${Number(availableMeals) - selectedMeals.length} وجبة/ات لم يتم اختيارها بعد`)
        } else if (selectedMeals.length > Number(availableMeals) && mealType === 'عشاء') {
            setLoading(false)
            return toast.error(i18n.language.includes('en') ? `The Dinner meals number is more than expected` : `عدد وجبات العشاء اكثر من المتوقع`)
        } else if (selectedMeals.length === Number(availableMeals) && mealType === 'عشاء') {
            if (packageAvailableMeals.includes('سناك')) {
                setMealType('سناك')
                // Scroll to top of the scrollable div smoothly
                scrollableRef.current.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                setLoading(false)
                return;
            }
        } else if (selectedMeals.length >= Number(availableMeals) && selectedMeals.length < (Number(availableMeals) + Number(availableSnacks)) && mealType === 'سناك') {
            setLoading(false)
            return toast.error(i18n.language.includes('en') ? `You Have to select ${availableSnacks} snack/s` : `يجب اختيار ${availableSnacks} سناك/سناكات`)
        } else if (selectedMeals.length > (Number(availableMeals) + Number(availableSnacks)) && mealType === 'سناك') {
            setLoading(false)
            return toast.error(i18n.language.includes('en') ? `The Snacks meals number is more than expected` : `عدد وجبات السناك اكثر من المتوقع`)
        } else if (selectedMeals.length !== (Number(availableMeals) + Number(availableSnacks))) {
            setLoading(false)
            return toast.error(i18n.language.includes('en') ? `The total selected meals number is not equal to the available meals number` : `العددالاجمالي للوجبات غير مطابق لعدد الوجبات التي تم اختيارها`)
        }


        if (!dateId && !dateIdFromURL) {
            setLoading(false)
            return toast.error('Date Id is not defined')
        }

        const ArrayOfMeals = selectedMeals.map(item => {
            return item.id
        })

        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);
        // LOGIC
        let requestBody = {
            dateId: dateId || dateIdFromURL,
            meals: ArrayOfMeals,
        }

        if (isEditing) {
            requestBody = {
                ...requestBody,
                flag: 'edit'
            }
        }

        try {
            if (availableMeals === 0 && availableSnacks === 0 && window.confirm('Please Note that by choosing new meals the previous day meals will by Deleted.')) {
                axios.post(`https://api.easydietkw.com/api/v1/client/select/meal`, requestBody, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(_ => {
                        setLoading(false)
                        router.push('/user/my_subscription').then(() => {
                            toast.success('The Meals of the Day Updated Successfully')
                            //Clear the Reducer
                            dispatch(resetSelectedMeals());
                        })
                    })
                    .catch(err => {
                        setLoading(false)
                        toast.error(err.response?.data?.message || err.message)
                    })
            } else {
                axios.post(`https://api.easydietkw.com/api/v1/client/select/meal`, requestBody, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(_ => {
                        setLoading(false)
                        router.push('/user/my_subscription').then(() => {
                            toast.success('The Meals of the Day Updated Successfully')
                            //Clear the Reducer
                            dispatch(resetSelectedMeals());
                        })
                    })
                    .catch(err => {
                        setLoading(false)
                        toast.error(err.response?.data?.message || err.message)
                    })
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message)
        }
    }

    const changeCurrentStep = (step) => {
        setMealType(step);
    }

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Choose Day Meals</title>
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
                    <div className={classes.Top}>
                        <div className={classes.Top_Container}>
                            <div
                                className={classes.Navigation}
                                data-word={t("filter")}
                                data-day={new Date(date).toLocaleDateString(i18n.language.includes('en') ? 'en-US' : "ar-EG", {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            >
                                <Stepper currentStep={(step) => changeCurrentStep(step)} mealType={mealType}
                                         meals={packageAvailableMeals} availableMeals={packageAvailableMeals}/>
                            </div>
                            <div className={classes.Buttons}>
                                <button title={'Selected Meals'} onClick={() => {
                                    resetMealsHandler()
                                    router.push('/user/my_subscription');
                                }}>
                                    <Image style={{transform: 'rotate(180deg)'}} src={'/images/Auth/next-icon.svg'}
                                           alt={'Selected Meals'}
                                           width={20} height={20}/>
                                    <span>{t("back")}</span>
                                </button>
                                <button title={'Selected Meals'} onClick={() => setOverlay(true)}>
                                    <Image src={'/images/Global/SelectedMeals_Icon.svg'} alt={'Selected Meals'}
                                           width={20} height={20}/>
                                    <span>{t("selected")}</span>
                                </button>
                                <button title={'Reset All Meals'} onClick={resetMealsHandler}>
                                    <Image src={'/images/Global/ResetMeals_Icon.svg'} alt={'Selected Meals'}
                                           width={20}
                                           height={20}/>
                                    <span>{t("reset")}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={classes.Bottom}>
                        <div className={classes.Cards}>
                            {meals && meals.map((cur) => {
                                if (cur?.mealId?._id && cur?.mealId?.lang && cur?.mealId?.mealTitle && cur?.mealId?.imagePath && cur?.mealId?.calories && cur?.mealId?.carbohydrates && cur?.mealId?.protine && cur?.mealId?.fats)
                                    return (
                                        <MealCard_User
                                            key={cur?.mealId?._id}
                                            ID={cur?.mealId?._id}
                                            image={cur?.mealId?.imagePath}
                                            carbohydrate={cur?.mealId?.carbohydrates}
                                            protein={cur?.mealId?.protine}
                                            fats={cur?.mealId?.fats}
                                            calories={cur?.mealId?.calories}
                                            name={cur?.mealId?.mealTitle}
                                            lang={cur?.mealId?.lang}
                                            availableMeals={availableMeals}
                                            availableSnacks={availableSnacks}
                                            mealType={cur?.mealId?.mealType}
                                        />
                                    )
                            })}
                        </div>
                        <button
                            className={[classes.Create_button].join(' ')}
                            type={'submit'}
                            onClick={submitHandler}
                        >
                            <span>{i18n.language.includes('en') ? (mealType !== packageAvailableMeals[packageAvailableMeals.length - 1] ? (loading ?
                                <Spinner size={1} color={'#FFFFFF'}/> : "Next") : (loading ? <Spinner size={1}
                                                                                                      color={'#FFFFFF'}/> : "Confirm")) : (mealType !== packageAvailableMeals[packageAvailableMeals.length - 1] ? (loading ?
                                <Spinner size={1} color={'#FFFFFF'}/> : "التالي") : (loading ?
                                <Spinner size={1} color={'#FFFFFF'}/> : "تأكيد"))}</span>
                        </button>
                    </div>
                </div>
                <ScrollToTop parentRef={scrollableRef}/>
            </main>
            <Overlay active={overlay} clicked={hideOverlay}>
                <SelectedMeals text1={t("selectedMeals")} text2={t("noMeals")} isActive={overlay}
                               selectedMeals={selectedMeals} closeTheOverlay={hideOverlay}/>
            </Overlay>
        </>

    )
}

export default Choose_Day_Meals;