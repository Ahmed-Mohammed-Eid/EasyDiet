import {useEffect, useState} from "react";
import classes from '@/styles/pages/admin/edit_package.module.scss'
import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";
//IMPORTS
import CustomSelectTime from "@/components/pages/dashboard/custom-select-time";
import CustomSelectLanguage from "@/components/pages/dashboard/custom-select-language";
import Spinner from "@/components/layout/spinner/Spinner";
//REDUX
import wrapper from "@/redux/store";
import {clearAll, onInputChange, setAll} from "@/redux/slices/Admin/editpackage-slice";
import {useDispatch, useSelector} from "react-redux";
//HELPERS
import {toast} from "react-toastify";
import axios from "axios";
import {extractTokenFromCookie} from "@/helpers/extractToken";
// LANGUAGE
import {useTranslation} from "react-i18next";
import custom from "@/pages/admin/packages/custom";
import i18n from "@/i18n";

const EditPackage = ({bundle}) => {
    // ROUTER
    const router = useRouter();

    console.log(bundle)

    // LANGUAGE
    const {t} = useTranslation('editPackage');

    // STATES
    const [selectedImage, setSelectedImage] = useState('');
    const [preview, setPreview] = useState('');
    const [selectedImageFemale, setSelectedImageFemale] = useState('');
    const [previewFemale, setPreviewFemale] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCustom, setIsCustom] = useState(false);

    // REDUX
    const dispatch = useDispatch();
    const {
        bundleId,
        name,
        nameEn,
        textOnCard,
        textOnCardEn,
        realTime,
        packagePrice,
        numberOfMeals,
        numberOfSnacks,
        offerDays,
        fridayIncluded,
        packageMeals,
        breakfast,
        lunch,
        dinner,
        stopThePackage
    } = useSelector(state => state.edit_package)

    // SET THE DEFAULT STATE
    // SET THE STATE
    let ArrayOfMealsIds;

    if (bundle?.menu) {
        ArrayOfMealsIds = bundle.menu.map(obj => {
            return obj.mealId
        })
    }
    useEffect(() => {

        // GET THE CUSTOM PARAM FROM THE URL
        const custom = router.query.custom;
        setIsCustom(custom)


        if (bundle) {
            dispatch(setAll({
                bundleId: bundle._id,
                name: bundle.bundleName,
                nameEn: bundle.bundleNameEn,
                textOnCard: bundle.timeOnCard,
                textOnCardEn: bundle.timeOnCardEn,
                realTime: bundle.bundlePeriod,
                packagePrice: bundle.bundlePrice,
                numberOfMeals: bundle.mealsNumber,
                numberOfSnacks: bundle.snacksNumber,
                offerDays: bundle.bundleOffer,
                fridayIncluded: bundle.fridayOption,
                packageMeals: ArrayOfMealsIds,
                breakfast: bundle.mealsType.includes('افطار'),
                lunch: bundle.mealsType.includes('غداء'),
                dinner: bundle.mealsType.includes('عشاء'),
                stopThePackage: bundle.deActivate
            }))
        }
    }, [dispatch, bundle])

    // SUBMIT HANDLER
    const submitHandler = async (e) => {
        // STOP RELOADING
        e.preventDefault();
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        //Check the inputs
        if ((!name || !realTime || !packagePrice || !numberOfMeals || !numberOfSnacks || packageMeals.length <= 0) && !custom) {
            toast.error(`Please fill All inputs`);
            return;
        }

        // VALIDATION FOR CUSTOM PACKAGE
        if (isCustom && (!name || !nameEn || !numberOfMeals || !numberOfSnacks || !realTime || !packagePrice)) {
            toast.error(i18n.language.includes('en') ? `The name and (meals & snacks) number and bundle period and bundle price are required` : `الاسم وعدد الوجبات والوجبات الخفيفة وفترة الباقة وسعر الباقة مطلوبين`);
            return;
        }

        // Set the loading state for the spinner
        setLoading(true);

        const editMeal_Obj = {
            bundleId: bundleId,
            bundleName: name,
            bundleNameEn: nameEn,
            mealsNumber: numberOfMeals,
            breakfast: breakfast ? 'on' : 'off',
            lunch: lunch ? 'on' : 'off',
            dinner: dinner ? 'on' : 'off',
            snacksNumber: numberOfSnacks,
            bundlePeriod: realTime,
            bundleOffer: offerDays || 0,
            fridayOption: fridayIncluded,
            bundlePrice: packagePrice,
            timeOnCard: textOnCard,
            timeOnCardEn: textOnCardEn,
            deActivate: stopThePackage
        }

        const formData = new FormData();

        // Append the image
        formData.append("files", selectedImage);
        formData.append("files", selectedImageFemale);

        for (let i = 0; i < packageMeals.length; i++) {
            formData.append('mealsIds[]', packageMeals[i]);
        }

        Object.entries(editMeal_Obj).forEach(([key, value]) => {
            formData.append(key, value);
        });


        // Send Create Request to the server
        await axios.put(`https://api.easydietkw.com/api/v1/edit/bundle`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                // SET THE STATE
                setLoading(false);
                // DO WHAT I WANT
                toast.success(res.data.message || `Package Updated Successfully`);
                router.push(`/admin/packages`)
                    .then(() => {
                        // Clear the reducer
                        dispatch(clearAll());
                    })
            })
            .catch(err => {
                // SET THE STATE
                setLoading(false);
                // DO WHAT I WANT
                toast.error(err?.response?.data?.message || err?.message);
            })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Set the Image State
            setSelectedImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleImageFemaleChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Set the Image State
            setSelectedImageFemale(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewFemale(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewFemale(null);
        }
    };

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Edit Package</title>
                <meta name="description"
                      content="Discover EasyDiet's healthy meal options that have been satisfying customers for over five years. Our experienced chefs prepare each meal with fresh, locally-sourced ingredients to ensure that you get the best quality and flavor. Choose EasyDiet for convenient and delicious meals that leave you feeling energized and healthy."/>
                <meta name="keywords"
                      content="healthy meals, meal delivery, fresh ingredients, locally-sourced, convenient meal options, energy-boosting, nutritious food, easy ordering, delicious and healthy, meal plans"/>
                <meta name="author" content="EasyDiet"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta name="robots" content="index, follow"/>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta name="language" content="English"/>
                <meta name="revisit-after" content="2 days"/>
                <meta name="generator" content="EasyDiet"/>
                <meta name="og:title" content="EasyDiet"/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://easydietkw.com/"/>
                <meta property="og:image" content="/easyDietLogo.png"/>
                <meta property="og:site_name" content="EasyDiet"/>
                <meta property="og:description"
                      content="EasyDiet has been offering healthy meal options for over 5 years. With a diverse menu of delicious and locally-sourced ingredients, their experienced chefs provide convenient and energizing meals. Experience a healthier lifestyle with EasyDiet."/>
            </Head>
            <main className={classes.Main}>
                <div className={classes.FormContainer}>
                    <h1>{t("title")}</h1>
                    <p>{t("underTitle")} ({name})</p>
                    <form onSubmit={submitHandler}>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <div className={classes.Image_Uploader}>
                                    <label htmlFor={'meal_image'}>
                                        <div className={classes.Static}>
                                            <Image src={'/images/Upload_Icon.svg'} alt={'Upload Icon'} width={30}
                                                   height={30}/>
                                            <span>{t("uploadMaleImage")}</span>
                                        </div>
                                        <div className={classes.ImagePreviewer}>
                                            {preview && <Image src={preview} alt="Preview" width={80} height={50}/>}
                                        </div>
                                    </label>
                                    <input id={'meal_image'} onChange={handleImageChange} type={'file'}
                                           name={'Meal_Image'}
                                           accept="image/*"/>
                                </div>
                            </div>
                            <div className={classes.InputGroup}>
                                <div className={classes.Image_Uploader}>
                                    <label htmlFor={'femal_image'}>
                                        <div className={classes.Static}>
                                            <Image src={'/images/Upload_Icon.svg'} alt={'Upload Icon'} width={30}
                                                   height={30}/>
                                            <span>{t("uploadFemaleImage")}</span>
                                        </div>
                                        <div className={classes.ImagePreviewer}>
                                            {previewFemale && <Image src={previewFemale} alt="Preview" width={80} height={50}/>}
                                        </div>
                                    </label>
                                    <input id={'femal_image'} onChange={handleImageFemaleChange} type={'file'}
                                           name={'Meal_Image'}
                                           accept="image/*"/>
                                </div>
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'package_name'}>{t("name")}</label>
                                <input
                                    type={'text'}
                                    name={'package_name'}
                                    id={'package_name'}
                                    placeholder={'EX: FIT PACKAGE'}
                                    value={name}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'name',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'name_en'}>{t("nameEn")}</label>
                                <input
                                    type={'text'}
                                    name={'name_en'}
                                    id={'name_en'}
                                    placeholder={'Fit Package'}
                                    value={nameEn}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'nameEn',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={[classes.InputGroup, classes.MultiSelect].join(' ')}>
                                <label htmlFor={'package_real_time'}>{t("timeReal")}</label>
                                <CustomSelectTime
                                    defaultValue={realTime}
                                    changed={(values) => {
                                        // Set the State in Redux
                                        dispatch(onInputChange({
                                            key: 'realTime',
                                            value: values.value
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'package_price'}>{t("price")}</label>
                                <input
                                    type={'number'} step={'.25'}
                                    name={'package_price'}
                                    min={'0'}
                                    id={'package_price'}
                                    placeholder={'EX: 15.5 KWD'}
                                    value={packagePrice}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'packagePrice',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'number_of_meals'}>{t("numberOfMeals")}</label>
                                <input
                                    type={'number'}
                                    name={'number_of_meals'}
                                    min={'0'}
                                    id={'number_of_meals'}
                                    placeholder={'EX: 5'}
                                    value={numberOfMeals}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'numberOfMeals',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'Snacks_meals'}>{t("numberOfSnacks")}</label>
                                <input
                                    type={'number'}
                                    name={'Snacks_meals'}
                                    min={'0'}
                                    id={'Snacks_meals'}
                                    placeholder={'EX: 2'}
                                    value={numberOfSnacks}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'numberOfSnacks',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'text_on_card'}>{t("textOnCard")}</label>
                                <input
                                    type={'text'}
                                    name={'text_on_card'}
                                    id={'text_on_card'}
                                    placeholder={'100 كارب 100 بروتين'}
                                    value={textOnCard}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'textOnCard',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'text_on_cardEN'}>{t("textOnCardEn")}</label>
                                <input
                                    type={'text'}
                                    name={'text_on_cardEN'}
                                    id={'text_on_cardEN'}
                                    placeholder={'100 Carb - 100 Protein - 100 Fat'}
                                    value={textOnCardEn}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'textOnCardEn',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'offers_days'}>{t("offer")}</label>
                                <input
                                    type={'number'}
                                    name={'offers_days'}
                                    min={'0'}
                                    id={'offers_days'}
                                    placeholder={'EX: 2'}
                                    value={offerDays}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'offerDays',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <div className={classes.checkboxRow}>
                                    <label className={classes.checkbox}>
                                        <input type="checkbox" checked={breakfast}
                                               onChange={(event) => {
                                                   dispatch(onInputChange({
                                                       key: 'breakfast',
                                                       value: event.target.checked
                                                   }))
                                               }}
                                        />
                                        <span className={classes.checkmark}></span>
                                        {t("breakfast")}
                                    </label>
                                    <label className={classes.checkbox}>
                                        <input type="checkbox" checked={lunch}
                                               onChange={(event) => {
                                                   dispatch(onInputChange({
                                                       key: 'lunch',
                                                       value: event.target.checked
                                                   }))
                                               }}
                                        />
                                        <span className={classes.checkmark}></span>
                                        {t("lunch")}
                                    </label>
                                    <label className={classes.checkbox}>
                                        <input type="checkbox" checked={dinner}
                                               onChange={(event) => {
                                                   dispatch(onInputChange({
                                                       key: 'dinner',
                                                       value: event.target.checked
                                                   }))
                                               }}
                                        />
                                        <span className={classes.checkmark}></span>
                                        {t("dinner")}
                                    </label>
                                </div>
                            </div>

                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <div className={classes.togglerInput}>
                                    <label htmlFor="package_friday_included">{t("fridays")}</label>
                                    <div className={classes.toggler}>
                                        <input
                                            type="checkbox"
                                            id="package_friday_included"
                                            name="package_friday_included"
                                            checked={fridayIncluded}
                                            onChange={(event) => {
                                                dispatch(onInputChange({
                                                    key: 'fridayIncluded',
                                                    value: event.target.checked
                                                }))
                                            }}
                                        />
                                        <div className={classes.slider}></div>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.InputGroup}>
                                <div className={classes.togglerInput}>
                                    <label htmlFor="stopThePackage">{t("stopThePackage")}</label>
                                    <div className={classes.toggler}>
                                        <input
                                            type="checkbox"
                                            id="stopThePackage"
                                            name="stopThePackage"
                                            checked={stopThePackage}
                                            onChange={(event) => {
                                                dispatch(onInputChange({
                                                    key: 'stopThePackage',
                                                    value: event.target.checked
                                                }))
                                            }}
                                        />
                                        <div className={classes.slider}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={classes.NavigationContainer}>
                            <button className={classes.SelectMeals} type={'button'}
                                    onClick={() => router.push(`/admin/packages/editpackage_meals`)}>
                                {t("select")}
                            </button>
                            <button type={'submit'}>
                                <span>
                                    {loading ? <Spinner size={2} color={`#ffffff`}/> : t("create")}
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
export default EditPackage

