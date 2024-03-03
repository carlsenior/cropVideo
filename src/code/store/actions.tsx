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
  SAVE_IMAGE_DIMENSION = "SAVE_IMAGE_DIMENSION",
  SET_YOUTUBE_FORMAT = "SET_YOUTUBE_FORMAT",
  SET_TIKTOK_FORMAT = "SET_TIKTOK_FORMAT",
  CROP = "CROP",
  // todo: set aspect ratio. tik tok format vs youtube format etc.
  // todo: add text to canvas
}

export type CanvasReducerAction =
  | { type: CanvasActions.NONE }
  | { type: CanvasActions.CROP }
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
      type: CanvasActions.SAVE_IMAGE_DIMENSION;
      payload: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }
  | { type: CanvasActions.SET_YOUTUBE_FORMAT }
  | { type: CanvasActions.SET_TIKTOK_FORMAT };
