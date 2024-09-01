import classes from './Meal_Edit.module.scss';
import Image from "next/image";
import {useRouter} from "next/router";
// HELPERS
import axios from "axios";
import {extractTokenFromCookie} from "@/helpers/extractToken";
import {toast} from "react-toastify";
//REDUX
import {onInputChange} from "@/redux/slices/Admin/meals-slice";
import {useSelector, useDispatch} from "react-redux";
// LANGUAGE
import {useTranslation} from "react-i18next";
import i18n from '@/i18n';


const MealCardAdmin = ({ID, image, name, protein, calories, fats, carbohydrate, lang, blocked}) => {
    // ROUTER
    const router = useRouter();

    // LANGUAGE
    const {t} = useTranslation('menu');

    //REDUX
    const dispatch = useDispatch();
    const {meals} = useSelector(state => state.meals);

    // DELETE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie)

        if (window.confirm('This Meal Will Be Deleted. Are you sure you want to continue?')) {
            await axios.delete(`https://api.easydietkw.com/api/v1/delete/meal?mealId=${ID}&lang=${lang}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(_ => {
                    // Show notification
                    toast.success('Meal Deleted Successfully');
                    // Update the State
                    const updatedItems = meals.filter(item => item._id !== ID);
                    dispatch(onInputChange({key: 'meals', value: updatedItems}))
                })
                .catch(err => {
                    toast.error(err.response?.data?.message || err.message || 'Something Went Wrong');
                })
        }
    }

    // STYLE FOR SPAN BLOCKED EN
    const span_style = {
        position: 'absolute',
        top: '0',
        left: '0',
        backgroundColor: 'red',
        padding: '0.5rem 1rem',
        borderRadius: '0 0 0.5rem 0',
        zIndex: '1',
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 'bold'
    };

    // STYLE FOR SPAN BLOCKED AR
    const span_style_ar = {
        position: 'absolute',
        top: '0',
        right: '0',
        backgroundColor: 'red',
        padding: '0.5rem 1rem',
        borderRadius: '0 0.5rem 0 0',
        zIndex: '1',
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 'bold'
    };


    return (
        <article className={classes.Card}>
            <div className={classes.Image_Container}>
                {blocked && (<span style={i18n.language.includes('en') ? span_style : span_style_ar}>
                    {i18n.language.includes('en') ? 'Blocked' : 'تم الحظر'}
                </span>)}
                <Image src={image || '/images/no_image.webp'} alt={'Meal Image'} width={360} height={250}/>
            </div>
            <div className={classes.Content_Container}>
                <h2>{name}</h2>
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
                <div className={classes.Buttons}>
                    <button>
                        <Image src={'/images/Delete_Icon.svg'} onClick={deleteHandler} alt={'Delete'} width={18}
                               height={18}/>
                    </button>
                    <button
                        onClick={() => router.push(`/admin/edit/edit_meal?mealId=${ID}&lang=${lang}&mealName=${name}`)}>
                        <Image src={'/images/Edit_Icon.svg'} alt={'Edit'} width={18} height={18}/>
                    </button>
                </div>
            </div>
        </article>
    )
}
export default MealCardAdmin