import Head from "next/head";
// IMPORTS
import LoadingPage from "@/components/layout/LoadingPage/LoadingPage";

const Loading = () => {
    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Redirecting</title>
                <meta name="description"
                      content="EasyDiet has been offering healthy meal options for over 5 years. With a diverse menu of delicious and locally-sourced ingredients, their experienced chefs provide convenient and energizing meals. Experience a healthier lifestyle with EasyDiet."/>
                <meta name="keywords"
                      content="healthy meals, meal delivery, fresh ingredients, locally-sourced, convenient meal options, energy-boosting, nutritious food, easy ordering, delicious and healthy, meal plans, EasyDiet, Easy Diet, EasyDiet Dubai, EasyDiet UAE, EasyDiet Abu Dhabi, EasyDiet Sharjah, EasyDiet Ajman, EasyDiet Fujairah, EasyDiet Ras Al Khaimah, EasyDiet Umm Al Quwain, EasyDiet Al Ain, EasyDiet Al Gharbia, EasyDiet Al Dhafra, EasyDiet Al Ruwais, EasyDiet Al Wathba, EasyDiet Al Khazna, EasyDiet Al Khatim, EasyDiet Al Mirfa, EasyDiet Al Sila, EasyDietKw, EasyDiet-kw, EasyDiet-kw.com, easydietkw.com"/>
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
            <div>
                <LoadingPage />
            </div>
        </>
    )
}

export default Loading;