export const getServerSideProps = wrapper.getServerSideProps(_ => async ({req, query}) => {
    // get the Auth
    const cookies = req.headers.cookie;
    const token = cookies.split('=');
    console.log('token!!!!!')
    console.log(cookies)
    console.log(token)
    //CHECK THE ROLE
    let tokenInfo;
    if (token) {
        await axios.get(`https://api.easydietkw.com/api/v1/get/verify/token`, {
            params: {
                token: token[1],
            }
        })
            .then(res => tokenInfo = res.data.decodedToken)
            .catch(err => console.log(err))
    }

    if (!tokenInfo || tokenInfo.role !== 'admin' || tokenInfo.active === false) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }


    // GET THE ID OF THE MEAL FROM THE URL
    const {ID} = query;
    let bundle;

    if (ID) {
        // GET THE MEAL FROM THE SERVER
        await axios.get(`https://api.easydietkw.com/api/v1/get/bundle?bundleId=${ID}`, {
            headers: {
                'Authorization': `Bearer ${token[1]}`
            }
        })
            .then(res => {
                bundle = res.data.bundle
            })
            .catch(err => {
                // SET THE STATE
                console.log(err.message)
            })
    }

    // Your code here
    let propsObj = {};
    if (bundle) {
        propsObj = {bundle}
    }

    return {
        props: propsObj
    }

});