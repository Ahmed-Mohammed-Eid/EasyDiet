// UserDataSection.js

import React from 'react';
import styles from './UserDataSection.module.scss';
import i18n from "@/i18n";
import Image from "next/image";
import axios from "axios";
import {extractTokenFromCookie} from "@/helpers/extractToken";
import {toast} from "react-toastify";
import Spinner from "@/components/layout/spinner/Spinner";

const UserDataSection = ({userData, subscriptionData, bundles}) => {
    const [loading, setLoading] = React.useState(false);
    const [subscription, setSubscription] = React.useState(null);
    const [renewLoader, setRenewLoader] = React.useState(false);
    const [selectedPackageForRenew, setSelectedPackageForRenew] = React.useState(null);


    const handlePrint = () => {
        const token = extractTokenFromCookie(document.cookie);
        setLoading(true);
        axios.get(`https://api.easydietkw.com/api/v1/print/client/contract`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                clientId: userData?._id
            }
        })
            .then(res => {
                const url = res.data.url;
                setTimeout(() => {

                    window.open(url, '_blank');
                    setLoading(false);
                }, 1000)
            })
            .catch(err => {
                console.log(err)
                setLoading(false);
                toast.error(i18n.language.includes('en') ? 'Something went wrong, please try again later' : 'حدث خطأ ما، يرجى المحاولة مرة أخرى')
            })
    }


    // GET SUBSCRIPTION HISTORY
    const getSubscriptionHistory = (ID) => {
        // GET THE USER DATA
        const token = extractTokenFromCookie(document.cookie);

        setSubscription(true)
        // GET THE CLIENT DATA
        axios.get(`https://api.easydietkw.com/api/v1/report?reportName=clientHistory`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                clientId: ID
            }
        })
            .then(res => {
                if (res.data?.url) {
                    const timer = setTimeout(() => {
                        window.open(res.data.url, '_blank');
                        setSubscription(false)
                        clearTimeout(timer)
                    }, 1000);
                } else {
                    setSubscription(false)
                    toast.error(i18n.language.includes('en') ? 'Something went wrong, please try again later' : 'حدث خطأ ما، يرجى المحاولة مرة أخرى')
                }
            })
            .catch(err => {
                setSubscription(false)
                console.log(err)
            })
    }

    // RENEW SUBSCRIPTION
    const renewSubscription = (ID) => {

        if (!selectedPackageForRenew) return toast.error(i18n.language.includes('en') ? 'Please select a package' : 'يرجى اختيار باقة');
        if (!ID) return toast.error(i18n.language.includes('en') ? 'Something went wrong, please try again later' : 'حدث خطأ ما، يرجى المحاولة مرة أخرى');

        setRenewLoader(true)
        axios.post(`https://api.easydietkw.com/api/v1/renew/subscription`, {
            clientId: ID,
            bundleId: selectedPackageForRenew
        }, {
            headers: {
                Authorization: `Bearer ${extractTokenFromCookie(document.cookie)}`
            }
        })
            .then(_ => {
                setRenewLoader(false)
                setSelectedPackageForRenew(null)
                toast.success(i18n.language.includes('en') ? 'Subscription renewed successfully' : 'تم تجديد الاشتراك بنجاح')
            })
            .catch(err => {
                setRenewLoader(false);
                toast.error(i18n.language.includes('en') ? 'Something went wrong, please try again later' : 'حدث خطأ ما، يرجى المحاولة مرة أخرى')
                console.log(err)
            })
    }


    return (
        <div className={styles.container}>
            <div className={[styles.section, styles.buttons].join(' ')}>
                {userData?.subscriped && (<button className={styles.contractButton} onClick={handlePrint}>
                    <Image src={'/images/printer.png'} alt={'Add Icon'} width={18}
                           height={18}/>
                    {i18n.language.includes('en') ? `Print Contract` : `طباعة العقد`}
                    {loading && <Spinner color={'#ffffff'} size={1}/>}
                </button>)}
                {
                    (<button className={[styles.contractButton, styles.previousContracts].join(' ')}
                             onClick={() => {
                                 getSubscriptionHistory(userData?._id);
                             }}>
                        <Image src={'/images/printer.png'} alt={'Add Icon'} width={18}
                               height={18}/>
                        {i18n.language.includes('en') ? `Subscription history` : `سجل الإشتراكات`}
                        {subscription && <Spinner color={'#ffffff'} size={1}/>}
                    </button>)
                }
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionHeader}>{i18n.language.includes('en') ? `Renew:` : `تجديد:`}</h3>
                <div>
                    <select
                        value={selectedPackageForRenew}
                        className={styles.select} onChange={(event) => {
                        setSelectedPackageForRenew(event.target.value)
                    }}>
                        <option
                            value={null}>{i18n.language.includes('en') ? `Select Package` : `اختر الباقة`}</option>
                        {userData?.subscripedBundle?.bundleId && (
                            <option
                                value={userData?.subscripedBundle?.bundleId}>{i18n.language.includes('en') ? `The Same Package` : `نفس الباقة`}</option>)}
                        {bundles?.map(bundle => {
                            return (
                                <option key={bundle._id}
                                        value={bundle._id}>{i18n.language.includes('en') ? bundle.bundleNameEn : bundle.bundleName}</option>
                            )
                        })}
                    </select>
                    <button onClick={() => renewSubscription(userData?._id)} className={styles.renewButton}>
                        {i18n.language.includes('en') ? `Renew` : `تجديد`}
                        {renewLoader && <Spinner color={'#ffffff'} size={1}/>}
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionHeader}>{i18n.language.includes('en') ? `Personal Data:` : `المعلومات الشخصية:`}</h3>
                <ul className={styles.list}>
                    <li>
                        <span
                            className={styles.label}>{i18n.language.includes('en') ? `Full Name:` : `الاسم:`}</span>{' '}
                        <span
                            className={styles.value}>{i18n.language.includes('en') ? (userData?.clientNameEn || userData?.clientName) : userData?.clientName}</span>
                    </li>
                    <li>
                        <span
                            className={styles.label}>{i18n.language.includes('en') ? `Email:` : `البريد الالكتروني:`}</span>{' '}
                        <span className={styles.value}>{userData?.email}</span>
                    </li>
                    <li>
                        <span
                            className={styles.label}>{i18n.language.includes('en') ? `Phone Number:` : `رقم الهاتف:`}</span>{' '}
                        <span className={styles.value}>{userData?.phoneNumber}</span>
                    </li>
                    <li>
                        <span className={styles.label}>{i18n.language.includes('en') ? `Gender:` : `النوع:`}</span>{' '}
                        <span className={styles.value}>{userData?.gender}</span>
                    </li>
                    <li>
                        <span
                            className={styles.label}>{i18n.language.includes('en') ? `Governorate:` : `المحافظة:`}</span>{' '}
                        <span className={styles.value}>{userData?.governorate}</span>
                    </li>
                    <li>
                        <span
                            className={styles.label}>{i18n.language.includes('en') ? `Region:` : `المنطقة:`}</span>{' '}
                        <span className={styles.value}>{userData?.distrect}</span>
                    </li>
                    <li>
                        <span
                            className={styles.label}>{i18n.language.includes('en') ? `Block:` : `القطعة:`}</span>{' '}
                        <span className={styles.value}>{userData?.streetName}</span>
                    </li>
                    <li>
                        <span className={styles.label}>{i18n.language.includes('en') ? `Street:` : `الشارع:`}</span>{' '}
                        <span className={styles.value}>{userData?.homeNumber}</span>
                    </li>
                    <li>
                        <span
                            className={styles.label}>{i18n.language.includes('en') ? `House:` : `المنزل:`}</span>{' '}
                        <span className={styles.value}>{userData?.floorNumber}</span>
                    </li>
                    <li>
                        <span
                            className={styles.label}>{i18n.language.includes('en') ? `Floor:` : `الدور:`}</span>{' '}
                        <span className={styles.value}>{userData?.appartment}</span>
                    </li>
                    <li>
                        <span
                            className={styles.label}>{i18n.language.includes('en') ? `Apartment:` : `الشقة:`}</span>{' '}
                        <span className={styles.value}>{userData?.appartmentNo}</span>
                    </li>
                </ul>
            </div>
            <div className={styles.section}>
                <h3 className={styles.sectionHeader}>{i18n.language.includes('en') ? `Subscription Data:` : `معلومات الاشتراك:`}</h3>
                <ul className={styles.list}>
                    <li>
                        <span
                            className={styles.label}>{i18n.language.includes('en') ? `MEMBERSHIP ID:` : `رقم العضوية:`}</span>{' '}
                        <span className={styles.value}>{userData?.subscriptionId}</span>
                    </li>
                    <li>
                        <span className={styles.label}>{i18n.language.includes('en') ? `Plan:` : `الباقة:`}</span>{' '}
                        <span
                            className={styles.value}>{i18n.language.includes('en') ? subscriptionData?.planEn : subscriptionData?.plan}</span>
                    </li>
                    <li>
                        <span
                            className={styles.label}>{i18n.language.includes('en') ? `Status:` : `الحالة:`}</span>{' '}
                        <span
                            className={styles.value}>{userData?.subscriped ? (i18n.language.includes('en') ? "Subscribed" : "مشترك") : (i18n.language.includes('en') ? "Unsubscribed" : "غير مشترك")}</span>
                    </li>
                    <li>
                        <span
                            className={styles.label}>{i18n.language.includes('en') ? `Starting Date:` : `تاريخ الابتداء:`}</span>{' '}
                        <span
                            className={styles.value}>{new Date(subscriptionData?.startDate).toLocaleDateString(i18n.language.includes('en') ? "en-US" : "ar-EG", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </li>
                    <li>
                        <span
                            className={styles.label}>{i18n.language.includes('en') ? `End Date:` : `تاريخ الانتهاء:`}</span>{' '}
                        <span
                            className={styles.value}>{new Date(subscriptionData?.endDate).toLocaleDateString(i18n.language.includes('en') ? "en-US" : "ar-EG", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </li>
                    <li>
                        <span
                            className={styles.label}>{i18n.language.includes('en') ? `Remaining Days:` : `الايام المتبقية:`}</span>{' '}
                        <span className={styles.value}>{subscriptionData?.remainingDays}</span>
                    </li>
                </ul>
            </div>
        </div>
    )
        ;
};

export default UserDataSection;
