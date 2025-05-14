'use client';
import { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '@/contexts/AuthContext';
import Image from 'next/image';
import React from "react";

import { Stack, TextField, Select, MenuItem, FormControl, InputLabel, Button, Grid, Input, IconButton } from "@mui/material";
import { toast } from 'react-toastify';
import test from 'node:test';

/*
 export const maskInsc5 = (v:string) => {
   const Provid = useContext(AuthContext); 
   //const mask = provid.entidade?.maskinsc as string | RegExp; 
   const mask = Provid.entidade?.maskinsc as string ; 
   switch(mask){      
      case '1':    v = v.replace(/\D/g, "") 
      v = v.substring(0, 14);
         //00.000.0000.000.00  
     v = v.replace(/(\d{2})(\d)/, "$1.$2")
     v = v.replace(/(\d{3})(\d)/, "$1.$2")
     v = v.replace(/(\d{4})(\d)/, "$1.$2")
     v = v.replace(/(\d{3})(\d{2})$/, "$1.$2") 
     return v ; break;
      case '2':   v = v.replace(/\D/g, "") 
      v = v.substring(0, 16);
      v = v.replace(/(\d{2})(\d)/, "$1.$2")
      v = v.replace(/(\d{2})(\d)/, "$1.$2")
      v = v.replace(/(\d{3})(\d)/, "$1.$2")
      v = v.replace(/(\d{4})(\d)/, "$1.$2")
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1.$2")
 return v ; break;
      case '5':  v = v.replace(/\D/g, "") 
      v = v.substring(0, 14);   
 return v ; break;       
      }  

//      if (mask === '1'){
//          v = v.replace(/\D/g, "") 
//     v = v.substring(0, 14);
//        //00.000.0000.000.00  
//    v = v.replace(/(\d{2})(\d)/, "$1.$2")
//    v = v.replace(/(\d{3})(\d)/, "$1.$2")
//    v = v.replace(/(\d{4})(\d)/, "$1.$2")
//    v = v.replace(/(\d{3})(\d{2})$/, "$1.$2") 
//    return v
//       }
//       if (mask === '2'){
//          v = v.replace(/\D/g, "") 
//          v = v.substring(0, 16);
//          v = v.replace(/(\d{2})(\d)/, "$1.$2")
//          v = v.replace(/(\d{2})(\d)/, "$1.$2")
//          v = v.replace(/(\d{3})(\d)/, "$1.$2")
//          v = v.replace(/(\d{4})(\d)/, "$1.$2")
//          v = v.replace(/(\d{3})(\d{1,2})$/, "$1.$2")
//     return v
//       }
//       if (mask === '5'){
//          v = v.replace(/\D/g, "") 
//          v = v.substring(0, 14);   
//     return v
//       } 

//  return v.replace(/(\d{2})(\d{3})(\d{4})(\d{3})(\d{2})/, "$1.$2.$3.$4.$5"); 

/*   v = v.replace(/\D/g, "") 
 v = v.substring(0, 14); // limita em 14 números  
//00.000.0000.00000  
v = v.replace(/(\d{2})(\d)/, "$1.$2")
 v = v.replace(/(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
 v = v.replace(/(\d{4})(\d)/, "$1.$2") */

/*   //00.000.0000.000.00  
 v = v.replace(/(\d{2})(\d)/, "$1.$2")
  v = v.replace(/(\d{3})(\d)/, "$1.$2")
  v = v.replace(/(\d{4})(\d)/, "$1.$2")
  v = v.replace(/(\d{3})(\d{2})$/, "$1.$2") 

  //00.00.000.0000.000.00  com distrito
  v = v.replace(/(\d{2})(\d)/, "$1.$2")
  v = v.replace(/(\d{2})(\d)/, "$1.$2")
  v = v.replace(/(\d{3})(\d)/, "$1.$2")
  v = v.replace(/(\d{4})(\d)/, "$1.$2")
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1.$2")
} 
} */


export default function Dashboard() {

    const provid = useContext(AuthContext);
    //useEffect(() => { },[]); 


    const tesste = () => {
        
    let data2 = new Date(); 

data2.setDate(data2.getDate() + 2);
console.log(data2.toLocaleDateString('pt-BR'));


// let data1 = new Date(venc_inicial);

// console.log('DSH',data1.toLocaleString("en-GB", { year: "numeric", day: "2-digit", month: "2-digit" }));


        // var data = '2024-09-24'
        // console.log(data.split('-').join('/'))       

        // var assin1 = '';
        // var assin2 = '';
        // var assin3 = '';   

        // //  {!assin1 || !assin2 || !assin3 ? 'LINHA' :'NOMES'}
        // console.log(assin1 || assin2 || assin3 ? 'NOMES' : 'LINHA')
        
        // var teste = '12.34-56&#/'
        // console.log('teste', teste);
        // console.log('teste2', teste.replace(/[^0-9]/g, ''))
    }

    const maskInsc3 = () => {
        var teste = '12.34-56&#/'
        var teste2 = teste;
        var char = ".-!?,";


        console.log('teste', teste);
        console.log('teste2', teste.replace(/[^0-9]/g, ''))
        var cpf = "12345678901";
        var resultado1 = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

        var resultado2 = cpf.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{2})/, "$1.$2.$3-$4")
        console.log('resultado', resultado1)
        console.log('resultado2', resultado2)
    }
    function formatarReal(v:any) {
        //return v.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        v = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2}).format(v);
        return v;        
      }

    const testNUmber = ()=>{
         const valorA = 1250.20;
        const valorFormatado = formatarReal(valorA);
          console.log(valorFormatado); // Saída: 1.234.567,89
    }

  
      const tessste = ()=>{
         let i = 0;
         let exercicio = new Date().getFullYear() + 1;
          do {
           exercicio = exercicio - 1;           
           console.log('teste',exercicio)
            i++;        }
        while (i < 6)         
      }
   
     

    let teste = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(new Date());

    const handleChange = (e: any) => {
        // setStartDate(e);
        var teste = e.target.value;
        console.log('is2:', teste.toLocaleDateString())
        setStartDate(teste);
        console.log(startDate)
    }
    //onChange={(date: any) => setStartDate(date)}
    //onChange={(date) => handleChange({target: { name: "myDate", value: date }})}

    return (
        <>
            {provid.auth &&
                <div id="container_body">
                    <div id='iPnl'>
                        <div id='tbody_dahsb'>
                            <div className="col-md-12">
                                <div className='entidade'>
                                    <picture>
                                        <img className='ent_brasao' src={!provid.entidade?.caminho ? '/bzpadrao.png' : `${provid.entidade?.urlbras}/${provid.entidade?.caminho}`} alt="picture" width={60} height={60} />
                                    </picture>
                                    <div className='ent_texto mt-3'>
                                        <p>{provid.sessao?.entidade}</p>
                                        <p>{provid.entidade?.secretaria && provid.entidade?.secretaria}</p>
                                        <p>{provid.entidade?.cnpj && provid.entidade?.cnpj}</p>
                                    </div>
                                </div>
                            </div>

                        
                            {/* <div className='entidade'>
         <Image alt='preview' className='ent_brasao' 
          loader={()=>!provid.sessao?.imgbras ? '/simg.jpg' : provid.sessao?.imgbras}
         src={!provid.sessao?.imgbras ? '/simg.jpg' : provid.sessao?.imgbras} width={60} height={60}/>                       
        <div className='ent_texto'>
           <h4> {provid.sessao?.entidade}</h4>
           <p className='text-nowrap'>{provid.sessao?.rua}, {provid.sessao?.numero} {provid.sessao?.bairro} - {provid.sessao?.uf}</p> 
           <p>{provid.sessao?.cnpj}</p>              
        </div>                     
         </div>    */}

                            {/* <Stack spacing={2} component="form">
            <h3>Beneficiário</h3>
            <TextField
                label="Nome do Beneficiário"
                
                required
            />
            <FormControl required>
                <InputLabel>Tipo da Chave Pix</InputLabel>
                <Select
                    label="Tipo da Chave Pix"
                   
                >
                    <MenuItem value="cpf">CPF</MenuItem>
                    <MenuItem value="cnpj">CNPJ</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="telefone">Telefone</MenuItem>
                    <MenuItem value="aleatoria">Chave Aleatória</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Chave Pix"
                
                required
            />
            <TextField
                label="Cidade"
                
                required
            />
            <Stack direction="row" spacing={2} justifyContent='space-between'>
                <Input
                    type="file"
                   
                    inputProps={{ style: { display: 'none' } }}
                    id="upload-button" // Adicione o atributo id aqui
                    style={{ display: 'none' }}
                />
             
            </Stack>
            <Stack direction="row" spacing={2} justifyContent='space-between'>
                <Button fullWidth variant="contained" color="primary" type="submit" onClick={tessste}>
                    Salvar
                </Button>
            </Stack>
             
        </Stack> */}
                        </div>   
          
           
                    </div>

                </div>}
        </>
    );
}



