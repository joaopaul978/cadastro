import { useCallback, useRef } from 'react'
//serve pra dá um atraso nas chamadas do backEnd
//Já que a aplicação inicia sem os dados.
export const useDebounce = (delay = 8000) => {
    const deboucing = useRef<NodeJS.Timeout>();
    
    //isFirstTime serve pra n dá atraso na primeira consulta
    const isFirstTime = useRef(true);

    const debounce = useCallback((func: () => void) => {  
        if (isFirstTime.current){
            isFirstTime.current = false;
            func();
        }else{
            if(deboucing.current){
                clearTimeout(deboucing.current);
            }
            deboucing.current = setTimeout(()=>func(),delay);
        }      

    },[delay]);
  
return{ debounce };
 
}