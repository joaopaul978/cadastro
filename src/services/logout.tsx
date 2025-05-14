
'use client';

import router from "next/router";
import { destroyCookie, parseCookies } from "nookies";
export default function logout() {    
    destroyCookie(undefined, 'CadsToken');   
    setTimeout(()=>{ 
      const {'id': codEnt} = parseCookies();
      codEnt ? router.push(`/?id=${codEnt}`) : router.push(`/?id=`); console.log('obs: EXpired')}          
    ,1000)
  }