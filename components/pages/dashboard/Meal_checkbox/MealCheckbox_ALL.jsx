import React from 'react';
import classes from './Checkbox.module.scss';
// Redux
import {useDispatch, useSelector} from "react-redux";
import {onSelectAll, onUnSelectAll} from '@/redux/slices/Admin/createpackage-slice';

const Checkbox = ({meals}) => {
    //REDUX
    const dispatch = useDispatch();
    const {packageMeals} = useSelector(state => state.create_package);

    // create an array of meal ids
    let mealIds = [];
    if(meals?.length > 0){
        mealIds = meals.map(meal => meal._id);
    }


    // GENERATE ID
    const id = Math.random().toString(36).substr(2, 9);


    return (
        <div className={classes.checkboxContainer}>
            <input
                type="checkbox"
                id={`checkbox${id}`}
                checked={packageMeals.length === meals?.length}
                onChange={() => {
                    if (packageMeals.length === meals?.length) {
                        dispatch(onUnSelectAll());
                    } else {
                        dispatch(onSelectAll({mealIds}));
                    }
                }}
                className={classes.checkboxInput}
            />
            <label htmlFor={`checkbox${id}`} className={classes.checkboxLabel}>
                <svg height="24px" width="24px" viewBox="0 0 17.837 17.837" xmlns="http://www.w3.org/2000/svg"
                     xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve">
                    <g>
                        <path
                            d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
                            style={{fill: '#c545ff'}}/>
                    </g>
                </svg>
            </label>
        </div>
    );
};

export default Checkbox;
