import Konva from "konva";
import { CanvasActions, CanvasReducerAction } from "../code/store/reducer";

export type ImageProps = {
  imageX: number;
  imageY: number;
  imageWidth: number;
  imageHeight: number;
};

export type CropRectProps = {
  cropRectWidth: number;
  cropRectHeight: number;
};

export type StageDimensionsProps = {
  stageWidth: number;
  stageHeight: number;
};

export type CanvasProps = {
  imageProps: ImageProps;
  cropRect: CropRectProps;
  stageDimensions: StageDimensionsProps;
  canvasAction: CanvasActions;
};

export type CanvasHistoryState = {
  current: CanvasProps;
  undoStack: CanvasProps[];
  redoStack: CanvasProps[];
};

export type KonvaContextType = {
  canvasState: CanvasHistoryState;
  // canvasDispatch: React.Dispatch<CanvasReducerAction>;
  // handleDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  // handleUndo: () => void;
  // handleRedo: () => void;
  // handleDragStart: () => void;
  // handleDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  // handleResize: (e: any) => void;
};
