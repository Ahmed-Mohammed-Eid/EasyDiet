import React from 'react';
import styles from './Stepper.module.scss';
// REDUX
import {useSelector, useDispatch} from "react-redux";
import i18n from "@/i18n";
import {onInputChange} from "@/redux/slices/user/daymeals_slice";

const Stepper = ({currentStep, mealType, meals, availableMeals}) => {

    // REDUX
    const dispatch = useDispatch();
    const {selectedMeals} = useSelector(state => state.daymeals_user);

    return (
        <div className={styles.container}>
            {meals.map((step, index) => (
                <div
                    key={index}
                    style={{cursor: availableMeals.indexOf(step) < availableMeals.indexOf(mealType) ? 'pointer' : 'auto'}}
                    className={`${styles.step} ${index <= meals.indexOf(mealType) ? styles.active : ''}`}
                    onClick={() => {
                        if(step === "سناك") return;
                        if(step === mealType) return;
                        if(availableMeals.indexOf(step) > availableMeals.indexOf(mealType)) return;
                        if(window.confirm(i18n.language.includes('en') ? 'Please note that changing it witll remove all selected meals in the next steps' : `يرجى ملاحظة أن تغييره سيؤدي إلى إزالة جميع الوجبات المحددة في الخطوات التالية`)) {
                            if (step === "افطار") {
                                const copyOfSelectedMeals = [...selectedMeals];
                                // Remove All EXCEPT Breakfast
                                const filteredMeals = copyOfSelectedMeals.filter((meal) => meal.mealType === "افطار");
                                dispatch(onInputChange({
                                    key: 'selectedMeals',
                                    value: filteredMeals
                                }))
                                // Change Current Step
                                currentStep(step);
                            } else if (step === "غداء" && availableMeals.indexOf("غداء") < availableMeals.indexOf(mealType)) {
                                const copyOfSelectedMeals = [...selectedMeals];
                                // Remove All EXCEPT Lunch and Breakfast
                                const filteredMeals = copyOfSelectedMeals.filter((meal) => meal.mealType === "افطار" || meal.mealType === "غداء");
                                dispatch(onInputChange({
                                    key: 'selectedMeals',
                                    value: filteredMeals
                                }))
                                currentStep(step);
                            } else if (step === "عشاء" && availableMeals.indexOf("عشاء") < availableMeals.indexOf(mealType)) {
                                const copyOfSelectedMeals = [...selectedMeals];
                                // Remove All EXCEPT Lunch and Breakfast and Dinner
                                const filteredMeals = copyOfSelectedMeals.filter((meal) => meal.mealType === "افطار" || meal.mealType === "غداء" || meal.mealType === "عشاء");
                                dispatch(onInputChange({
                                    key: 'selectedMeals',
                                    value: filteredMeals
                                }))
                                currentStep(step);
                            }
                        }
                    }}
                >
                    {step === "افطار" ? (i18n.language.includes('en') ? 'Breakfast' : 'فطور') : (step === "غداء" ? (i18n.language.includes('en') ? 'Lunch' : 'غداء') : (step === "عشاء" ? (i18n.language.includes('en') ? 'Dinner' : 'عشاء') : (step === "سناك" ? (i18n.language.includes('en') ? 'Snack' : 'سناك') : '')))}
                </div>
            ))}
        </div>
    );
};

export default Stepper;
