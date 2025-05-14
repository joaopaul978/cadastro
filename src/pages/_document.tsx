
import AuthProvider from '@/contexts/AuthContext';
import { Html, Head, NextScript, Main } from 'next/document';
import React, { useEffect, useState } from 'react';


export default function Document() {

  return ( 
    <div> 
    <Html lang="en">
    <Head />  
   
      <Main /> 
    
      <NextScript />      
     
    </Html> 
    
     </div>
 )
}
