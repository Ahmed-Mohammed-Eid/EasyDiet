import classes from './MySubscription.module.scss';
import {useRouter} from "next/router";
// LANGUAGE
import {useTranslation} from "react-i18next";
import i18n from "@/i18n";

const MySubscription = ({hasPreviousSubscribtion, bundleId}) => {

    // ROUTER
    const router = useRouter();

    // LANGUAGE
    const {t} = useTranslation('mySubscription');

    let renewButton = null;

    if(hasPreviousSubscribtion === true && bundleId !== null) {
        renewButton = <button className={classes.Renew} onClick={() => router.push(`/user/choose_starting_date?packageId=${bundleId}`)}>{i18n.language.includes('en') ? 'Renew the last Package' : 'تجديد اخر باقة'}</button>
    }

    return (
        <>
            <div className={classes.MySubscription} data-title={t("title1")}>
                <p>{t("notLoadedMessage")}</p>
                <button className={classes.Packages} onClick={() => router.push('/user/packages')}>{t("button")}</button>
                {renewButton}
            </div>
        </>
    )
}

export default MySubscription;