import classes from './overlay.module.scss'

const Overlay = ({children , active, clicked, style}) => {
    return (
        <div style={{...style || ''}} onClick={(e) => {
            if(Array.from(e.target.classList).includes(classes.Overlay)){
                clicked()
            }
        }
        } className={[classes.Overlay, active ? classes.Active : ''].join(' ')}>
            {children}
        </div>
    )
}
export default Overlay