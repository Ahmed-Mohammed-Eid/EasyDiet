import {useEffect} from "react";
import classes from './LoadingPage.module.scss';
import {useRouter} from "next/router";
// IMPORTS
import Spinner from "@/components/layout/spinner/Spinner";
// HELPER
import axios from "axios";
import {extractTokenFromCookie} from "@/helpers/extractToken";
import {toast} from "react-toastify";
// TRANSLATION
import {useTranslation} from "react-i18next";

const LoadingPage = () => {
    // Router
    const router = useRouter();

    // Translation
    const {t} = useTranslation('user_global');

    // SEND REQUEST WHEN COMPONENT IS LOADED
    useEffect(() => {
        subscriptionHandler();
    }, [router]);

    // SUBSCRIPTION HANDLER
    const subscriptionHandler = () => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        // Check if the tap_id is in the query
        if (router.query.tap_id) {
            axios.post('https://api.easydietkw.com/api/v1/check/payment', {
                tap_id: router.query.tap_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    if (res.data.success === true) {
                        router.push('/user/my_subscription')
                            .then(() => {
                                toast.success(res.data?.message || "Payment done successfully")
                                localStorage.removeItem('selectedPackageId')
                            })
                    } else {
                        router.push('/user/my_subscription')
                            .then(() => {
                                toast.error(res.data?.message)
                                localStorage.removeItem('selectedPackageId')
                            })
                    }
                })
                .catch(err => {
                    router.push('/user/my_subscription').then(() => {
                        toast.error(err.response?.data?.message || err.message || "Something went wrong please call the support")
                        localStorage.removeItem('selectedPackageId')
                    })
                })
        }
    }

    return (
        <>
            <div className={classes.LoadingPage}>
                <Spinner color={'#A71523'} size={5}/>
                <p>{t("loading")}</p>
            </div>
        </>
    )
}

export default LoadingPage;