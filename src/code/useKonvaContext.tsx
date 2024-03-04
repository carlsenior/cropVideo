import { useContext } from "react";
import { KonvaContext } from "./store/KonvaProvider";

const useKonvaContext = () => {
  const context = useContext(KonvaContext);

  if (context === undefined) {
    throw new Error("useKonva must be used within a CountProvider");
  }

  return context;
};

export default useKonvaContext;
