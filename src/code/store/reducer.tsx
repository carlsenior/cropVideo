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
  imageCrop: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  canvasAction: CanvasActions.NONE,
};

export const initialCanvasHistoryState: CanvasHistoryState = {
  current: initialCanvasState,
  undoStack: [],
  redoStack: [],
  keepRatio: false,
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
      case CanvasActions.SET_IMAGE_CROP:
        draft.current.imageCrop = action.payload;
        draft.undoStack.push({ ...draft.current });
        break;
      case CanvasActions.CROP:
        // get intersection between cropRect and imageRect
        const new_imageProps = {
          ...draft.current.imageProps,
          x: Math.max(draft.current.imageProps.x, draft.current.cropRect.x),
          y: Math.max(draft.current.imageProps.y, draft.current.cropRect.y),
          width: Math.max(
            0,
            Math.min(
              draft.current.cropRect.x + draft.current.cropRect.width,
              draft.current.imageProps.x + draft.current.imageProps.width
            ) - Math.max(draft.current.imageProps.x, draft.current.cropRect.x)
          ),
          height: Math.max(
            0,
            Math.min(
              draft.current.cropRect.y + draft.current.cropRect.height,
              draft.current.imageProps.y + draft.current.imageProps.height
            ) - Math.max(draft.current.imageProps.y, draft.current.cropRect.y)
          ),
        };
        // update image crop if there is new width and new height of intersection
        if (new_imageProps.width > 0 && new_imageProps.height > 0) {
          // draft.current.imageProps = new_imageProps;
          // there are 5 available cases
          let new_crop = { ...draft.current.imageCrop };
          // 1. case if intersection includes left-top corner of imageRect
          if (
            draft.current.imageProps.x === new_imageProps.x &&
            draft.current.cropRect.y <= draft.current.imageProps.y
          ) {
            new_crop.width *=
              Math.min(new_imageProps.width, draft.current.imageProps.width) /
              draft.current.imageProps.width;
            new_crop.height *=
              Math.min(new_imageProps.height, draft.current.imageProps.height) /
              draft.current.imageProps.height;
          }
          // 2. case if intersection includes right-top corner of imageRect
          else if (
            draft.current.imageProps.x + draft.current.imageProps.width ===
              new_imageProps.x + new_imageProps.width &&
            draft.current.cropRect.y <= draft.current.imageProps.y
          ) {
            const go_advance_x =
              ((draft.current.imageProps.width - new_imageProps.width) /
                draft.current.imageProps.width) *
              new_crop.width;
            new_crop.x += go_advance_x;
            new_crop.width -= go_advance_x;
            new_crop.height *=
              Math.min(new_imageProps.height, draft.current.imageProps.height) /
              draft.current.imageProps.height;
          }
          // 3. case if intersection includes left-bottom corner of imageRect
          else if (
            draft.current.imageProps.x === new_imageProps.x &&
            draft.current.cropRect.y > draft.current.imageProps.y
          ) {
            const go_advance_y =
              ((draft.current.imageProps.height - new_imageProps.height) /
                draft.current.imageProps.height) *
              new_crop.height;
            new_crop.y += go_advance_y;
            new_crop.height -= go_advance_y;
            new_crop.width *=
              Math.min(new_imageProps.width, draft.current.imageProps.width) /
              draft.current.imageProps.width;
          }
          // 4. case if intersection includes right-bottom corner of imageRect
          else if (
            draft.current.imageProps.x + draft.current.imageProps.width ===
              new_imageProps.x + new_imageProps.width &&
            draft.current.cropRect.y > draft.current.imageProps.y
          ) {
            const go_advance_x =
              ((draft.current.imageProps.width - new_imageProps.width) /
                draft.current.imageProps.width) *
              new_crop.width;
            const go_advance_y =
              ((draft.current.imageProps.height - new_imageProps.height) /
                draft.current.imageProps.height) *
              new_crop.height;
            new_crop.x += go_advance_x;
            new_crop.width -= go_advance_x;
            new_crop.y += go_advance_y;
            new_crop.height -= go_advance_y;
          }
          draft.current.imageProps = new_imageProps;
          draft.current.imageCrop = new_crop;
          draft.current.canvasAction = CanvasActions.CROP;
          recordHistory(draft);
        } else {
          // update nothing
          draft.current.canvasAction = CanvasActions.NONE;
        }

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
          width: draft.current.imageProps.height * aspectRatio,
          x: draft.current.imageProps.x * scaleX,
          restrict: draft.current.imageProps.restrict * scaleX,
        };
        draft.current.cropRect = {
          ...draft.current.cropRect,
          width: draft.current.cropRect.height * aspectRatio,
          x: draft.current.cropRect.x * scaleX,
          restrict: draft.current.cropRect.restrict * scaleX,
        };
        draft.keepRatio = true;
        draft.current.canvasAction = CanvasActions.NONE;
        recordHistory(draft);
        break;
      default:
    }
    return draft;
  });
}
