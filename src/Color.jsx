import { useState } from "react";

import { copyToClipboard, changeBackground } from "./helpers";

const Color = ({ color, weight }) => {
    const [content, setContent] = useState(color);
    const isMobile = !!(window.innerWidth < 800);
    const size = Math.min(2.5, 1 + weight / 15);
    const emphasis = isMobile ? `${50 * `${size}`}px` : `${80 * `${size}`}px`;

    const colorStyle = {
        backgroundColor: color,
        height: emphasis,
        width: emphasis,
    };

    const clickColor = () => {
        copyToClipboard(color);
        setContent("copied");
        setTimeout(() => setContent(color), 400);
    };

    return (
        <div
            onMouseOver={() => changeBackground(color)}
            className="color-block"
            onClick={clickColor}
            style={colorStyle}
        >
            {content}
        </div>
    );
};

export default Color;
