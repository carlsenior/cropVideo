import { CanvasActions, CanvasReducerAction } from "../code/store/actions";

export type ImageProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  restrict: number;
};

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
  keepRatio: boolean;
};

export type KonvaContextType = {
  canvasState: CanvasHistoryState;
  dispatch: React.Dispatch<CanvasReducerAction>;
};
