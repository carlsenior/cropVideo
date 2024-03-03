import { CanvasActions, CanvasReducerAction } from "../code/store/actions";

export type ImageProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  restrict: number;
};

export type ActualCropedProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImageCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CanvasProps = {
  imageProps: ImageProps;
  cropRect: ImageProps;
  stageDimensions: ImageProps;
  imageCrop: ImageCrop;
  canvasAction: CanvasActions;
};

export type CanvasHistoryState = {
  current: CanvasProps;
  undoStack: CanvasProps[];
  redoStack: CanvasProps[];
  keepRatio: boolean;
};

export type KonvaContextType = {
  canvasState: CanvasHistoryState;
  dispatch: React.Dispatch<CanvasReducerAction>;
};
