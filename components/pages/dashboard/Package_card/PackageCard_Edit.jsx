import classes from './PackageCard_Edit.module.scss';
import Image from "next/image";
import {useRouter} from "next/router";
// HELPERS
import {extractTokenFromCookie} from "@/helpers/extractToken";
import axios from "axios";
import {toast} from "react-toastify";
//REDUX
import {useSelector, useDispatch} from "react-redux";
import {onInputChange} from "@/redux/slices/Admin/packages-slice";
// LANGUAGE
import {useTranslation} from "react-i18next";


const PackageAdminCard = ({ID, name, price, time, meals, snacks, fridays, offers, language}) => {
    //ROUTER
    const router = useRouter();

    // TRANSLATION
    const {t} = useTranslation('packageCard');

    // REDUX
    const dispatch = useDispatch();
    const {packages} = useSelector(state => state.packages);

    // DELETE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie)

        if (window.confirm('This Package Will Be Deleted. Are you sure you want to continue?')) {
            await axios.delete(`https://api.easydietkw.com/api/v1/delete/bundle?bundleId=${ID}&lang=${language}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    // Show notification
                    toast.success('Meal Deleted Successfully');
                    // Update the State
                    const updatedItems = packages.filter(item => item._id !== ID);
                    dispatch(onInputChange({key: 'packages', value: updatedItems}))
                })
                .catch(err => {
                    toast.error(err.response?.data?.message || res.message);
                })
        }
    }



    return (
        <article className={classes.Card}>
            <div className={classes.Buttons}>
                <button onClick={() => router.push(`/admin/edit/edit_package?ID=${ID}&lang=${language}`)}>
                    <Image src={'/images/Edit_Icon.svg'} alt={'Edit'} width={18} height={18} />
                </button>
                <button onClick={deleteHandler}>
                    <Image src={'/images/Delete_Icon.svg'} alt={'Delete'} width={18} height={18} />
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
export default PackageAdminCard