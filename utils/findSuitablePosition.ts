import RGL from "react-grid-layout";

const isOverlap = (layouts: RGL.Layout[], target: RGL.Layout) => {
  return layouts.some(
    (layout: RGL.Layout) =>
      target.x < layout.x + layout.w &&
      target.x + target.w > layout.x &&
      target.y < layout.y + layout.h &&
      target.y + target.h > layout.y
  );
};

const findSuitablePosition = (
  layouts: RGL.Layout[],
  newLayout: RGL.Layout,
  maxRows: number,
  maxCols: number
): RGL.Layout => {
  for (let y = 0; y <= maxRows - newLayout.h; y++) {
    for (let x = 0; x <= maxCols - newLayout.w; x++) {
      const potentialPos = { ...newLayout, x, y };

      if (!isOverlap(layouts, potentialPos)) {
        return potentialPos;
      }
    }
  }

  throw new Error("No suitable position found.");
};

export default findSuitablePosition;
