import Image from 'next/image';

export default function Loading() {

  return (         
   <div className='loader'>   
   <Image unoptimized className='load' src='/load.gif' width={30} height={40} alt='loading...'/>  <br />
   <label>Carregando...</label>  
       </div>  
  );
}
