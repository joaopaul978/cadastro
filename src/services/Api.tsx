//'use client';

import Axios from "axios";
import { destroyCookie, parseCookies } from "nookies";

import { toast } from "react-toastify";
import logout from "@/services/logout";
import router from "next/router";

/* export default Axios.create({  
  baseURL:`http://localhost:3001/`
}); */

//const API_URL =  process.env.NODE_ENV === 'development' ? 'http://localhost:8080/admin/api' : '/admin-app/admin/api';

const Api = Axios.create({
    baseURL:`https://cadapi-oz3i.vercel.app/`
}); 

Api.interceptors.request.use((req) => {
  const {'CadsToken': token} = parseCookies();
  if(token){
      req.headers.sessao = `Bearer ${token}`;
  }
  return req;
});

/* Api.interceptors.response.use(
  function (response) { 
      let code = response.status;
      let dataCd = response.data;
      if (code === 200) {toast.success(dataCd);}
      if (code === 202) {toast.success('Login: Bem vindo');}                    
       return response; 
  }, 
  function (error) { 
       let code = error.response.status; console.log(error)
       let dataCd = error.response.data;
      if (code === 401) {toast.warn('Usuário Não autorizado!');logout()}
      if (code === 403) {toast.warn('Token Invalido!');logout();}
      if (code === 404) {toast.warn('Erro: Salvar/Consultar Dados');logout()}
      if (code === 405) {toast.warn('Não é Possivel excluir: Registro Chave');}    
      if (code === 500) {toast.warn(dataCd)}          
  }
); */

// MIGRADO PARA AUTH PROVID
  Api.interceptors.response.use(
      function (response) {      
          switch(response.status){ //200 alerta por json padrão. 201 alerta por varivel msg
            case 200: toast.success(response.data); break;     
            case 201: toast.success(response.data.msg); break;
            case 203: toast.error(response.data.msg); break;
            case 204: toast.info(response.data.msg); break;
           }
           return response;    
      }, 
      function (error) { //const provid = useContext(AuthContext);
           switch(error.response.status){ 
          // case 401: toast.warn(error.response.data); logout();break;
           case 401: toast.info(error.response.data);break;
           case 403: toast.info(error.response.data); destroyCookie(undefined, 'CadsToken');logout1(); break;
           case 404: toast.info(error.response.data);break;
           case 405: toast.error(error.response.data);break;     
           case 500: toast.info(error.response.data);break;  
           }               
      }
    ); 

const logout1 = () => {     
  destroyCookie(undefined, 'CadsToken');
  setTimeout(()=>{ 
    const {'ecode': idEnt} = parseCookies();
    idEnt ? router.push(`/?ecode=${idEnt}`) : router.push(`/?ecode=`); }     
  ,1000)  
};


/* Api.interceptors.request.use(
  config => {
    const {'CadsToken': token} = parseCookies();
      if (token) {
       config.headers.common['sessao'] = `Bearer ${token}`;
       config.headers.common['Content-Type'] = 'application/json; charset=utf-8';
      }
      return config;
  }
); */
//const auth = useContext(AuthContext)




export default Api;
