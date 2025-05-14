"use client"
import React, { useContext, useRef } from 'react'

import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { IEntidade } from '@/services/interfaces'

import { useRouter, useSearchParams } from 'next/navigation'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import Loading from './components/load'
import { toast } from 'react-toastify'
import { AuthContext } from '@/contexts/AuthContext';
import Image from 'next/image';
import Api from "@/services/Api";

const Login = () => {
  //const [dados, setEntidades] = useState<{ [key: string]: any }>({});
  const [entidades, setEntidades] = useState<IEntidade[]>([]);

  type SignInData = { username: string; password: string }

  const initialState = {
    id_user: 0, id_pessoa: '', cod_ent: 0, id_ent: 0, cod_pessoa: '', cnpj: '', email: '', usu_cad: '', entidade: '', telefone: '', fixo: '', agencia: '', conta: '', num_convenio: 0, nome_banco: '', num_banco: 0, local_pgto: '', tx1: 0, tx2: 0, tx3: 0,
    rua: '', numero: '', bairro: '', cidade: '', uf: '', cep: '', data_cad: '', secretaria: '', lei: '', decreto: '', data_alt: '', arquivo: '', caminho: '',
    campo1_nome: '', campo2_nome: '', campo3_nome: '', campo1_tam: 0, campo2_tam: 0, campo3_tam: 0, campo4_nome: '', campo5_nome: '', campo6_nome: '', urlperf: '', urlbras: '', username: 'joaopaulo', password: '123456'
  };
  const [state, setState] = useState(initialState);

  /*const initEntidad = {
    id_user: 0, id_pessoa: '', cod_ent: 0, id_ent: 0, cod_pessoa: '', cnpj: '', email: '', usu_cad:'', entidade: '', telefone: '', fixo: '', agencia: '', conta: '', num_convenio: 0, nome_banco: '', num_banco: 0, local_pgto: '', tx1: 0, tx2: 0, tx3: 0,
    rua: '', numero: '', bairro: '', cidade: '', uf: '', cep: '', data_cad: '', secretaria: '',lei:'',decreto:'', data_alt: '', arquivo: '', caminho: '',
    campo1_nome: '', campo2_nome: '', campo3_nome: '', campo1_tam: 0, campo2_tam: 0, campo3_tam: 0,campo4_nome: '',campo5_nome: '',campo6_nome: '', urlperf: '', urlbras: '',ver:'', calc_imovel:'',desconto_iptu:'',vvi:''};
  const [entidade, setEntidade] = useState<IEntidade>(initEntidad); */

  const { username, password } = state;
  const [box, setBox] = React.useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  //const { signIn } = useContext(AuthContext);

  const provid = useContext(AuthContext);

  useEffect(() => {
    const {'id': cod_ent} = parseCookies();
    switch (cod_ent) { 
      case '':
        router.push(`/?id=`);  
        break;
        case null:
          router.push(`/?id=`);  
          break;
      default:
        if (cod_ent) {      
          let id = parseInt(cod_ent as string);
          provid.codEnt(id);         
        }
        break;
    }
  }, [searchParams,provid]); 

  const signIn = async ({ username, password }: SignInData) => {
    //const {'id': id_ent} = parseCookies();
    let id_ent = provid.entidade?.id_ent;
    let codEnt = provid.entidade?.cod_ent;
    await Api.post("/login", { id_ent, username, password }).then((resp) => { //pra lê a tipagem da bibiblioteca cookies, só instalar npm add @types/cooki -D              
          setCookie(undefined, 'CadsToken', resp.data.Token_acesso, {
          maxAge: 60 * 60 * 1, //1 hora    
        });
        if(codEnt === 999025){
          router.push(`/cadastro/painel`);
        }else{router.push(`/cadastro/dashboard`)}
      }).catch(() => { });
  }

  // const signInAdm = async ({ username, password }: SignInData) => {
  //   let id_ent = '1'; console.log(id_ent, username, password)
  //   await Api.post("/login", { id_ent, username, password })
  //     .then((resp) => { //pra lê a tipagem da bibiblioteca cookies, só instalar npm add @types/cooki -D              
  //       setCookie(undefined, 'CadsTokenAdm', resp.data.Token_acesso, {
  //         maxAge: 60 * 60 * 1, //1 hora    
  //       });
  //       router.push(`/painel`);
  //       //loadDados();
  //       //setShow(true); 
  //     }).catch(() => { });
  // }

  // const HandleLoginAdm = async (e: any) => {
  //   e.preventDefault();
  //   const data = { username, password }
  //   await signInAdm(data)
  // }

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const data = { username, password }
    await signIn(data)
  }

  const handleInput = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    setState({ ...state, [name]: value })
  };

  return (
    <>
      <div className="flex-1">
        <div className="container col-md-8">
          <div className="row">       
              <div className="container_center">
                <div>
                  <div className="row">
                    <div className='login'>               
                      <Form onSubmit={handleLogin}>
                        <div className='cab'>
                          {/* <Image quality={75} alt='preview' unoptimized={true}
                            loader={() => !provid.entidade?.caminho ? '/simg.jpg' : provid.entidade?.urlbras + provid.entidade?.caminho}
                            src={!provid.entidade?.caminho ? '/simg.jpg' : provid.entidade?.urlbras + provid.entidade?.caminho}
                            width={90} height={90} /> */}                         
                          <picture>
                              <img className='ent_brasao' src={!provid.entidade?.caminho ? '/bzpadrao.png' : `${provid.entidade?.urlbras}/${provid.entidade?.caminho}`} alt="picture" width={90} height={90} />
                          </picture>
                          <h3>{provid.entidade?.entidade}</h3>
                          <p>{provid.entidade?.secretaria}</p>
                          <p>Arrecadação de Tributos</p>
                        </div>
                        
                        <h3>Login</h3>
                        <hr />
                        <div>
                          <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Usuário</Form.Label>
                            <Form.Control type="username" placeholder="Enter User" name="username" value={username} onChange={handleInput} />
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" name="password" value={password} onChange={handleInput} />
                          </Form.Group>
                          <div className="d-grid gap-2">
                            <span>Conectar-se!</span>
                            <Button variant="primary btn-md" type="submit">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z" />
                                <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                              </svg> Entrar
                            </Button>
                          </div>
                        </div>
                        <hr />
                        <span>© Copyright 2024</span>
                      </Form>
                    </div>
                  </div>
                </div>
              </div> 
          </div>
        </div>
      </div>
    </>
  )
}
export default Login;