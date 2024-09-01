import classes from './Meal_User.module.scss';
import Image from "next/image";

// LANGUAGE
import {useTranslation} from "react-i18next";
import i18n from "@/i18n";


const MealCardAdmin = ({ID, image, name, nameEn, protein, calories, fats, carbohydrate}) => {
    // LANGUAGE
    const {t} = useTranslation('menu');

    // TRANSLATIONS
    const lang = i18n.language;


    return (
        <article className={classes.Card}>
            <div className={classes.Image_Container}>
                <Image src={image || '/images/no_image.webp'} alt={'Meal Image'} width={360} height={250}/>
            </div>
            <div className={classes.Content_Container}>
                <h2>{lang.includes('en') ? nameEn : name}</h2>
                <div className={classes.Info_Container}>
                    <div className={classes.Info_Item}>
                        <h3>{t("calories")}</h3>
                        <span>{calories} cal</span>
                    </div>
                    <div className={classes.Info_Item}>
                        <h3>{t("protein")}</h3>
                        <span>{protein} {t("gram")}</span>
                    </div>
                    <div className={classes.Info_Item}>
                        <h3>{t("fat")}</h3>
                        <span>{fats} {t("gram")}</span>
                    </div>
                    <div className={classes.Info_Item}>
                        <h3>{t("carbohydrate")}</h3>
                        <span>{carbohydrate} {t("gram")}</span>
                    </div>
                </div>
            </div>
        </article>
    )
}
export default MealCardAdmin