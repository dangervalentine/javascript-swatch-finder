import { useState } from "react";
import { formatColor, copyToClipboard, changeBackground } from "./helpers";

const Color = ({ color, tier, percentage, format }) => {
  const [copied, setCopied] = useState(false);
  const formatted = formatColor(color, format);

  const onClick = () => {
    copyToClipboard(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 600);
  };

  const bgColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

  return (
    <div className="color-item" onClick={onClick}>
      <div
        className={`color-circle ${tier}`}
        style={{ backgroundColor: bgColor }}
        onMouseOver={() => changeBackground(bgColor)}
      >
        {copied && "copied"}
      </div>
      <span className="color-value">{formatted}</span>
      <span className="color-percentage">{percentage.toFixed(1)}%</span>
    </div>
  );
};

export default Color;
