import { CanvasProps, CanvasHistoryState } from "../../constants/types";
import { produce } from "immer";

export enum CanvasActions {
  NONE = "none",
  RESIZE = "resize",
  CROP = "crop",
  SELECT_RESIZE = "select_resize",
  DESELECT_RESIZE = "deselect_resize",
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
  | {
      type: CanvasActions.RESIZE;
      payload: { width: number; height: number; x: number; y: number };
    }
  | {
      type: CanvasActions.CROP;
      payload: {
        imageX: number;
        imageY: number;
        width: number;
        height: number;
      };
    }
  | {
      type: CanvasActions.SELECT_RESIZE;
      payload: { cropRectWidth: number; cropRectHeight: number };
    }
  | {
      type: CanvasActions.DESELECT_RESIZE;
      payload: { cropRectWidth: number; cropRectHeight: number };
    }
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

const initialCanvasState: CanvasProps = {
  imageProps: {
    imageX: 0,
    imageY: 0,
    imageWidth: 720,
    imageHeight: 360,
  },
  cropRect: {
    cropRectWidth: 720,
    cropRectHeight: 360,
  },
  stageDimensions: {
    stageWidth: 720,
    stageHeight: 360,
  },
  canvasAction: CanvasActions.NONE,
};

export const initialCanvasHistoryState: CanvasHistoryState = {
  current: initialCanvasState,
  undoStack: [],
  redoStack: [],
};

export function canvasPropsReducer(
  state: CanvasHistoryState,
  action: CanvasReducerAction
) {
  return produce(state, (draft) => {
    switch (action.type) {
      case CanvasActions.RESIZE:
        //   recordHistory(draft);

        draft.current.imageProps.imageWidth = action.payload.width;
        draft.current.imageProps.imageHeight = action.payload.height;
        break;

      case CanvasActions.CROP:
        //   recordHistory(draft);

        draft.current.cropRect = {
          cropRectWidth: action.payload.width,
          cropRectHeight: action.payload.height,
        };
        draft.current.imageProps = {
          ...draft.current.imageProps,
          // todo, should X and Y be 0,0 after cropping?
          imageX: action.payload.imageX,
          imageY: action.payload.imageY,
        };
        break;

      case CanvasActions.DRAG_START:
        //   recordHistory(draft);
        break;

      case CanvasActions.DRAG_MOVE:
        draft.current.imageProps.imageX = action.payload.imageX;
        draft.current.imageProps.imageY = action.payload.imageY;
        break;

      case CanvasActions.DRAG_END:
        draft.current.imageProps.imageX = action.payload.imageX;
        draft.current.imageProps.imageY = action.payload.imageY;
        break;

      case CanvasActions.SELECT_RESIZE:
        console.log("select");
        draft.current.cropRect.cropRectWidth = action.payload.cropRectWidth;
        draft.current.cropRect.cropRectHeight = action.payload.cropRectHeight;

        draft.current.canvasAction = CanvasActions.SELECT_RESIZE;
        break;

      case CanvasActions.DESELECT_RESIZE:
        console.log("deselect");
        draft.current.canvasAction = CanvasActions.NONE;
        break;

      case CanvasActions.SELECT_CROP:
        draft.current.canvasAction = CanvasActions.SELECT_CROP;
        break;

      case CanvasActions.DESELECT_CROP:
        draft.current.canvasAction = CanvasActions.NONE;
        break;

      case "undo":
        //   undoAction(draft);
        break;

      case "redo":
        //   redoAction(draft);
        break;

      case "reset":
        return draft;
    }
  });
}
