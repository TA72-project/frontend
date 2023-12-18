import { createContext, Dispatch, SetStateAction, useContext } from "react";

export interface ISnackbarValues {
  isOpen: boolean;
  duration: number;
  severity: "error" | "warning" | "success" | "info";
  message: string;
}
export interface ISnackbarContext {
  snackbarValues: ISnackbarValues;
  setSnackbarValues: Dispatch<SetStateAction<ISnackbarValues>>;
}

const SnackbarContext = createContext<ISnackbarContext | undefined>(undefined);

export const useSnack = (): ISnackbarContext => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnack must be used within a SnackbarProvider");
  }
  return context;
};

export default SnackbarContext;
