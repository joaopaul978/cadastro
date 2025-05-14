import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { Button, Modal, Row, Table } from 'react-bootstrap';
//import Api from '@/components/Api';
//import Api from '@/components/Api';
import LinearProgress from '@mui/material/LinearProgress';
import { IUser } from '@/services/interfaces';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Api from "@/services/Api";
import { maskFone } from '@/util/validacao';

export default function Aside() {
  const provid = useContext(AuthContext);
  const pathname = usePathname();
  const [show2, setShow2] = useState(false);
  const initialUser = { id_ent: '', id_user: 0, username: '', password: '', confPass: '',confPass2: '', nome: '', email: '', telefone: '', role: 0, prv: '', data_cad: '', data_alt: '', imgperf: '',ativo:'' };
  const [usuario, setUsuario] = useState(initialUser);
  const resetUser = () => { setUsuario(initialUser); };
  const CloseM2 = () => { setShow2(false); resetUser(); setIsChecked(false); setloadModal(false); setRowId(null); }
  const [isChecked, setIsChecked] = useState(false);
  const [arquivo, setArquivo] = useState('');
  const [usuarios, setUsuarios] = useState<IUser[]>([]);
  const [rowId, setRowId] = useState(null);
  const [loadModal, setloadModal] = useState(false);

  const loadUsuarios = async (id_ent: any) => {
    await Api.get(`/usuarios/${id_ent}`)
      .then((res) => {
        setUsuarios(res.data.result);
        setloadModal(false);
      }).catch((err) => {
        console.log(err.res);
      })
  };

  const NovoUser = () => {
    setShow2(true);
    setRowId(null);
    resetUser();
  }
  const Alterar = () => { setRowId(null) }

  const EditarUser = async (id: any) => {
    resetUser();
    setloadModal(true);
    var id_ent = provid.sessao?.id_ent;
    const res = await Api.get(`usuario/${id}`);
    if (res){
      setUsuario(res.data.result[0]);
      setloadModal(false);
      loadUsuarios(id_ent)}
    else{setShow2(false);}  
  }

  const Cancelar = (rowId: any) => {
    setloadModal(true);
    if (rowId) {
      setRowId(rowId)
      EditarUser(rowId);
    } else { CloseM2(); }
  }
  const Excluir = (id_user: any) => {
    toast.warn('Não Autorizado!')
    /*  var id_ent = provid.sessao?.id_ent;
      if (window.confirm(`Apagar Usuário? ${usuario.nome}`)) {
        Api.delete(`user/${id_user}`);
        setTimeout(() => loadUsuarios(id_ent), 500);
      }*/
  };

  const OpenModalUser = () => {
    setRowId(null);
    resetUser();
    setloadModal(true);
    var id_ent = provid.sessao?.id_ent;
    setShow2(true);
    loadUsuarios(id_ent)
  }

  const ajustesUsuario = [["Privileg", 'prv', `${usuario.prv}`], ["Ativo", 'ativo', `${usuario.ativo}`]];
  const handleOnCheck = (e: any) => {
    //e.preventDefault();
    const { name, value } = e.target;
    setIsChecked(!isChecked); console.log('isChecked', isChecked);
    //usuario.prv = value;
    setUsuario({ ...usuario, [name]: value });
  };
  const handleInput = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };
  
  const imageRef = useRef<any>(null)
  const handlerImagem = (e: any) => {
    if (e.target.files[0]) {
      imageRef.current!.src = URL.createObjectURL(e.target.files[0])
    }
    setArquivo(e.target.files[0])
  };
  function validation() {
    let nome0 = document.getElementById("rsNome0");
    let nome = document.getElementById("rsNome");
    let tel = document.getElementById("rsTel");
    let confPass = document.getElementById("rsSenha");
    let confSenha = document.getElementById("rsConfSenha");
    if (!usuario.nome) { if (nome !== null) nome.style.cssText = 'color: brown' }else{ if (nome !== null) nome.style.cssText = 'display: none'}
    if (!usuario.telefone) { if (tel !== null) tel.style.cssText = 'color: brown' }else{if (tel !== null) tel.style.cssText = 'display: none'}
    if (!usuario.confPass) { if (confSenha !== null) confSenha.style.cssText = 'color: brown'; toast.warning('Digite Senha!') }else{ if(confSenha !== null) confSenha.style.cssText = 'display: none'}
    if (usuario.confPass?.length < 4) { if (confPass !== null) confPass.style.cssText = 'color: brown' }else{ if (confPass !== null) confPass.style.cssText = 'display: none' }
    if (usuario.confPass !== usuario.confPass2) { if (confSenha !== null) confSenha.style.cssText = 'color: brown' }else{ if (confSenha !== null) confSenha.style.cssText = 'display: none' }
    toast.warning('Vericar Campos Obrigatórios')
  };

  const SalvarUser = async (e: any) => {
    e.preventDefault()   //if (!usuario.username || !usuario.password || !usuario.role || !usuario.nome || usuario.password === usuario.confPass) { 
      var id_ent = provid.sessao?.id_ent;
      usuario.id_ent = provid.sessao?.id_ent as any;
      usuario.data_cad = new Date().toLocaleString() + '';
      usuario.data_alt = new Date().toLocaleString() + ''; //<--Só quando for PUT
      const formData = new FormData();
      formData.append('id_ent', usuario.id_ent);
      formData.append('id_user', usuario.id_user as any);
      formData.append('username', usuario.username);
      if(usuario.confPass){ // se a senha for diferente do confirmar, a senha atual volta pra o banco.
        formData.append('password', usuario.confPass);
      }else{formData.append('password', usuario.password);}
      formData.append('nome', usuario.nome);
      formData.append('telefone', usuario.telefone);
      formData.append('role', usuario.role as any);
      formData.append('ativo', usuario.ativo);
      formData.append('prv', usuario.prv as any);
      formData.append('data_cad', usuario.data_cad);
      formData.append('data_alt', usuario.data_alt);
      formData.append('imgperf', usuario.imgperf);
      formData.append('arquivo', arquivo);
      if (!usuario.id_user) {
        if (!usuario.nome || !usuario.telefone || !usuario.confPass || usuario.confPass !== usuario.confPass2 || usuario.confPass?.length < 4) {
          return validation()
        } else {
        await Api.post("usuario", usuario).then((res) => {
          if (res) {
            resetUser();
            setShow2(true);
            Cancelar(res.data?.result2.insertId);            
            loadUsuarios(id_ent);
            let nome1 = document.getElementById("rsNome1");
            if (nome1 !== null) nome1.style.cssText = 'display: none';
          } else {
            let nome1 = document.getElementById("rsNome1");
            if (nome1 !== null) nome1.style.cssText = 'color: brown';
          }
        })}
      } else {
        if (!usuario.username) {
          return validation()
        } else {
        Api.put(`usuario`, formData)
          .then((res) => {
            setShow2(false); setShow2(true); Cancelar(res.data?.id_user);
            loadUsuarios(id_ent)
          })  }  }
    }
  return (
    <>
      {provid.auth &&
        <div id='aside'>
          {/*<h5><p>Cemitério {provid.entidade?.ver}</p></h5>*/}
          <div >
            <div className='cab0'>
             <picture>
            <img className='ent_brasao'  src={!provid.entidade?.caminho ? '/bzpadrao.png' : `${provid.entidade?.urlbras}/${provid.entidade?.caminho}`} alt="picture" width={80} height={85} />
          </picture> 
          <div>
              <p>{provid.sessao?.cidade}</p>
              <p className='text-overflow-ellipsis'>Exercicio:{provid.entidade?.exercicio}</p>
              </div>
            </div>
         
            <div className='menuLink'>
              <div className="pnl">
                <li className={pathname == "/cadastro/dashboard" ? "active" : "mlink"}><Link href='./dashboard'><Image alt='preview' src='/home.png' width={30} height={30} /><p>Home</p></Link></li>
                <li className={pathname == "/cadastro/pessoas" ? "active" : "mlink"}><Link href='./pessoas'><Image alt='preview' src='/pessoa.png' width={30} height={30} /><p>Pessoas</p></Link></li>
                <li className={pathname == "/cadastro/logradouros" ? "active" : "mlink"}><Link href='./logradouros'><Image alt='preview' src='/xml.png' width={30} height={30} /><p> Logradouros</p></Link></li>
                <li className={pathname == "/cadastro/tumulos" ? "active" : "mlink"}><Link href='./tumulos'><Image alt='preview' src='/tum1.png' width={30} height={30} /><p>Tumulos</p></Link></li>
                <li className={pathname == "/cadastro/lancmtos" ? "active" : "mlink"}><Link href='./lancmtos'><Image alt='preview' src='/lanc.png' width={30} height={30} /><p>Lançamentos</p></Link></li>
                <li className={pathname == "/cadastro/entidade" ? "active" : "mlink"}><Link href='./entidade' ><Image alt='preview' src='/config.png' width={30} height={30} /> <p>Ajustes</p></Link></li>
                <li onClick={OpenModalUser} style={provid.sessao?.role === 1 ? {} : { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' }}><Image alt='preview' src='/user.png' width={30} height={30} /> <p>Usuário</p></li>
              </div>
            </div>
            <div id='aside_vert' className='footerAside'> <div><p>Elmar {new Date().toLocaleDateString('pt-br', { dateStyle: ('long') })}</p></div>
            </div>
          </div>
        </div>}

      <Modal show={show2} onHide={CloseM2} animation={false}>
        <Modal.Header closeButton id="modalHeader">
          <Image alt='preview' src='/logoe.png' width={25} height={20} /><p>Cadastro de Usuários</p>
        </Modal.Header>

        <Modal.Body id='modalBody_diag'>
          <div id="btns">
            <button onClick={NovoUser}><Image alt='preview' src='/new.png' width={30} height={30} /><p>Novo</p></button>
            <button onClick={OpenModalUser}><Image alt='preview' width={30} height={25} src='/atuali.png' /><p>Atualizar</p></button>
            {/* <button onClick={() => Alterar()} disabled={!rowId ? true : false} style={!rowId ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' src='/lup.png' width={30} height={30} /><p>Alterar</p></button> */}
            <button onClick={() => Excluir(rowId)}><Image alt='preview' src='/exc.png' width={30} height={30} /><p>Excluir</p></button>
            {/* <button onClick={() => Cancelar(usuario.id_user)} disabled={rowId ? true : false} style={rowId ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' src='/voltar.png' width={30} height={30} /><p>Cancelar</p></button> */}
            <button onClick={e => SalvarUser(e)}><Image alt='preview' src='/slv.png' width={30} height={30} /><p>Salvar</p></button>
            <button onClick={CloseM2}><Image alt='preview' src='/x.png' width={30} height={30} /><p>Fechar</p></button>
          </div>
          {loadModal && (
            <div>
              <LinearProgress variant="indeterminate" />
            </div>
          )}
          <div className="form-group m-2">
            <hr /><h5>{!usuario.id_user ? <span>Novo</span> : <span>Alterar</span>} Usuário</h5><hr />
           <label id="titulo">Dados Usuário</label>
            <Row className="ms-3 me-3">
              <input type="hidden" id="id_ent" name="id_ent" onChange={handleInput} value={usuario.id_ent || ""} />
              <input type="hidden" className="form-control" name="id_user" onChange={handleInput} value={usuario.id_user || ""} />
              <div className="form-group col-md-6">
                <label>Nome<span id="rsNome" style={{ display: "none" }}> é Obrigatório</span></label>
                <input type="text" className="form-control" name="nome" onChange={handleInput} value={usuario.nome || ""} placeholder="Nome Usuário"
                  style={usuario.nome === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
              </div>
              <div className="form-group col-md-6">
                <label>Role</label>
                <select id="uf" className="form-control" name="role" onChange={handleInput} value={usuario.role || ""}>
                  <option value="2">OPERADOR</option>
                  <option value="3">CONSULTA</option>
                  <option value="1">ADMINISTRADOR</option>
                </select>
              </div>              
              <div className="form-group mt-2 col-md-8">
                <label >Telefone</label>
                <input type="text" className="form-control" name="telefone" onChange={handleInput} value={maskFone(usuario['telefone'] || '')}
                style={usuario.telefone === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} placeholder="(00) 00000-0000" />
              </div>
              <div className="form-group col-md-3">
                          <label>Opções</label>
                          {ajustesUsuario.map(([text, name, chek]) => (
                            <label key={name} className="container">
                              <input type="checkbox" id={name} name={name} checked={[`${chek}`].toString() === 'S' ? true : false}
                                value={isChecked ? 'N' : 'S'} onChange={handleOnCheck} />{text}</label>
                          ))}
                      </div>
            </Row>
            <hr />
            <label id="titulo">Login / Senha</label>
            <Row className="m-2">
              <div className='form-group col-md-12'>
                <label>Login
                  <span id="rsNome0" style={{ display: "none" }}> é Obrigatório</span><span id="rsNome1" style={{ display: "none" }}> *Já Cadastrado!</span>
                </label>
                <input disabled={rowId ? true : false} type="text" className="form-control" name="username" onChange={handleInput} value={usuario.username || ""} placeholder="Login"
                  style={usuario.username === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                <Row className='mt-2'>
                  <label id="rsConfSenha" style={{ display: "none" }}> *Senhas não Conferem!</label>
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
              {/* UPLOAD FOTO PERFIL  
              {usuario.id_user > 0 && <div className="form-group col-md-3">
                <div className="form-group">
                  <label className="custom-file-upload">Foto Perfil
                    <input id="inputImagem" type="file" name="arquivo" onChange={handlerImagem} />
                    <div id="brasao">
                      <picture>
                        <img ref={imageRef}
                          src={usuario.imgperf === '' ? '/noimg.jpg' : provid.sessao?.urlperf + usuario.imgperf}
                          alt="Landscap"
                          width={73} height={73} />
                      </picture>
                    </div>
                  </label>
                  {provid.sessao?.urlperf + usuario.imgperf}
                </div>
              </div>} */}
            </Row>
            <hr />  
            <label id="titulo">Usuários Cadastrados</label>       
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Login</th>
                  <th>Perfil</th>
                  <th style={{ textAlign: 'center' }}>Ativo</th>
                  <th>Opções</th>
                </tr>
              </thead>
              <tbody>
                {usuarios?.map((item: any) => {
                  return (
                    <tr key={item.id_user} id={item.id_user} 
                    className={usuario.id_user == item.id_user ? "bgactive" : ""}>
                      {/*  <td id='brasao2'><Image alt='preview' src={item.imgperf === '' ? '../noimg.jpg' : caminho2 + item.imgperf}  /></td>*/}
                      <td>{item.nome}</td>
                      <td>{item.username}</td>
                      <td>{(item.role === 1 && <span>Administrador</span>)
                        || (item.role === 2 && <span>Operador</span>)
                        || (item.role === 3 && <span>Consulta</span>)}
                      </td>
                      <td style={{ textAlign: 'center' }}><span>{item.ativo === 'S' ? 'SIM' : 'NÃO' }</span></td>
                      <td className="col_f text-center pe-2"><span onClick={() => EditarUser(item.id_user)} id="badgesuccs">Editar</span></td>
                    </tr> ) })}
              </tbody>
            </Table>
            <hr />
            {usuario.data_alt && <div className='text-center'><label>Última Alteração: {usuario.data_alt}</label></div>}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}