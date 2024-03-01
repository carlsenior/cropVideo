import { ImageProps } from "../../constants/types";

export enum CanvasActions {
  NONE = "NONE",
  UNDO = "UNDO",
  REDO = "REDO",
  IMAGE_RESIZE = "IMAGE_RESIZE",
  IMAGE_RELEASE = "IMAGE_RELEASE",
  RESIZE = "resize",
  CROP = "crop",
  SELECT_CROP = "select_crop",
  DESELECT_CROP = "deselect_cop",
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
  | { type: CanvasActions.IMAGE_RESIZE }
  | { type: CanvasActions.IMAGE_RELEASE }
  | { type: CanvasActions.UNDO }
  | { type: CanvasActions.REDO }
  | {
      type: CanvasActions.SELECT_CROP;
    }
  | {
      type: CanvasActions.DESELECT_CROP;
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
