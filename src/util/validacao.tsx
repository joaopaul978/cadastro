export const phoneNumber = /\([1-9]{2}\) 9[1-9]\d{3}-\d{4}/;
//inscrição
// 01.002.0362.001.00
export const maskInsc = (v:string) => {
  //const provid = useContext(AuthContext); 
  
  return v.replace(/(\d{2})(\d{3})(\d{4})(\d{3})(\d{2})/, "$1.$2.$3.$4.$5");
  
}
export const gerarCodVeri = (value:any) => {  
let num;
for(var x=1, alfanum = num = ""; x<5; x++){
    var letra = String.fromCharCode(65+Math.floor(Math.random() * 26));
    var numero = String.fromCharCode(65+Math.floor(Math.random() * 26));
    var numero2 = Math.floor(Math.random() * 9);
    //alfanum += numero%2 == 0 ? letra : numero; // verifico se 'numero' é par para formar a sequência alfanumérica
    alfanum += letra; 
    num += numero2; // formo a sequência numérica
 }
 const Codveri = alfanum+"-"+num;  
 console.log(Codveri);
   return Codveri;
};

// CPF OU CNPJ juntos
export const maskCPFJ = (v: string) => {
     v = v.replace(/\D/g, "")
  
    if (v.length <= 11) {
      v = v.replace(/(\d{3})(\d)/, "$1.$2")
      v = v.replace(/(\d{3})(\d)/, "$1.$2")
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    } else {
        v = v.substring(0, 14); // limita em 14 números  
      v = v.replace(/^(\d{2})(\d)/, "$1.$2")
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")
      v = v.replace(/(\d{4})(\d)/, "$1-$2")
    }  
    return v
  }
    // R$ 1.542,00 com RS
  export const currencyBRL$ = (value:any) => {
    
     const formattedValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/\D/g, "");  
      return formattedValue;
  };
   // 1.542,00 sem RS
   export const currencyBRL = (value:any) => {
   // v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    //const v = new Intl.NumberFormat('pt-BR', {minimumFractionDigits: 2});  
  // const v = value.toLocaleString('pt-BR', {  currency: 'BRL' });
    const v = value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2}).replace(/[^0-9\.,]+/g, '');  
    return v
  };
  export const valorR = (v: any) => {
//     (^R\$ )?(\d+(\.)?)+(\,\d{1,2})?$
     //v = v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); 000,000,000,000,000
     //v = v.replace(/(\d{2})(,\d|$|\.)/, ',$1$2');  000000,00
     //v = v.replace(/(\d+)(\d{2})$/, "$1,$2")  0000,00
     //v = v.replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.") 0.000 só mil
  //   v = v.replace(/(\d{2})(,\d|$|\.)/, ',$1$2'); 
  v = v.toLocaleString().replace(/\D/g, "").replace(/(\d{2})(,\d|$|\.)/, ',$1$2');
     return v    
 }
  // (00) 00000-0000
  export const maskFone = (v: string) => {
    v = v.replace(/\D/g, "")
    v = v.substring(0, 11); // limita em 12 números  
    v=v.replace(/\D/g,"");             //Remove tudo o que não é dígito
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v=v.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
    return v;
 }
  // (00) 00000-0000
  export const maskFixo = (v: string) => {
    v = v.replace(/\D/g, "")
    v = v.substring(0, 10); // limita em 12 números  
    v=v.replace(/\D/g,"");             //Remove tudo o que não é dígito
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v=v.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
    return v;
 }

 // 00000-000
 export const maskCEP = (v: string) => {
    v = v.substring(0, 9); // limita em 8 números  
    v = v.replace(/\D/g, "").replace(/^(\d{5})(\d{3})+?$/, "$1-$2");
    return v 
  };

  // 00/00/0000
  export const maskDate = (v: string)  => {   
    v = v.substring(0, 10); // limita em 9 números  
      v = v.replace(/\D/g, "")
      v = v.replace(/(\d{2})(\d)/, "$1/$2")
      v = v.replace(/(\d{2})(\d)/, "$1/$2")
      v = v.replace(/(\d{4})(\d)/, "$1");
      return v  
  };

  // apenas que letras sejam digitadas
  export const maskOnlyLetras = (v: string) => {
    v = v.replace(/[0-9!@#¨$%^&*)(+=._-]+/g, "");
    return v
  };
  
  // Aceita apenas números
  export  const maskOnlyNumbers = (v: string) => {
    v = v.replace(/\D/g, "");
    return v
  };
  