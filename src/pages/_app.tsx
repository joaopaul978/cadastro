
"use client"
import React, { useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import AuthProvider from '@/contexts/AuthContext'
import NaveBar from './components/navebar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './components/loading';
import { useState } from 'react';
import Aside from './components/aside';
import Footer from './components/footer';
import router from "next/router";


export default function App({ Component, pageProps }: AppProps) {
  const [load, setLoad] = useState(true);

//   useEffect(() => {      
//     const handleStart = (url:any) => (url !== router.asPath) && setLoad(true);
//     const handleComplete = (url:any) => (url === router.asPath) && setLoad(false);
   
//            router.events.on('routeChangeStart', handleStart)
//            router.events.on('routeChangeComplete', handleComplete)
//            router.events.on('routeChangeError', handleComplete)
// }, [load]); 

  return (      

<AuthProvider>

    <NaveBar />  
    <div id='containers'>
         <Aside /> 
    <ToastContainer position="top-center" autoClose={800} hideProgressBar={false}
            newestOnTop={false} closeOnClick rtl={false}  pauseOnFocusLoss
            draggable  pauseOnHover  theme="light" />   
               {/* { load && <Loading /> }     */}
    <Component {...pageProps} />
    </div>   
   <Footer/> 
 </AuthProvider>
  )
}
