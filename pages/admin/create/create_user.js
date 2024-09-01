import {useState} from "react";
import classes from "@/styles/pages/admin/create_user.module.scss";
import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";
// IMPORT
import CustomSelect from "@/components/pages/register/custom-select";
import PackageSelect from "@/components/pages/dashboard/packageSelect/packageSelect";
import Overlay from "@/components/layout/overlay";
import CopyClientData from "@/components/pages/dashboard/copyClientDta/copyClientData";
import Spinner from "@/components/layout/spinner/Spinner";
import CustomSelectGovernate from "@/components/pages/register/custom-select-governate";
import CustomSelectRegion from "@/components/pages/register/custom-select-region";
// HELPERS
import {toast} from "react-toastify";
import axios from "axios";
import {extractTokenFromCookie} from "@/helpers/extractToken";
// REDUX
import {clearAll, onInputChange} from "@/redux/slices/Admin/createUser-slice";
import {useDispatch, useSelector} from "react-redux";
// LANGUAGE
import {useTranslation} from "react-i18next";
import i18n from "@/i18n";

const CreateUser = () => {
    // ROUTER
    const router = useRouter();

    // LANGUAGE
    const {t} = useTranslation("createClient");

    // STATES
    const [loading, setLoading] = useState(false);
    const [governorate, setGovernorate] = useState("");
    const [regionSelect, setRegionSelect] = useState("");
    const [showUserModel, setShowUserModel] = useState(false);
    const [emailModel, setEmailModel] = useState("");
    const [passwordModel, setPasswordModel] = useState("");

    // REDUX
    const dispatch = useDispatch();
    const {
        //PACKAGE
        mealsNumber,
        numberOfSnacks,
        breakfast,
        lunch,
        dinner,
        bundlePeriod,
        bundlePrice,
        fridayIncluded,
        dislikedMeals,
        // USER DATA
        fullName,
        email,
        gender,
        password,
        phone,
        street,
        house,
        floor,
        apartment,
        apartmentNumber,
        selectedPackage,
        payment,
    } = useSelector((state) => state.create_user);

    // SUBMIT HANDLER
    const submitHandler = async (e) => {
        // STOP RELOADING
        e.preventDefault();
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        //Check the inputs
        if (
            !fullName ||
            !email ||
            !gender ||
            !password ||
            !phone ||
            !governorate ||
            !regionSelect ||
            !street ||
            !house ||
            !floor
        ) {
            toast.error(`Please fill All inputs`);
            return;
        }

        // Check if the package info is complete and the bundleId at the same time send an error
        if (
            (mealsNumber ||
                breakfast ||
                lunch ||
                dinner ||
                numberOfSnacks ||
                bundlePeriod ||
                fridayIncluded ||
                bundlePrice) &&
            selectedPackage
        ) {
            toast.error(
                i18n.language.includes(`en`)
                    ? `You can't fill the package info and select a package at the same time`
                    : `لا يمكنك ملئ معلومات الباقة واختيار باقة في نفس الوقت`
            );
            return;
        }

        // Check if the package info is complete and the bundleId at the same time send an error
        if (
            (!mealsNumber ||
                !numberOfSnacks ||
                !bundlePeriod ||
                !bundlePrice) &&
            !selectedPackage
        ) {
            toast.error(
                i18n.language.includes(`en`)
                    ? `You should make a custom package or select exist package`
                    : `يجب عليك اختيار باقة موجودة او انشاء باقة جديدة`
            );
            return;
        }

        if (!breakfast && !lunch && !dinner && !selectedPackage) {
            toast.error(
                i18n.language.includes(`en`)
                    ? `You should select at least one meal type`
                    : `يجب عليك اختيار نوع وجبة واحدة على الاقل`
            );
            return;
        }

        // Set the loading state for the spinner
        setLoading(true);
        const clientData = {
            // package
            mealsNumber: mealsNumber,
            breakfast: breakfast,
            lunch: lunch,
            dinner: dinner,
            snacksNumber: numberOfSnacks,
            bundlePeriod: bundlePeriod,
            fridayOption: fridayIncluded,
            bundlePrice: bundlePrice,
            dislikedMeals: dislikedMeals,
            customBundle: !selectedPackage,
            // user data
            clientName: fullName,
            clientNameEn: fullName,
            phoneNumber: phone,
            email: email,
            gender: gender,
            governorate: governorate,
            distrect: regionSelect,
            streetName: street,
            homeNumber: house,
            floorNumber: floor,
            appartment: apartment,
            appartmentNo: apartmentNumber,
            password: password,
            bundleId: selectedPackage,
        };

        // Send Create Request to the server
        await axios
            .post(
                `https://api.easydietkw.com/api/v1/admin/create/client`,
                clientData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
                // SET THE STATE
                setLoading(false);
                // SHOW THE MODEL
                if (res.data.credentials) {
                    setEmailModel(res.data.credentials.username);
                    setPasswordModel(res.data.credentials.password);
                    setShowUserModel(true);
                }
                // DO WHAT I WANT
                toast.success(res.data.message);
                // RESET DATA
                setRegionSelect("")
                setGovernorate("")
                // CLEAR THE STATE
                dispatch(clearAll());
                // REDIRECT TO THE DASHBOARD USERS PAGE
                // router.push("/admin/users");
            })
            .catch((err) => {
                // SET THE STATE
                setLoading(false);
                // DO WHAT I WANT
                toast.error(err?.response?.data?.message || err?.message);
            });
    };

    const closeHandler = () => {
        setShowUserModel(false);
        dispatch(clearAll());
        setEmailModel("");
        setPasswordModel("");
        router.push("/admin/users");
    };

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Create User</title>
                <meta
                    name="description"
                    content="Discover EasyDiet's healthy meal options that have been satisfying customers for over five years. Our experienced chefs prepare each meal with fresh, locally-sourced ingredients to ensure that you get the best quality and flavor. Choose EasyDiet for convenient and delicious meals that leave you feeling energized and healthy."
                />
                <meta
                    name="keywords"
                    content="healthy meals, meal delivery, fresh ingredients, locally-sourced, convenient meal options, energy-boosting, nutritious food, easy ordering, delicious and healthy, meal plans"
                />
                <meta name="author" content="EasyDiet"/>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="robots" content="index, follow"/>
                <meta
                    httpEquiv="Content-Type"
                    content="text/html; charset=utf-8"
                />
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
                    content="EasyDiet has been offering healthy meal options for over 5 years. With a diverse menu of delicious and locally-sourced ingredients, their experienced chefs provide convenient and energizing meals. Experience a healthier lifestyle with EasyDiet."
                />
            </Head>
            <main className={classes.Main}>
                <div className={classes.FormContainer}>
                    <h1>{t("title")}</h1>
                    <form onSubmit={submitHandler}>
                        <div className={classes.InputsContainer}>
                            <h2>
                                {i18n.language.includes("en")
                                    ? `Custom Package`
                                    : `باقة مخصصة`}
                            </h2>

                            <div className={classes.InputGroup}>
                                <label htmlFor={"MealsNumber"}>
                                    {i18n.language.includes("en")
                                        ? `Meals Number`
                                        : `عدد الوجبات`}
                                </label>
                                <input
                                    type={"number"}
                                    name={"MealsNumber"}
                                    id={"MealsNumber"}
                                    min={"0"}
                                    placeholder={"EX: 5"}
                                    value={mealsNumber}
                                    onChange={(event) => {
                                        dispatch(
                                            onInputChange({
                                                key: "mealsNumber",
                                                value: event.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>

                            <div className={classes.InputGroup}>
                                <label htmlFor={"Snacks_meals"}>
                                    {i18n.language.includes("en")
                                        ? `Snacks Number`
                                        : `عدد الوجبات الخفيفة`}
                                </label>
                                <input
                                    type={"number"}
                                    name={"Snacks_meals"}
                                    min={"0"}
                                    id={"Snacks_meals"}
                                    placeholder={"EX: 2"}
                                    value={numberOfSnacks}
                                    onChange={(event) => {
                                        dispatch(
                                            onInputChange({
                                                key: "numberOfSnacks",
                                                value: event.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>

                            <div className={classes.InputGroup}>
                                <label htmlFor={"bundlePeriod"}>
                                    {i18n.language.includes("en")
                                        ? `Bundle Period`
                                        : `مدة الباقة`}
                                </label>
                                <input
                                    type={"number"}
                                    name={"bundlePeriod"}
                                    id={"bundlePeriod"}
                                    placeholder={"EX: 15"}
                                    min={5}
                                    onBlur={(event) => {
                                        event.target.value < 5 &&
                                        (event.target.value = 5);
                                    }}
                                    value={bundlePeriod}
                                    onChange={(event) => {
                                        dispatch(
                                            onInputChange({
                                                key: "bundlePeriod",
                                                value: event.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>

                            <div className={classes.InputGroup}>
                                <label htmlFor={"bundlePrice"}>
                                    {i18n.language.includes("en")
                                        ? `Bundle Price`
                                        : `سعر الباقة`}
                                </label>
                                <input
                                    type={"number"}
                                    name={"bundlePrice"}
                                    id={"bundlePrice"}
                                    placeholder={"EX: 150"}
                                    value={bundlePrice}
                                    onChange={(event) => {
                                        dispatch(
                                            onInputChange({
                                                key: "bundlePrice",
                                                value: event.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>

                            <div className={classes.InputGroup}>
                                <div className={classes.togglerInput}>
                                    <label htmlFor="package_friday_included">
                                        {i18n.language.includes("en")
                                            ? `Fridays`
                                            : `تضمين الجمعة`}
                                    </label>
                                    <div className={classes.toggler}>
                                        <input
                                            type="checkbox"
                                            id="package_friday_included"
                                            name="package_friday_included"
                                            checked={fridayIncluded}
                                            onChange={(event) => {
                                                dispatch(
                                                    onInputChange({
                                                        key: "fridayIncluded",
                                                        value: event.target
                                                            .checked,
                                                    })
                                                );
                                            }}
                                        />
                                        <div className={classes.slider}></div>
                                    </div>
                                </div>
                            </div>

                            <div className={classes.InputGroup}>
                                <div className={classes.checkboxRow}>
                                    <label className={classes.checkbox}>
                                        <input
                                            type="checkbox"
                                            checked={breakfast}
                                            onChange={(event) => {
                                                dispatch(
                                                    onInputChange({
                                                        key: "breakfast",
                                                        value: event.target
                                                            .checked,
                                                    })
                                                );
                                            }}
                                        />
                                        <span
                                            className={classes.checkmark}
                                        ></span>
                                        {i18n.language.includes("en")
                                            ? `Breakfast`
                                            : `فطور`}
                                    </label>
                                    <label className={classes.checkbox}>
                                        <input
                                            type="checkbox"
                                            checked={lunch}
                                            onChange={(event) => {
                                                dispatch(
                                                    onInputChange({
                                                        key: "lunch",
                                                        value: event.target
                                                            .checked,
                                                    })
                                                );
                                            }}
                                        />
                                        <span
                                            className={classes.checkmark}
                                        ></span>
                                        {i18n.language.includes("en")
                                            ? `Lunch`
                                            : `غداء`}
                                    </label>
                                    <label className={classes.checkbox}>
                                        <input
                                            type="checkbox"
                                            checked={dinner}
                                            onChange={(event) => {
                                                dispatch(
                                                    onInputChange({
                                                        key: "dinner",
                                                        value: event.target
                                                            .checked,
                                                    })
                                                );
                                            }}
                                        />
                                        <span
                                            className={classes.checkmark}
                                        ></span>
                                        {i18n.language.includes("en")
                                            ? `Dinner`
                                            : `عشاء`}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <h2>
                                {i18n.language.includes("en")
                                    ? `Client`
                                    : `العميل`}
                            </h2>
                            <div className={classes.InputGroup}>
                                <label htmlFor={"fullName"}>
                                    {t("fullName")}
                                </label>
                                <input
                                    type={"text"}
                                    name={"fullName"}
                                    id={"fullName"}
                                    placeholder={"EX: Ahmed Mohammed"}
                                    value={fullName}
                                    onChange={(event) => {
                                        dispatch(
                                            onInputChange({
                                                key: "fullName",
                                                value: event.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={"phone"}>{t("mobile")}</label>
                                <input
                                    type={"tel"}
                                    name={"phone"}
                                    id={"phone"}
                                    placeholder={"EX: 99995555"}
                                    value={phone}
                                    onChange={(event) => {
                                        dispatch(
                                            onInputChange({
                                                key: "phone",
                                                value: event.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <PackageSelect
                                    labelSelect={t("package")}
                                    defaultValue={selectedPackage || ""}
                                    changed={(values) => {
                                        dispatch(
                                            onInputChange({
                                                key: "selectedPackage",
                                                value: values?.value,
                                            })
                                        );
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={"gender"}>{t("gender")}</label>
                                <CustomSelect
                                    defaultValue={gender || ""}
                                    changed={(values) => {
                                        dispatch(
                                            onInputChange({
                                                key: "gender",
                                                value: values?.value,
                                            })
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={"email"}>{t("email")}</label>
                                <input
                                    type={"email"}
                                    name={"email"}
                                    id={"email"}
                                    placeholder={"EX: ahmed2001"}
                                    value={email}
                                    onChange={(event) => {
                                        dispatch(
                                            onInputChange({
                                                key: "email",
                                                value: event.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={"password"}>
                                    {t("password")}
                                </label>
                                <input
                                    type={"password"}
                                    name={"password"}
                                    id={"password"}
                                    placeholder={"EX: *******"}
                                    value={password}
                                    onChange={(event) => {
                                        dispatch(
                                            onInputChange({
                                                key: "password",
                                                value: event.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={"governorate"}>{t("governorate")}</label>
                                <CustomSelectGovernate
                                    placeholder={t("governorate")}
                                    defaultValue={governorate}
                                    changed={(values) => {
                                        setGovernorate(values.value)
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={"region"}>{t("region")}</label>
                                <CustomSelectRegion
                                    placeholder={t("region")}
                                    linkedSelectValue={governorate}
                                    defaultValue={regionSelect}
                                    changed={(values) => {
                                        setRegionSelect(values.value)
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup} style={{width: "100%"}}>
                                <label htmlFor={"street"}>{t("street")}</label>
                                <input
                                    type={"text"}
                                    name={"street"}
                                    id={"street"}
                                    placeholder={"EX: ...."}
                                    value={street}
                                    onChange={(event) => {
                                        dispatch(
                                            onInputChange({
                                                key: "street",
                                                value: event.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={"house"}>{t("house")}</label>
                                <input
                                    type={"text"}
                                    name={"house"}
                                    id={"house"}
                                    placeholder={"EX: ......"}
                                    value={house}
                                    onChange={(event) => {
                                        dispatch(
                                            onInputChange({
                                                key: "house",
                                                value: event.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={"floor"}>{t("floor")}</label>
                                <input
                                    type={"text"}
                                    name={"floor"}
                                    id={"floor"}
                                    placeholder={"EX: ......"}
                                    value={floor}
                                    onChange={(event) => {
                                        dispatch(
                                            onInputChange({
                                                key: "floor",
                                                value: event.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={"apartment"}>
                                    {t("apartment")}
                                </label>
                                <input
                                    type={"text"}
                                    name={"apartment"}
                                    id={"apartment"}
                                    placeholder={"EX: ......"}
                                    value={apartment}
                                    onChange={(event) => {
                                        dispatch(
                                            onInputChange({
                                                key: "apartment",
                                                value: event.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>

                            <div className={classes.InputGroup}>
                                <label htmlFor={"apartmentNo"}> {t("apartmentNumber")}</label>
                                <input
                                    type={"text"}
                                    name={"apartmentNo"}
                                    id={"apartmentNo"}
                                    placeholder={"EX: ......"}
                                    value={apartmentNumber}
                                    onChange={(event) => {
                                        dispatch(
                                            onInputChange({
                                                key: "apartmentNumber",
                                                value: event.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <div className={classes.togglerInput}>
                                    <label htmlFor="payment">
                                        {t("payment")}
                                    </label>
                                    <div className={classes.toggler}>
                                        <input
                                            type="checkbox"
                                            id="payment"
                                            name="payment"
                                            checked={payment}
                                            onChange={(event) => {
                                                dispatch(
                                                    onInputChange({
                                                        key: "payment",
                                                        value: event.target
                                                            .checked,
                                                    })
                                                );
                                            }}
                                        />
                                        <div className={classes.slider}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={classes.TextAreaGroup}>
                            <label htmlFor={"dislikedMeals"}>
                                {i18n.language.includes("en")
                                    ? `Disliked Meals`
                                    : `وجبات غير مفضلة`}
                            </label>
                            <textarea
                                id={"dislikedMeals"}
                                name={"dislikedMeals"}
                                placeholder={"EX: I don't like fish"}
                                value={dislikedMeals}
                                onChange={(event) => {
                                    dispatch(
                                        onInputChange({
                                            key: "dislikedMeals",
                                            value: event.target.value,
                                        })
                                    );
                                }}
                            />
                        </div>

                        <div className={classes.NavigationContainer}>
                            <button type={"submit"}>
                                <span>
                                    {loading ? (
                                        <Spinner size={2} color={`#ffffff`}/>
                                    ) : (
                                        t("button")
                                    )}
                                </span>
                                <Image
                                    src={"/images/Send_Icon.svg"}
                                    alt={"Send"}
                                    width={20}
                                    height={20}
                                />
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <Overlay active={showUserModel}>
                <CopyClientData
                    input1Value={emailModel}
                    input2Value={passwordModel}
                    closeHandler={closeHandler}
                />
            </Overlay>
        </>
    );
};

export default CreateUser;

export const getServerSideProps = async (ctx) => {
    // GET THE TOKEN FROM THE REQUEST
    const {token} = ctx.req.cookies;

    let tokenInfo;
    if (token) {
        await axios
            .get(`https://api.easydietkw.com/api/v1/get/verify/token`, {
                params: {
                    token: token,
                },
            })
            .then((res) => (tokenInfo = res.data.decodedToken))
            .catch((err) => console.log(err));
    }

    if (
        !tokenInfo ||
        tokenInfo.role !== "admin" ||
        tokenInfo.active === false
    ) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
