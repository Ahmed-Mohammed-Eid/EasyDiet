import {useId} from "react";
// SELECT
import Select from 'react-select';


// CUSTOM STYLE FOR SELECT
const customStyles = {
    control: (provided) => ({
        ...provided,
        width: '100%',
        border: 'none',
        borderBottom: '1px solid',
        borderBottomImage: 'linear-gradient(to left, #000000, #A71523)',
        borderRadius: '0',
        padding: '.3rem 1rem',
        backgroundColor: '#FAFAFA',
        "&:hover": {
            borderBottom: `1px solid #000000`,
            cursor: 'pointer'
        },
        '&:focus': {
            outline: 'none',
            borderBottom: '1px solid #A71523',
        },
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

const CustomSelect = ({changed, defaultValue, placeholder}) => {

    // GET THE DEFAULT VALUE TO SET
    // Find the option objects that match the option labels
    const defaultValueObject = options.find(option => option.value === defaultValue);

    return (
        <>
            <Select placeholder={placeholder} instanceId={useId()} options={options} styles={customStyles} value={defaultValueObject || ''} onChange={changed} />
        </>
    )
}
export default CustomSelect