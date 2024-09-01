import {useEffect, useId, useState} from "react";
// SELECT
import Select from 'react-select';
// DATA
import data from '@/data/governateAndRegions.json'

import i18n from '@/i18n'


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


const CustomSelect = ({changed, defaultValue, placeholder, linkedSelectValue}) => {
    const [options, setOptions] = useState([])
    const [optionsAr, setOptionsAr] = useState([])

    let optionsKeys = []
    let optionsArray = []
    let optionsArArray = []

    // GET THE OPTIONS
    if(linkedSelectValue) {
        data.forEach(governate => {
            // loop through the Governorate and if the Governate is not in the options array, add it
            if (!optionsKeys.includes(governate.Englsih) && governate.Governorate === linkedSelectValue) {
                optionsKeys.push(governate.English)
                optionsArray.push({value: governate.English, label: governate.English})
            }
            // loop through the Governorate and if the المحافظة is not in the options array, add it
            if (!optionsKeys.includes(governate.Arabic) && governate.المحافظة === linkedSelectValue) {
                optionsKeys.push(governate.Arabic)
                optionsArArray.push({value: governate.Arabic, label: governate.Arabic})
            }
        })
    }

    useEffect(() => {
        setOptions(optionsArray)
        setOptionsAr(optionsArArray)
    }, [linkedSelectValue]);

    let defaultValueObject;

    if(i18n.language.includes('ar')) {
        defaultValueObject = optionsAr.find(option => option.value === defaultValue);
    } else {
        defaultValueObject = options.find(option => option.value === defaultValue);
    }
    return (
        <>
            <Select placeholder={placeholder} instanceId={useId()} options={i18n.language.includes('en') ? options : optionsAr} styles={customStyles} value={defaultValueObject || ''} onChange={changed} />
        </>
    )
}
export default CustomSelect