import classes from './PackageCard.module.scss';
import {useRouter} from "next/router";
// HELPERS
import {toast} from "react-toastify";
//REDUX
import {onInputChange} from '@/redux/slices/user/subscription_info';
import {onInputChange as onPackagesChange} from '@/redux/slices/Admin/packages-slice';
import {useDispatch, useSelector} from "react-redux";
// TRANSITIONS
import i18n from "@/i18n";
import {useTranslation} from "react-i18next";
import {extractTokenFromCookie} from "@/helpers/extractToken";
import axios from "axios";

function PackageCard({
                         ID,
                         type,
                         showOnly,
                         name,
                         nameEn,
                         fridays,
                         mealsType,
                         textOnCard,
                         textOnCardEn,
                         price,
                         snacks,
                         meals,
                         authenticationStatus: {hasProfile, isAuthenticated},
                         custom
                     }) {

    // ROUTER
    const router = useRouter();

    // REDUX
    const dispatch = useDispatch();
    const {packages} = useSelector(state => state.packages);

    // TRANSLATIONS
    const lang = i18n.language;
    const {t} = useTranslation('packageCard');

    // CREATE A LINEAR GRADIENT FOR THE PACKAGE CARD RANDOMLY WITHOUT ADDING THE LIGHT COLORS AND MAKE THE GRADIENT COLORS MACH GOOD
    const ArrayOfGradients = [
        {
            color1: '#00A1AB',
            color2: `#020112`
        },
        {
            color1: '#1E2A78',
            color2: `#FF2E4C`
        },
        {
            color1: '#020112',
            color2: `#00A1AB`
        },
        {
            color1: '#19335A',
            color2: `#8FC8EB`
        },
        {
            color1: '#1C0125',
            color2: `#DB6BE2`,
            color3: `#ad5cad`
        },
        {
            color1: '#310C37',
            color2: `#FE1157`
        },
        {
            color1: '#19335A',
            color2: `#697A98`
        },
        {
            color1: '#485296',
            color2: `#8F3481`
        }
    ];

    const randomGradient = Math.floor(Math.random() * ArrayOfGradients.length);
    const gradient = ArrayOfGradients[randomGradient];

    // CREATE THE GRADIENT STYLE WITH THE RANDOM COLORS AND IF COLOR3 IS NOT DEFINED THEN USE ONLY 2 COLORS
    const gradientStyle = {
        background: gradient.color3 ? `linear-gradient(90deg, ${gradient.color1} 0%, ${gradient.color2} 50%, ${gradient.color3} 100%)` : `linear-gradient(90deg, ${gradient.color1} 0%, ${gradient.color2} 100%)`,
    }


    // DELETE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie)

        if (window.confirm('This Package Will Be Deleted. Are you sure you want to continue?')) {
            await axios.delete(`https://api.easydietkw.com/api/v1/delete/bundle?bundleId=${ID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(_ => {
                    // Show notification
                    toast.success('Package Deleted Successfully');
                    // Update the State
                    const updatedItems = packages.filter(item => item._id !== ID);
                    dispatch(onPackagesChange({key: 'packages', value: updatedItems}))
                })
                .catch(err => {
                    console.log(err);
                    toast.error(err.response?.data?.message || err?.message || 'Something went wrong');
                })
        }
    }


    return (
        <>
            <div className={classes.packageCard} style={gradientStyle}
                 data-text={lang.includes('en') ? textOnCardEn : textOnCard}>
                <div className={classes.packageCard__header}>
                    <h3><span className={classes.heighlighted}>&#34;</span>{lang.includes('en') ? nameEn : name}<span
                        className={classes.heighlighted}>&#34;</span></h3>
                    <p className={classes.packageCard__header__price}>
                        <span>{price} <span className={classes.heighlighted}>{t("priceType")}</span></span>
                        <span className={classes.packageCard__header__price__time}>{t("time")}</span>
                    </p>
                </div>
                <div className={classes.packageCard__body}>
                    <div className={classes.packageCard__body__features}>
                        <ul>
                            {mealsType.includes("افطار") && (<li>{t("breakfast")}</li>)}
                            {(mealsType.includes("غداء") || mealsType.includes("عشاء")) && (
                                <li>{mealsType.includes("افطار") ? Number(meals) - 1 : Number(meals)} {mealsType.includes("غداء") && t("lunch")}{mealsType.includes("عشاء") && ' , ' + t("dinner")}</li>)}
                            {Number(snacks) > 0 && (<li>{snacks} {t("snacks")}</li>)}
                        </ul>
                    </div>
                    {!showOnly && (<div className={classes.packageCard__body__button}>
                        {(type === "user") && (<button
                            className={classes.packageCard__body__button_user}
                            onClick={() => {
                                if (isAuthenticated && hasProfile) {
                                    dispatch(onInputChange({
                                        key: 'package',
                                        value: {id: ID, friday: fridays}
                                    }))
                                    router.push(`/user/choose_starting_date`)
                                } else if (isAuthenticated && !hasProfile) {
                                    router.push(`/user/profile`).then(() => {
                                        toast.error('Please Fill your information first')
                                    })
                                } else {
                                    localStorage.setItem('selectedPackageId', JSON.stringify(ID))
                                    router.push(`/auth/register`)
                                }
                            }}
                        >
                            {t("buy")}
                        </button>)}
                        {type === "admin" && (<>
                            <button
                                className={classes.packageCard__body__button_admin}
                                onClick={() => {
                                    if(custom) {
                                        router.push(`/admin/edit/customPackage?ID=${ID}`)
                                    }else{
                                        router.push(`/admin/edit/edit_package?ID=${ID}`)
                                    }}}>
                                {t("edit")}
                            </button>
                            <button
                                className={classes.packageCard__body__button_admin}
                                onClick={deleteHandler}>
                                {t("delete")}
                            </button>
                        </>)}
                    </div>)}
                </div>
            </div>
        </>
    )
}

export default PackageCard;