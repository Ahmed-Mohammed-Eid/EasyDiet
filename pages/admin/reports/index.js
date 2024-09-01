import { useState } from "react";
import classes from "@/styles/pages/admin/reports.module.scss";
import Head from "next/head";
import Image from "next/image";
// IMPORT
import CustomSelectReports from "@/components/pages/dashboard/custom-select-reports";
import Spinner from "@/components/layout/spinner/Spinner";
// HELPERS
import axios from "axios";
import { toast } from "react-toastify";
import { extractTokenFromCookie } from "@/helpers/extractToken";
// LANGUAGE
import { useTranslation } from "react-i18next";

const Reports = ({ role }) => {
    // LANGUAGE
    const { t } = useTranslation("reports");

    // STATES
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = useState("");
    const [reportStartDate, setReportStartDate] = useState("");
    const [reportEndDate, setReportEndDate] = useState("");

    // SUBMIT FORM
    const submitForm = (e) => {
        // PREVENT DEFAULT
        e.preventDefault();

        // GET THE TOKEN
        const token = extractTokenFromCookie(document.cookie);

        // CHECK IF THE TYPE IS SELECTED
        if (!reportType) {
            toast.error("please select a report type");
            return;
        }

        if (
            (reportType === "kitchenMeals" ||
                reportType === "paymentHistory") &&
            !reportStartDate
        ) {
            toast.error("please select a start date");
            return;
        }

        if (reportType === "paymentHistory" && !reportEndDate) {
            toast.error("please select an end date");
            return;
        }

        // SET LOADING
        setLoading(true);

        // SET DYNAMIC URL BASED ON THE ROLE
        let url = `https://api.easydietkw.com/api/v1/report`;
        if (role === "manager") {
            url = `https://api.easydietkw.com/api/v1/manager/active/clients`;
        }

        // SEND FORM DATA TO THE SERVER
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    reportName: reportType,
                    dateFrom: reportStartDate || "",
                    dateTo: reportEndDate || "",
                },
            })
            .then((res) => {
                
                setTimeout(() => {
                    // OPEN THE URL IN A NEW TAB
                    window.open(res.data?.url, "_blank");
                    setLoading(false);
                }, 1000);
            })
            .catch((err) => {
                setLoading(false);
                toast.error(
                    err.response?.data?.message || "something went wrong"
                );
            });
    };

    return (
        <>
            {/*SEO OPTIMIZATION*/}
            <Head>
                <title>EasyDiet | Reports</title>
                <meta
                    name="description"
                    content="Discover EasyDiet's healthy meal options that have been satisfying customers for over five years. Our experienced chefs prepare each meal with fresh, locally-sourced ingredients to ensure that you get the best quality and flavor. Choose EasyDiet for convenient and delicious meals that leave you feeling energized and healthy."
                />
                <meta
                    name="keywords"
                    content="healthy meals, meal delivery, fresh ingredients, locally-sourced, convenient meal options, energy-boosting, nutritious food, easy ordering, delicious and healthy, meal plans"
                />
                <meta name="author" content="EasyDiet" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="robots" content="index, follow" />
                <meta
                    httpEquiv="Content-Type"
                    content="text/html; charset=utf-8"
                />
                <meta name="language" content="English" />
                <meta name="revisit-after" content="2 days" />
                <meta name="generator" content="EasyDiet" />
                <meta name="og:title" content="EasyDiet" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://easydietkw.com/" />
                <meta property="og:image" content="/easyDietLogo.png" />
                <meta property="og:site_name" content="EasyDiet" />
                <meta
                    property="og:description"
                    content="EasyDiet has been offering healthy meal options for over 5 years. With a diverse menu of delicious and locally-sourced ingredients, their experienced chefs provide convenient and energizing meals. Experience a healthier lifestyle with EasyDiet."
                />
            </Head>
            <main className={classes.Main}>
                <div className={classes.FormContainer}>
                    <h1>{t("title")}</h1>
                    <form onSubmit={submitForm}>
                        <div className={classes.InputsContainer}>
                            <div
                                className={[
                                    classes.InputGroup,
                                    classes.MultiSelect,
                                ].join(" ")}
                            >
                                <label htmlFor={"user_role"}>{t("type")}</label>
                                <CustomSelectReports
                                    changed={(values) =>
                                        setReportType(values.value)
                                    }
                                    defaultValue={reportType}
                                />
                            </div>
                        </div>
                        {reportType !== "active clients" && (
                            <div className={classes.InputsContainer}>
                                {(reportType === "kitchenMeals" ||
                                    reportType === "paymentHistory") && (
                                    <div className={classes.InputGroup}>
                                        <label htmlFor={"report_start_date"}>
                                            {t("start")}
                                        </label>
                                        <input
                                            type={"date"}
                                            name={"report_start_date"}
                                            id={"report_start_date"}
                                            value={reportStartDate}
                                            onChange={(e) =>
                                                setReportStartDate(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                )}
                                {reportType !== "kitchenMeals" &&
                                    reportType && (
                                        <div className={classes.InputGroup}>
                                            <label htmlFor={"report_end_date"}>
                                                {t("end")}
                                            </label>
                                            <input
                                                type={"date"}
                                                name={"report_end_date"}
                                                id={"report_end_date"}
                                                value={reportEndDate}
                                                onChange={(e) =>
                                                    setReportEndDate(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                            </div>
                        )}
                        <button type={"submit"}>
                            <span>
                                {loading ? (
                                    <Spinner size={2} color={`#ffffff`} />
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
                    </form>
                </div>
            </main>
        </>
    );
};
export default Reports;

export const getServerSideProps = async (ctx) => {
    // GET THE TOKEN FROM THE REQUEST
    const { token } = ctx.req.cookies;

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
        (tokenInfo.role !== "admin" && tokenInfo.role !== "manager") ||
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
        props: { role: tokenInfo.role },
    };
};
