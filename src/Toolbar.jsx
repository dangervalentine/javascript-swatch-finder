const Toolbar = ({
  hasImage,
  pixelSize,
  onPixelSizeChange,
  paletteSize,
  onPaletteSizeChange,
  colorFormat,
  onColorFormatChange,
  mode,
  onModeChange,
  onDownload,
  isMobile,
  selectionApplied,
  onClearSelection,
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <span className="toolbar-label">Pixelation</span>
        <input
          type="range"
          min="1"
          max="30"
          value={pixelSize}
          onChange={(e) => onPixelSizeChange(Number(e.target.value))}
          disabled={!hasImage}
        />
        <span className="toolbar-value">{pixelSize}</span>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <span className="toolbar-label">Mode</span>
        <div className="mode-toggle">
          <button
            className={mode === "full" ? "active" : ""}
            onClick={() => onModeChange("full")}
            disabled={!hasImage}
          >
            Full Image
          </button>
          <button
            className={mode === "selection" ? "active" : ""}
            onClick={() => onModeChange("selection")}
            disabled={!hasImage}
          >
            Selection
          </button>
        </div>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <span className="toolbar-label">Colors</span>
        <input
          type="range"
          min="3"
          max="20"
          value={paletteSize}
          onChange={(e) => onPaletteSizeChange(Number(e.target.value))}
          disabled={!hasImage}
        />
        <span className="toolbar-value">{paletteSize}</span>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <span className="toolbar-label">Format</span>
        <select
          className="toolbar-select"
          value={colorFormat}
          onChange={(e) => onColorFormatChange(e.target.value)}
          disabled={!hasImage}
        >
          <option value="hex">HEX</option>
          <option value="rgb">RGB</option>
          <option value="hsl">HSL</option>
        </select>
      </div>

      {selectionApplied && (
        <button
          className="clear-selection-button"
          onClick={onClearSelection}
        >
          Clear Selection
        </button>
      )}

      <button
        className="download-button"
        onClick={onDownload}
        disabled={!hasImage}
      >
        {!isMobile && <span>Download</span>}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 1v7M6 8L3 5M6 8l3-3M1 10h10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Toolbar;
