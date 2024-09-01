import {useEffect, useId, useState} from "react";
// SELECT
import Select from 'react-select';
import data from "@/data/governateAndRegions.json";
import i18n from "@/i18n";

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


const CustomSelect = ({changed, defaultValue, placeholder}) => {
    const [options, setOptions] = useState([])
    const [optionsAr, setOptionsAr] = useState([])

    let optionsKeys = []
    let optionsArray = []
    let optionsArArray = []

    // GET THE OPTIONS
    data.forEach(governate => {
        // loop through the Governorate and if the Governate is not in the options array, add it
        if(!optionsKeys.includes(governate.Governorate)) {
            optionsKeys.push(governate.Governorate)
            optionsArray.push({value: governate.Governorate, label: governate.Governorate})
        }
        // loop through the Governorate and if the المحافظة is not in the options array, add it
        if(!optionsKeys.includes(governate.المحافظة)) {
            optionsKeys.push(governate.المحافظة)
            optionsArArray.push({value: governate.المحافظة, label: governate.المحافظة})
        }
    })

    useEffect(() => {
        setOptions(optionsArray)
        setOptionsAr(optionsArArray)
    }, []);

    // GET THE DEFAULT VALUE TO SET
    // Find the option objects that match the option labels
    // const defaultValueObject = options.find(option => option.value === defaultValue);
    let defaultValueObject = null

    if(i18n.language.includes('ar')) {
        defaultValueObject = optionsAr.find(option => option.value === defaultValue);
    } else {
        defaultValueObject = options.find(option => option.value === defaultValue);
    }

    return (
        <>
            <Select placeholder={placeholder} instanceId={useId()}
                    options={i18n.language.includes('en') ? options : optionsAr} styles={customStyles}
                    value={defaultValueObject || ''} onChange={changed}/>
        </>
    )
}
export default CustomSelect