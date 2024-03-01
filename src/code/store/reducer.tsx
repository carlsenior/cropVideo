import {
  CanvasProps,
  CanvasHistoryState,
  ImageProps,
} from "../../constants/types";
import { CanvasActions, CanvasReducerAction } from "../store/actions";
import { produce } from "immer";

const initialRect = {
  x: 0,
  y: 0,
  width: 720,
  height: 360,
};

const initialCanvasState: CanvasProps = {
  imageProps: initialRect,
  cropRect: initialRect,
  stageDimensions: initialRect,
  canvasAction: CanvasActions.NONE,
};

export const initialCanvasHistoryState: CanvasHistoryState = {
  current: initialCanvasState,
  undoStack: [initialCanvasState],
  redoStack: [],
  // inUndoRedo: false,
};

function recordHistory(draft: CanvasHistoryState) {
  draft.undoStack.push({ ...draft.current });
  draft.redoStack = [];
}

export function canvasPropsReducer(
  state: CanvasHistoryState,
  action: CanvasReducerAction
) {
  return produce(state, (draft) => {
    switch (action.type) {
      case CanvasActions.RESIZE:
        //   recordHistory(draft);

        // draft.current.imageProps.imageWidth = action.payload.width;
        // draft.current.imageProps.imageHeight = action.payload.height;
        break;

      case CanvasActions.CROP:
        //   recordHistory(draft);

        // draft.current.cropRect = {
        //   cropRectWidth: action.payload.width,
        //   cropRectHeight: action.payload.height,
        // };
        // draft.current.imageProps = {
        //   ...draft.current.imageProps,
        //   // todo, should X and Y be 0,0 after cropping?
        //   imageX: action.payload.imageX,
        //   imageY: action.payload.imageY,
        // };
        break;

      case CanvasActions.DRAG_START:
        //   recordHistory(draft);
        break;

      case CanvasActions.DRAG_MOVE:
        // draft.current.imageProps.imageX = action.payload.imageX;
        // draft.current.imageProps.imageY = action.payload.imageY;
        break;

      case CanvasActions.DRAG_END:
        // draft.current.imageProps.imageX = action.payload.imageX;
        // draft.current.imageProps.imageY = action.payload.imageY;
        break;

      case CanvasActions.IMAGE_RESIZE:
        draft.current.canvasAction = CanvasActions.IMAGE_RESIZE;
        recordHistory(draft);
        break;

      case CanvasActions.IMAGE_RELEASE:
        draft.current.canvasAction = CanvasActions.NONE;
        recordHistory(draft);
        break;
      case CanvasActions.REDO:
        if (draft.redoStack.length > 0) {
          const lastState = draft.redoStack.pop() as CanvasProps;
          draft.undoStack.push(lastState);
          draft.current = lastState;
        }
        break;
      case CanvasActions.UNDO:
        if (draft.undoStack.length > 1) {
          draft.redoStack.push(draft.undoStack.pop() as CanvasProps);
          const lastState = draft.undoStack[draft.undoStack.length - 1];
          draft.current = lastState;
        }
        break;
      case CanvasActions.SELECT_CROP:
        // draft.current.canvasAction = CanvasActions.SELECT_CROP;
        break;

      case CanvasActions.DESELECT_CROP:
        // draft.current.canvasAction = CanvasActions.NONE;
        break;

      case "undo":
        //   undoAction(draft);
        break;

      case "redo":
        //   redoAction(draft);
        break;

      case "reset":
      default:
    }
    return draft;
  });
}
