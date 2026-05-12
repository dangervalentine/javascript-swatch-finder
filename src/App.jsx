import { useEffect, useCallback, useState, useRef } from "react";
import Header from "./Header";
import Toolbar from "./Toolbar";
import Palette from "./Palette";
import Selection from "./Selection";
import { kMeansClustering, samplePixels, classifyTiers } from "./helpers";
import { useMediaQuery } from "./hooks/useMediaQuery";

import "./App.css";
import upload from "./upload.svg";

let imgSrc;

const App = () => {
  const isMobile = useMediaQuery("(max-width: 800px)");
  const [fileName, setFileName] = useState("");
  const [image, setImage] = useState("");
  const [pixelSize, setPixelSize] = useState(8);
  const [paletteSize, setPaletteSize] = useState(8);
  const [colorFormat, setColorFormat] = useState("hex");
  const [mode, setMode] = useState("full");
  const [colors, setColors] = useState([]);
  const [selection, setSelection] = useState(null);
  const photoContainer = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const handleFormClick = () => inputRef.current.click();

  const processImg = useCallback(
    (file) => {
      if (!file && !imgSrc) return;

      if (file) {
        imgSrc = URL.createObjectURL(file);
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      setFileName(file?.name ?? fileName);
      setImage(imgSrc);

      img.onload = () => {
        const height = (canvas.height = img.height);
        const width = (canvas.width = img.width);
        const maxDim = Math.max(height, width);
        const h = Math.round((height * pixelSize) / maxDim);
        const w = Math.round((width * pixelSize) / maxDim);

        ctx.drawImage(img, 0, 0, w, h);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);

        const pixelData = [];
        for (let i = 0; i < w; i++) {
          for (let j = 0; j < h; j++) {
            const d = ctx.getImageData(
              (width / w) * i,
              (height / h) * j,
              1,
              1
            ).data;
            pixelData.push([d[0], d[1], d[2]]);
          }
        }

        const sampled = samplePixels(pixelData, 500);
        const clusters = kMeansClustering(sampled, paletteSize);
        const tiered = classifyTiers(clusters);
        setColors(tiered);
      };
      img.src = imgSrc;
    },
    [canvasRef, fileName, pixelSize, paletteSize]
  );

  const processSelection = useCallback(
    (selRect) => {
      if (!selRect || !canvasRef.current || !imgSrc) {
        setSelection(null);
        processImg();
        return;
      }

      setSelection(selRect);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;

      const sx = Math.round((selRect.x / 100) * width);
      const sy = Math.round((selRect.y / 100) * height);
      const sw = Math.round((selRect.w / 100) * width);
      const sh = Math.round((selRect.h / 100) * height);

      if (sw < 1 || sh < 1) return;

      const img = new Image();
      img.onload = () => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = sw;
        tempCanvas.height = sh;
        const tempCtx = tempCanvas.getContext("2d");

        tempCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

        const maxDim = Math.max(sw, sh);
        const pw = Math.max(1, Math.round((sw * pixelSize) / maxDim));
        const ph = Math.max(1, Math.round((sh * pixelSize) / maxDim));

        tempCtx.drawImage(tempCanvas, 0, 0, pw, ph);
        tempCtx.imageSmoothingEnabled = false;
        tempCtx.drawImage(tempCanvas, 0, 0, pw, ph, 0, 0, sw, sh);

        const pixelData = [];
        for (let i = 0; i < pw; i++) {
          for (let j = 0; j < ph; j++) {
            const d = tempCtx.getImageData(
              (sw / pw) * i,
              (sh / ph) * j,
              1,
              1
            ).data;
            pixelData.push([d[0], d[1], d[2]]);
          }
        }

        const sampled = samplePixels(pixelData, 500);
        const clusters = kMeansClustering(sampled, paletteSize);
        const tiered = classifyTiers(clusters);
        setColors(tiered);

        ctx.drawImage(img, 0, 0, width, height);
        ctx.drawImage(tempCanvas, 0, 0, sw, sh, sx, sy, sw, sh);
      };
      img.src = imgSrc;
    },
    [canvasRef, pixelSize, paletteSize, processImg]
  );

  const onChange = (e) => {
    if (!e.target.files.length) return;
    processImg(e.target.files[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (!e.dataTransfer) return;
    processImg(e.dataTransfer.files[0]);
    photoContainer.current.classList.remove("drag-over");
  };

  const onDragOver = (e) => {
    e.preventDefault();
    photoContainer.current.classList.add("drag-over");
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    photoContainer.current.classList.remove("drag-over");
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (mode === "selection" && selection) {
        processSelection(selection);
      } else {
        processImg();
      }
    }, 150);
    return () => clearTimeout(debounceRef.current);
  }, [processImg, processSelection, pixelSize, paletteSize, mode, selection]);

  const downloadImage = () => {
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const hasImage = fileName !== "";

  const imageEl =
    image === "" ? (
      <div>
        <img src={upload} alt="upload" />
        <div className="image-text">
          <span className="bold">Choose a file</span> &nbsp;
          {!isMobile && "or drag it here"}
          <div className="tagline">
            Pixelate images &amp; extract color palettes
          </div>
        </div>
      </div>
    ) : (
      <img className="image-file" src={image} alt="uploaded file" />
    );

  return (
    <div>
      <Header />
      <Toolbar
        hasImage={hasImage}
        pixelSize={pixelSize}
        onPixelSizeChange={setPixelSize}
        paletteSize={paletteSize}
        onPaletteSizeChange={setPaletteSize}
        colorFormat={colorFormat}
        onColorFormatChange={setColorFormat}
        mode={mode}
        onModeChange={setMode}
        onDownload={downloadImage}
        isMobile={isMobile}
      />
      <div className="container">
        <div
          ref={photoContainer}
          className="photo-container"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div
            className={`photo${image === "" ? " border" : ""}`}
            onClick={handleFormClick}
          >
            {imageEl}
            <canvas ref={canvasRef} className="main-canvas" />
          </div>
          {mode === "selection" && hasImage && (
            <Selection
              onSelectionChange={processSelection}
              containerRef={photoContainer}
            />
          )}
        </div>
        <Palette colors={colors} format={colorFormat} />
        <input
          ref={inputRef}
          accept="image/*"
          type="file"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default App;
