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
  restrict: 100,
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
      case CanvasActions.SELECT_IMAGE:
        draft.current.canvasAction = CanvasActions.SELECT_IMAGE;
        recordHistory(draft);
        break;

      case CanvasActions.RELEASE_IMAGE:
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
        draft.current.canvasAction = CanvasActions.SELECT_CROP;
        recordHistory(draft);
        break;

      case CanvasActions.DESELECT_CROP:
        draft.current.canvasAction = CanvasActions.NONE;
        recordHistory(draft);
        break;
      case CanvasActions.SAVE_CROP_DIMENSION:
        draft.current.cropRect = {
          ...draft.current.cropRect,
          ...action.payload,
        };
        draft.current.canvasAction = CanvasActions.SELECT_CROP;
        recordHistory(draft);
        break;
      case CanvasActions.SAVE_IMAGE_DIMENSION:
        draft.current.imageProps = {
          ...draft.current.imageProps,
          ...action.payload,
        };
        draft.current.canvasAction = CanvasActions.SELECT_IMAGE;
        recordHistory(draft);
        break;
      case CanvasActions.SET_YOUTUBE_FORMAT:
      case CanvasActions.SET_TIKTOK_FORMAT:
        const aspectRatio =
          action.type === CanvasActions.SET_YOUTUBE_FORMAT ? 16 / 9 : 9 / 16;
        const oldWidth = draft.current.stageDimensions.width;
        draft.current.stageDimensions.width =
          draft.current.stageDimensions.height * aspectRatio;
        // calculate how much should be changed based on old width
        const scaleX = draft.current.stageDimensions.width / oldWidth;
        // update all width and x coordinates
        draft.current.imageProps = {
          ...draft.current.imageProps,
          width: draft.current.imageProps.width * scaleX,
          x: draft.current.imageProps.x * scaleX,
          restrict: draft.current.imageProps.restrict * scaleX,
        };
        draft.current.cropRect = {
          ...draft.current.cropRect,
          width: draft.current.cropRect.width * scaleX,
          x: draft.current.cropRect.x * scaleX,
          restrict: draft.current.cropRect.restrict * scaleX,
        };
        draft.current.canvasAction = CanvasActions.NONE;
        recordHistory(draft);
        break;
      default:
    }
    return draft;
  });
}
