import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image'

export default function MenuLink(){
  const pathname = usePathname();
  return (         
    <div className='menuLink'>       
    <div className="pnl">
                <li className={pathname == "/cadastro/dashboard" ? "active" : "mlink"}><Link  href='./dashboard'><Image alt='preview' src='../img/home.png' width={30}/><p>Home</p></Link></li>
                <li className={pathname == "/cadastro/pessoas" ? "active" : "mlink"}><Link  href='./pessoas'><Image alt='preview' src='../img/pessoa.png' width={30}/><p>Pessoas</p></Link></li>
                <li className={pathname == "/cadastro/imoveis" ? "active" : "mlink"}><Link  href='./imoveis'><Image alt='preview' src='../img/imoveis.png' width={30}/><p> Imobiliario</p></Link></li>
                <li className={pathname == "/cadastro/cemiterios" ? "active" : "mlink"}><Link  href='./cemiterios'><Image alt='preview' src='../img/cemi.png' width={30}/><p>Cemitério</p></Link></li>
                <li className={pathname == "/cadastro/usuarios" ? "active" : "mlink"}><Link  href='./ajustes' ><Image alt='preview' src='../img/config.png' width={30}/> <p>Ajustes</p>
                </Link></li>
  </div>  

  </div>       
   
  );
}