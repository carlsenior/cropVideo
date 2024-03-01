import { useReducer, useMemo, createContext } from "react";
import { canvasPropsReducer, initialCanvasHistoryState } from "./reducer";
import { KonvaContextType } from "../../constants/types";

const initialKonvaContextValue: KonvaContextType = {
  canvasState: initialCanvasHistoryState,
  // canvasDispatch: () => {},
  // handleDragMove: () => {},
  // handleUndo: () => {},
  // handleRedo: () => {},
  // handleDragEnd: () => {},
  // handleDragStart: () => {},
  // handleResize: () => {},
};

export const KonvaContext = createContext<KonvaContextType>(
  initialKonvaContextValue
);

export const KonvaProvider = ({ children }: { children: React.ReactNode }) => {
  const [canvasState, canvasDispatch] = useReducer(
    canvasPropsReducer,
    initialCanvasHistoryState
  );

  // const {
  //   current: {
  //     stageDimensions: { stageHeight, stageWidth },
  //     imageProps: { imageHeight, imageWidth, imageX, imageY },
  //   },
  // } = canvasState;

  // const getSnapPosition = useCallback(
  //   (pos: any, scaledSize: { width: number; height: number }) => {
  //     const snapThreshold = 5;

  //     const snaps = {
  //       top: 0,
  //       bottom: stageHeight - scaledSize.height,
  //       left: 0,
  //       right: stageWidth - scaledSize.width,
  //       centerX: (stageWidth - scaledSize.width) / 2,
  //       centerY: (stageHeight - scaledSize.height) / 2,
  //     };

  //     // Calculate the distance to each snap position
  //     const distances = {
  //       top: Math.abs(pos.y),
  //       bottom: Math.abs(pos.y - snaps.bottom),
  //       left: Math.abs(pos.x),
  //       right: Math.abs(pos.x - snaps.right),
  //       centerX: Math.abs(pos.x + scaledSize.width / 2 - stageWidth / 2),
  //       centerY: Math.abs(pos.y + scaledSize.height / 2 - stageHeight / 2),
  //     };

  //     // Initial new positions are the current positions
  //     let newX = pos.x;
  //     let newY = pos.y;

  //     // Determine the closest snap positions based on these distances
  //     Object.entries(distances).forEach(([key, distance]) => {
  //       if (distance < snapThreshold) {
  //         switch (key) {
  //           case "top":
  //             newY = snaps.top;
  //             break;
  //           case "bottom":
  //             newY = snaps.bottom;
  //             break;
  //           case "left":
  //             newX = snaps.left;
  //             break;
  //           case "right":
  //             newX = snaps.right;
  //             break;
  //           case "centerX":
  //             newX = snaps.centerX;
  //             break;
  //           case "centerY":
  //             newY = snaps.centerY;
  //             break;
  //         }
  //       }
  //     });

  //     return { imageX: newX, imageY: newY };
  //   },
  //   [stageHeight, stageWidth]
  // );

  // const handleDragStart = useCallback(() => {
  //   canvasDispatch({ type: CanvasActions.DRAG_START });
  // }, []);

  // const handleDragMove = useCallback(
  //   (e: Konva.KonvaEventObject<DragEvent>) => {
  //     console.log("drag move");
  //     // Obtain current size taking scaling into account
  //     const scaledWidth = imageWidth * e.target.scaleX();
  //     const scaledHeight = imageHeight * e.target.scaleY();

  //     // snapping function
  //     const newPos = getSnapPosition(e.target.position(), {
  //       width: scaledWidth,
  //       height: scaledHeight,
  //     });

  //     e.target.position({ x: newPos.imageX, y: newPos.imageY });

  //     canvasDispatch({
  //       type: CanvasActions.DRAG_MOVE,
  //       payload: {
  //         imageX: newPos.imageX,
  //         imageY: newPos.imageY,
  //       },
  //     });
  //   },
  //   [getSnapPosition, imageHeight, imageWidth]
  // );

  // const handleUndo = useCallback(() => {
  //   canvasDispatch({
  //     type: "undo",
  //   });
  // }, []);

  // const handleRedo = useCallback(() => {
  //   console.log("redo");
  //   canvasDispatch({
  //     type: "redo",
  //   });
  // }, []);

  // const handleDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
  //   console.log("drag end");
  //   const finalPos = {
  //     x: e.target.x(),
  //     y: e.target.y(),
  //   };

  //   canvasDispatch({
  //     type: CanvasActions.DRAG_END,
  //     payload: { imageX: finalPos.x, imageY: finalPos.y },
  //   });
  // }, []);

  // const handleResize = useCallback((e: any) => {
  //   console.log("resize");
  //   const node = e.target;
  //   const newDimensions = {
  //     width: Math.max(0, node.width() * node.scaleX()),
  //     height: Math.max(0, node.height() * node.scaleY()),
  //   };

  //   canvasDispatch({
  //     type: CanvasActions.RESIZE,
  //     payload: {
  //       height: newDimensions.height,
  //       width: newDimensions.width,
  //       x: node.x,
  //       y: node.y,
  //     },
  //   });
  // }, []);

  const values = useMemo(
    () => ({
      canvasState,
      canvasDispatch,
      // handleDragMove,
      // handleUndo,
      // handleRedo,
      // handleDragEnd,
      // handleDragStart,
      // handleResize,
    }),
    [
      canvasState,
      canvasDispatch,
      // handleDragMove,
      // handleUndo,
      // handleRedo,
      // handleDragEnd,
      // handleResize,
      // handleDragStart,
    ]
  );

  return (
    <KonvaContext.Provider value={values}>{children}</KonvaContext.Provider>
  );
};
