import classes from './Aside.module.scss';
import Link from "next/link";
import Image from "next/image";
// LANGUAGES
import i18n from "@/i18n";
import {useTranslation} from "react-i18next";

// HELPERS
import {useRouter} from "next/router";

const Aside = ({isAuthenticated, userData}) => {
    //ROUTER
    const router = useRouter();

    // MULTI LANGUAGES
    const {t} = useTranslation('aside');

    // Helpers Functions
    const toggleLanguage = () => {
        let htmlTag;
        let bodyTag;
        if (document) {
            htmlTag = document.querySelector('html');
            bodyTag = document.body;
        }

        if (i18n.language.includes('en')) {
            if (htmlTag) {
                htmlTag.setAttribute('lang', 'ar');
                htmlTag.setAttribute('dir', 'rtl');
                bodyTag.classList.add('ARABIC');
            }
            i18n.changeLanguage('ar')
        } else {
            if (htmlTag) {
                htmlTag.setAttribute('lang', 'en')
                htmlTag.setAttribute('dir', 'ltr');
                bodyTag.classList.remove('ARABIC');
            }
            i18n.changeLanguage('en');
        }
    }

    // LOGOUT HANDLER
    const logoutHandler = (event) => {
        event.preventDefault();
        // Clear the cookie by setting its value to an empty string and an expiry date in the past
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });        // Redirect to another page
        router.push('/auth/login').then(() => {
            window.location.reload()
        })
    }

    // Handle the aside
    function handleResize() {
        if (window.innerWidth > 1440) {
            if (!document.body.classList.contains("Active_Aside")) {
                document.body.classList.add("Active_Aside");
            }
        } else {
            document.body.classList.remove("Active_Aside");
            document.body.style.height = "auto";
            document.body.style.overflow = "visible";
        }
    }

    return (<aside className={classes.Aside} id={`AsideId`}>
        <div className={classes.Aside_Options}>
            <button onClick={toggleLanguage}>
                {i18n?.language && i18n.language.includes('en') ? (
                    <>
                        <Image src={'/images/Arabic_Icon.svg'} alt={'Arabic icon'} width={30} height={20}/>
                        <span style={{fontFamily: `var(--font-almarai)`}}>العربية</span>
                    </>
                ) : (
                    <>
                        <Image src={'/images/English_Icon.svg'} alt={'Arabic icon'} width={30} height={20}/>
                        <span>ENGLISH</span>
                    </>
                )}
            </button>
        </div>

        <ul className={classes.Aside_List}>
            {(<li className={classes.Aside_List__Item}>
                <Link onClick={handleResize} href={'/'} className={router.pathname === '/' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/Home_Icon.svg'} alt={'Icon'} width={30} height={20}/>
                        </span>
                    <span className={classes.Text}>{t('home')}</span>
                </Link></li>)}
            {(<li className={classes.Aside_List__Item}>
                <Link onClick={handleResize} href={'/about'}
                      className={router.pathname === '/about' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/About_Icon.svg'} alt={'Icon'} width={30} height={20}/>
                        </span>
                    <span className={classes.Text}>{t('about')}</span>
                </Link></li>)}
            {(<li className={classes.Aside_List__Item}>
                <Link onClick={handleResize} href={'/user/packages'}
                      className={router.pathname === '/user/packages' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/Packages_Icon.svg'} alt={'Icon'} width={20} height={20}/>
                        </span>
                    <span className={classes.Text}>{t('bundles')}</span>
                </Link></li>)}
            {(<li className={classes.Aside_List__Item}>
                <Link onClick={handleResize} href={'/user/menu'}
                      className={router.pathname === '/user/menu' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/Meals_Icon.svg'} alt={'Icon'} width={30} height={20}/>
                        </span>
                    <span className={classes.Text}>{t('menu')}</span>
                </Link></li>)}
            {(isAuthenticated && userData?.decodedToken?.role === "client") && (
                <li className={classes.Aside_List__Item}>
                    <Link onClick={handleResize} href={'/user/profile'}
                          className={router.pathname === '/user/profile' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/Users_Icon.svg'} alt={'Icon'} width={30} height={20}/>
                        </span>
                        <span className={classes.Text}>{t('profile')}</span>
                    </Link></li>)}
            {(isAuthenticated && userData?.decodedToken?.role === "client") && (
                <li className={classes.Aside_List__Item}>
                    <Link onClick={handleResize} href={'/user/my_subscription'}
                          className={router.pathname === '/user/my_subscription' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/Subscription_Icon.svg'} alt={'Icon'} width={20} height={20}/>
                        </span>
                        <span className={classes.Text}>{t('mySubscription')}</span>
                    </Link></li>)}
            {(isAuthenticated && userData?.decodedToken?.role === "client") && (
                <li className={classes.Aside_List__Item}>
                    <Link onClick={handleResize} href={'/user/nutrition_specialist'}
                          className={router.pathname === '/user/nutrition_specialist' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/Doctor_Icon.svg'} alt={'Icon'} width={30} height={20}/>
                        </span>
                        <span className={classes.Text}>{t('NutritionSpecialist')}</span>
                    </Link></li>)}
            {(isAuthenticated && userData?.decodedToken?.role === "diet specialist") && (
                <li className={classes.Aside_List__Item}>
                    <Link onClick={handleResize} href={'/doctor'}
                          className={router.pathname === '/doctor' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/dashboard.png'} alt={'Icon'} width={20} height={20}/>
                        </span>
                        <span className={classes.Text}>{t('dashboard')}</span>
                    </Link></li>)}
            {(isAuthenticated && userData?.decodedToken?.role === "admin") && (<li className={classes.Aside_List__Item}>
                <Link onClick={handleResize} href={'/admin/dashboard'}
                      className={router.pathname === '/admin/dashboard' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/dashboard.png'} alt={'Icon'} width={20} height={20}/>
                        </span>
                    <span className={classes.Text}>{t('dashboard')}</span>
                </Link></li>)}
            {(isAuthenticated && userData?.decodedToken?.role === "admin") && (<li className={classes.Aside_List__Item}>
                <Link onClick={handleResize} href={'/admin/packages'}
                      className={router.pathname === '/admin/packages' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/Packages_Icon.svg'} alt={'Icon'} width={20} height={20}/>
                        </span>
                    <span className={classes.Text}>{t('packages')}</span>
                </Link></li>)}
            {(isAuthenticated && userData?.decodedToken?.role === "admin") && (<li className={classes.Aside_List__Item}>
                <Link onClick={handleResize} href={'/admin/meals'}
                      className={router.pathname === '/admin/meals' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/Meals_Icon.svg'} alt={'Icon'} width={30} height={20}/>
                        </span>
                    <span className={classes.Text}>{t('meals')}</span>
                </Link></li>)}
            {(isAuthenticated && userData?.decodedToken?.role === "admin") && (<li className={classes.Aside_List__Item}>
                <Link onClick={handleResize} href={'/admin/users'}
                      className={router.pathname === '/admin/users' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/Users_Icon.svg'} alt={'Icon'} width={30} height={20}/>
                        </span>
                    <span className={classes.Text}>{t('users')}</span>
                </Link></li>)}
            {(isAuthenticated && (userData?.decodedToken?.role === "manager" || userData?.decodedToken?.role === "admin")) && (
                <li className={classes.Aside_List__Item}>
                    <Link onClick={handleResize} href={'/admin/branch'}
                          className={router.pathname === '/admin/branch' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/branch.png'} alt={'Icon'} width={30} height={20}/>
                        </span>
                        <span className={classes.Text}>{t('branchManager')}</span>
                    </Link></li>)}
            {(isAuthenticated && (userData?.decodedToken?.role === "manager" || userData?.decodedToken?.role === "admin")) && (
                <li className={classes.Aside_List__Item}>
                    <Link onClick={handleResize} href={'/admin/defaultmeals'}
                          className={router.pathname === '/admin/defaultmeals' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/defaultmeals.png'} alt={'Icon'} width={20} height={20}/>
                        </span>
                        <span className={classes.Text}>{t('defaultMeals')}</span>
                    </Link></li>)}
            {(isAuthenticated && (userData?.decodedToken?.role === "manager" || userData?.decodedToken?.role === "admin")) && (
                <li className={classes.Aside_List__Item}>
                    <Link onClick={handleResize} href={'/admin/custom_packages_meals'}
                          className={router.pathname === '/admin/custom_packages_meals' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/defaultmeals.png'} alt={'Icon'} width={20} height={20}/>
                        </span>
                        <span className={classes.Text}>{i18n.language.includes('en') ? `Daily Menu` : `الوجبات اليومية`}</span>
                    </Link></li>)}
            {(isAuthenticated && (userData?.decodedToken?.role === "manager" || userData?.decodedToken?.role === "admin")) && (
                <li className={classes.Aside_List__Item}>
                    <Link onClick={handleResize} href={'/admin/reports'}
                          className={router.pathname === '/admin/reports' ? classes.Active : ''}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/Reports_Icon.svg'} alt={'Icon'} width={30} height={20}/>
                        </span>
                        <span className={classes.Text}>{t('reports')}</span>
                    </Link></li>)}
            {isAuthenticated ? (<li className={classes.Aside_List__Item}>
                <Link onClick={(event) => {
                    logoutHandler(event);
                    handleResize();
                }} href={'/auth/login'} className={classes.ActiveLogout}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/Logout_Icon.svg'} alt={'Icon'} width={30} height={20}/>
                        </span>
                    <span className={[classes.Logout_Text, classes.Text].join(' ')}>{t('logout')}</span>
                </Link></li>) : (<li className={classes.Aside_List__Item}>
                <Link onClick={handleResize} href={'/auth/login'} className={classes.Aside_List__Item}>
                        <span className={classes.Image_Container}>
                            <Image src={'/images/login.png'} alt={'Icon'} width={20} height={20}/>
                        </span>
                    <span className={[classes.Text]}>{t('Login')}</span>
                </Link></li>)}
        </ul>
    </aside>)
}
export default Aside;