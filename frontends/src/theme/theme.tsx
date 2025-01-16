import { useEffect, useState } from "react";

const Theme = ({ children }) => {

    const deviceMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const [ darkMode, setDarkMode ] = useState(deviceMode)
    const [isToggleRight, setIsToggleRight] = useState(true)

    const toggleRight = () => setIsToggleRight(!isToggleRight)

    useEffect(() => {
        setDarkMode(deviceMode);
    }, [])

    return (
        <div className={`${darkMode}`}>
            {children({ darkMode, toggleRight, setDarkMode })}
        </div>
    );
};

export default Theme;