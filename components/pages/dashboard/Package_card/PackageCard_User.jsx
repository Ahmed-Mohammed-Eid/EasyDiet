import classes from './PackageCard_User.module.scss';
import Image from "next/image";
import {useRouter} from "next/router";
// HELPERS
import {toast} from "react-toastify";
//REDUX
import {onInputChange} from '@/redux/slices/user/subscription_info';
import {useDispatch} from "react-redux";
// LANGUAGE
import {useTranslation} from "react-i18next";

const PackageCard_User = ({
                              ID,
                              name,
                              price,
                              time,
                              meals,
                              snacks,
                              fridays,
                              offers,
                              language,
                              authenticationStatus: {hasProfile, isAuthenticated}
                          }) => {

    //ROUTER
    const router = useRouter();

    //REDUX
    const dispatch = useDispatch();
    // TRANSLATION
    const {t} = useTranslation('packageCard');


    return (
        <article className={classes.Card}>
            <div className={classes.Buttons}>
                <button onClick={() => {
                    if (isAuthenticated && hasProfile) {
                        dispatch(onInputChange({key: 'package', value: {id: ID, friday: fridays, language: language}}))
                        router.push(`/user/choose_starting_date`)
                    } else if (isAuthenticated && !hasProfile) {
                        router.push(`/user/profile`).then(() => {
                            toast.error('Please Fill your information first')
                        })
                    } else {
                        router.push(`/auth/login`)
                    }
                }}>
                    <Image src={'/images/Global/Buy_Icon.svg'} alt={'Edit'} width={18} height={18}/>
                </button>
            </div>
            <p className={classes.Price}>{price} {t('priceType')}</p>
            <div className={classes.Top}>
                <div className={classes.Info}>
                    <p>{name}</p>
                    <span>{time}</span>
                    {/*<span>{meals}</span>*/}
                </div>
            </div>
            <div className={classes.Bottom}>
                <div>
                    <p>{t('meals')}</p>
                    <span>{meals}</span>
                </div>
                <div>
                    <p>{t('snacks')}</p>
                    <span>{snacks}</span>
                </div>
                <div>
                    <p>{t('fridays')}</p>
                    <span>{fridays ? <span>&#10003;</span> : <span>&#10006;</span>}</span>
                </div>
                <div>
                    <p>{t('offers')}</p>
                    <span>{offers > 0 ? <span>&#10003;</span> : <span>&#10006;</span>}</span>
                </div>
            </div>
        </article>
    )
}
export default PackageCard_User