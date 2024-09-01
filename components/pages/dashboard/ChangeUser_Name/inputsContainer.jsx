// ChangeUserData.js
import {useState, useEffect} from 'react';
import classes from './inputsContainer.module.scss';
// HELPERS
import {extractTokenFromCookie} from "@/helpers/extractToken";
import axios from "axios";
import {toast} from "react-toastify";
// LANGUAGE
import {useTranslation} from "react-i18next";
import EditUserGenderSelect from "@/components/pages/dashboard/editUserGenderSelect";
import CustomSelectGovernate from "@/components/pages/register/custom-select-governate";
import CustomSelectRegion from "@/components/pages/register/custom-select-region";

const ChangeUserData = ({clientId, clicked}) => {

    // LANGUAGE
    const {t} = useTranslation('managePages')

    const [userData, setUserData] = useState({
        fullName: '',
        phone: '',
        governorate: '',
        region: '',
        gender: '',
        street: '',
        house: '',
        floor: '',
        apartment: '',
        apartmentNumber: ''
    });

    // EFFECT TO GET THE USER DATA
    useEffect(() => {
            // GET THE USER DATA
            const token = extractTokenFromCookie(document.cookie);

            if(!token) return;
            if(!clientId) return;

            // GET THE CLIENT DATA
            axios.get(`https://api.easydietkw.com/api/v1/client/details`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params:{
                    clientId: clientId
                }
            })
                .then(res => {
                    setUserData({
                        fullName: res.data.clientData?.clientName,
                        phone: res.data?.clientData?.phoneNumber,
                        governorate: res.data?.clientData?.governorate,
                        region: res.data?.clientData?.distrect,
                        gender: res.data?.clientData?.gender,
                        street: res.data?.clientData?.streetName,
                        house: res.data?.clientData?.homeNumber,
                        floor: res.data?.clientData?.floorNumber || '',
                        apartment: res.data?.clientData?.appartment|| '',
                        apartmentNumber: res.data?.clientData?.appartmentNo || '',
                    })
                })
                .catch(err => console.log(err))
    }, [clientId])

    // EFFECT TO CLEAR THE INPUTS ON CLOSE
    useEffect(() => {
        if(!clicked) return;
        setUserData({
            fullName: '',
            phone: '',
            governorate: "",
            region: '',
            gender: '',
            street: '',
            house: '',
            floor: '',
            apartment: '',
        })
    }, [clicked])

    const handleSubmit = (event) => {
        event.preventDefault();
        // Do something with the new first name and last name
        const token = extractTokenFromCookie(document.cookie);

        if(!token) return;
        if(!clientId) {
            toast.error('No Client Id Found');
            return;
        }

        const {fullName, phone, street, house, floor, apartment} = userData;

        if(!fullName || !phone || !street || !house || !floor ) {
            toast.error('Please Fill All The Fields');
            return;
        }

        try {
            // GET THE EMPLOYEES
            axios.put(`https://api.easydietkw.com/api/v1/edit/client/profile`, {
                clientNameEn: fullName,
                phoneNumber: phone,
                governorate: userData?.governorate,
                distrect: userData?.region,
                gender: userData?.gender,
                streetName: street,
                homeNumber: house,
                floorNumber: floor,
                appartment: apartment,
                appartmentNo: userData?.apartmentNumber,
                clientId: clientId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(_ => {
                    // HIDE THE OVERLAY AND MODEL
                    clicked();
                    // SHOW A NOTIFICATION
                    toast.success(`Client Data Changed Successfully`);
                })
                .catch(err => {
                    toast.error(err.response?.data?.message || err.message);
                })
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    return (
        <form className={classes.change_name_form} onSubmit={handleSubmit}>
            <div className={classes.InputGroup}>
                <label htmlFor="fullName">{t("fullName")}</label>
                <input type="text" id="fullName" value={userData?.fullName} onChange={(event) => {
                    setUserData({...userData, fullName: event.target.value})
                }}/>
            </div>
            <div className={classes.InputGroup}>
                <label htmlFor="phone">{t("phone")}</label>
                <input type="text" id="phone" value={userData?.phone} onChange={(event) => {
                    setUserData({...userData, phone: event.target.value})
                }}/>
            </div>
            <div className={[classes.InputGroup, classes.InputGroup__full, classes.select_full].join(' ')}>
                <label htmlFor="GENDER">{t("GENDER")}</label>
                <EditUserGenderSelect
                    changed={(event) => {
                        setUserData({
                            ...userData,
                            gender: event.value
                        })
                    }}
                    defaultValue={userData?.gender}
                />
            </div>
            <div className={classes.InputGroup}>
                <label htmlFor="GOVERNORATE">{t("GOVERNORATE")}</label>
                <CustomSelectGovernate
                    changed={(event) => {
                        setUserData({
                            ...userData,
                            governorate: event.value
                        })
                    }}
                    defaultValue={userData?.governorate}
                    placeholder={t("GOVERNORATE")}
                />
            </div>
            <div className={classes.InputGroup}>
                <label htmlFor="REGION">{t("REGION")}</label>
                <CustomSelectRegion
                    changed={(event) => {
                        setUserData({
                            ...userData,
                            region: event.value
                        })
                    }}
                    defaultValue={userData?.region}
                    placeholder={t("REGION")}
                    linkedSelectValue={userData?.governorate}
                />
            </div>
            <div className={classes.InputGroup}>
                <label htmlFor="STREET">{t("BLOCK")}</label>
                <input type="text" id="STREET" value={userData?.street} onChange={(event) => {
                    setUserData({...userData, street: event.target.value})
                }}/>
            </div>
            <div className={classes.InputGroup}>
                <label htmlFor="HOUSE">{t("STREET")}</label>
                <input type="text" id="HOUSE" value={userData?.house} onChange={(event) => {
                    setUserData({...userData, house: event.target.value})
                }}/>
            </div>
            <div className={classes.InputGroup}>
                <label htmlFor="FLOOR">{t("HOUSE")}</label>
                <input type="text" id="FLOOR" value={userData?.floor} onChange={(event) => {
                    setUserData({...userData, floor: event.target.value})
                }}/>
            </div>
            <div className={classes.InputGroup}>
                <label htmlFor="APARTMENT">{t("FLOOR")}</label>
                <input type="text" id="APARTMENT" value={userData?.apartment} onChange={(event) => {
                    setUserData({...userData, apartment: event.target.value})
                }}/>
            </div>
            <div className={classes.InputGroup} style={{width: '100%'}}>
                <label htmlFor="APARTMENT">{t("APARTMENT")}</label>
                <input type="text" id="APARTMENT" value={userData?.apartmentNumber} onChange={(event) => {
                    setUserData({...userData, apartmentNumber: event.target.value})
                }}/>
            </div>
            <button type="submit">{t("saveBtn")}</button>
        </form>
    );
};

export default ChangeUserData;
