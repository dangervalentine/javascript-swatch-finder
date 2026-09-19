import { useState, useRef, useCallback, useEffect } from "react";

const Selection = ({ onApply, onCancel, containerRef }) => {
  const [rect, setRect] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [dragging, setDragging] = useState(null);
  const startRef = useRef(null);
  const rectRef = useRef(null);

  useEffect(() => {
    rectRef.current = rect;
  }, [rect]);

  const getRelativePos = useCallback(
    (e) => {
      const el = containerRef.current;
      if (!el) return { x: 0, y: 0 };
      const bounds = el.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - bounds.left) / bounds.width) * 100,
        y: ((clientY - bounds.top) / bounds.height) * 100,
      };
    },
    [containerRef]
  );

  const onPointerDown = useCallback(
    (e) => {
      e.preventDefault();
      const pos = getRelativePos(e);

      if (rectRef.current) {
        const r = rectRef.current;
        const inX = pos.x >= r.x && pos.x <= r.x + r.w;
        const inY = pos.y >= r.y && pos.y <= r.y + r.h;

        const nearLeft = Math.abs(pos.x - r.x) < 5;
        const nearRight = Math.abs(pos.x - (r.x + r.w)) < 5;
        const nearTop = Math.abs(pos.y - r.y) < 5;
        const nearBottom = Math.abs(pos.y - (r.y + r.h)) < 5;

        if (nearTop && nearLeft) { setDragging("nw"); startRef.current = pos; return; }
        if (nearTop && nearRight) { setDragging("ne"); startRef.current = pos; return; }
        if (nearBottom && nearLeft) { setDragging("sw"); startRef.current = pos; return; }
        if (nearBottom && nearRight) { setDragging("se"); startRef.current = pos; return; }

        if (inX && inY) { setDragging("move"); startRef.current = pos; return; }

        // Clicked outside — start a new selection
        setRect(null);
      }

      setDrawing(true);
      startRef.current = pos;
      setRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
    },
    [getRelativePos]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!startRef.current) return;
      e.preventDefault();
      const pos = getRelativePos(e);

      if (drawing) {
        const x = Math.min(startRef.current.x, pos.x);
        const y = Math.min(startRef.current.y, pos.y);
        const w = Math.abs(pos.x - startRef.current.x);
        const h = Math.abs(pos.y - startRef.current.y);
        setRect({ x, y, w, h });
        return;
      }

      if (dragging && rectRef.current) {
        const dx = pos.x - startRef.current.x;
        const dy = pos.y - startRef.current.y;
        const r = { ...rectRef.current };

        switch (dragging) {
          case "move":
            r.x = Math.max(0, Math.min(100 - r.w, r.x + dx));
            r.y = Math.max(0, Math.min(100 - r.h, r.y + dy));
            break;
          case "nw": r.x += dx; r.y += dy; r.w -= dx; r.h -= dy; break;
          case "ne": r.y += dy; r.w += dx; r.h -= dy; break;
          case "sw": r.x += dx; r.w -= dx; r.h += dy; break;
          case "se": r.w += dx; r.h += dy; break;
        }

        if (r.w < 2) r.w = 2;
        if (r.h < 2) r.h = 2;

        setRect(r);
        startRef.current = pos;
      }
    },
    [drawing, dragging, getRelativePos]
  );

  const onPointerUp = useCallback(() => {
    setDrawing(false);
    setDragging(null);
    startRef.current = null;
  }, []);

  useEffect(() => {
    const handler = () => {
      if (drawing || dragging) onPointerUp();
    };
    window.addEventListener("mouseup", handler);
    window.addEventListener("touchend", handler);
    return () => {
      window.removeEventListener("mouseup", handler);
      window.removeEventListener("touchend", handler);
    };
  }, [drawing, dragging, onPointerUp]);

  const hasValidRect = rect && rect.w > 1 && rect.h > 1;

  return (
    <div
      className="selection-overlay"
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
    >
      {hasValidRect && (
        <>
          <div
            className="selection-rect"
            style={{
              left: `${rect.x}%`,
              top: `${rect.y}%`,
              width: `${rect.w}%`,
              height: `${rect.h}%`,
              background: "transparent",
              boxShadow: `0 0 0 9999px var(--bg-scrim)`,
              pointerEvents: "auto",
              cursor: "move",
            }}
          >
            <div className="selection-handle nw" />
            <div className="selection-handle ne" />
            <div className="selection-handle sw" />
            <div className="selection-handle se" />
          </div>
          {!drawing && !dragging && (
            <div className="selection-actions" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
              <button
                className="selection-apply"
                onClick={() => onApply(rect)}
              >
                Apply
              </button>
              <button
                className="selection-cancel"
                onClick={() => { setRect(null); onCancel(); }}
              >
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Selection;
