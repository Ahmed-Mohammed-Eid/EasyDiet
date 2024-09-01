import {useId} from "react";
// SELECT
import Select from 'react-select';


// CUSTOM STYLE FOR SELECT
const customStyles = {
    control: (provided) => ({
        ...provided,
        width: '100%',
        border: '1px solid var(--color-dashboard-border)',
        borderRadius: '3px',
        padding: '.4rem .6rem',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'var(--color-gray-444)',
    }),
    input: (provided) => ({
        ...provided,
        color: 'var(--color-gray-444)',
    }),
};

const options = [
    {value: 'Male', label: 'Male'},
    {value: 'Female', label: 'Female'},
];

const CustomSelect = ({changed, defaultValue}) => {

    // GET THE DEFAULT VALUE TO SET
    // Find the option objects that match the option labels
    const defaultValueObject = options.find(option => option.value === defaultValue);

    return (
        <>
            <Select instanceId={useId()} options={options} styles={customStyles} value={defaultValueObject || ''} onChange={changed} />
        </>
    )
}
export default CustomSelect