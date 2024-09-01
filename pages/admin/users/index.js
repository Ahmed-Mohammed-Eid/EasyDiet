import React, {useEffect, useRef, useState} from "react";
import classes from '@/styles/pages/admin/users.module.scss';
import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";
//HELPERS
import axios from "axios";
import {extractTokenFromCookie} from "@/helpers/extractToken";
import {toast} from "react-toastify";
// REDUX
import {useSelector, useDispatch} from "react-redux";
import {setUsers, onInputChange} from '@/redux/slices/Admin/users-slice';
//IMPORTS
import Overlay from "@/components/pages/dashboard/ChangeUser_Name/overlay";
import InputsContainer from "@/components/pages/dashboard/ChangeUser_Name/inputsContainer";
import UserDataSection from "@/components/pages/dashboard/UserDataModel/UserDataSection";
// LANGUAGE
import {useTranslation} from "react-i18next";
import i18n from "@/i18n";

const Users = () => {
    // ROUTER
    const router = useRouter();

    // LANGUAGE
    const {t} = useTranslation('managePages')

    // STATES
    const [remainingDays, setRemainingDays] = useState([]);
    const [clientEditId, setClientEditId] = useState(false);
    const [clientData, setClientData] = useState({
        personalData: null,
        subscriptionData: null,
    });
    // BUNDLES
    const [bundles, setBundles] = React.useState(null);
    // PAGINATION STATES
    const [pageNumber, setPageNumber] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);

    //REF
    const searchInputRef = useRef();

    // REDUX
    const dispatch = useDispatch();
    const {users, usersType, isOn} = useSelector(state => state.users)

    const handleClick = (e) => {
        dispatch(onInputChange({key: 'isOn', value: e.target.checked}));
    };

    const checkEmployees = () => {
        dispatch(onInputChange({key: 'isOn', value: true}));
    }
    const checkClients = () => {
        dispatch(onInputChange({key: 'isOn', value: false}));
    }

    // EMPLOYEE FUNCTIONS
    async function employeeStatusChangeHandler(ID, isActive) {
        const token = extractTokenFromCookie(document.cookie);

        // GET THE EMPLOYEES
        axios.put(`https://api.easydietkw.com/api/v1/set/user/active`, {
            userId: ID,
            isActive: !isActive
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                const usersCopy = [...users];
                // SET THE USERS IN REDUX
                if (isActive) {
                    const index = usersCopy.findIndex(item => item._id === ID);

                    if (index !== -1) {
                        const objectCopy = {...usersCopy[index]}
                        objectCopy.isActive = false;
                        usersCopy[index] = objectCopy
                    }

                    dispatch(setUsers({users: usersCopy, usersType: 'employees'}))
                    toast.success(`The User account Deactivated`)

                } else {
                    const index = usersCopy.findIndex(item => item._id === ID);

                    if (index !== -1) {
                        const objectCopy = {...usersCopy[index]}
                        objectCopy.isActive = true;
                        usersCopy[index] = objectCopy
                    }

                    dispatch(setUsers({users: usersCopy, usersType: 'employees'}))
                    toast.success(`The User account Activated`)
                }
            })
            .catch(err => {
                toast.error(err.response?.data?.message || err.message);
            })
    }

    async function employeeDeleteHandler(ID) {
        const token = extractTokenFromCookie(document.cookie);

        window.confirm(`This Employee will be deleted. Are you sure you want to continue?`)
        {
            // GET THE EMPLOYEES
            axios.delete(`https://api.easydietkw.com/api/v1/delete/user?userId=${ID}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(_ => {
                    // SET THE USERS IN REDUX
                    const usersCopy = [...users];
                    // SET THE USERS IN REDUX
                    const index = usersCopy.findIndex(item => item._id === ID);

                    if (index !== -1) {
                        usersCopy.splice(index, 1);
                    }

                    dispatch(setUsers({users: usersCopy, usersType: 'employees'}))
                    toast.success(`User Deleted Successfully`)
                })
                .catch(err => {
                    toast.error(err.response?.data?.message || err.message);
                })
        }
    }

    // USERS
    async function handleFreeze(ID) {
        const token = extractTokenFromCookie(document.cookie);

        if (window.confirm(`Please not that by accepting you will freeze the subscription for this user. Are you sure you want to continue?`)) {
            // GET THE EMPLOYEES
            axios.post(`https://api.easydietkw.com/api/v1/client/pause`, {
                clientId: ID
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(_ => {
                    toast.success(`Account Froze Successfully`);
                    // GET A COPY OF THE USERS
                    const usersCopy = [...users];
                    // CHANGE THE STATUS OF THE USER
                    const index = usersCopy.findIndex(item => item._id === ID);

                    if (index !== -1) {
                        const objectCopy = {...usersCopy[index]}
                        const clientStatusCopy = {...objectCopy.clientStatus}
                        clientStatusCopy.paused = true;
                        clientStatusCopy.numPause = clientStatusCopy.numPause - 1;
                        objectCopy.clientStatus = clientStatusCopy;
                        usersCopy[index] = objectCopy;
                        dispatch(setUsers({users: usersCopy, usersType: 'clients'}))
                    }
                })
                .catch(err => {
                    toast.error(err.response?.data?.message || err.message);
                })
        }
    }


    async function handleUnfreeze(ID) {
        const token = extractTokenFromCookie(document.cookie);
        if (window.confirm(`Please not that by accepting you will unfreeze the subscription for this user. Are you sure you want to continue?`)) {
            // GET THE EMPLOYEES
            axios.put(`https://api.easydietkw.com/api/v1/activate/client`, {
                clientId: ID,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(_ => {
                    // SET THE USERS IN REDUX
                    toast.success(`Account unFroze Successfully`)
                    // GET A COPY OF THE USERS
                    const usersCopy = [...users];
                    // CHANGE THE STATUS OF THE USER
                    const index = usersCopy.findIndex(item => item._id === ID);

                    if (index !== -1) {
                        const objectCopy = {...usersCopy[index]}
                        const clientStatusCopy = {...objectCopy.clientStatus}
                        clientStatusCopy.paused = false;
                        objectCopy.clientStatus = clientStatusCopy;
                        usersCopy[index] = objectCopy;
                        dispatch(setUsers({users: usersCopy, usersType: 'clients'}))
                    }
                })
                .catch(err => {
                    toast.error(err.response?.data?.message || err.message);
                })
        }
    }

    async function handleDelete(ID) {
        const token = extractTokenFromCookie(document.cookie);

        if (window.confirm('This user will be deleted. Are you sure you want to continue')) {
            // GET THE EMPLOYEES
            axios.delete(`https://api.easydietkw.com/api/v1/admin/remove/client?clientId=${ID}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(_ => {
                    // SET THE USERS IN REDUX
                    toast.success(`User Deleted Successfully`)
                })
                .catch(err => {
                    toast.error(err.response?.data?.message || err.message);
                })
        }
    }

    async function handleSearch() {
        const token = extractTokenFromCookie(document.cookie);

        // GET THE EMPLOYEES
        axios.get(`https://api.easydietkw.com/api/v1/find/client?searchTerm=${searchInputRef.current.value}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.data?.clients && res.data?.remainingDays) {
                    // SET THE USERS IN REDUX
                    dispatch(setUsers({users: res.data.clients, usersType: 'clients'}))
                    // SET REMAINING DAYS
                    setRemainingDays(res.data.remainingDays)
                }
            })
            .catch(err => {
                toast.error(err.response?.data?.message || err.message);
            })
    }

    function clearTheIdOfUser() {
        setClientEditId('')
    }

    // PAGINATION LOGIC
    const prevPage = () => {
        if (pageNumber === 1) return;

        if (hasPrevPage) {
            setPageNumber(prev => prev - 1);
        }
    }

    const nextPage = () => {
        if (hasNextPage) {
            setPageNumber(prev => prev + 1);
        }
    }

    // EFFECT TO GET THE USERS
    useEffect(() => {
        const token = extractTokenFromCookie(document.cookie);
        if (isOn) {
            // GET THE EMPLOYEES
            axios.get(`https://api.easydietkw.com/api/v1/get/all/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    // SET THE USERS IN REDUX
                    dispatch(setUsers({users: res.data.users, usersType: 'employees'}))
                })
                .catch(err => console.log(err))

        } else {
            // GET THE USERS
            axios.get(`https://api.easydietkw.com/api/v1/all/clients`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    page: pageNumber || 1
                }
            })
                .then(res => {
                    setHasNextPage(res.data.data.hasNextPage);
                    setHasPrevPage(res.data.data.hasPreviousPage);
                    // SET THE USERS IN REDUX
                    dispatch(setUsers({users: res.data.data.clients, usersType: 'clients'}))
                    // SET THE REMAINING DAYS FOR EVERY USER (CLIENT) IN LOCAL STATE INSTEAD OF REDUX BECAUSE IT IS UPDATED LATELY
                    setRemainingDays(res.data.data.remainingDays)
                })
                .catch(err => console.log(err))
        }
    }, [isOn, dispatch, pageNumber]);

    // HANDLER TO CLOSE THE MODEL
    const handleUserModelClose = () => {
        setClientData({
            personalData: null,
            subscriptionData: null,
        })
    }

    const showUserDataHandler = (ID) => {
        // GET THE USER DATA
        const token = extractTokenFromCookie(document.cookie);

        // GET THE CLIENT DATA
        axios.get(`https://api.easydietkw.com/api/v1/client/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                clientId: ID
            }
        })
            .then(res => {
                setClientData({
                    personalData: res.data.clientData,
                    subscriptionData: {
                        plan: res.data.bundleName,
                        planEn: res.data.bundleNameEn,
                        startDate: res.data.startDate,
                        endDate: res.data.endDate,
                        remainingDays: res.data.remainingDays,
                    },
                })
            })
            .catch(err => console.log(err))

        // GET ALL BUNDLES
        axios.get(`https://api.easydietkw.com/api/v1/get/bundles`, {
            headers: {
                Authorization: `Bearer ${extractTokenFromCookie(document.cookie)}`
            }
        })
            .then(res => {
                setBundles(res.data.bundles)
            })
            .catch(err => {
                console.log(err)
                toast.error(i18n.language.includes('en') ? 'Something went wrong, please try again later' : 'حدث خطأ ما، يرجى المحاولة مرة أخرى')
            })
    }

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Users</title>
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
                <div className={classes.Container}>
                    <div className={classes.Top}>
                        <button
                            onClick={() => isOn ? router.push(`/admin/create/create_employee`) : router.push(`/admin/create/create_user`)}>
                            <Image src={'/images/Add_Icon.svg'} alt={'Add Icon'} width={18} height={18}/>
                            <span>{isOn ? t("createEmployee") : t("createClient")}</span>
                        </button>
                        <div className={classes.Toggle_container}>
                            <span onClick={checkClients}>{t("clients")}</span>
                            <div className={classes.UserToggler}>
                                <label htmlFor={'users_type'}
                                       className={[classes.toggle_container, isOn ? classes.Employees : ''].join(' ')}>
                                </label>
                                <input
                                    id={'users_type'}
                                    type="checkbox"
                                    name="toggle"
                                    checked={isOn}
                                    onChange={handleClick}
                                />
                            </div>
                            <span onClick={checkEmployees}>{t("employees")}</span>
                        </div>
                        {usersType === "clients" && (
                            <div className={classes.Search}>
                                <button onClick={handleSearch}>
                                    <Image src={'/images/Search_Icon.svg'} alt={'Add Icon'} width={18} height={18}/>
                                </button>
                                <input ref={searchInputRef} type={'text'} alt={'search'} placeholder={'search'}/>
                            </div>)}
                    </div>
                    <div className={classes.Bottom}>
                        {usersType === "clients" &&
                            <table className={classes.table}>
                                <thead>
                                <tr>
                                    <th>{i18n.language.includes('en') ? `MEMBERSHIP ID` : `رقم العضوية`}</th>
                                    <th>{i18n.language.includes('en') ? `FULL NAME` : `الاسم`}</th>
                                    <th>{i18n.language.includes('en') ? `MOBILE` : `رقم الهاتف`}</th>
                                    <th>{i18n.language.includes('en') ? `STATUS` : `الحالة`}</th>
                                    <th>{i18n.language.includes('en') ? `REMAINING` : `المتبقي`}</th>
                                    <th>{i18n.language.includes('en') ? `ACTIONS` : `إجراءات`}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users && users.map((user, index) => {
                                    return (
                                        <tr className={classes.row} key={user._id}>
                                            <td>{user.subscriptionId}</td>
                                            <td className={classes.ClientName}>{user.clientNameEn || user.clientName}
                                                <span onClick={() => {
                                                    setClientEditId(user._id)
                                                }}><Image
                                                    src={'/images/Edit_Icon.svg'} alt={'Edit'} width={20} height={20}/> </span>
                                            </td>
                                            <td>{user.phoneNumber}</td>
                                            <td><span
                                                className={[classes.SubscriptionButton, user.subscriped ? classes.Active : classes.Inactive].join(' ')}>{user.subscriped ? `Active` : 'Inactive'}</span>
                                            </td>
                                            <td>
                                                <span
                                                    className={[remainingDays[index] === 0 ? classes.RedBG : (remainingDays[index] <= 5 ? classes.OrangeBG : classes.GreenBG)]}>
                                                    {remainingDays && remainingDays[index]}
                                                </span>
                                            </td>
                                            <td className={classes.Actions}>
                                                <button className={classes.Freeze}
                                                        onClick={() => {
                                                            if (user.clientStatus.paused !== true && user.clientStatus.numPause > 0) {
                                                                handleFreeze(user._id, user.isActive)
                                                            } else {
                                                                handleUnfreeze(user._id)
                                                            }
                                                        }}>
                                                    {user.clientStatus.paused ? t("unfreeze") : t("freeze")}

                                                </button>
                                                <button className={classes.Delete}
                                                        onClick={() => handleDelete(user._id)}>
                                                    <Image src={'/images/Delete_Icon.svg'} alt={'Delete'} width={14}
                                                           height={14}/> {t("delete")}
                                                </button>
                                                <button className={classes.UserData}
                                                        onClick={() => showUserDataHandler(user._id)}>
                                                    <Image src={'/images/user.svg'} alt={'User Data'} width={14}
                                                           height={14}/>
                                                    <span>{i18n.language.includes('en') ? `More Data` : `تفاصيل المشترك`}</span>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>}
                        {usersType === "employees" &&
                            <table className={[classes.table, classes.tableEmployees].join(' ')}>
                                <thead>
                                <tr>
                                    <th>IMAGE</th>
                                    <th>NAME</th>
                                    <th>USERNAME</th>
                                    <th>MOBILE</th>
                                    <th>ROLE</th>
                                    <th>ACTIONS</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users && users.map((user) => {
                                    return (
                                        <tr className={classes.row} key={user._id}>
                                            <td>
                                                <div className={classes.UserImage}>
                                                    <Image src={`${user.userImage || '/images/no_image.webp'}`}
                                                           alt={'User Image'} width={40} height={40}/>
                                                </div>
                                            </td>
                                            <td>{user.fullName}</td>
                                            <td>{user.username}</td>
                                            <td>{user.phoneNumber}</td>
                                            <td><span
                                                className={classes.SubscriptionButton}>{user.role}</span>
                                            </td>
                                            <td className={classes.Actions}>
                                                <button className={classes.Edit}
                                                        onClick={() => router.push(`/admin/edit/edit_employee?ID=${user._id}`)}>{t("edit")}
                                                </button>
                                                <button className={classes.Deactivate} onClick={() => {
                                                    employeeStatusChangeHandler(user._id, user.isActive)
                                                }}>{user.isActive ? t("deactivate") : t("activate")}</button>
                                                <button className={classes.Delete} onClick={() => {
                                                    employeeDeleteHandler(user._id)
                                                }}>
                                                    <Image src={'/images/Delete_Icon.svg'} alt={'Delete'} width={14}
                                                           height={14}/> {t("delete")}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>}
                    </div>
                    {(hasNextPage || hasPrevPage) && (
                        <div className={classes.Table_Pagination}>
                            <button onClick={prevPage} disabled={!hasPrevPage} title={String(pageNumber - 1)}>
                                <Image src={'/images/Arrow-Left_Icon.svg'} alt={'Arrow Left'} width={15}
                                       height={15}/>
                            </button>
                            <button onClick={nextPage} disabled={!hasNextPage} title={String(pageNumber + 1)}>
                                <Image src={'/images/Arrow-Right_Icon.svg'} alt={'Arrow Right'} width={15}
                                       height={15}/>
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Overlay active={clientEditId.length > 5} clicked={clearTheIdOfUser}>
                <InputsContainer clientId={clientEditId} clicked={clearTheIdOfUser}/>
            </Overlay>
            <Overlay active={(clientData.personalData !== null && clientData.subscriptionData !== null)}
                     clicked={handleUserModelClose}>
                <UserDataSection userData={clientData.personalData} subscriptionData={clientData.subscriptionData}
                                 bundles={bundles}/>
            </Overlay>
        </>
    )
}
export default Users

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