import React, { useState, useEffect, useContext, useRef } from "react";
import { useAnimate, stagger } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { StoreContext } from "../core/store/Provider";

const staggerMenuItems = stagger(0.1, { startDelay: 0.15 });

function useMenuAnimation(isOpen) {
    const [scope, animate] = useAnimate();

    useEffect(() => {
        animate(
            "ul",
            {
                clipPath: isOpen
                    ? "inset(0% 0% 0% 0% round 10px)"
                    : "inset(10% 0% 90% 100% round 10px)",
                translateY: isOpen ? 12 : 0,
                translateX: isOpen ? 4 : 0,
            },
            {
                type: "spring",
                bounce: 0,
                duration: 0.5,
            }
        );

        animate(
            "li",
            isOpen
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : { opacity: 0, scale: 0.3, filter: "blur(20px)" },
            {
                duration: 0.2,
                delay: isOpen ? staggerMenuItems : 0,
            }
        );
    }, [isOpen]);

    return scope;
}

const Dropdown = () => {
    const store = useContext(StoreContext);
    const [isOpen, setIsOpen] = useState(false);
    const scope = useMenuAnimation(isOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (scope.current && !scope.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        window.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="nav-item dropdown" ref={scope} style={{ zIndex: 1001 }}>
            <a className="dropdown-toggle nav-link">
                <FontAwesomeIcon
                    style={{ color: "white", fontSize: "24px" }}
                    icon={faUser}
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                />
            </a>
            <ul
                className="log-ul"
                style={{
                    pointerEvents: isOpen ? "auto" : "none",
                    clipPath: "inset(10% 50% 90% 50% round 10px)",
                }}
            >
                <li className="log-li">
                    <a className="dropdown-item" href="/portal">
                        My Profile
                    </a>
                </li>
                <li className="log-li">
                    <a className="dropdown-item" href="/portal">
                        Settings
                    </a>
                </li>
                <li className="log-li">
                    <a
                        className="dropdown-item"
                        onClick={() => {
                            store.logout();
                        }}
                    >
                        Logout
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Dropdown;
