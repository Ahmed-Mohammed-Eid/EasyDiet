import classes from './overlay.module.scss'
const Overlay = ({children , active, clicked, style}) => {
    return (
        <div style={{...style || ''}} className={[classes.Overlay, active ? classes.Active : ''].join(' ')}>
            {children}
        </div>
    )
}
export default Overlay