import '@/styles/globals.scss'
// TRANSLATION
import {I18nextProvider} from 'react-i18next';
import i18n from "@/i18n";
// REDUX
import {Provider} from 'react-redux'
import wrapper, {store} from '../redux/store'
// IMPORTS
import Layout from "@/components/layout/Layout";
import NextNProgress from 'nextjs-progressbar';

import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from "next/router";
import {useEffect} from "react";
// AUTH CHECKER
import {useAuth} from "@/hooks/useAuth";

function MyApp({Component, pageProps}) {
    //ROUTER
    const router = useRouter();

    // AUTH CHECKER DATA
    const {isAuthenticated, userData} = useAuth();

    //EFFECT TO SET THE DEFAULT OF LANGUAGES
    useEffect(() => {
        let htmlTag;
        let bodyTag;
        if (document) {
            htmlTag = document.querySelector('html');
            bodyTag = document.body;
        }

        if (i18n.language.includes('en')) {
            if (htmlTag) {
                htmlTag.setAttribute('lang', 'en');
                htmlTag.setAttribute('dir', 'ltr');
                bodyTag.classList.remove('ARABIC');
            }
            i18n.changeLanguage('en')
        } else {
            if (htmlTag) {
                htmlTag.setAttribute('lang', 'ar')
                htmlTag.setAttribute('dir', 'rtl');
                bodyTag.classList.add('ARABIC');
            }
            i18n.changeLanguage('ar');
        }
    }, [])

    return (
        <I18nextProvider i18n={i18n}>
            <NextNProgress color={`#A71523`}/>
            <Provider store={store}>
                {(router.pathname.includes('/admin') || router.pathname.includes('/user') || router.pathname.includes('/doctor')) ? (
                        <Layout isAuthenticated={isAuthenticated} userData={userData}>
                            <Component {...pageProps} isAuthenticated={isAuthenticated} userData={userData}/>
                        </Layout>
                    ) :
                    (
                        <Component {...pageProps} isAuthenticated={isAuthenticated} userData={userData}/>
                    )
                }
            </Provider>
            <ToastContainer position="bottom-right"/>
        </I18nextProvider>
    )
}

export default wrapper.withRedux(MyApp)
