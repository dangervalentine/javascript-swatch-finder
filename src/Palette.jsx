import Color from "./Color";
import { formatColor, copyToClipboard } from "./helpers";

const Palette = ({ colors, format }) => {
  if (colors.length === 0) {
    return (
      <div className="palette-panel">
        <div className="palette-empty">Upload an image to extract colors</div>
      </div>
    );
  }

  const tiers = ["dominant", "supporting", "accent"];
  const grouped = {};
  for (const tier of tiers) {
    const items = colors.filter((c) => c.tier === tier);
    if (items.length > 0) grouped[tier] = items;
  }

  const buildCopyText = () => {
    const lines = [];
    for (const tier of tiers) {
      if (!grouped[tier]) continue;
      const values = grouped[tier]
        .map((c) => formatColor(c.color, format))
        .join(", ");
      lines.push(`/* ${tier} */ ${values}`);
    }
    return lines.join("\n");
  };

  const copyAll = () => copyToClipboard(buildCopyText());

  return (
    <div className="palette-panel">
      <div className="palette-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3>Palette</h3>
          <span className="palette-count">{colors.length} colors</span>
        </div>
        <button className="copy-all-button" onClick={copyAll}>
          Copy All
        </button>
      </div>

      {tiers.map(
        (tier) =>
          grouped[tier] && (
            <div className="tier-group" key={tier}>
              <div className={`tier-label ${tier}`}>{tier}</div>
              <div className="tier-swatches">
                {grouped[tier].map((c) => (
                  <Color
                    key={c.color.join(",")}
                    color={c.color}
                    tier={c.tier}
                    percentage={c.percentage}
                    format={format}
                  />
                ))}
              </div>
            </div>
          )
      )}

      <div className="color-list-block">
        <div className="color-list-header">
          <span>All colors — click to copy</span>
          <button className="color-list-copy" onClick={copyAll}>
            Copy
          </button>
        </div>
        <div className="color-list-text">
          {tiers.map(
            (tier) =>
              grouped[tier] && (
                <div key={tier}>
                  <span className="tier-comment">/* {tier} */</span>{" "}
                  <span className={`${tier}-colors`}>
                    {grouped[tier]
                      .map((c) => formatColor(c.color, format))
                      .join(", ")}
                  </span>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Palette;
