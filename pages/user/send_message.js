import {useRef, useState} from "react";
import classes from '@/styles/pages/user/send_message.module.scss';
import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";
// REDUX
import {useDispatch, useSelector} from "react-redux";
import {onInputChange, clearAll} from "@/redux/slices/user/nutritionspecialist_slice";
// HELPERS
import {extractTokenFromCookie} from "@/helpers/extractToken";
import axios from "axios";
import {toast} from "react-toastify";
// COMPONENTS
import Spinner from "@/components/layout/spinner/Spinner";
// LANGUAGE
import {useTranslation} from "react-i18next";

const SendMessage = ({ID, fullName, userImage}) => {
    // ROUTER
    const router = useRouter();

    // LANGUAGE
    const {t} = useTranslation('send_message')

    // STATES
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState(null);

    //REFS
    const pdfFileRef = useRef();

    // REDUX
    const dispatch = useDispatch();
    const {
        subject,
        content
    } = useSelector(state => state.nutrition_specialist)


    // SUBMIT HANDLER
    const submitHandler = async (e) => {
        // STOP RELOADING
        e.preventDefault();
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        //Check the inputs
        if (!ID || !subject || !content) {
            toast.error(`Please fill All inputs`);
            return;
        }
        // Set the loading state for the spinner
        setLoading(true);

        // Create the Data as formData
        const sendMessage_formData = new FormData();
        sendMessage_formData.append("specialistId", ID);
        sendMessage_formData.append("title", subject);
        sendMessage_formData.append("body", content);
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                sendMessage_formData.append('files', files[i]);
            }
        }

        // Send Create Request to the server
        await axios.post(`https://api.easydietkw.com/api/v1/send/message`, sendMessage_formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                // SET THE STATE
                setLoading(false);
                // DO WHAT I WANT
                toast.success(res.data.message || `Message Sent Successfully`);
                router.push(`/user/nutrition_specialist`)
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

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Send Message</title>
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
                        <div className={classes.Left}>
                            <div className={classes.Image}>
                                <Image src={userImage || '/images/no_image.webp'} alt={'Doctor Image'} width={100}
                                       height={100}/>
                            </div>
                            <div className={classes.Content}>
                                <h1>{fullName}</h1>
                                <p>{t("specialist")}</p>
                            </div>
                        </div>
                        <div className={classes.Right}>
                            <button className={classes.Close}>
                                <Image src={'/images/Auth/next-icon.svg'} alt={'go back'} width={25} height={25}/>
                            </button>
                        </div>
                    </div>
                    <form onSubmit={submitHandler}>
                        <div className={classes.InputsContainer}>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'subject'}>{t("subject")}</label>
                                <input
                                    type={'text'}
                                    name={'subject'}
                                    id={'subject'}
                                    placeholder={'EX: Diet'}
                                    value={subject}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'subject',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <label htmlFor={'content'}>{t("content")}</label>
                                <textarea
                                    name={'content'}
                                    id={'content'}
                                    placeholder={'EX: Ask your question...'}
                                    value={content}
                                    onChange={(event) => {
                                        dispatch(onInputChange({
                                            key: 'content',
                                            value: event.target.value
                                        }))
                                    }}
                                />
                            </div>
                            <div className={classes.InputGroup}>
                                <div className={classes.Image_Uploader}>
                                    <label htmlFor={'pdf_file'}>
                                        <div className={classes.Static}>
                                            <Image src={'/images/Upload_Icon.svg'} alt={'Upload Icon'} width={30}
                                                   height={30}/>
                                            <span>{t("upload")}</span>
                                        </div>
                                    </label>
                                    <input id={'pdf_file'} type={'file'} name={'PDF_File'} ref={pdfFileRef} multiple
                                           accept="application/pdf" onChange={(e) => {
                                        setFiles(Array.from(e.target.files))
                                    }}/>
                                    {files && files.map((file, i) => {
                                        return (
                                            <p key={i} className={classes.SelectedFile}>{file.name}</p>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className={classes.NavigationContainer}>
                            <button type={'submit'}>
                                <span>
                                    {loading ? <Spinner size={2} color={`#ffffff`}/> : t("send")}
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

export default SendMessage;

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

    if (!tokenInfo) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }


    // GET THE ID OF THE MEAL FROM THE URL
    const {ID} = ctx.query;
    let specialist;

    if (ID) {
        // GET THE MEAL FROM THE SERVER
        await axios.get(`https://api.easydietkw.com/api/v1/get/specialist?userId=${ID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                // SET THE STATE
                specialist = res.data.user
            })
            .catch(err => {
                // SET THE STATE
                console.log(err)
            })
    }

    // SET THE EMPLOYEE IF EXIST
    let propObj = {};
    if (specialist) {
        propObj = {
            ID,
            ...specialist
        }
    }

    return {
        props: propObj,
    };
};
