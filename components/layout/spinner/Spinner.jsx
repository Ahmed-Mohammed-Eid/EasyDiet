import classes from './Spinner.module.scss';

const Spinner = ({size, color}) => {
    return (
        <div style={{width: `${size}rem`, height: `${size}rem`, border: `0.5rem solid ${color}20`, borderTop: `0.5rem solid ${color}`}} className={classes.Loader}></div>
    );
}

export default Spinner;