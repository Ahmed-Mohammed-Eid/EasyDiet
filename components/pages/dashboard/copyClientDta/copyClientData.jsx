import React, {useRef} from 'react';
import classes from './copyClientData.module.scss';
import Image from "next/image";

const CopyClientData = ({input1Value, input2Value, closeHandler}) => {
    // Refs for inputs
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);

    // Copy input values to clipboard
    const handleCopy1 = () => {
        input1Ref.current.select();
        document.execCommand('copy');
    };

    // Copy input values to clipboard
    const handleCopy2 = () => {
        input2Ref.current.select();
        document.execCommand('copy');
    };

    // Close the model
    const closeClickedHandler = () => {
        if(window.confirm('Please not that by accepting the user info model will be hidden. \nplease copy these data before continue')){
            closeHandler()
        }
    }

    return (
        <div className={classes.Model}>
            <div className={classes.Header}>
                <h2>Client Login Data</h2>
            </div>
            <div className={classes.InputContainer}>
                <div className={classes.Input}>
                    <label>Email</label>
                    <div className={classes.InputGroup}>
                        <input type="text" ref={input1Ref} value={input1Value} readOnly/>
                        <button onClick={handleCopy1}>
                            Copy
                            <Image src={'/images/copy.png'} alt={'copy'} width={20} height={20}/>
                        </button>
                    </div>
                </div>
                <div className={classes.Input}>
                    <label>Password</label>
                    <div className={classes.InputGroup}>
                        <input type="text" ref={input2Ref} value={input2Value} readOnly/>
                        <button onClick={handleCopy2}>
                            Copy
                            <Image src={'/images/copy.png'} alt={'copy'} width={20} height={20}/>
                        </button>
                    </div>
                </div>
            </div>
            <button className={classes.Close} onClick={closeClickedHandler}>
                close
            </button>
        </div>
    );
};

export default CopyClientData;
