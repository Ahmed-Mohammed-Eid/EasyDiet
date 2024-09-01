import classes from './PackageCard.module.scss';
// LANGUAGE
import {useTranslation} from "react-i18next";

const PackageAdminCard = ({name, price, time, meals, snacks, fridays, offers}) => {

    // TRANSLATION
    const {t} = useTranslation('packageCard');

    return (
        <article className={classes.Card}>
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
export default PackageAdminCard