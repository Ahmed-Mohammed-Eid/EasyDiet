import {useState, useRef, useEffect} from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/router";

//STYLE
import classes from '@/styles/pages/register.module.scss'
// IMPORTS
import Spinner from "@/components/layout/spinner/Spinner";
import CustomSelect from "@/components/pages/register/custom-select-new";
import CustomSelectGovernate from "@/components/pages/register/custom-select-governate";
import CustomSelectRegion from "@/components/pages/register/custom-select-region";
// HELPERS
import axios from "axios";
import {toast} from "react-toastify";
// Language
import {useTranslation} from "react-i18next";


export default function Register({isAuthenticated}) {
    // ROUTER
    const router = useRouter();
    // LANGUAGE
    const {t} = useTranslation('register');

    // EFFECT TO REDIRECT TO HOME IF THE USER IS AUTHENTICATED
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/')
        }
    }, [isAuthenticated, router]);


    // STATES
    const [gender, setGender] = useState();
    const [governate, setGovernate] = useState();
    const [region, setRegion] = useState();
    const [loading, setLoading] = useState(false);
    const [readTerms, setReadTerms] = useState(false);

    // REFS
    const PartsContainerRef = useRef();
    const NextButton = useRef();
    const CreateButtonRef = useRef();
    const PreviousPartRef = useRef();
    // INPUTS REF
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    //P2
    const parcelRef = useRef();
    const streetRef = useRef();
    const houseRef = useRef();
    const floorRef = useRef();
    const apartmentRef = useRef();


    // FUNCTIONS
    const showPreviousPart = (e) => {
        // Stop reloading
        e.preventDefault();
        // Remove the Class from the container
        PartsContainerRef.current.classList.remove(classes.P2_Active)
        // Show the Next Button
        NextButton.current.classList.remove(classes.Un_Active)
        // Hide the Create Button
        CreateButtonRef.current.classList.add(classes.Un_Active)
        // Hide the Previous Part Link
        PreviousPartRef.current.classList.add(classes.Un_Active)
    }


    const showNextPart = (e) => {
        // Stop reloading
        e.preventDefault();
        //GET THE VALUES OF THE FIRST PART INPUTS
        const firstName = firstNameRef.current.value;
        const lastName = lastNameRef.current.value;
        const email = emailRef.current.value;
        const phone = phoneRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        // CHECK IF THE DATA OF THE FIRST PART IS VALID
        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            toast.error(`Please fill all fields first`);
            return
        }
        if (password !== confirmPassword) {
            toast.error(`password and confirm password are not the same`);
            return
        }

        // Add the Class from the container
        PartsContainerRef.current.classList.add(classes.P2_Active)
        // Hide the Next Button
        NextButton.current.classList.add(classes.Un_Active)
        // Show the Next Button
        CreateButtonRef.current.classList.remove(classes.Un_Active)
        // Show the Previous Part Link
        PreviousPartRef.current.classList.remove(classes.Un_Active)
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check that required fields are filled in
        if (!firstNameRef.current.value ||
            !lastNameRef.current.value ||
            !emailRef.current.value ||
            !phoneRef.current.value ||
            !gender ||
            !passwordRef.current.value ||
            !confirmPasswordRef.current.value ||
            !governate ||
            !region ||
            !streetRef.current.value ||
            !houseRef.current.value ||
            readTerms === false
        ) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Check that password and confirm password match
        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            toast.error('Passwords do not match');
            return;
        }

        // Check that the phone number is valid
        if (phoneRef.current.value.length !== 8) {
            toast.error("Please Enter valid phone number");
            return;
        }

        if (phoneRef.current.value[0] !== "9" && phoneRef.current.value[0] !== "6" && phoneRef.current.value[0] !== "5") {
            toast.error("The phone number must starts with 9 || 6 || 5");
            return;
        }

        // Submit form data here
        try {
            // SET THE LOADING STATE
            setLoading(true)

            await axios.post(`https://api.easydietkw.com/api/v1/register/new/client`, {
                clientName: `${firstNameRef.current.value} ${lastNameRef.current.value}`,
                phoneNumber: phoneRef.current.value,
                email: emailRef.current.value,
                gender: gender,
                governorate: governate,
                distrect: region,
                streetName: parcelRef.current.value,
                homeNumber: streetRef.current.value,
                floorNumber: houseRef.current.value,
                appartment: floorRef.current.value,
                appartmentNo: apartmentRef.current.value,
                password: passwordRef.current.value,
                confirmPassword: confirmPasswordRef.current.value,
            })

            // Reset form inputs
            firstNameRef.current.value = '';
            lastNameRef.current.value = '';
            emailRef.current.value = '';
            phoneRef.current.value = '';
            setGender('');
            passwordRef.current.value = '';
            confirmPasswordRef.current.value = '';
            setGovernate('');
            setRegion('');
            streetRef.current.value = '';
            houseRef.current.value = '';
            floorRef.current.value = '';
            apartmentRef.current.value = '';

            // SET THE LOADING STATE
            setLoading(false)

            // REDIRECT TO THE LOGIN PAGE
            router.push('/auth/login')
                .then(() => {
                    // Display success message
                    toast.success('User created successfully');
                })

        } catch (e) {
            // SET THE LOADING STATE
            setLoading(false)
            toast.error(e.response.data.message || e.message)
        }
    }


    // GOOGLE HANDLER
    const googleHandler = () => {
        axios.get('https://api.easydietkw.com/api/v1/auth/google')
            .then(res => {
                if (res.data?.authUrl) {
                    window.location.href = res.data.authUrl
                } else {
                    toast.error('Something is wrong with the auth url')
                }
            })
            .catch(err => {
                toast.error(err.response?.data?.message || err.message)
            })
    }


    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Register</title>
                <meta
                    name="description"
                    content="Register to EasyDiet and access our diverse menu of delicious, healthy meals that are perfect for people who are looking to maintain a healthy lifestyle. Our team of experienced chefs use fresh, locally-sourced ingredients to prepare each meal. Join our community of satisfied customers who have reported feeling more energized and healthier after consuming our meals. EasyDiet: Providing Healthy Meals for Over 5 Years "/>
                <meta
                    name="keywords"
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
                <meta
                    property="og:description"
                    content="EasyDiet has been offering healthy meal options for over 5 years. With a diverse menu of delicious and locally-sourced ingredients, their experienced chefs provide convenient and energizing meals. Experience a healthier lifestyle with EasyDiet."/>
            </Head>
            <div className={classes?.Container}>
                <div className={classes?.Main}>
                    <div className={classes?.Right}>
                        <div className={classes?.Logo} onClick={() => router.push('/')}>
                            <Image src={'/easyDietLogo-text.png'} alt={'logo'} width={104.5} height={100}/>
                        </div>
                        <form className={classes.Form} onSubmit={handleSubmit}>
                            <h2 className={classes.Heading_2}>{t("title")}</h2>
                            <div className={classes.Parts_Container} ref={PartsContainerRef}>
                                <div className={classes.Form_P1}>
                                    <div className={classes.Input_Container}>
                                        <div className={classes.Input_Group}>
                                            <div className={classes.InputBorderContainer}>
                                                <input
                                                    ref={firstNameRef}
                                                    type={'text'}
                                                    id={'firstname'}
                                                    placeholder={t("placeholder0")}
                                                    name={'first name'}/>
                                            </div>
                                        </div>
                                        <div className={classes.Input_Group}>
                                            <div className={classes.InputBorderContainer}>
                                                <input
                                                    ref={lastNameRef}
                                                    type={'text'}
                                                    id={'lastname'}
                                                    name={'last name'}
                                                    placeholder={t("placeholder1")}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.Input_Group}>
                                        <div className={classes.Input_Group}>
                                            <div className={classes.InputBorderContainer}>
                                                <input
                                                    ref={emailRef}
                                                    type={'email'}
                                                    id={'email'}
                                                    name={'email'}
                                                    placeholder={t("placeholder2")}/>
                                            </div>
                                        </div>
                                        <div className={classes.Input_Container}>
                                            <div className={classes.Input_Group}>
                                                <div className={classes.InputBorderContainer}>
                                                    <input
                                                        ref={phoneRef}
                                                        type={'tel'}
                                                        id={'phone_number'}
                                                        placeholder={'PHONE NUMBER'}
                                                        name={t("placeholder3")}/>
                                                </div>
                                            </div>
                                            <div className={classes.Input_Group}>
                                                <CustomSelect
                                                    defaultValue={gender || ''}
                                                    changed={(values) => {
                                                        setGender(values.value)
                                                    }}
                                                    placeholder={t("placeholder4")}
                                                />
                                            </div>
                                        </div>
                                        <div className={classes.Input_Container}>
                                            <div className={classes.Input_Group}>
                                                <div className={classes.InputBorderContainer}>
                                                    <input
                                                        ref={passwordRef}
                                                        type={'password'}

                                                        id={'password'}
                                                        placeholder={t("placeholder5")}
                                                        name={'password'}/>
                                                </div>
                                            </div>
                                            <div className={classes.Input_Group}>
                                                <div className={classes.InputBorderContainer}>
                                                    <input
                                                        ref={confirmPasswordRef}
                                                        type={'password'}
                                                        id={'confirm_password'}
                                                        placeholder={t("placeholder6")}
                                                        name={'confirm password'}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.Form_P2}>
                                    <div className={classes.Input_Container}>
                                        <div className={classes.Input_Group}>
                                            <div className={classes.InputBorderContainer}>
                                                <CustomSelectGovernate
                                                    placeholder={t("governorate")}
                                                    changed={(values) => {
                                                        setGovernate(values.value)
                                                    }}
                                                    defaultValue={governate || ''}
                                                />
                                            </div>
                                        </div>
                                        <div className={classes.Input_Group}>
                                            <div className={classes.InputBorderContainer}>
                                                <CustomSelectRegion
                                                    placeholder={t("placeholder7")}
                                                    changed={(values) => {
                                                        setRegion(values.value)
                                                    }}
                                                    defaultValue={region || ''}
                                                    linkedSelectValue={governate}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.Input_Container}>
                                        <div className={classes.Input_Group}>
                                            <div className={classes.InputBorderContainer}>
                                                <input
                                                    ref={parcelRef}
                                                    type={'text'}
                                                    id={'Parcel'}
                                                    name={'Parcel'}

                                                    placeholder={t("placeholder8")}/>
                                            </div>
                                        </div>
                                        <div className={classes.Input_Group}>
                                            <div className={classes.InputBorderContainer}>
                                                <input
                                                    ref={streetRef}
                                                    type={'text'}
                                                    id={'street'}
                                                    name={'street'}
                                                    placeholder={t("placeholder9")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.Input_Group}>
                                        <div className={classes.InputBorderContainer}>

                                            <input
                                                ref={houseRef}
                                                type={'text'}
                                                id={'HOUSE'}
                                                name={'HOUSE'}
                                                placeholder={t("placeholder10")}
                                            />
                                        </div>
                                    </div>
                                    <div className={classes.Input_Container}>
                                        <div className={classes.Input_Group}>
                                            <div className={classes.InputBorderContainer}>
                                                <input
                                                    ref={floorRef}
                                                    type={'text'}
                                                    id={'FLOOR'}
                                                    name={'FLOOR'}
                                                    placeholder={t("placeholder11")}
                                                />
                                            </div>
                                        </div>
                                        <div className={classes.Input_Group}>
                                            <div className={classes.InputBorderContainer}>
                                                <input
                                                    ref={apartmentRef}
                                                    type={'text'}
                                                    id={'Apartment'}
                                                    placeholder={t("placeholder12")}
                                                    name={'Apartment'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.Input_Container}>
                                        <div className={classes.Input_Group}>
                                            <div className={classes.togglerInput}>
                                                <label htmlFor="payment">{t("terms1")} <Link
                                                    target={'_blank'}
                                                    href={'/user/License'}>{t("termsLink")}</Link> {t("terms2")}
                                                </label>
                                                <div className={classes.toggler}>
                                                    <input

                                                        type="checkbox"
                                                        id="payment"
                                                        name="payment"
                                                        checked={readTerms}
                                                        onChange={(event) => {
                                                            setReadTerms(event.target.checked)
                                                        }}
                                                    />
                                                    <div className={classes.slider}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.Form_buttons}>
                                <div className={classes.Links}>
                                    <Link href={'/auth/login'}>
                                        {t("link1")}
                                    </Link>
                                </div>
                                <div className={classes.Buttons_Container}>
                                    <button type={'button'} className={classes.Google_button} onClick={googleHandler}>
                                        <span><Image
                                            src={'/images/Auth/google-icon.svg'}

                                            alt={'Create User'} width={30}
                                            height={30}/></span>
                                    </button>
                                    <button onClick={showPreviousPart} ref={PreviousPartRef}
                                            className={[classes.Next_button, classes.Un_Active].join(' ')}
                                            type={'button'}>
                                        <span>{t("previousButton")}</span>
                                    </button>
                                    <button onClick={showNextPart} ref={NextButton} className={classes.Next_button}
                                            type={'button'}>
                                        <span>{t("nextButton")}</span>
                                    </button>
                                    <button ref={CreateButtonRef}
                                            className={[classes.Create_button, classes.Un_Active].join(' ')}
                                            type={'submit'}>
                                        <span>{loading ?
                                            <Spinner size={2} color={`#A71523`}/> : t('createButton')}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className={classes?.Left}>
                        <p>EASYDEIT</p>
                    </div>
                </div>
            </div>
        </>
    )
}
