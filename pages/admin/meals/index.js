import { useEffect, useState } from "react";
import classes from "@/styles/pages/admin/meals.module.scss";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
// IMPORTS
import MealCard from "@/components/pages/dashboard/Meal_card/MealCard_Edit";
// HELPERS
import axios from "axios";
import { extractTokenFromCookie } from "@/helpers/extractToken";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import { onInputChange } from "@/redux/slices/Admin/meals-slice";
// LANGUAGE
import { useTranslation } from "react-i18next";

const Meals = () => {
    //ROUTER
    const router = useRouter();

    // LANGUAGE
    const { t } = useTranslation("managePages");

    // REDUX
    const dispatch = useDispatch();
    const { meals } = useSelector((state) => state.meals);

    // PAGINATION STATES
    const [pageNumber, setPageNumber] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);

    // PAGINATION LOGIC
    const prevPage = () => {
        if (pageNumber === 1) return;

        if (hasPrevPage) {
            setPageNumber((prev) => prev - 1);
        }
    };

    const nextPage = () => {
        if (hasNextPage) {
            setPageNumber((prev) => prev + 1);
        }
    };

    // EFFECT TO GET THE MEALS WHEN PAGE LOAD
    useEffect(() => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        axios
            .get(`https://api.easydietkw.com/api/v1/get/all/meals`, {
                params: {
                    page: pageNumber || 1,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setHasNextPage(res.data.data.hasNextPage);
                setHasPrevPage(res.data.data.hasPreviousPage);
                // SET THE MEALS IN THE STATE
                dispatch(
                    onInputChange({ key: "meals", value: res.data.data.meals })
                );
            })
            .catch((err) => console.log(err));
    }, [dispatch, pageNumber]);

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Meals</title>
                <meta
                    name="description"
                    content="Discover EasyDiet's healthy meal options that have been satisfying customers for over five years. Our experienced chefs prepare each meal with fresh, locally-sourced ingredients to ensure that you get the best quality and flavor. Choose EasyDiet for convenient and delicious meals that leave you feeling energized and healthy."
                />
                <meta
                    name="keywords"
                    content="healthy meals, meal delivery, fresh ingredients, locally-sourced, convenient meal options, energy-boosting, nutritious food, easy ordering, delicious and healthy, meal plans"
                />
                <meta name="author" content="EasyDiet" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="robots" content="index, follow" />
                <meta
                    httpEquiv="Content-Type"
                    content="text/html; charset=utf-8"
                />
                <meta name="language" content="English" />
                <meta name="revisit-after" content="2 days" />
                <meta name="generator" content="EasyDiet" />
                <meta name="og:title" content="EasyDiet" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://easydietkw.com/" />
                <meta property="og:image" content="/easyDietLogo.png" />
                <meta property="og:site_name" content="EasyDiet" />
                <meta
                    property="og:description"
                    content="EasyDiet has been offering healthy meal options for over 5 years. With a diverse menu of delicious and locally-sourced ingredients, their experienced chefs provide convenient and energizing meals. Experience a healthier lifestyle with EasyDiet."
                />
            </Head>
            <div className={classes.Main}>
                <div className={classes.Top}>
                    <button
                        onClick={() => router.push(`/admin/create/create_meal`)}
                    >
                        <Image
                            src={"/images/Add_Icon.svg"}
                            alt={"Add Icon"}
                            width={18}
                            height={18}
                        />
                        <span>{t("createMeal")}</span>
                    </button>
                </div>
                <div className={classes.Bottom}>
                    {meals.map((item) => {
                        return (
                            <MealCard
                                key={item._id}
                                ID={item._id}
                                image={item.imagePath}
                                name={item.mealTitle}
                                calories={item.calories}
                                carbohydrate={item.carbohydrates}
                                protein={item.protine}
                                fats={item.fats}
                                lang={item.lang}
                                blocked={item.mealBlocked}
                            />
                        );
                    })}
                    {(hasNextPage || hasPrevPage) && (
                        <div className={classes.Table_Pagination}>
                            <button
                                onClick={prevPage}
                                disabled={!hasPrevPage}
                                title={String(pageNumber - 1)}
                            >
                                <Image
                                    src={"/images/Arrow-Left_Icon.svg"}
                                    alt={"Arrow Left"}
                                    width={15}
                                    height={15}
                                />
                            </button>
                            <button
                                onClick={nextPage}
                                disabled={!hasNextPage}
                                title={String(pageNumber + 1)}
                            >
                                <Image
                                    src={"/images/Arrow-Right_Icon.svg"}
                                    alt={"Arrow Right"}
                                    width={15}
                                    height={15}
                                />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
export default Meals;

export const getServerSideProps = async (ctx) => {
    // GET THE TOKEN FROM THE REQUEST
    const { token } = ctx.req.cookies;

    let tokenInfo;
    if (token) {
        await axios
            .get(`https://api.easydietkw.com/api/v1/get/verify/token`, {
                params: {
                    token: token,
                },
            })
            .then((res) => (tokenInfo = res.data.decodedToken))
            .catch((err) => console.log(err));
    }

    if (
        !tokenInfo ||
        tokenInfo.role !== "admin" ||
        tokenInfo.active === false
    ) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
