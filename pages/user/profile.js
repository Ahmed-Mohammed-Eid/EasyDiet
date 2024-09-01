import {useEffect, useState} from "react";
import classes from '@/styles/pages/user/profile.module.scss'
import Head from "next/head";
import Image from "next/image";
//IMPORTS
import Spinner from "@/components/layout/spinner/Spinner";
import CustomSelect from "@/components/pages/register/custom-select";
import CustomSelectGovernate from "@/components/pages/register/custom-select-governate";
import CustomSelectRegion from "@/components/pages/register/custom-select-region";
// HELPERS
import {toast} from "react-toastify";
import axios from "axios";
import {extractTokenFromCookie} from "@/helpers/extractToken";
// REDUX
import {onInputChange, setAll} from "@/redux/slices/user/profile_slice";
import {useDispatch, useSelector} from "react-redux";
// LANGUAGE
import {useTranslation} from "react-i18next";
import i18n from "@/i18n";

const Profile = (props) => {
    // LANGUAGE
    const {t} = useTranslation('profile')

    // STATES
    const [loading, setLoading] = useState(false);
    const [governorate, setGovernorate] = useState('');
    const [region, setRegion] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');

    // REDUX
    const dispatch = useDispatch();
    const {
        userId,
        firstName,
        lastName,
        phone,
        gender,
        street,
        house,
        floor,
        apartment,
        dislikedMeals,
    } = useSelector(state => state.profile)


    // SET THE EMPLOYEE DATA IF IT'S FOUND
    useEffect(() => {
        if (props) {
            dispatch(setAll({
                userId: props._id || '',
                firstName: props?.clientName.split(' ')[0] || '',
                lastName: props?.clientName.split(' ')[1] || '',
                phone: props.phoneNumber || '',
                street: props.streetName || '',
                house: props.homeNumber || '',
                floor: props.floorNumber || '',
                apartment: props.appartment || '',
                gender: props.gender || '',
                dislikedMeals: props.dislikedMeals || '',
            }))
            setGovernorate(props.governorate || '');
            setRegion(props.distrect || '');
            setApartmentNumber(props.appartmentNo || '');
        }
    }, [dispatch, props])


    // SUBMIT HANDLER
    const submitHandler = async (e) => {
        // STOP RELOADING
        e.preventDefault();
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        //Check the inputs
        if (!userId || !firstName || !lastName || !phone || !region || !street || !house || !floor || !apartment || !gender) {
            toast.error(`Please fill All inputs`);
            return;
        }
        // Set the loading state for the spinner
        setLoading(true);

        const updateProfileObject = {
            clientName: `${firstName} ${lastName}`,
            phoneNumber: phone,
            governorate: governorate,
            distrect: region,
            streetName: street,
            homeNumber: house,
            floorNumber: floor,
            appartment: apartment,
            appartmentNo: apartmentNumber,
            clientId: userId,
            gender: gender,
            dislikedMeals: dislikedMeals,
        }

        // Send Create Request to the server
        await axios.put(`https://api.easydietkw.com/api/v1/edit/profile`, updateProfileObject, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                // SET THE STATE
                setLoading(false);
                // DO WHAT I WANT
                toast.success(res.data.message || `Profile Updated Successfully`);
            })
            .catch(err => {
                // SET THE STATE
                setLoading(false);
                // DO WHAT I WANT
                toast.error(err?.response?.data?.message || err?.message);
            })
    }

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Profile</title>
                <meta name="description" content="Sign in to EasyDiet and access our diverse menu of delicious, healthy meals that are perfect for people who are looking to maintain a healthy lifestyle. Our team of experienced chefs use fresh, locally-sourced ingredients to prepare each meal. Join our community of satisfied customers who have reported feeling more energized and healthier after consuming our meals. EasyDiet: Providing Healthy Meals for Over 5 Years "/>
                <meta name="keywords" content="healthy meals, meal delivery, fresh ingredients, locally-sourced, convenient meal options, energy-boosting, nutritious food, easy ordering, delicious and healthy, meal plans"/>
                <meta name="author" content="EasyDiet"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta name="robots" content="index, follow"/>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta name="language" content="English"/>
                <meta name="revisit-after" content="2 days"/>
                <meta name="generator" content="EasyDiet"/>
                <meta name="og:title" content="EasyDiet"/>
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://easydietkw.com/" />
                <meta property="og:image" content="/easyDietLogo.png" />
                <meta property="og:site_name" content="EasyDiet" />
                <meta property="og:description" content="EasyDiet has been offering healthy meal options for over 5 years. With a diverse menu of delicious and locally-sourced ingredients, their experienced chefs provide convenient and energizing meals. Experience a healthier lifestyle with EasyDiet." />
            </Head>
            <main className={classes.Main}>
                <div className={classes.FormContainer}>
                    <div className={classes.Top}>
                        <h1>{t("title")}</h1>
                    </div>
                    <form onSubmit={submitHandler}>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'firstname'}>{t("firstName")}</label>
                                <input
                                    type={'text'}
                                    name={'firstname'}
                                    id={'firstname'}
                                    placeholder={'EX: Ahmed'}
                                    value={firstName}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'firstName',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'lastname'}>{t("lastName")}</label>
                                <input
                                    type={'text'}
                                    name={'lastname'}
                                    id={'lastname'}
                                    placeholder={'EX: Mohammed'}
                                    value={lastName}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'lastName',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                        </div>

                        <div className={classes.InputsContainer}>
                            <div className={classes.FillContainer}>
                                <label htmlFor={'gender'}>{i18n.language.includes('en')? 'Gender' : 'النوع'}</label>
                                <CustomSelect defaultValue={gender || ''} changed={(values) => {
                                    dispatch(onInputChange({key: 'gender', value: values?.value}))
                                }}/>
                            </div>
                        </div>

                        <div className={classes.TextAreaGroup}>
                            <label htmlFor={'dislikedMeals'}>{i18n.language.includes('en')? 'Disliked Meals' : 'الوجبات الغير مرغوبة'}</label>
                            <textarea
                                id={'dislikedMeals'}
                                name={'dislikedMeals'}
                                placeholder={'EX: I don\'t like fish'}
                                value={dislikedMeals}
                                onChange={(event) => {
                                    dispatch(onInputChange({
                                        key: 'dislikedMeals',
                                        value: event.target.value,
                                    }))
                                }}
                            />
                        </div>

                        <div className={classes.InputGroup} style={{width: '100%'}}>
                            <label htmlFor={'phoneNumber'}>{t("phoneNumber")}</label>
                            <input
                                type={'tel'}
                                name={'phoneNumber'}
                                id={'phoneNumber'}
                                placeholder={'EX: 99995658'}
                                value={phone}
                                onChange={(event) => {
                                    dispatch(onInputChange({
                                        key: 'phone',
                                        value: event.target.value
                                    }))
                                }}
                            />
                        </div>

                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'governorate'}>{t("governorate")}</label>
                                <CustomSelectGovernate
                                    defaultValue={governorate || ''}
                                    changed={(values) => {
                                        setGovernorate(values?.value)
                                    }}
                                    placeholder={i18n.language.includes('en')? 'Select a governorate' : 'اختر المحافظة'}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'Region'}>{t("region")}</label>
                                <CustomSelectRegion
                                    defaultValue={region || ''}
                                    changed={(values) => {
                                        setRegion(values?.value)
                                    }}
                                    linkedSelectValue={governorate}
                                    placeholder={i18n.language.includes('en')? 'Select a region' : 'اختر المنطقة'}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'street'}>{i18n.language?.includes('en')? 'Block' : 'القطعة'}</label>
                                <input
                                    type={'text'}
                                    name={'street'}
                                    id={'street'}
                                    placeholder={'EX: 15 Mohammed Ali Street'}
                                    value={street}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'street',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'house'}>{t("house")}</label>
                                <input
                                    type={'text'}
                                    name={'house'}
                                    min={'0'}
                                    id={'house'}
                                    placeholder={'EX: 2'}
                                    value={house}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'house',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'floor'}>{t("floor")}</label>
                                <input
                                    type={'text'}
                                    name={'floor'}
                                    min={'0'}
                                    id={'floor'}
                                    placeholder={'EX: 5'}
                                    value={floor}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'floor',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'apartment'}>{t("apartment")}</label>
                                <input
                                    type={'text'}
                                    name={'apartment'}
                                    min={'0'}
                                    id={'apartment'}
                                    placeholder={'EX: 2'}
                                    value={apartment}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'apartment',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                        </div>

                        <div className={classes.InputGroup} style={{width: '100%'}}>
                            <label htmlFor={'apartmentNumber'}>{t("apartmentNumber")}</label>
                            <input
                                type={'text'}
                                name={'apartmentNumber'}
                                min={'0'}
                                id={'apartmentNumber'}
                                placeholder={'EX: 2'}
                                value={apartmentNumber}
                                onChange={(event) => {
                                    setApartmentNumber(event.target.value)
                                }}
                            />
                        </div>

                        <div className={classes.NavigationContainer}>
                            <button type={'submit'}>
                                <span>
                                    {loading ? <Spinner size={2} color={`#ffffff`}/> : t("updateButton")}
                                </span>
                                <Image src={'/images/Send_Icon.svg'} alt={'Send'} width={20} height={20}/>
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}
export default Profile;

export const getServerSideProps = async (ctx) => {
    // GET THE TOKEN FROM THE REQUEST
    const {token} = ctx.req.cookies;

    let tokenInfo;
    if (token) {
        await axios.get(`https://api.easydietkw.com/api/v1/get/verify/token`, {
            params: {
                token: token,
            }
        })
            .then(res => tokenInfo = res.data.decodedToken)
            .catch(err => console.log(err))
    }

    if (!tokenInfo || tokenInfo.role !== 'client') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    // GET THE ID OF THE MEAL FROM THE URL
    let clientInfo;

    if (tokenInfo?.userId) {
        // GET THE MEAL FROM THE SERVER
        await axios.get(`https://api.easydietkw.com/api/v1/client/profile?clientId=${tokenInfo.userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                // SET THE STATE
                clientInfo = res.data.client
            })
            .catch(err => {
                // SET THE STATE
                console.log(err)
            })
    } else {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    // SET THE EMPLOYEE IF EXIST
    let propObj = {};
    if (clientInfo) {
        propObj = {
            ...clientInfo
        }
    }

    return {
        props: propObj,
    };
};
