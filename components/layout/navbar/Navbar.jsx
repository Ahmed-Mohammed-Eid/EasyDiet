import {useEffect} from "react";
import Image from "next/image";
import classes from "./Navbar.module.scss";
import {useRouter} from "next/router";
import _debounce from "lodash/debounce";

const Navbar = () => {
    const router = useRouter();

    const toggleAsideHandler = () => {
        document.body.classList.toggle("Active_Aside");
    };

    useEffect(() => {
        const observer = new MutationObserver(_debounce(handleResize, 100));
        observer.observe(document.body, {attributes: true, attributeFilter: ["class"]});

        handleResize(); // Set initial state

        return () => {
            observer.disconnect();
        };
    }, []);

    function handleResize() {
        if (window.innerWidth > 1440) {
            if (!document.body.classList.contains("Active_Aside")) {
                document.body.classList.add("Active_Aside");
            }
        }

        if (window.innerWidth < 650 && document.body.classList.contains("Active_Aside")) {
            document.body.style.height = "100vh";
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.height = "auto";
            document.body.style.overflow = "visible";
        }
    }


    return (
        <nav className={classes.Navbar}>
            <div className={classes.Logo} onClick={() => router.push("/")}>
                <Image src={"/easyDietLogo.png"} alt={"logo"} width={90} height={61.1}/>
            </div>
            <button className={classes.Navbar_Button} onClick={toggleAsideHandler}>
                <span></span>
                <span></span>
            </button>
        </nav>
    );
};

export default Navbar;
