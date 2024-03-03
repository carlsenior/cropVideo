import { useReducer, useMemo, createContext } from "react";
import { canvasPropsReducer, initialCanvasHistoryState } from "./reducer";
import { CanvasReducerAction } from "./actions";
import { KonvaContextType } from "../../constants/types";
import React from "react";

const initialKonvaContextValue: KonvaContextType = {
  canvasState: initialCanvasHistoryState,
  dispatch: () => {},
};

export const KonvaContext = createContext<KonvaContextType>(
  initialKonvaContextValue
);

export const KonvaProvider = ({ children }: { children: React.ReactNode }) => {
  const [canvasState, dispatch] = useReducer(
    canvasPropsReducer,
    initialCanvasHistoryState
  );

  const values = useMemo(
    () => ({
      canvasState,
      dispatch,
    }),
    [canvasState, dispatch]
  );

  return (
    <KonvaContext.Provider value={values}>{children}</KonvaContext.Provider>
  );
};
