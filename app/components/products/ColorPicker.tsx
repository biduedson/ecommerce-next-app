"use client";

import { useState, useEffect } from "react";
import { ChromePicker } from "react-color";

const ColorPicker = () => {
  const [color, setColor] = useState("#ff0000");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Evita erro no SSR

  return (
    <div>
      <ChromePicker
        color={color}
        onChange={(updatedColor) => setColor(updatedColor.hex)}
      />
      <p>Cor Selecionada: {color}</p>
    </div>
  );
};

export default ColorPicker;
