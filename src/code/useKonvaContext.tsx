import { useContext } from "react";
import { KonvaContext } from "./store/KonvaProvider";

// function recordHistory(draft: CanvasHistoryState) {
//   draft.undoStack.push(JSON.parse(JSON.stringify(draft.current)));
//   draft.redoStack = [];
// }

// function undoAction(draft: CanvasHistoryState) {
//   if (draft.undoStack.length === 0) return;

//   const prevState = draft.undoStack.pop();
//   if (prevState !== undefined) {
//     draft.redoStack.push({ ...draft.current });
//     draft.current = prevState;
//   }
// }

// function redoAction(draft: CanvasHistoryState) {
//   if (draft.redoStack.length === 0) return;

//   const nextState = draft.redoStack.pop();

//   draft.undoStack.push({ ...draft.current });
//   draft.current = { ...(nextState as CanvasProps) };
// }

const useKonvaContext = () => {
  const context = useContext(KonvaContext);

  if (context === undefined) {
    throw new Error("useKonva must be used within a CountProvider");
  }

  return context;
};

export default useKonvaContext;
