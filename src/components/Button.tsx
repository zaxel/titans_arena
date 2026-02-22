import { useEffect, useState } from "react";

const Button = ({ currentPage = "intro", setCurrentPage }: { currentPage: string, setCurrentPage: (page: string) => void }) => {
    const [buttonMargin, setButtonMargin] = useState(window.innerHeight / 5);

    const updateButtonMargin = () => {
        setButtonMargin(window.innerHeight / 5);
    }

    useEffect(() => {
        window.addEventListener("resize", updateButtonMargin);
        return () => window.removeEventListener("resize", updateButtonMargin);

    }, []);

    return (
        <div className={`main-button ${currentPage === "home" ? "display" : "hide"}`}>
            <div className={`main-button__container`} style={{ marginTop: `${buttonMargin ?? 10}px` }} >
                <button className='main-button__button' onClick={() => setCurrentPage("store")}>
                    ENTER
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    );
};

export default Button;