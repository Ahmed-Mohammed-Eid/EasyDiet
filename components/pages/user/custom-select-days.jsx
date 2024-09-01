import React, { useState, useEffect, useId } from 'react';
// IMPORT NEXTJS COMPONENTS
import Select from 'react-select';
//REDUX
import {useDispatch, useSelector} from "react-redux";
import {onInputChange} from '@/redux/slices/user/subscription_info';


// CUSTOM STYLE FOR SELECT
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        fontFamily: 'var(--font-roboto)',
        fontSize: '1.5rem',
        padding: '.1rem 1rem',
        borderRadius: '0',
        width: '100%',
        border: `1px solid ${state.isFocused ? 'var(--color-main)' : 'var(--color-input-border)'}`,
        boxShadow: state.isFocused ? `0 0 0 1px var(--color-primary)` : 'initial',
        '&:hover': {
            borderColor: 'var(--color-input-border)',
        },
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'var(--color-white)' : 'var(--color-gray-333)',
        backgroundColor: state.isSelected ? 'var(--color-primary)' : 'initial',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'var(--color-select-background)',
        },
    }),
};

// MONTH OPTIONS
const monthOptions = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = new Date().getMonth() + i;
    const month = (monthIndex % 12) + 1;
    return {
        value: month,
        label: new Date(new Date().getFullYear(), month - 1, 1).toLocaleString('default', { month: 'long' })
    };
});

// GET DAYS IN MONTH
function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function MySelect(props) {

    //REDUX
    const dispatch = useDispatch();
    const {selectedDay, selectedMonth} = useSelector(state => state.subscription_user);

    // STATE
    const [dayOptions, setDayOptions] = useState([]);

    // EFFECT
    useEffect(() => {
        if (selectedMonth) {
            const month = selectedMonth.value;
            const year = new Date().getFullYear();
            const daysInMonth = getDaysInMonth(month, year);

            const days = Array.from({ length: daysInMonth }, (_, i) => i + 1).filter((day) => {
                const date = new Date(year, month - 1, day);
                const currentDate = new Date();
                const twoDaysLater = new Date(currentDate.setDate(currentDate.getDate() + 2));
                return date >= twoDaysLater;
            });

            setDayOptions(
                days.map((day) => ({ value: day, label: day.toString() }))
            );

            if (selectedDay && selectedDay.value > daysInMonth) {
                dispatch(onInputChange({key: 'selectedDay', value: null}))
            }
        }
    }, [dispatch, selectedMonth, selectedDay]);



    // HANDLERS
    function handleMonthChange(option) {
        dispatch(onInputChange({key: 'selectedMonth', value: option}))
        dispatch(onInputChange({key: 'selectedDay', value: null}))
    }

    function handleDayChange(option) {
        dispatch(onInputChange({key: 'selectedDay', value: option}))
    }

    return (
        <>
            <div>
                <label htmlFor="month-select">{props.monthText}</label>
                <Select
                    inputId="month-select"
                    options={monthOptions}
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    aria-label="Select a month"
                    styles={customStyles}
                    {...props}
                    instanceId={useId()}
                />
            </div>
            <div>
                <label htmlFor="day-select">{props.dayText}</label>
                <Select
                    inputId="day-select"
                    options={dayOptions}
                    value={selectedDay}
                    onChange={handleDayChange}
                    isDisabled={!selectedMonth}
                    aria-label="Select a day"
                    styles={customStyles}
                    {...props}
                    instanceId={useId()}
                />
            </div>

        </>
    );
}

export default MySelect;
