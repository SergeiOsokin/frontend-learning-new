// чтобы передавать контекст по всему приложению
import { createContext } from 'react';

function nullMy () {}; 

export const AuthContext = createContext({
    authorization: false,
    userId: null,
    login: nullMy,
    logout: nullMy,
});