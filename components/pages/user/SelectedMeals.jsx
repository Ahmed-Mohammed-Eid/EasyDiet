import classes from './SelectedMeals.module.scss';
import Image from "next/image";
// IMPORT COMPONENTS
import SelectedMealCard from "@/components/pages/user/SelectedMealCard";


const SelectedMeals = ({text1, text2, isActive, selectedMeals, closeTheOverlay}) => {
    return (
        <>
            <div className={[classes.SelectedMeals, isActive? classes.isActive : ''].join(' ')}>
                <h2>{text1}</h2>
                <button className={classes.Close} onClick={closeTheOverlay}>
                    <Image src={'/images/Auth/next-icon.svg'} alt={'Close'} width={20} height={20} />
                </button>
                <div className={classes.Meals_Container}>
                    {
                        selectedMeals?.length > 0 ? selectedMeals.map((meal, index) => {
                            return (
                                <SelectedMealCard name={meal.name} image={meal.image} ID={meal.id} key={index} number={meal.number}/>
                            )
                        }): (
                            <p>{text2}</p>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default SelectedMeals;