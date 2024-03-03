import { CanvasActions, CanvasReducerAction } from "../code/store/actions";

export type ImageProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  restrict: number;
};

// export type CropRectProps = {
//   cropRectWidth: number;
//   cropRectHeight: number;
// };

// export type StageDimensionsProps = {
//   stageWidth: number;
//   stageHeight: number;
// };

export type CanvasProps = {
  imageProps: ImageProps;
  cropRect: ImageProps;
  stageDimensions: ImageProps;
  canvasAction: CanvasActions;
};

export type CanvasHistoryState = {
  current: CanvasProps;
  undoStack: CanvasProps[];
  redoStack: CanvasProps[];
};

export type KonvaContextType = {
  canvasState: CanvasHistoryState;
  dispatch: React.Dispatch<CanvasReducerAction>;
  // handleDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  // handleUndo: () => void;
  // handleRedo: () => void;
  // handleDragStart: () => void;
  // handleDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  // handleResize: (e: any) => void;
};
