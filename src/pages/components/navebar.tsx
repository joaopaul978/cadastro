'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Container, Dropdown, DropdownButton, InputGroup, Modal, Nav, Navbar, Table } from 'react-bootstrap';
import { Button, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Link from 'next/link';

import { AuthContext } from '@/contexts/AuthContext';
import { IAssinaturas, IBancos, IUser } from '@/services/interfaces';
import router from 'next/router';
import LinearProgress from '@mui/material/LinearProgress';
import Image from 'next/image'
import Api from '@/services/Api';
import { currencyBRL } from '@/util/validacao';

export default function NaveBar() {

  const provid = useContext(AuthContext);
  //const auth = useContext(AuthContext); 
  //const [auth,setAuth] = useState(false);
  const initState = { cod_ent: '', id_ent: 0, username: '', password: '',  resp_manute: '',inscricao:'',id_user:0, usu_cad:'',pago:'', data_pgmto:'',valor_real:'',nossonum:'',nome_pessoa:'', des_rec:'', data_venc:''}
  const [state, setState] = useState(initState);
  //const { manute } = state;
  const [resp_manute, setResp_manute] = useState({ result1: '',manute: '', err1: '', message: '', msg: '' });
  const imageRef = useRef<any>(null);
  const initialUser = { id_ent: 0, id_user: 0, username: '', password: '', confPass: '',confPass2: '', nome: '', email: '', telefone: '', role: 0,ativo:'',prv:'',isAdmin: '', data_cad: '', data_alt: '', imgperf: '', manute: '', resp_manute: '' };
  const [usuario, setUsuario] = useState(initialUser);
  const [arquivo, setArquivo] = useState('');
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const CloseM2 = () => { setShow2(false); setShow3(false); reset2(); setloadModal(false)}
  const [loadingDiag, setloadDiag] = useState(false);
  const initBanco = { id_ent: '', id_banco: '', agencia: '', conta: '', convenio: '', cod_banco: '', nome_banco: '', local_pgto: '', brasao: '', ativo: '', usu_cad: '', data_cad: '', data_alt: '' };
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedb, setIsCheckedb] = useState(false);
  const [bancos, setBancos] = useState<IBancos[]>([]);
  const [assinaturas, setAllAssin] = useState<IAssinaturas[]>([]);
  const initAssin = {id_ent:0,id_assin:'',nome:'',cargo:'',matricula:'',ativo:'',data_cad:'',obs_assin:'' }
  const [assin, setAssin] = useState(initAssin);
  const [banco, setBanco] = useState(initBanco);

  const reset2 = () => {
    setState(initState); setResp_manute({result1: '',manute: '', err1: '', message: '', msg: '' })
    setBanco(initBanco); setArquivo(''); setAssin(initAssin);
    let f1 = document.getElementById("rsf1");
    let f2 = document.getElementById("rsf2");
    let f3 = document.getElementById("rsf3");
    if (f1 !== null) f1.style.cssText = 'display: none';
    if (f2 !== null) f2.style.cssText = 'display: none';
    if (f3 !== null) f3.style.cssText = 'display: none';  
  };
  // const {'CadsToken': token} = parseCookies(); 
  const [rowId, setRowId] = useState(null);
  const [loadModal, setloadModal] = useState(false);
  const [modo, setModo] = useState('');

  const loadBancos = async (id_ent: any) => {
    await Api.get(`/bancos/${id_ent}`)
      .then((res) => {
        setBancos(res.data.result);
        setloadModal(false);
      }).catch((err) => {
        console.log(err.res);
      })
  };

  const NovoBanco = () => {
    reset2()
  }

  const ExcluirBanco = (id_banco:any) => {
    if(id_banco){    
      let id_user = provid.sessao?.id_user;
        Api.delete(`banco/${id_banco}/${id_user}`).then(()=>{
          modalBancos();
        }).catch((err)=>{console.log(err)});
    }else{ toast.warning('Selecione um Registro!')}
  };

  function validation() {
    let nome = document.getElementById("rsNome");
    let tel = document.getElementById("rsTel");
    let confPass = document.getElementById("rsSenha");
    let confSenha = document.getElementById("rsConfSenha");
    if (!usuario.nome) { if (nome !== null) nome.style.cssText = 'color: brown' }else{ if (nome !== null) nome.style.cssText = 'display: none'}
    if (!usuario.telefone) { if (tel !== null) tel.style.cssText = 'color: brown' }else{if (tel !== null) tel.style.cssText = 'display: none'}
    if (!usuario.confPass2) { if (confSenha !== null) confSenha.style.cssText = 'color: brown'; toast.warning('Digite Senha!') }else{ if(confSenha !== null) confSenha.style.cssText = 'display: none'}
    if (usuario.confPass?.length < 4) { if (confPass !== null) confPass.style.cssText = 'color: brown' }else{ if (confPass !== null) confPass.style.cssText = 'display: none' }
    if (usuario.confPass !== usuario.confPass2) { if (confSenha !== null) confSenha.style.cssText = 'color: brown' }else{ if (confSenha !== null) confSenha.style.cssText = 'display: none' }
    //toast.warning('Vericar Campos Obrigatórios')
  };
  function validationBx() {
    let f1 = document.getElementById("rsf1");
    let f2 = document.getElementById("rsf2");
    let f3 = document.getElementById("rsf3");

    if (!state.nossonum) { if (f1 !== null) f1.style.cssText = 'color: brown' }else{ if (f1 !== null) f1.style.cssText = 'display: none'}
    if (state.nossonum.length !== 14) { if (f1 !== null) f1.style.cssText = 'color: brown' }else{ if (f1 !== null) f1.style.cssText = 'display: none'}
    if (!state.data_pgmto) { if (f2 !== null) f2.style.cssText = 'color: brown' }else{if (f2 !== null) f2.style.cssText = 'display: none'}
    if (!state.valor_real) { if (f3 !== null) f3.style.cssText = 'color: brown'}else{ if(f3 !== null) f3.style.cssText = 'display: none'}
  };

  const consultaBaixa = () => {
    reset2();
    let f1 = document.getElementById("rsf1");
    if(state.nossonum.length !== 14){
      if (f1 !== null) f1.style.cssText = 'color: brown'     
    }else{
      if (f1 !== null) f1.style.cssText = 'display: none';
      let id_ent = provid.sessao?.id_ent;
      Api.get(`consultaBaixa/${state.nossonum}/${id_ent}`).then((res)=>{
        if(res.data.result1[0]){
          setState(res.data.result1[0]); 
        }else{toast.warning('DAM Não encontrado!')}
        
      }).catch((err)=>{console.log(err)});}
  };

  const efetuarBaixa = () => {
    if(state.nossonum.length !== 14 || !state.data_pgmto || !state.valor_real){ 
     return validationBx();
      }else{
         state.id_ent = provid.sessao?.id_ent as number;
         state.id_user = provid.sessao?.id_user as number;
          Api.put(`BaixaManual/`,state).then((res)=>{
            consultaBaixa();
            toast.success(res.data.msg); validationBx();
          }).catch((err)=>{console.log(err)});
      }        
  };  
  const estornoBaixa = () => { 
    let f1 = document.getElementById("rsf1");
    if(state.nossonum.length !== 14 ){ 
      if (f1 !== null) f1.style.cssText = 'color: brown'
      }else{
        if (f1 !== null) f1.style.cssText = 'display: none'
         state.id_ent = provid.sessao?.id_ent as number;
         state.id_user = provid.sessao?.id_user as number;
          Api.put(`estornoBaixa/`,state).then((res)=>{ consultaBaixa()
            toast.success(res.data.msg)
          }).catch((err)=>{console.log(err)});
      }      
  };  

  const EditarBanco = async (id: any) => {
    await Api.get(`/banco/${id}`)
      .then((res) => {
        setBanco(res.data.result[0]);
        setloadModal(false);
      }).catch((err) => {
        console.log(err.res);
      })
  }

  const SalvarBanco = async (e: any) => {
    e.preventDefault();
    if (!banco.cod_banco || !banco.nome_banco || !banco.agencia || !banco.conta || !banco.convenio) {
      return validation();
    } else {
      banco.id_ent = provid.sessao?.id_ent as any;
      banco.data_cad = new Date().toLocaleString() + '';
      banco.data_alt = new Date().toLocaleString() + ''; //<--Só quando for PUT
      banco.usu_cad = provid.sessao?.username as string;
      const formData = new FormData();
      formData.append('id_ent', banco.id_ent);
      formData.append('id_banco', banco.id_banco);
      formData.append('usu_cad', banco.usu_cad);
      formData.append('cod_banco', banco.cod_banco);
      formData.append('nome_banco', banco.nome_banco);
      formData.append('agencia', banco.agencia);
      formData.append('conta', banco.conta);
      formData.append('convenio', banco.convenio);
      formData.append('local_pgto', banco.local_pgto);
      formData.append('ativo', banco.ativo as any);
      formData.append('data_alt', banco.data_alt);
      formData.append('arquivo', arquivo);
      if (!banco.id_banco) {
        await Api.post("banco", banco).then((res) => {
          if (res) {
            reset2();
            loadBancos(provid.sessao?.id_ent)
            EditarBanco(res.data?.result.insertId);
          }
        })
      } else {
        Api.put(`banco`, formData)
          .then((res) => {
            setShow3(false);
            //setTimeout(()=> setShow3(true),100)        
            setShow3(true)
            EditarBanco(res.data?.id_banco)
          })
      }
    }
  }

  const EditarUser = (id_user: any) => {
    setloadModal(true);
    setRowId(id_user)
    setShow2(true);
    Api.get(`/usuario/${id_user}`).then((response) => {
      if (response) {
        setUsuario(response.data.result[0]);
        setloadModal(false);
      }else{setShow2(false);}
    })
  }

  const Alterar = () => { setRowId(null) }
  const Cancelar = (rowId: any) => {
    if (rowId) {
      setRowId(rowId)
      EditarUser(rowId);
    } else { CloseM2(); }
  }

  const handlerImagem = (e: any) => {
    imageRef.current!.src = URL.createObjectURL(e.target.files[0])
    setArquivo(e.target.files[0])
  };
  // const handlerImgBrasao = (e:any)=>{
  //   imageRef.current!.src = URL.createObjectURL(e.target.files[0])
  //   setBrasao(e.target.files[0])    
  // };
  const apagarImg = () =>{    
    //imageRef.current.src = null;    
    imageRef.current!.src = '/simg.png';
    usuario.imgperf = '';
    setArquivo('')
  }
  const handleOnCheck = (e: any) => {
    //e.preventDefault();
    const { name, value } = e.target;
    setIsChecked(!isChecked);
    setIsCheckedb(!isCheckedb);
    setUsuario({ ...usuario, [name]: value });
    setState({ ...state, [name]: value });
    setAssin({ ...assin, [name]: value });
    setBanco({ ...banco, [name]: value });
  };

  const handleInput = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
    setState({ ...state, [name]: value });
    setAssin({ ...assin, [name]: value.toUpperCase() });
    setBanco({ ...banco, [name]: value.toUpperCase() });    
    setResp_manute({ ...resp_manute, [name]: value });
  };

  const logout = (e: any) => {
    e.preventDefault();
    //const {'ecode': idEnt} = parseCookies();        
    // setCookie(undefined, 'CadsToken','');
    toast.success('Saindo');
    router.push(`/?ecode=${provid.sessao?.cod_ent}`);
    // destroyCookie(undefined, 'CadsToken');  ;
  }
  const modalBaixas = async () => {
    setShow3(true); setModo('Baixas') 
  }
  const modalCalc = async () => {
    setShow3(true); setModo('Calcular') 
  }
  const modalAssin = async () => {
    setloadModal(true);
    setShow3(true); loadAssin(); setModo('Assinaturas')
  }
  const modalBancos = async () => {
    let id_ent = provid.sessao?.id_ent as any;
    loadBancos(id_ent);
    setShow3(true); setModo('Bancos')
  }

  const salvarUser = async (e: any) => {
    e.preventDefault();
    if (!usuario.nome || !usuario.telefone ) {
      return validation()
    } else {
      validation();
      usuario.data_cad = new Date().toLocaleString() + '';
      usuario.data_alt = new Date().toLocaleString() + ''; //<--Só quando for PUT
      const formData = new FormData();
      formData.append('id_ent', usuario.id_ent as any);
      formData.append('id_user', usuario.id_user as any);
      formData.append('username', usuario.username);
      if(usuario.confPass){ // se a senha for diferente do confirmar, a senha atual volta pra o banco.
        formData.append('password', usuario.confPass);
      }else{formData.append('password', usuario.password);}
      formData.append('nome', usuario.nome);
      formData.append('telefone', usuario.telefone);
      formData.append('email', usuario.email);
      formData.append('role', usuario.role as any);
      formData.append('prv', usuario.prv);
      formData.append('ativo', usuario.ativo);
      formData.append('data_cad', usuario.data_cad);
      formData.append('data_alt', usuario.data_alt);
      formData.append('arquivo', arquivo);
      if (!usuario.id_user) {
        alert("Erro F5");
      } else {
        if (!usuario.nome || !usuario.confPass || usuario.confPass !== usuario.confPass2 || usuario.confPass?.length < 4) {
          validation();
          toast.warning("Preencher campos Obrigatorios");
        } else {
          setloadModal(true);
          Api.put(`usuario`, formData)
            .then((response) => {
              setloadModal(false);
            })
        }
      }
    }
  }

  const manutencao = async (e: any) => {
    e.preventDefault();
    let id_user = provid.sessao?.id_user as number;
    let id_ent = provid.sessao?.id_ent as number;
    let manute = resp_manute.manute;
    await Api.post("/m4nut3", { id_user, manute, id_ent })
      .then((resp) => {
        setResp_manute(resp.data);
      }).catch(error => {
        setResp_manute(error.data);
      })
  }
  const versao = () => {
    Api.get(`/versao/`).then((res) => {
      console.log(res.data)
    });
  }

  const delAssin = (id: any) => {    
        if(id){
          Api.delete(`delAssin/${id}`).then(() => {
            loadAssin(); reset2();
          }).catch((error) => { console.log('error', error) });
        }else{toast.warning('Selecione um Registro!')}    
  };

  const edit_assin = async (id: any) => {
    setModo('Assinaturas');
    await Api.get(`/assinId/${id}`)
      .then((res) => {
        setAssin(res.data.result[0]);
        setloadModal(false);
      }).catch((err) => {
        console.log(err.res);
      })
  }

  const novaAssin = () =>{
    reset2()
  }

  const loadAssin = () => {
    setloadDiag(true);
    const id_ent = provid.sessao?.id_ent;
    Api.get(`/assinaturas/${id_ent}`).then((resp) => {
      if (resp) {
        setloadModal(false)
        setAllAssin(resp.data);
      }
    }).catch(() => { setAllAssin([]); setShow3(false); });
  }

  const SalvarAssin = async (e: any) => {
    e.preventDefault()    
    if (!assin.nome || !assin.cargo) {
      return validation();
    } else {
      setloadModal(true);
      //assin.data_cad = assin.data_cad.format('YYYY-MM-DD')
      assin.id_ent = provid.sessao?.id_ent as number;           
      if (!assin.id_assin) {
        Api.post(`/assinaturas`, assin).then((res) => {
          if(res){
            loadAssin();      
            edit_assin(res.data.result.id)   
            setloadModal(false);
          }             
        }).catch(() =>{ setAllAssin([]);
         });
      } else { 
        Api.put(`/assinaturas/`, assin).then((res) => {
          if(res){
          setloadModal(false);
          //setModo('Logradouros');
          loadAssin();
          }                  
        }).catch(() =>{setAllAssin([])});
      }
    }
  }
  const calcImovelAll = () => {
    if (provid.sessao?.id_ent as number) {
      state.id_ent = provid.sessao?.id_ent as number;
      state.id_user = provid.sessao?.id_user as number;
      state.usu_cad = provid.sessao?.username as string;
      //state.data_alt = new Date().toLocaleString() + '';
      Api.put(`/calcImovelALL`, state).then((res) => {
        setloadModal(false);
        setTimeout(() => {
        }, 200);
      }).catch(() => { });

    } else { toast.warn('Sen dados') }
  }

  return (
    <>
      <Navbar className='NaveBar' collapseOnSelect expand="lg" bg="primary" variant="dark" >
        <Container className='navcontainer'>
          <div> <Image alt='preview' src='/logoe.png' width="25" height="25" style={{ width: '25px', marginTop: '-9px' }} />
            <Navbar.Brand href="#" style={{ fontSize: '15pt' }} onClick={versao}>Elmar</Navbar.Brand></div>
          <Navbar.Collapse id="responsive-navbar-nav">
            {provid.auth &&
              <Nav>
                <ul className="pnl">
                  <li><Link href='./dashboard'><div className='menu' ><Image alt="brand" src='/home.png' width={25} height={25} /><p>Home</p></div></Link></li>

                  <li><div className='menu'><Image alt='preview' src='/pessoa.png' width={25} height={25} /><p>Pessoas</p></div>
                    <ul>
                      <Link className='link' href='./pessoas'><li><Image alt='preview' src='/pessoa.png' width={25} height={25} /> <span>Pessoas {provid.entidade?.tributos === 'S' && '/ Mercantil'}</span></li></Link>
                      <Link className='link' href='./logradouros' ><li><Image alt='preview' src='/xml.png' width={25} height={25} /> <span>Logradouros</span></li>   </Link>
                      <li onClick={modalAssin}><Image alt='preview' src="/caneta.png" width={25} height={25} /> <span>Assinaturas</span></li>
                    </ul>
                  </li>
                  <li><div className='menu' ><Image alt='preview' src="/lanc3.png" width={25} height={25} /><p>Baixas</p></div>
                    <ul>
                      <li onClick={modalBaixas}><Image alt='preview' src="/baixas.png" width={25} height={25} /> <span>Baixa Automáica</span></li>
                      <li onClick={modalBaixas}><Image alt='preview' src="/lanc1.png" width={25} height={25} /> <span>Baixa Manual</span></li>
                    </ul>
                  </li>                
                  <li><div className='menu'><Image alt='preview' width={25} height={25} src='/cemi.png' /><p>Cemiterios</p></div>
                    <ul>
                      <Link href='./tumulos'><li><Image alt='preview' width={25} height={25} src='/tum1.png' /> <span>Tumulos</span></li></Link>
                      <Link href='./sepmto'><li><Image alt='preview' width={25} height={25} src='/sepult.png' /> <span>Sepultamentos</span></li></Link>
                      <Link className='link' href='./pessoas'><li><Image alt='preview' src='/pessoa.png' width={25} height={25} /> <span>Pessoas</span></li></Link>
                      <Link href='./cemiterios'><li><Image alt='preview' width={25} height={25} src='/cemi.png' /> <span>Cemitérios</span></li></Link>
                    </ul>
                  </li>
                  {provid.entidade?.tributos === 'S' &&
                    <li><div className='menu'><Image alt='preview' width={25} height={25} src='/imoveis.png' /><p>Imobiliario</p></div>
                      <ul>
                        <Link href='./imoveis'><li><Image alt='preview' width={25} height={25} src='/imoveis.png' /> <span>Imoveis</span></li></Link>
                        <Link href='./itbi'><li><Image alt='preview' width={25} height={25} src='/calc4.png' /> <span>I.T.B.I.</span></li></Link>
                        <Link href='./loteamentos'><li><Image alt='preview' width={25} height={25} src='/xml1.png' /> <span>Loteamentos</span></li></Link>
                      </ul>
                    </li>}
                    <li><div className='menu' ><Image alt='preview' width={25} height={25} src='/config.png' /><p>Sistema</p></div>
                    <ul>
                      <Link className='link' href='./entidade'><li><Image alt="brand" src='/chaves.png' width={25} height={25} /> <span>Dados da Entidade</span></li></Link>
                      <li onClick={modalBancos}><Image alt='preview' src="/lanc4.png" width={28} height={28} /> <span>Cadastro de Bancos</span></li>
                      <Link className='link' href='./ajustes'><li><Image alt="brand" src='/config.png' width={25} height={25} /> <span>Configurações Ajustes</span></li></Link>
                      <li onClick={modalCalc}><Image alt='preview' src="/lanc2.png" width={28} height={28} /> <span>Calculos IPTU/Divida</span></li>
                    </ul>
                  </li>                    

                  <li><div className='menu'><Image alt='preview' width={25} height={25} src='/relat.png' /><p>Relatórios</p></div>
                    <ul>
                    <label htmlFor="" id='titleRel'>Pessoas</label>
                      <li><Image alt='preview' width={25} height={25} src='/print.png' /> <span>Relação Cadastral</span>
                      <ul className='subG'>                    
                        <li><Image alt='preview' width={25} height={25} src='/print.png' /> <span>Pessoas</span></li>                   
                      </ul> 
                      </li>   
                      <Link href='../relatorios/relacao_dams'><li><Image alt='preview' width={25} height={25} src='/print.png' /> <span>Relação DAMs Emitidos</span></li></Link>
                   
                      

                    <label htmlFor="" id='titleRel'>Cemitério</label>
                      <li><Image alt='preview' width={25} height={25} src='/print.png' /> <span>Tumulos</span></li>
                      <li><Image alt='preview' width={25} height={25} src='/print.png' /> <span>Sepultamentos</span></li>
                    <label htmlFor="" id='titleRel'>Recebimentos</label>
                      <Link href='../relatorios/recebimentos'><li><Image alt='preview' width={25} height={25} src='/print.png' /> <span>Recebimentos</span></li></Link>
                      <Link href='../relatorios/recebimentos_det'><li><Image alt='preview' width={25} height={25} src='/print.png' /> <span>Recebimentos Detalhado</span></li></Link>                      
                      <label htmlFor="" id='titleRel'>Imoveis</label>
                      <li><Image alt='preview' width={25} height={25} src='/print.png' /> <span>Relação Cadastral</span></li>
                      <li><Image alt='preview' width={25} height={25} src='/print.png' /> <span>Divida Ativa - Imovel</span></li>
                      <li><Image alt='preview' width={25} height={25} src='/print.png' /> <span>I.T.B.I.</span></li>
                    </ul>
                  </li>                 
                </ul>             
                  <div id="btns0">
                  <Link href='./receitas'>
                    <div className="pnl2">
                      <Image alt='preview' src='/lanc2.png' width={18} height={17} />
                      <p>Receitas</p>
                    </div></Link>
                    <div className="pnl2">
                      <Image alt='preview' src='/suport.png' width={16} height={16} />
                      <p>Suporte</p>
                    </div>
                    <div className="pnl2">
                      <Image alt='preview' src='/lancmto.png' width={18} height={17} />
                      <p>Virada Anual</p>
                    </div>
                    <div className="pnl2">
                      <Image alt='preview' src='/usercfg.png' width={18} height={17} />
                      <p>Manutenção</p>
                    </div>
                    </div>
              </Nav>}
          </Navbar.Collapse>
          <Nav className="me-right">
            {provid.auth &&
              <ul className="pnl">
                <li>
                  <div id='fotoPerfil' className='menu'>
                    <Image alt='preview'
                      loader={() => provid.sessao?.imgperf === '' ? '/noimg.jpg' : provid.sessao?.urlperf + `${provid.sessao?.imgperf}`}
                      src={provid.sessao?.imgperf === '' ? '/noimg.jpg' : provid.sessao?.urlperf + `${provid.sessao?.imgperf}`} width={30} height={30} id='img' />
                     <div className="linha-vertical"></div>                                    
                      <p style={{fontSize:'9pt'}}>{provid.sessao?.nome}</p>
                      <p style={{marginTop:'-15px', marginLeft:'8px',float:'left'}}>{(() => { switch (provid.sessao?.role) { case 1: return 'Administrador'; case 2: return 'Operador'; case 3: return 'Consulta'; } })()}</p>                   
                  </div>
                  <ul>
                    <li onClick={() => EditarUser(provid.sessao?.id_user)}><Image alt='preview' width="25" height="25" src='/user.png' /> <span>Painel</span></li>
                    <li onClick={provid.logoutP}><Image alt='preview' width="25" height="25" src='/chaves.png' /> <span>Sair</span></li>
                  </ul>

                </li>
              </ul>}
          </Nav>
        </Container>
      </Navbar>
      <Modal className="modal" show={show2} onHide={CloseM2} animation={false}>
        <Modal.Header closeButton id="modalHeader">
          <Image alt='preview' width="20" height="20" src='/logoe.png' title={`#${usuario.id_ent} ${usuario.id_user}`}/><p>Elmar Tecnologia</p>
        </Modal.Header>
        <Modal.Body id='modalBody_diag'>
          <div id="btns">
            <button onClick={() => Alterar()} disabled={!rowId ? true : false} style={!rowId ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}} id="btActive"><Image alt='preview' width="25" height="25" src='/lup.png' /><p>Alterar</p></button>
            <button onClick={() => Cancelar(usuario.id_user)} disabled={rowId ? true : false} style={rowId ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}} id="btActive"><Image alt='preview' width="25" height="25" src='/voltar.png' /><p>Cancelar</p></button>
            <button onClick={e => salvarUser(e)} disabled={rowId ? true : false} style={rowId ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}} id="btActive"><Image alt='preview' width="25" height="25" src='/slv.png' /><p>Salvar</p></button>
            <button onClick={() => CloseM2()}><Image alt='preview' width="25" height="25" src='/x.png'/><p>Fechar</p></button>
          </div>
          {loadModal && (
            <div>
              <LinearProgress variant="indeterminate" />
            </div>
          )}
          <div className="form-group m-2"><hr />
            <h5 className='ms-4'>Dados Usuário</h5><hr />
            <div id="titulo"><p>Dados Usuário</p></div>
            <Row className="m-1 mt-2">
              <input type="hidden" id="id_ent" name="id_ent" onChange={handleInput} value={usuario.id_ent || ""} />
              <input type="hidden" className="form-control" name="id_user" onChange={handleInput} value={usuario.id_user || ""} />
              <div className="form-group col-md-6">
                <label>Nome Usuário<span id="rsNome" style={{ display: "none" }}> é Obrigatório</span></label>
                <input type="text" className="form-control" name="nome" onChange={handleInput} value={usuario.nome || ""}
                  style={usuario.nome === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}
                  placeholder="Nome Usuário" />
              </div>
              <div className="form-group col-md-6">
                <label >Telefone<span id="rsTel" style={{ display: "none" }}> é Obrigatório</span></label>
                <input type="text" className="form-control" name="telefone" onChange={handleInput} value={usuario.telefone || ""}
                  style={usuario.telefone === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}
                  placeholder="(00) 00000-0000" />
              </div>
              <div className="form-group col-md mt-2">
                <label >Email</label>
                <input type="text" className="form-control" name="email" onChange={handleInput} value={usuario.email || ""} placeholder="Email" />
              </div>
            </Row>
            <hr />
            <div id="titulo"><p>Login / Senha</p></div>
            <Row className="m-2">
              <div className="form-group col-md-9">
                <label>Login</label>
                <input disabled type="text" className="form-control" name="username" onChange={handleInput} value={usuario.username || ""} placeholder="Login"
                  style={usuario.username === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                <Row className='mt-2'>
                  <label id="rsConfSenha" style={{ display: "none" }}> *Senhas não Conferem</label>
                  <div className="form-group col-md-6">
                    <label>Senha <span id="rsSenha" style={{ display: "none" }}>Minimo 4 Digitos</span></label>
                    <input type="password" id="confPass" className="form-control" name="confPass" onChange={handleInput} value={usuario.confPass}
                      style={usuario.confPass ? { borderLeftColor: 'green', borderLeftWidth: '5px' } : { borderLeftColor: 'brown', borderLeftWidth: '5px' }}
                      placeholder="Senha" />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Conf. Senha  </label>
                    <input type="password" className="form-control" name="confPass2" onChange={handleInput} value={usuario.confPass2}

                      style={usuario.confPass2 ? { borderLeftColor: 'green', borderLeftWidth: '5px' } : { borderLeftColor: 'brown', borderLeftWidth: '5px' }}
                      placeholder="Confirma Senha" />
                  </div>
                </Row>
              </div>
              {usuario.id_user && <div className="form-group col-md-3">
                <div className="form-group">
                  <label className="custom-file-upload">Foto Perfil
                    <input id="inputImagem" type="file" name="arquivo" onChange={handlerImagem} />
                    <div id="brasao">
                      <picture>
                        <img ref={imageRef}
                          src={usuario.imgperf === '' ? '/noimg.jpg' : provid.sessao?.urlperf + usuario.imgperf}
                          alt="picture"
                          width={73} height={73} />
                      </picture>
                    </div>
                  </label>
                  <span style={{marginTop:'20px',fontSize:'9pt', color:'green', cursor:'pointer'}} onClick={apagarImg}>Apagar Imagem</span>
                </div>
              </div>}

            </Row>   <hr />
            <div className='text-center mt-2'><label>Última Alteração: {usuario.data_alt}</label></div>
            {provid.sessao?.prv === 'S' && provid.sessao?.username === 'Master' &&
              <div>
                <div id="titulo"><p>*Administração - Manutenção</p></div>
                <Form onSubmit={manutencao} className="form">
                  <input type="hidden" id="id_ent" name="id_ent" onChange={handleInput} value={usuario.id_ent || ""} />
                  <input type="hidden" className="form-control" name="id_user" onChange={handleInput} value={usuario.id_user || ""} />

                  {loadModal && (
                    <div>
                      <LinearProgress variant="indeterminate" />
                    </div>
                  )}
                  <Row className="m-2 mb-0">
                    <div className="form-group ">
                      <textarea className="my_textarea form-control" placeholder="Descrição DAM..." rows={2}
                        style={resp_manute.manute === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}
                        onChange={handleInput} name='manute' value={resp_manute.manute} ></textarea>
                    </div>

                  </Row>
                  <Row className="m-2 mb-0">
                    <div className="form-group ">
                      <h6>{resp_manute.msg}</h6>
                      {/* <h6>{resp_manute.result1?.message as string}</h6>                    
                      <h6>{resp_manute.err1?.message as string}</h6> */}
                      <Button variant="outline-primary btn-sm float-end" id="button-addon2" style={{ height: '33px' }} type="submit">
                        Execultar... <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lightning" viewBox="0 0 16 16">
                          <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641zM6.374 1 4.168 8.5H7.5a.5.5 0 0 1 
                    .478.647L6.78 13.04 11.478 7H8a.5.5 0 0 1-.474-.658L9.306 1z"/></svg>
                      </Button>
                    </div>
                  </Row>
                </Form>
              </div>}           
          </div>
        </Modal.Body>
      </Modal>
      {/*Modal Baixa / Bancos*/}
      <Modal className="modal" show={show3} onHide={CloseM2} animation={false}>
        <div className="form">
          <Modal.Header closeButton id="modalHeader">
            <Image alt='preview' width="20" height="20" src='/logoe.png' title={`#${usuario.id_ent}`}/><p>Elmar Tecnologia</p>
          </Modal.Header>
          <Modal.Body id='modalBody'>
            {modo === 'Baixas' &&
              <div>
                <hr />
                <h4>Baixar Lançamentos (DAMs)</h4>
                <hr />              
                <label htmlFor="">Nosso Numero<span id="rsf1" style={{ display: "none" }}> Digite Nosso Numero! (14 Digitos)</span></label>               
                <InputGroup>
                  <Form.Control className="form-group col-md-3" placeholder="Digite o Nosso Numero" aria-label="Recipient's username" aria-describedby="basic-addon2"
                    name="nossonum" onChange={handleInput} value={state?.nossonum || ''} />
                 <Button variant="outline-secondary btn-sm" id="button-addon2" onClick={consultaBaixa}>
                          Consultar...<Image alt='preview' src='/lup.png' width={20} height={18} />
                        </Button>
                </InputGroup>
                <hr />
                <div id='area_console'>
                  {state.nome_pessoa && <div>
                     Nome: {state.nome_pessoa} <br />
                     Receita: {state.des_rec}<br />
                     Vencimento: {state.data_venc} - Valor Total: {currencyBRL(state.valor_real)}<br />
                     Situação: {(() => { switch (state.pago) { case 'S': return <span style={{ color: 'green',fontWeight:'bolder' }}>Pago</span>; case 'N': return <span style={{ color: 'brown',fontWeight:'bolder' }}>Não Pago</span>;}})()}
                     </div>
                  }
                </div>
                <Row className="col-md-12  mb-2">                 
                    <div className="form-group col-md-6" >
                      <label>Data Pagamento<span id="rsf2" style={{ display: "none" }}> é Obrigatório</span></label>
                      <input className='form-control form-control-solid w-250px' type='date' onChange={handleInput} name='data_pgmto' value={state.data_pgmto || ''}
                      style={!state.data_pgmto ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}/>
                    </div>
            
                    <div className="form-group col-md-6">
                      <label>Valor Total<span id="rsf3" style={{ display: "none" }}> é Obrigatório</span></label>                  
                        <input className='form-control form-control text-end' name="valor_real" onChange={handleInput} value={currencyBRL(state.valor_real || '')} placeholder='0,00' disabled
                          style={!state.valor_real ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} /> 
                    </div>
                  </Row>
                  <hr />
                  <Row className=" m-1"> 
                    <Button disabled={!state.pago ? true : false}  variant="primary" id="button-addon2" onClick={efetuarBaixa}>
                          Baixar Manual</Button>                          
                        <Button disabled={state.pago === 'S' ? false : true} className='mt-2' variant="danger" id="button-addon2" onClick={estornoBaixa}>
                          Estornar Pagamento</Button>                      
                        <Button className='mt-2' variant="secondary btn-sm" id="button-addon2" onClick={reset2}>
                          Reset</Button>
                   
                    </Row>
              </div>}
            {modo === 'Bancos' &&
              <div>
                <div id="btns">
                  <button onClick={NovoBanco}><Image alt='preview' src='/new.png' width={30} height={30} /><p>Novo</p></button>
                  <button onClick={modalBancos}><Image alt='preview' width={30} height={25} src='/atuali.png' /><p>Atualizar</p></button>
                  <button onClick={e => SalvarBanco(e)} disabled={!banco.nome_banco ? true : false} style={!banco.nome_banco ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' src='/slv.png' width={30} height={30} /><p>Salvar</p></button>
                  <button onClick={() => ExcluirBanco(banco.id_banco)} disabled={!banco.id_banco ? true : false} style={!banco.id_banco ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' src='/exc.png' width={30} height={30} /><p>Excluir</p></button>
                  <button onClick={CloseM2}><Image alt='preview' src='/x.png' width={30} height={30} /><p>Fechar</p></button>
                </div>
                {loadModal && (
                  <div>
                    <LinearProgress variant="indeterminate" />
                  </div>
                )}
                <div className="form-group">
                  <hr /><h5>{!banco.id_banco ? <span>Novo</span> : <span>Alterar</span>} Banco</h5><hr />
                  <div id="titulo"><p>Dados Bancários</p></div>
                  <Row className="ms-3 me-3">
                    <input type="hidden" id="id_ent" name="id_ent" onChange={handleInput} value={banco.id_ent || ""} />
                    <input type="hidden" className="form-control" name="id_banco" onChange={handleInput} value={banco.id_banco || ""} />
                    <div className="form-group col-md-4">
                      <label>Codigo Banco</label>
                      <input type="text" className="form-control" name="cod_banco" onChange={handleInput} value={banco.cod_banco || ""}
                        style={banco.cod_banco === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>
                    <div className="form-group col-md-3">
                    <label htmlFor="" className='ms-2'>
                      <input type="checkbox" id="ativo" name="ativo"
                        checked={banco.ativo === 'S' ? true : false}
                        value={isCheckedb ? 'N' : 'S'}
                        onChange={handleOnCheck} />
                       &nbsp;Ativo</label>
                    </div>
                    {banco.id_banco && 
                    <div className="form-group col-md-3">
                      <div className="form-group">
                        <label className="custom-file-upload">Brasão
                          <input id="inputImagem" type="file" name="arquivo" onChange={handlerImagem} />
                          <div id="brasao_banco">
                            <picture>
                              <img ref={imageRef}
                                src={banco.brasao === '' ? '/simg.jpg' : provid.entidade?.urlbras + banco.brasao}
                                alt="Landscap"
                                width={30} height={30} />
                            </picture>
                          </div>
                        </label>
                      </div>
                      <span style={{marginTop:'0px', marginLeft:'30px',position:'absolute',fontSize:'9pt', color:'green', cursor:'pointer'}} onClick={apagarImg}>Apagar Imagem</span>
                    </div>}
                  </Row>
                  <Row className="ms-3 me-3">
                    <input type="hidden" id="id_ent" name="id_ent" onChange={handleInput} value={banco.id_ent || ""} />
                    <div className="form-group">
                      <label>Nome Banco</label>
                      <input type="text" className="form-control" name="nome_banco" onChange={handleInput} value={banco.nome_banco || ""}
                        style={banco.nome_banco === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>
                    <div className="form-group mt-2 col-md-4">
                      <label >Agencia</label>
                      <input type="text" className="form-control" name="agencia" onChange={handleInput} value={banco.agencia || ""}
                        style={banco.agencia === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>
                    <div className="form-group mt-2 col-md-4">
                      <label >Conta</label>
                      <input type="text" className="form-control" name="conta" onChange={handleInput} value={banco.conta || ""}
                        style={banco.conta === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>
                    <div className="form-group mt-2 col-md-4">
                      <label >Convênio</label>
                      <input type="text" className="form-control" name="convenio" onChange={handleInput} value={banco.convenio || ""}
                        style={banco.convenio === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>
                  </Row>
                  <hr />
                  <div id="titulo">
                    <p>Ajustes</p>
                  </div>
                  <Row className="m-2">
                    <div className="form-group">
                      <label>Local Pagamento</label>
                      <input type="text" className="form-control" name="local_pgto" onChange={handleInput} value={banco.local_pgto || ""} />
                    </div>
                  </Row> <hr />  <h6 id='titleR'>Bancos Cadastrados</h6>
                
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th className='text-center'>Codigo</th>
                        <th>Nome</th>
                        <th className='text-center'>Situação</th>
                        <th>Opções</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bancos?.map((item: any) => {
                        return (
                          <tr key={item.id_banco} id={item.id_banco}
                            style={banco.id_banco == item.id_banco ? { backgroundColor: '#abc8ff', fontWeight: 600, cursor: 'pointer' } : {}}>
                            {/*  <td id='brasao2'><Image alt='preview' src={item.imgperf === '' ? '../noimg.jpg' : caminho2 + item.imgperf}  /></td>*/}
                            <td className='text-center'>{item.cod_banco}</td>
                            <td>{item.nome_banco}</td>
                            <td className='text-center'><span>{item.ativo === 'S' ? 'Ativo': 'Inativo' }</span></td>
                            <td className="col_f text-center pe-2">
                              <span onClick={() => EditarBanco(item.id_banco)} id="badgesuccs">Editar</span></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                  <hr />                
                </div>
              </div>}
              {modo === 'Assinaturas' && 
              <div>
              <div id="btns">
             <button onClick={novaAssin}><Image alt='preview' width={30} height={25} src='/new.png' /><p>Novo</p></button>
                  <button onClick={loadAssin}><Image alt='preview' width={30} height={25} src='/atuali.png' /><p>Atualizar</p></button>
                  <button onClick={() => delAssin(assin.id_assin)} disabled={!assin.id_assin ? true : false} style={!assin.id_assin ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' src='/exc.png' width={30} height={30} /><p>Excluir</p></button>
                  <button onClick={e => SalvarAssin(e)} disabled={!assin.nome ? true : false} style={!assin.nome ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' src='/slv.png' width={30} height={30} /><p>Salvar</p></button>
              <button onClick={CloseM2}><Image alt='preview' src='/x.png' width={30} height={30} /><p>Fechar</p></button>
            </div>
            {loadModal && (
              <div>
                <LinearProgress variant="indeterminate" />
              </div>
            )}
            <div className="form-group "><hr />
              <h5>{!assin.id_assin ? <span>Nova</span> : <span>Alterar</span>} Assinatura</h5>
             <hr />
              <div id="titulo"><p>Dados Assinatura</p></div>
              <Row className="">               
                <input type="hidden" className="form-control" name="id_assin" onChange={handleInput} value={assin.id_assin || ""} />
                <div className="form-group">
                  <label>Nome<span id="rsNome" style={{ display: "none" }}> é Obrigatório</span></label>
                  <input type="text" className="form-control" name="nome" onChange={handleInput} value={assin.nome || ""} placeholder="Nome Assinante" maxLength={40}
                    style={assin.nome === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                </div>               
                <div className="form-group ">
                        <div className="form-group mt-2">
                        <label>Cargo<span id="rsNome" style={{ display: "none" }}> é Obrigatório</span></label>
                  <input type="text" className="form-control" name="cargo" onChange={handleInput} value={assin.cargo || ""} placeholder="Cargo Assinante" maxLength={40}
                    style={assin.cargo === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                </div>
                </div>
                <div className="form-group mt-2 col-md-8">
                  <label >Matricula<span id="rsTel" style={{ display: "none" }}> é Obrigatório</span></label>
                  <input type="text" className="form-control" name="matricula" onChange={handleInput} value={assin.matricula || ""} maxLength={10} placeholder="0012 / 2024" />
                </div>
                <div className="form-group mt-2 col-md-2">
                            <label>Situação</label>
                              <label key={assin.id_assin} className="container">
                                <input type="checkbox"  name='ativo' checked={[`${assin.ativo}`].toString() === 'S' ? true : false}
                                  value={isChecked ? 'N' : 'S'} onChange={handleOnCheck} />
                                Ativo</label>                         
                        </div>
              </Row>
              <hr />
              <div id="titulo">
                <p>Observações</p>
              </div>
              <div className="form-group ">
                  <textarea className="my_textarea form-control" placeholder="Observações..." rows={2} style={{ backgroundColor: 'white' }}
                    name="obs_assin" onChange={handleInput} value={assin.obs_assin || ""}></textarea>
                </div>
              <hr />
              <h6 id='titleR'>Assinaturas</h6>
              <div style={{background:'white', border:'solid #b0b1b2 1px'}}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Ativo</th>
                    <th>Oções</th>      
                  </tr>
                </thead>
                <tbody>
                  {assinaturas?.map((item: any) => {
                    return (
                      <tr key={item.id_assin} id={item.id_assin} className={assin.id_assin === item.id_assin ? "bgactive" : ""}>
                        {/*  <td id='brasao2'><Image alt='preview' src={item.imgperf === '' ? '../noimg.jpg' : caminho2 + item.imgperf}  /></td>*/}
                        <td>{item.nome}</td>            
                        <td style={{ textAlign: 'center' }}><span>{item.ativo === 'S' ? 'SIM' : 'Não' }</span></td>
                        <td className="col_a text-center pe-2">
                          <span onClick={() => edit_assin(item.id_assin)} id="badgesuccs">Editar</span>          
                        </td>
                      </tr> ) })}
                </tbody>
              </Table></div>
              <hr />          
            </div>
            </div>
              }
               {modo === 'Calcular' &&
              <div>
                <br/>
                <h4>Calculos de IPTU / Divida Ativa</h4>
                <hr />
                <div className='mb-2'>
                  <label>Inscrições: </label>
                  <input type="text"  name="inscricao"  value={state.inscricao} onChange={handleInput}/>
                </div>
                <div id='area_console'>

                </div>
                <hr />
                <Row className="m-2 mb-4" id='inputsValor'>
              <div className="d-flex align-items-end justify-content-center col-md-12">
              <div id='bt_g'><Image alt='preview' src='/calc5.png' width={35} height={35} /><p>Calcular IPTU</p></div>
              <div id='bt_g'><Image alt='preview' src='/calc5.png' width={35} height={35} /><p>Calcular Divida</p></div>
              </div>
            </Row>
                <div className='text-center'>
                
                </div>
              </div>}
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
}