import {useId} from "react";
// SELECT
import Select from 'react-select';


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

const options = [
    {value: 1, label: '1 Week'},
    {value: 2, label: '2 Weeks'},
    {value: 3, label: '3 Weeks'},
    {value: 4, label: '4 Weeks'},
];

const CustomSelect = ({defaultValue, changed}) => {

    // CUSTOM ID
    const id = useId();

    // GET THE DEFAULT VALUE TO SET
    // Find the option objects that match the option labels
    const defaultValueObject = options.find(option => option.value === defaultValue);


    return (
        <>
            <Select
                instanceId={id}
                options={options}
                styles={customStyles}
                value={defaultValueObject || ''}
                onChange={changed}
            />
        </>
    )
}
export default CustomSelect