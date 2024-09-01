import classes from './DoctorCard.module.scss';
import Image from "next/image";
import {useRouter} from "next/router";
// REDUX
import {onInputChange} from '@/redux/slices/user/nutritionspecialist_slice'
import {useDispatch, useSelector} from "react-redux";

const DoctorCard = ({userId, nutrition_specialistId, image, name, phone}) => {

    //ROUTER
    const router = useRouter();

    //REDUX
    const dispatch = useDispatch();
    const {} = useSelector(state => state.nutrition_specialist)

    return (
        <>
            <article className={classes.DoctorCard}>
                <Image src={image || '/images/no_image.webp'} alt={'Doctor Image'} width={280} height={280} />
                <div className={classes.Overlay}>
                    <div className={classes.Top}>
                        <button onClick={() => window.open(`https://wa.me/${phone}`, '_blank')}>
                            <Image src={'/images/Global/Whatsapp_Icon.svg'} alt={'WhatsApp'} height={22} width={22} />
                        </button>
                        <button
                            onClick={() => {
                                dispatch(onInputChange({key: 'nutrition_specialistId', value: nutrition_specialistId}));
                                router.push(`/user/send_message?ID=${nutrition_specialistId}`)
                            }}
                        >
                            <Image src={'/images/Global/Chat_Icon.svg'} alt={'WhatsApp'} height={22} width={22} />
                        </button>
                    </div>
                    <div className={classes.Bottom}>
                        <h4>{name}</h4>
                    </div>
                </div>
            </article>
        </>
    )
}

export default DoctorCard;