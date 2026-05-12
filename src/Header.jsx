import logo from "./swatch-finder.svg";
import download from "./download.svg";

const Header = (props) => {
    return (
        <header>
            <img className="logo" src={logo} alt="swatch finder logo"></img>
            <div className="header-text">
                <p className="title">Swatch Finder</p>
                <a
                    target="_blank"
                    className="credit"
                    rel="noopener noreferrer"
                    href="https://github.com/victoriousj/javascript-swatch-finder"
                >
                    <p>by victor d. johnson</p>
                </a>
            </div>
            {props.hasImage && (
                <div className="settings">
                    <input
                        onChange={props.changeSize}
                        type="range"
                        id="size"
                        name="size"
                        min="1"
                        max="30"
                        value={props.size}
                    />
                    <span hidden={props.isMobile}> {props.size}</span>
                    <div>
                        <button
                            className="download-button"
                            onClick={props.downloadImage}
                        >
                            <span hidden={props.isMobile}>download</span>
                            <img src={download} alt={"download"} />
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
