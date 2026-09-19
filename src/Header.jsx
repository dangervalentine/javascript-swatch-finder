import { useState } from "react";
import logo from "./swatch-finder.svg";
import { getInitialTheme, setTheme } from "./theme";

const Header = () => {
  const [mode, setMode] = useState(getInitialTheme);

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    setTheme(next);
  };

  return (
    <header>
      <img className="logo" src={logo} alt="swatch finder logo" />
      <div className="header-text">
        <p className="title">Swatch Finder</p>
        <a
          target="_blank"
          className="credit"
          rel="noopener noreferrer"
          href="https://github.com/victoriousj/javascript-swatch-finder"
        >
          <p>by Danger Valentine</p>
        </a>
      </div>
      <div className="theme-toggle" onClick={toggle} role="button" tabIndex={0}>
        <span>{mode === "dark" ? "\u263D" : ""}</span>
        <div className="theme-toggle-track">
          <div className={`theme-toggle-thumb ${mode}`} />
        </div>
        <span>{mode === "light" ? "\u2600" : ""}</span>
      </div>
    </header>
  );
};

export default Header;
