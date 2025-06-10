import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";

const HANDLE_SIZE = 8;

const LiveCanvas = forwardRef(
  (
    { canvasRef, width, height, elements, setElements, setSelectedTextId },
    ref
  ) => {
    const contextRef = useRef(null);
    const [selectedId, setSelectedId] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [start, setStart] = useState({ x: 0, y: 0 });
    const [resizeHandle, setResizeHandle] = useState(null);

    useImperativeHandle(ref, () => ({
      updateFontSize: (newSize) => {
        setElements((prev) =>
          prev.map((el) => {
            if (el.id !== selectedId || el.type !== "text") return el;
            return { ...el, size: parseInt(newSize) };
          })
        );
      },
      updateColor: (newColor) => {
        setElements((prev) =>
          prev.map((el) => {
            if (el.id !== selectedId) return el;
            return { ...el, color: newColor };
          })
        );
      },
    }));

    const drawHandles = (ctx, x, y, w, h) => {
      const positions = [
        [x - HANDLE_SIZE / 2, y - HANDLE_SIZE / 2],
        [x + w - HANDLE_SIZE / 2, y - HANDLE_SIZE / 2],
        [x - HANDLE_SIZE / 2, y + h - HANDLE_SIZE / 2],
        [x + w - HANDLE_SIZE / 2, y + h - HANDLE_SIZE / 2],
      ];
      ctx.fillStyle = "white";
      ctx.strokeStyle = "blue";
      positions.forEach(([hx, hy]) => {
        ctx.fillRect(hx, hy, HANDLE_SIZE, HANDLE_SIZE);
        ctx.strokeRect(hx, hy, HANDLE_SIZE, HANDLE_SIZE);
      });
    };

    const drawElements = useCallback(() => {
      const ctx = contextRef.current;
      if (!ctx) return;

      const drawOutline = (ctx, el) => {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        if (el.type === "circle") {
          ctx.strokeRect(el.x, el.y, el.radius * 2, el.radius * 2);
          drawHandles(ctx, el.x, el.y, el.radius * 2, el.radius * 2);
        } else if (el.type === "text") {
          const offsetY = el.size || 20;
          ctx.strokeRect(el.x, el.y - offsetY, el.width, el.height);
          drawHandles(ctx, el.x, el.y - offsetY, el.width, el.height);
        } else {
          ctx.strokeRect(el.x, el.y, el.width, el.height);
          drawHandles(ctx, el.x, el.y, el.width, el.height);
        }
      };

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      elements.forEach((el) => {
        const isSelected = el.id === selectedId;
        ctx.fillStyle = el.color || "black";

        switch (el.type) {
          case "rectangle":
            ctx.fillRect(el.x, el.y, el.width, el.height);
            break;
          case "circle":
            ctx.beginPath();
            ctx.arc(
              el.x + el.radius,
              el.y + el.radius,
              el.radius,
              0,
              Math.PI * 2
            );
            ctx.fill();
            break;
          case "text":
            ctx.font = `${el.size || 20}px Manrope, sans-serif`;
            ctx.fillText(el.text, el.x, el.y);
            break;
          case "image":
            const img = new Image();
            img.src = el.url;
            img.onload = () =>
              ctx.drawImage(img, el.x, el.y, el.width, el.height);
            break;
          default:
            break;
        }

        if (isSelected) drawOutline(ctx, el);
      });
    }, [elements, selectedId, width, height]);

    useEffect(() => {
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      contextRef.current = ctx;
      drawElements();
    }, [width, height, elements, canvasRef, drawElements]);

    const getElementAt = (x, y) => {
      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        if (el.type === "circle") {
          const dx = x - (el.x + el.radius);
          const dy = y - (el.y + el.radius);
          if (Math.sqrt(dx * dx + dy * dy) <= el.radius) return el;
        } else if (el.type === "text") {
          const offsetY = el.size || 20;
          if (
            x >= el.x &&
            x <= el.x + el.width &&
            y >= el.y - offsetY &&
            y <= el.y - offsetY + el.height
          )
            return el;
        } else if (
          x >= el.x &&
          x <= el.x + el.width &&
          y >= el.y &&
          y <= el.y + el.height
        ) {
          return el;
        }
      }
      return null;
    };

    const getHandleAt = (x, y, el) => {
      const isText = el.type === "text";
      const box =
        el.type === "circle"
          ? { x: el.x, y: el.y, width: el.radius * 2, height: el.radius * 2 }
          : isText
          ? {
              x: el.x,
              y: el.y - (el.size || 20),
              width: el.width,
              height: el.height,
            }
          : { x: el.x, y: el.y, width: el.width, height: el.height };

      const handles = {
        topLeft: [box.x, box.y],
        topRight: [box.x + box.width, box.y],
        bottomLeft: [box.x, box.y + box.height],
        bottomRight: [box.x + box.width, box.y + box.height],
      };

      for (let key in handles) {
        const [hx, hy] = handles[key];
        if (
          x >= hx - HANDLE_SIZE &&
          x <= hx &&
          y >= hy - HANDLE_SIZE &&
          y <= hy
        ) {
          return key;
        }
      }
      return null;
    };

    const handleMouseDown = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const el = getElementAt(x, y);
      if (el) {
        setSelectedId(el.id);
        setSelectedTextId?.(el.id);
        setStart({ x, y });

        const handle = getHandleAt(x, y, el);
        if (handle) {
          setResizing(true);
          setResizeHandle(handle);
        } else {
          setDragging(true);
        }
      } else {
        setSelectedId(null);
        setSelectedTextId?.(null);
      }
    };

    const handleMouseMove = (e) => {
      if (!dragging && !resizing) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = x - start.x;
      const dy = y - start.y;

      setStart({ x, y });

      setElements((prev) =>
        prev.map((el) => {
          if (el.id !== selectedId) return el;
          const updated = { ...el };

          if (resizing) {
            switch (resizeHandle) {
              case "bottomRight":
                updated.width = (el.width || el.radius * 2) + dx;
                updated.height = (el.height || el.radius * 2) + dy;
                if (el.type === "circle") {
                  updated.radius =
                    Math.max(updated.width, updated.height) / 2;
                }
                break;
              default:
                break;
            }
          } else if (dragging) {
            updated.x += dx;
            updated.y += dy;
          }

          return updated;
        })
      );
    };

    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
      setResizeHandle(null);
    };

    const handleKeyDown = (e) => {
      if ((e.key === "Backspace" || e.key === "Delete") && selectedId) {
        setElements((prev) => prev.filter((el) => el.id !== selectedId));
        setSelectedId(null);
        setSelectedTextId?.(null);
      }
    };

    useEffect(() => {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    });

    return (
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="canvas-board"
        tabIndex={0}
      />
    );
  }
);

export default LiveCanvas;
