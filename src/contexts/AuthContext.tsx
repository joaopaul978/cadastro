//"use client"
import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies"; //npm add nookies
import jwt_did from 'jwt-decode' //npm i jwt-did
import { useRouter } from "next/navigation";
import { IEntidade, ISessao } from "@/services/interfaces";

import { toast } from "react-toastify";
import Api from "@/services/Api";

type SignInData = {username: string; password: string;}
type AuthContextType = {
  entidade: IEntidade | null;
    sessao: ISessao | null; 
    codEnt:(id:number)=> void;
    logoutP:(e:any)=> void;
    auth: boolean;    
}

export const AuthContext = createContext({} as AuthContextType)

export default function AuthProvider({ children }: {children: React.ReactNode}) {
    const initiSessao = {id_ent: 0, cod_ent: 0, id_user: 0, nome: '',username: '', role: 0, entidade: '', cnpj: '', email: '', telefone: '', rua: '', numero: '', bairro: '', cidade: '', uf: '', arquivo: '',
    prv:'', urlperf: '', imgbras: '',imgperf:'',ver:'', calc_imovel:'',limit_rows:0 }
    const [sessao, setSessao] = useState<ISessao | null>(initiSessao)      
    const [entidade, setEntidade] = useState<IEntidade | null>(null);
    const router = useRouter();   
    const [auth,setAuth] = useState(false);
   
    const {'CadsToken': token} = parseCookies();
    const {'ecode': cod} = parseCookies();

  useEffect(() => { 
     if(token){
         setSessao(jwt_did(token));
         codEnt(parseInt(cod))
         setAuth(true);
       }else{    
        logoutP(); 
        //logoutP();
        /* setSessao(initiSessao); 
        setAuth(false);
         destroyCookie(undefined, 'CadsToken'); //em caso do token ser invalido  
         setTimeout(()=>{ 
          const {'id': idEnt} = parseCookies();
          if(idEnt){router.push(`/?ecode=${idEnt}`)}; console.log('obs: cancel handle houter')}          
        ,1000) */
        //if(idEnt === null){router.push(`/?ecode=`)}else{router.push(`/?ecode=${idEnt}`)} 
       }  
     },[token]); 

     const logoutP = ()=> {
      destroyCookie(undefined, 'CadsToken');
      setSessao(initiSessao); setAuth(false);      
      setTimeout(()=>{ 
        const {'ecode': idEnt} = parseCookies();
        idEnt ? router.push(`/?ecode=${idEnt}`) : router.push(`/?ecode=`)}
      ,1000)      
    }

    const codEnt = (cod_ent:number) => {
      Api.get(`/EntCod/${cod_ent}`).then((resp) => {
        if(resp.data.result[0] === undefined){
          router.push(`/?ecode=`)
        }else{
          setEntidade(resp.data.result[0]);
        }     
        }).catch(() => { router.push(`/?ecode=`) });                  
     }; 

//  const signIn = async ({username, password}:SignInData) => {
//      const {'id': id_ent} = parseCookies();
//         await Api.post("/login", { id_ent, username, password })
//         .then((resp) => { //pra lê a tipagem da bibiblioteca cookies, só instalar npm add @types/cooki -D              
//         setCookie(undefined, 'CadsToken',resp.data.Token_acesso,{
//         maxAge: 60 * 60 * 1, //1 hora    
//     });        
//    router.push(`/cadastro/dashboard`)
//             }).catch(() => {});     
//     }  
 
    return (
        <AuthContext.Provider value={{ codEnt,logoutP, auth, entidade, sessao }}>           
            {children}
        </AuthContext.Provider>
    )
}





