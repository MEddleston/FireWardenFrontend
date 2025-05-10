import React, { useRef, useState, useEffect } from "react";
import "./dashboard.css";

function MapWithPins() {
  const imgRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [activePin, setActivePin] = useState(null);

  const baseMapSize = { width: 1351, height: 1286 };

  const locations = [
    { id: 1, x: 559, y: 921, count: 0, title: "Allwyn Hall" },
    { id: 2, x: 1106, y: 1150, count: 2, title: "Beech Glade" },
    { id: 3, x: 687, y: 950, count: 5, title: "Bowers Building" },
    { id: 4, x: 686, y: 736, count: 5, title: "Burma Road Student Village" },
  ];

  useEffect(() => {
    const updateSize = () => {
      if (imgRef.current) {
        setImageSize({
          width: imgRef.current.clientWidth,
          height: imgRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const scaleX = imageSize.width / baseMapSize.width;
  const scaleY = imageSize.height / baseMapSize.height;

  const getColor = (count) => {
    if (count === 0) return "gray";
    if (count <= 2) return "green";
    if (count <= 5) return "orange";
    return "red";
  };

  return (
    <div className="map-wrapper">
      <div className="map-pdf-container">
        <img ref={imgRef} src="/map.png" alt="Campus Map" className="map-image" />

        <div className="pin-overlay">
          {locations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => setActivePin(activePin?.id === loc.id ? null : loc)}
              style={{
                position: "absolute",
                left: `${loc.x * scaleX}px`,
                top: `${loc.y * scaleY}px`,
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: getColor(loc.count),
                transform: "translate(-50%, -50%)",
                zIndex: 10,
                boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                border: "2px solid white",
                cursor: "pointer",
              }}
              title={loc.title}
            />
          ))}

          {activePin && (
            <div
              className="pin-popup"
              style={{
                position: "absolute",
                left: `${activePin.x * scaleX}px`,
                top: `${activePin.y * scaleY - 30}px`,
                transform: "translate(-50%, -100%)",
                backgroundColor: "#fff",
                padding: "6px 10px",
                borderRadius: "6px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                zIndex: 999,
                fontSize: "14px",
                textAlign: "center",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              <strong>{activePin.title}</strong>
              <br />
              {activePin.count} warden{activePin.count !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapWithPins;
