import { ImageProps } from "../../constants/types";

export enum CanvasActions {
  NONE = "NONE",
  UNDO = "UNDO",
  REDO = "REDO",
  SELECT_IMAGE = "SELECT_IMAGE",
  RELEASE_IMAGE = "RELEASE_IMAGE",
  SELECT_CROP = "SELECT_CROP",
  DESELECT_CROP = "DESELECT_CROP",
  SAVE_CROP_DIMENSION = "SAVE_CROP_DIMENSION",

  RESIZE = "resize",
  CROP = "crop",
  DRAG_MOVE = "drag_move",
  DRAG_END = "drag_end",
  DRAG_START = "drag_start",
  // todo: set aspect ratio. tik tok format vs youtube format etc.
  // todo: add text to canvas
}

export type CanvasReducerAction =
  | { type: CanvasActions.NONE }
  | { type: CanvasActions.RESIZE; payload: ImageProps }
  | {
      type: CanvasActions.CROP;
      payload: {
        imageX: number;
        imageY: number;
        width: number;
        height: number;
      };
    }
  | { type: CanvasActions.SELECT_IMAGE }
  | { type: CanvasActions.RELEASE_IMAGE }
  | { type: CanvasActions.UNDO }
  | { type: CanvasActions.REDO }
  | { type: CanvasActions.SELECT_CROP }
  | { type: CanvasActions.DESELECT_CROP }
  | {
      type: CanvasActions.SAVE_CROP_DIMENSION;
      payload: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }
  | {
      type: CanvasActions.DRAG_MOVE;
      payload: { imageX: number; imageY: number };
    }
  | {
      type: CanvasActions.DRAG_END;
      payload: { imageX: number; imageY: number };
    }
  | {
      type: CanvasActions.DRAG_START;
    }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "reset" };
