import {FC, ReactNode, useState} from "react";
import SnackbarContext, {ISnackbarContext, ISnackbarValues} from "./snackbarContext";
import {Alert, Snackbar} from "@mui/material";
export const SnackbarProvider: FC<{children: ReactNode}> = ({ children}) => {

    const [snackbarValues, setSnackbarValues] = useState<ISnackbarValues>({
       isOpen: false,
       duration: 3000,
       severity: "success",
    });

    const sharedValues: ISnackbarContext = {
        snackbarValues: snackbarValues,
        setSnackbarValues: setSnackbarValues,
    }

    return(
        <SnackbarContext.Provider value={sharedValues}>
            <Snackbar open={snackbarValues.isOpen} autoHideDuration={snackbarValues.duration} onClose={() => setSnackbarValues((prevState)=>({...prevState, isOpen: false}))}>
                <Alert
                    onClose={() => setSnackbarValues((prevState)=>({...prevState, isOpen: false}))}
                    severity={snackbarValues.severity}
                >

                </Alert>
            </Snackbar>
            {children}
        </SnackbarContext.Provider>
    );
};