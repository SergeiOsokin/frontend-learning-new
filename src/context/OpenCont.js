// чтобы передавать контекст по всему приложению
import { createContext } from 'react';

export const Cont = createContext({
    open: false,
    setOpen: (el) => { console.log(el) }
});