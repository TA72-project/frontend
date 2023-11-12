import {createContext, useContext} from "react";

export interface IFormValues{
    mail: string,
    password: string,
}

interface IAuthContext {
    login: (e: React.MouseEvent) => void;
    logout: () => Promise<void>;
    formValues: IFormValues;
    setFormValues: React.Dispatch<React.SetStateAction<IFormValues>>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;