import classes from './Meal_Add.module.scss';
import Image from "next/image";
//REDUX
import {onInputChange} from "@/redux/slices/user/daymeals_slice";
import {useSelector, useDispatch} from "react-redux";
// LANGUAGE
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";


const MealCardAdmin = ({ID, image, name, protein, calories, fats, carbohydrate, availableMeals, availableSnacks, mealType}) => {

    //REDUX
    const dispatch = useDispatch();
    const {selectedMeals} = useSelector(state => state.daymeals_user);

    // LANGUAGE
    const {t} = useTranslation('chooseDayMeals');

    // Check if the user selected the meal
    const checkMeal = () => {
        const index = selectedMeals.findIndex((meal) => meal.id === ID);
        return index !== -1;
    }

    // ADD HANDLER
    const addHandler = async () => {
        // Make a copy from the meals
        const mealsCopy = [...selectedMeals];

        // find the meal by index
        const index = mealsCopy.findIndex((meal) => meal.id === ID);

        if (index !== -1) {
            // REMOVE THE MEAL WITH THE INDEX FROM THE ARRAY
            mealsCopy.splice(index, 1);

            dispatch(onInputChange({
                key: 'selectedMeals',
                value: mealsCopy
            }))
        } else {
            // VALIDATION TO CHECK IF THE USER SELECTED THE MAXIMUM MEALS
            if ((+availableMeals + +availableSnacks) === selectedMeals.length && selectedMeals.length > 0) {
                toast.error(`You can't select more than ${availableMeals} meals and ${availableSnacks} snacks`);
                return;
            }

            dispatch(onInputChange({
                key: 'selectedMeals',
                value: [...mealsCopy, {image: image, name: name, id: ID, number: 1, mealType: mealType}]
            }))
        }
    }

    return (
        <article className={classes.Card}>
            <div className={classes.Image_Container}>
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
                    {ID && (
                        <button
                            title={'Select'}
                            onClick={() => addHandler(ID)}
                            // disabled={checkMeal()}
                        >
                            {!checkMeal() ? (
                                <Image src={'/images/Global/Add_Icon.svg'} alt={'Add'} width={18} height={18}/>) : (
                                <Image src={'/images/Global/Check_Icon.svg'} alt={'Select'} width={18} height={18}/>)}
                        </button>)
                    }
                </div>
            </div>
        </article>
    )
}
export default MealCardAdmin