import {useState} from "react";
import classes from '@/styles/pages/admin/create_employee.module.scss'
import Image from "next/image";
import {useRouter} from "next/router";
import Head from "next/head";
// IMPORT
import CustomSelectRoleType from "@/components/pages/dashboard/custom-select-userRole";
import Spinner from "@/components/layout/spinner/Spinner";
// HELPERS
import {toast} from "react-toastify";
import axios from "axios";
import {extractTokenFromCookie} from "@/helpers/extractToken";
// REDUX
import {clearAll, onInputChange} from "@/redux/slices/Admin/createEmployee-slice";
import {useDispatch, useSelector} from "react-redux";
// LANGUAGE
import {useTranslation} from "react-i18next";

const CreateEmployee = () => {
    // ROUTER
    const router = useRouter()

    // LANGUAGE
    const {t} = useTranslation('createEmployee')

    // STATES
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // REDUX
    const dispatch = useDispatch();
    const {fullName, username, role, password, address, phone} = useSelector(state => state.create_employee)

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

    // SUBMIT HANDLER
    const submitHandler = async (e) => {
        // STOP RELOADING
        e.preventDefault();
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie)

        //Check the inputs
        if (!selectedImage || !fullName || !username || !role || !password || !address || !phone) {
            toast.error(`Please fill All inputs`);
            return;
        }
        // Set the loading state for the spinner
        setLoading(true);
        // Create the Data as formData
        const createEmployee_formData = new FormData();
        createEmployee_formData.append("fullName", fullName);
        createEmployee_formData.append("username", username);
        createEmployee_formData.append("role", role);
        createEmployee_formData.append("password", password);
        createEmployee_formData.append("address", address);
        createEmployee_formData.append("phoneNumber", phone);
        createEmployee_formData.append("files", selectedImage);

        // Send Create Request to the server
        await axios.post(`https://api.easydietkw.com/api/v1/create/employee`, createEmployee_formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                // SET THE STATE
                setLoading(false);
                // DO WHAT I WANT
                toast.success(res.data.message);
                router.push(`/admin/users`)
                    .then(() => {
                        // Clear the reducer
                        dispatch(clearAll());
                        // Clear the image;
                        setSelectedImage('');
                        setPreview('')
                    })
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
                <title>EasyDiet | Create Employee</title>
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
                    <form onSubmit={submitHandler}>
                        <div className={classes.Image_Uploader}>
                            <label htmlFor={'meal_image'}>
                                <div className={classes.Static}>
                                    <Image src={'/images/Upload_Icon.svg'} alt={'Upload Icon'} width={30} height={30}/>
                                    <span>{t("upload")}</span>
                                </div>
                                <div className={classes.ImagePreviewer}>
                                    {preview && <Image src={preview} alt="Preview" width={80} height={50}/>}
                                </div>
                            </label>
                            <input id={'meal_image'} onChange={handleImageChange} type={'file'} name={'Meal_Image'}
                                   accept="image/*"/>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'employee_name'}>{t("name")}</label>
                                <input
                                    type={'text'}
                                    name={'employee_name'}
                                    id={'employee_name'}
                                    placeholder={'EX: Ahmed Mohammed'}
                                    value={fullName}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'fullName',
                                            value: event.target.value,
                                        }))
                                    }}
                                />
                            </div>
                            <div className={[classes.InputGroup, classes.MultiSelect].join(' ')}>
                                <label htmlFor={'user_role'}>{t("role")}</label>
                                <CustomSelectRoleType
                                    defaultValue={role}
                                    changed={(values) => {
                                        // Set the State in Redux
                                        dispatch(onInputChange({
                                            key: 'role',
                                            value: values.value
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'employee_address'}>{t("address")}</label>
                                <input
                                    type={'text'}
                                    name={'employee_address'}
                                    id={'employee_address'}
                                    placeholder={'EX: 15 Marg Street'}
                                    value={address}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'address',
                                            value: event.target.value,
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'employee_phone'}>{t("phone")}</label>
                                <input
                                    type={'tel'}
                                    name={'employee_phone'}
                                    id={'employee_phone'}
                                    placeholder={'EX: 01020985828'}
                                    value={phone}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'phone',
                                            value: event.target.value,
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'employee_username'}>{t("username")}</label>
                                <input
                                    type={'text'}
                                    name={'employee_username'}
                                    id={'employee_username'}
                                    placeholder={'EX: A7med'}
                                    value={username}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'username',
                                            value: event.target.value,
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'employee_password'}>{t("password")}</label>
                                <input
                                    type={'password'}
                                    name={'employee_password'}
                                    id={'employee_password'}
                                    placeholder={'EX: *******'}
                                    value={password}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'password',
                                            value: event.target.value,
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                        <button type={'submit'}>
                            <span>
                                {loading ? <Spinner size={2} color={`#ffffff`}/> : t("button")}
                            </span>
                            <Image src={'/images/Send_Icon.svg'} alt={'Send'} width={20} height={20}/>
                        </button>
                    </form>
                </div>
            </main>
        </>
    )
}
export default CreateEmployee

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

    if (!tokenInfo || tokenInfo.role !== 'admin' || tokenInfo.active === false) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: {},
    };
};