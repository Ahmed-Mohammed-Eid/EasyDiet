import {useEffect} from "react";
import classes from '@/styles/pages/user/menu.module.scss'
import Head from "next/head";
// IMPORTS
import MealCard_User from "@/components/pages/dashboard/Meal_card/MealCard_User";
// HELPERS
import axios from "axios";
import {toast} from "react-toastify";
// REDUX
import {useDispatch, useSelector} from "react-redux";
import {onInputChange} from '@/redux/slices/user/menu';
// TRANSLATION
import {useTranslation} from "react-i18next";

const Menu = () => {
    // LANGUAGE
    const {t} = useTranslation('menu')

    //REDUX
    const dispatch = useDispatch();
    const {menu} = useSelector(state => state.menu_user);

    // EFFECT TO GET THE PACKAGES WHEN PAGE LOAD
    useEffect(() => {

        // LOGIC
        try {
            axios.get(`https://api.easydietkw.com/api/v1/client/meals?lang=${'EN'}&page=${1}`)
                .then(res => {
                    dispatch(onInputChange({key: 'menu', value: res.data.data.meals}))
                })
        } catch (err) {
            toast.error(err.response?.data?.message || err.message)
        }

    }, [dispatch])

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Menu</title>
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
            <div className={classes.Main}>
                <h1>{t("title")}</h1>
                <div className={classes.Bottom}>
                    {menu && menu.map((cur) => {
                        return (
                            <MealCard_User
                                key={cur._id}
                                ID={cur._id}
                                name={cur.mealTitle}
                                nameEn={cur.mealTitleEn}
                                calories={cur.calories}
                                carbohydrate={cur.carbohydrates}
                                fats={cur.fats}
                                protein={cur.protine}
                                lang={cur.lang}
                                image={cur.imagePath}
                            />
                        )
                    })}
                </div>
            </div>
        </>
    )
}
export default Menu