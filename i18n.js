import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                aside: require('./locales/en/aside.json'),
                home: require('./locales/en/pages/home.json'),
                about: require('./locales/en/pages/about.json'),
                packageCard: require('./locales/en/packageCard.json'),
                license: require('./locales/en/pages/license.json'),
                // AUTHENTICATION
                login: require('./locales/en/pages/login.json'),
                register: require('./locales/en/pages/register.json'),
                newPassword: require('./locales/en/pages/newPassword.json'),
                resetPassword: require('./locales/en/pages/resetPassword.json'),
                verifyEmail: require('./locales/en/pages/verifyEmail.json'),
                // USER
                paymentMethod: require('./locales/en/pages/user/paymentMethod.json'),
                chooseDayMeals: require('./locales/en/pages/user/chooseDayMeals.json'),
                chooseStartingDate: require('./locales/en/pages/user/chooseStartingDay.json'),
                menu: require('./locales/en/pages/user/menu.json'),
                myStatus: require('./locales/en/pages/user/myStatus.json'),
                mySubscription: require('./locales/en/pages/user/mySubscription.json'),
                nutrition_specialist: require('./locales/en/pages/user/nutrition_specialist.json'),
                bundles: require('./locales/en/pages/user/bundles.json'),
                profile: require('./locales/en/pages/user/profile.json'),
                send_message: require('./locales/en/pages/user/send_message.json'),
                user_global: require('./locales/en/pages/user/globalText.json'),
                // DOCTOR
                doctor: require('./locales/en/pages/doctor/doctor.json'),
                //ADMIN
                dashboard: require('./locales/en/pages/admin/dashboard.json'),
                managePages: require('./locales/en/pages/admin/managePages.json'),
                createPackage: require('./locales/en/pages/admin/createPackage.json'),
                editPackage: require('./locales/en/pages/admin/editPackage.json'),
                createMeal: require('./locales/en/pages/admin/createMeal.json'),
                editMeal: require('./locales/en/pages/admin/editMeal.json'),
                createEmployee: require('./locales/en/pages/admin/createEmployee.json'),
                editEmployee: require('./locales/en/pages/admin/editEmployee.json'),
                createClient: require('./locales/en/pages/admin/createClient.json'),
                defaultMeals: require('./locales/en/pages/admin/defaultMeals.json'),
                reports: require('./locales/en/pages/admin/reports.json'),
                branch: require('./locales/en/pages/admin/branchManager.json'),
            },
            ar: {
                aside: require('./locales/ar/aside.json'),
                home: require('./locales/ar/pages/home.json'),
                about: require('./locales/ar/pages/about.json'),
                packageCard: require('./locales/ar/packageCard.json'),
                license: require('./locales/ar/pages/license.json'),
                // AUTHENTICATION
                login: require('./locales/ar/pages/login.json'),
                register: require('./locales/ar/pages/register.json'),
                newPassword: require('./locales/ar/pages/newPassword.json'),
                resetPassword: require('./locales/ar/pages/resetPassword.json'),
                verifyEmail: require('./locales/ar/pages/verifyEmail.json'),
                // USER
                paymentMethod: require('./locales/ar/pages/user/paymentMethod.json'),
                chooseDayMeals: require('./locales/ar/pages/user/chooseDayMeals.json'),
                chooseStartingDate: require('./locales/ar/pages/user/chooseStartingDay.json'),
                menu: require('./locales/ar/pages/user/menu.json'),
                myStatus: require('./locales/ar/pages/user/myStatus.json'),
                mySubscription: require('./locales/ar/pages/user/mySubscription.json'),
                nutrition_specialist: require('./locales/ar/pages/user/nutrition_specialist.json'),
                bundles: require('./locales/ar/pages/user/bundles.json'),
                profile: require('./locales/ar/pages/user/profile.json'),
                send_message: require('./locales/ar/pages/user/send_message.json'),
                user_global: require('./locales/ar/pages/user/globalText.json'),
                // DOCTOR
                doctor: require('./locales/ar/pages/doctor/doctor.json'),
                //ADMIN
                dashboard: require('./locales/ar/pages/admin/dashboard.json'),
                managePages: require('./locales/ar/pages/admin/managePages.json'),
                createPackage: require('./locales/ar/pages/admin/createPackage.json'),
                editPackage: require('./locales/ar/pages/admin/editPackage.json'),
                createMeal: require('./locales/ar/pages/admin/createMeal.json'),
                editMeal: require('./locales/ar/pages/admin/editMeal.json'),
                createEmployee: require('./locales/ar/pages/admin/createEmployee.json'),
                editEmployee: require('./locales/ar/pages/admin/editEmployee.json'),
                createClient: require('./locales/ar/pages/admin/createClient.json'),
                defaultMeals: require('./locales/ar/pages/admin/defaultMeals.json'),
                reports: require('./locales/ar/pages/admin/reports.json'),
                branch: require('./locales/ar/pages/admin/branchManager.json'),
            },
        },
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
