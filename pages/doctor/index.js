import {useEffect, useRef, useState} from "react";
import classes from '@/styles/pages/doctor/doctor.module.scss';
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
// HELPERS
import {toast} from "react-toastify";
import {extractTokenFromCookie} from "@/helpers/extractToken";
import axios from "axios";
// IMPORTS
import Spinner from "@/components/layout/spinner/Spinner";
// LANGUAGE
import {useTranslation} from "react-i18next";

const Doctor = () => {

    // LANGUAGE
    const {t} = useTranslation('doctor')

    //STATES
    const [hasNextPage, setHasNextPage] = useState(false);
    const [nextPage, setNextPage] = useState();
    const [messages, setMessages] = useState([]);
    const [userMessages, setUserMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeUser, setActiveUser] = useState({
        messageId: '',
        userId: '',
        userImage: '/images/no_image.webp',
        userName: '',
        userTopic: ''
    });
    const [showActiveUser, setShowActiveUser] = useState(false);

    //REFS
    const heightRef = useRef();
    const weightRef = useRef();
    const messageRef = useRef();
    const messagesRef = useRef();


    //HELPERS
    function getObjectIndexById(array, id) {
        for (let i = 0; i < array.length; i++) {
            if (array[i]._id === id) {
                return i;
            }
        }
        // if no object with matching ID was found, return -1
        return -1;
    }

    //HANDLERS
    const submitHandler = (event) => {
        event.preventDefault();
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie)

        // GET THE REFS VALUE
        const height = heightRef.current.value;
        const weight = weightRef.current.value;
        const message = messageRef.current.value;

        if (!activeUser.messageId || !activeUser?.userId) {
            toast.error('The User ID || Message ID => is not found');
            return
        }

        if(!height && !weight && !message){
            toast.error('There are no inputs');
            return
        }

        // SET THE LOADING STATE
        setLoading(true)

        // LOGIC
        axios.post(`https://api.easydietkw.com/api/v1/message/reply`, {
                messageId: activeUser?.messageId,
                reply: message,
                clientId: activeUser?.userId,
                wieght: weight,
                tall: height
            }
            , {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(_ => {
                // LOGIC
                setLoading(false)
                // SET THE RESPONSE IN THE STATE
                const messages_copy = [...userMessages];
                const messageIndex = getObjectIndexById(messages_copy, activeUser?.messageId)

                if (messageIndex !== -1) {
                    const message_copy = messages_copy[messageIndex];

                    message_copy['reply'] = message;

                    messages_copy[messageIndex] = message_copy;

                    setUserMessages(messages_copy)
                }

                toast.success(`Message Sent Successfully`)
                // CLEAR THE INPUTS
                heightRef.current.value = '';
                weightRef.current.value = '';
                messageRef.current.value = '';
            })
            .catch(err => {
                setLoading(false)
                toast.error(err?.response?.data?.message || err.message)
            })

    }

    const messageReadHandler = (messageID) => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie)

        axios.put(`https://api.easydietkw.com/api/v1/set/message/status`, {
                messageId: messageID,
            }
            , {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(_ => {
                // SET THE STATE OF READ
                const messages_copy = [...messages];
                const messageIndex = getObjectIndexById(messages_copy, messageID)

                if (messageIndex !== -1) {
                    const message_copy = messages_copy[messageIndex];

                    message_copy['isRead'] = true;

                    messages_copy[messageIndex] = message_copy;

                    setMessages(messages_copy)
                }
            })
            .catch(err => {
                toast.error(err?.response?.data?.message || err.message)
            })
    }

    const getTheUserHandler = (clientId) => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie)

        axios.get(`https://api.easydietkw.com/api/v1/client/messages?clientId=${clientId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                // SET THE MEALS IN THE STATE
                setUserMessages(res.data.messages)
            })
            .catch(err => {
                toast.error(err?.response?.data?.message || err.message)
            })
    }

    //EFFECTS
    useEffect(() => {
        //GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie)

        axios.get(`https://api.easydietkw.com/api/v1/clients/messages`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                // SET THE STATE OF HAS NEXT PAGE AND NEXT PAGE
                setHasNextPage(res.data.data.hasNextPage);
                setNextPage(res.data.data.nextPage);

                // SET THE MEALS IN THE STATE
                setMessages(res.data.data.messages)
            })
            .catch(err => console.log(err))
    }, [])

    // FUNCTION TO LOAD THE DATA FROM THE SERVER WHEN THE USER SCROLL TO THE BOTTOM MESSAGES LIST IF THE HAS NEXT PAGE IS TRUE AND UPDATE THE STATE
    useEffect(() => {
        function handleScroll() {
            const scrollHeight = messagesRef.current.scrollHeight;
            const scrollTop = messagesRef.current.scrollTop;
            const clientHeight = messagesRef.current.clientHeight;

            if (scrollHeight === scrollTop + clientHeight && hasNextPage) {
                axios
                    .get(`https://api.easydietkw.com/api/v1/clients/messages?page=${nextPage}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then(res => {
                        setHasNextPage(res.data.data.hasNextPage);
                        setNextPage(res.data.data.nextPage);
                        setMessages(prevMessages => [...prevMessages, ...res.data.data.messages]);
                    })
                    .catch(err => {
                        toast.error(err?.response?.data?.message || err.message);
                    });
            }
        }

        messagesRef.current.addEventListener("scroll", handleScroll);
        return () => {
            // messagesRef.current.removeEventListener("scroll", handleScroll);
        };
    }, [hasNextPage, nextPage]);

    return (
        <>
            {/*OPTIMIZE THE SEO FOR THIS PAGE IN NEXTJS */}
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="Dashboard for the doctor to review the questions of the clients" />
                <meta name="keywords" content="Dashboard, Doctor, EasyDiet" />
                <meta name="author" content="EasyDiet Team" />

                {/* OPEN GRAPH */}
                <meta property="og:title" content="Dashboard" />
                <meta property="og:description" content="Dashboard for the doctor to review the questions of the clients" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://easydietkw.com/doctor" />
                <meta property="og:image" content="/easyDietLogo.png" />
                <meta property="og:site_name" content="EasyDiet" />
            </Head>

            <div className={classes.Doctor}>
                <div className={classes.Clients} ref={messagesRef}>
                    {messages && messages.map((message) => {
                        return (
                            <div
                                key={message._id}
                                className={classes.Client}
                                onClick={() => {
                                    // Change the Read Status If it's unread
                                    if (message.isRead === false) {
                                        messageReadHandler(message?._id)
                                    }
                                    // GET THE CLIENT MESSAGES BY ID
                                    getTheUserHandler(message?.clientId?._id)
                                    //SET THE ACTIVE USER INFO
                                    setActiveUser({
                                        messageId: message?._id,
                                        userId: message?.clientId?._id,
                                        userName: message?.clientId?.clientNameEn || message?.clientId?.clientName,
                                        userTopic: message?.title
                                    });
                                    setShowActiveUser(true)
                                }}
                            >
                                <div className={classes.Client_Container}>
                                    <div className={classes.Client_Image}>
                                        <Image src={'/images/no_image.webp'} alt={''} width={50} height={50}/>
                                    </div>
                                    <div className={classes.Client_Info}>
                                        <h3>{message?.clientId?.clientNameEn || message?.clientId?.clientName}</h3>
                                        <p>{message?.title}</p>
                                    </div>
                                </div>
                                {message.isRead === false && <span className={classes.Client_Unread}></span>}
                            </div>
                        )
                    })}
                </div>
                <div className={classes.Chat}>
                    {showActiveUser && (
                        <div className={classes.Top}>
                            <div className={classes.Client_Container}>
                                <div className={classes.Client_Image}>
                                    <Image src={activeUser?.userImage || '/images/no_image.webp'} alt={''} width={50}
                                           height={50}/>
                                </div>
                                <div className={classes.Client_Info}>
                                    <h3>{activeUser?.userName || ''}</h3>
                                    <p>{activeUser?.userTopic || ''}</p>
                                </div>
                            </div>
                        </div>)
                    }
                    <div className={classes.Bottom}>
                        <div className={classes.Questions}>
                            {(showActiveUser && userMessages) && (
                                <div className={classes.Current_Question}>
                                    <h3>{t("currentQuestion")}</h3>
                                    <h4>q: {userMessages[0]?.body}?</h4>
                                    <time>{new Date(userMessages[0]?.updatedAt).toLocaleDateString('en-US', {
                                        day: "numeric",
                                        month: "long",
                                        year: 'numeric',
                                    })}</time>
                                    {userMessages[0]?.reply && (<p>({userMessages[0]?.specialistId?.fullName.toUpperCase()}): {userMessages[0]?.reply}</p>)}
                                    <h5>{t("attachments")}</h5>
                                    {userMessages[0] && userMessages[0]?.attachments.map((attachment, attachIndex) => {
                                        return (
                                            <Link href={attachment} target={'_blank'}
                                                  key={attachIndex}>{'Attachment ' + (attachIndex + 1)}</Link>
                                        )
                                    })}
                                </div>
                            )}
                            {(showActiveUser && userMessages) && (
                                <div className={classes.Previous_Questions}>
                                    <h3>{t("previousQuestion")}</h3>
                                    <div className={classes.Previous_Questions__container}>
                                        {userMessages && userMessages.map((message, messageIndex) => {
                                            if (messageIndex !== 0) {
                                                return (
                                                    <div key={message._id} className={classes.Previous_Question}>
                                                        <h4>q: {message?.body}?</h4>
                                                        <time>{new Date(message?.updatedAt).toLocaleDateString('en-US', {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: 'numeric',
                                                        })}</time>
                                                        <p>({message?.specialistId?.fullName.toUpperCase()}): {message?.reply}</p>
                                                        <h5>{t("attachments")}</h5>
                                                        {message && message?.attachments.map((attachment, attachIndex) => {
                                                            return (
                                                                <Link href={attachment} target={'_blank'}
                                                                      key={attachIndex}>{'Attachment ' + (attachIndex + 1)}</Link>
                                                            )
                                                        })}
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={classes.Sender}>
                            <form onSubmit={submitHandler}>
                                <div className={classes.Input_Container}>
                                    <div className={classes.Input_Group}>
                                        <input ref={heightRef} autoComplete={'off'} placeholder={t("height")}
                                               type={'number'}
                                               name={'height'} step={1} min={0}/>
                                        <span><span>{t("heightUnit")}</span></span>
                                    </div>
                                    <div className={classes.Input_Group}>
                                        <input ref={weightRef} autoComplete={'off'} placeholder={t("weight")}
                                               type={'number'}
                                               name={'weight'} step={0.01} min={0}/>
                                        <span><span>{t("weightUnit")}</span></span>
                                    </div>
                                </div>
                                <div className={classes.Input_Container}>
                                    <div className={classes.Input_Group}>
                                        <textarea ref={messageRef} placeholder={t("message")}
                                                  name={'Message'}/>
                                        <button type={'submit'}>
                                            <Image src={'/images/Global/SendDoctor_Icon.svg'} alt={'send'} width={22}
                                                   height={22}/>
                                            {loading && <Spinner size={2} color={'#A71523'}/>}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Doctor;

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

    if (!tokenInfo || tokenInfo.role !== 'diet specialist' || tokenInfo.active === false) {
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
