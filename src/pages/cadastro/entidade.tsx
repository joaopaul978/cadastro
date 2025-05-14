import { useState, useEffect, useContext, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import Api from "@/services/Api";
import { AuthContext } from '@/contexts/AuthContext';

import { maskCEP, maskCPFJ, maskDate, maskFixo, maskFone } from '@/util/validacao';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-toastify';
import Image from 'next/image';
import LinearProgress from '@mui/material/LinearProgress';
import { useRouter } from "next/navigation";
import { IPadrao, ITipo } from '@/services/interfaces';

export default function Entidade() {
  const router = useRouter();
  const provid = useContext(AuthContext);
  const initEntidad = {
    id_user: 0, id_pessoa: '', cod_ent: 0, id_ent: 0, cod_pessoa: '', cnpj: '', email: '', msg1: '', msg2: '', msg3: '', msg4: '', usu_cad: '', entidade: '', telefone: '', fixo: '', tx1: 0, tx2: 0, tx3: 0,
    rua: '', numero: '', bairro: '', cidade: '', uf: '', cep: '', data_cad: '', secretaria: '', lei: '', decreto: '', data_alt: '', arquivo: '', caminho: '',
    campo1_nome: '', campo2_nome: '', campo3_nome: '', campo1_tam: 0, campo2_tam: 0, campo3_tam: 0, campo4_nome: '', campo4_tam: 0, campo5_nome: '', campo5_tam: 0, campo6_nome: '',
    maskinsc: '', maskgrupo: '', urlperf: '', urlbras: '', ver: '', calc_imovel: '', desconto_iptu: '', vvi: '', insc_seq: '', venc_unica:'',venc_antec:'',venc_dvexercicio:'',venc_dvtotal:'',
  };
  const [entidad, setEntidad] = useState(initEntidad);


  // assim funciona com o '?' const [entidade, setEntidade] = useState<IEntidade | null>(null); 
  //const [entidad, setEntidad] = useState<IEntidade[]>([]);
  const [key, setKey] = useState('1');
  const [caminho, setCaminho] = useState('');
  const [loadModal, setloadModal] = useState(false);
  const [tiposimovel, setTiposimovel] = useState<ITipo[]>([]);
  const [padroes, setPadroes] = useState<IPadrao[]>([]);
  const [tipo_imovel, setTipo] = useState({ id_ent: '', id_tipo_imovel: 0, cod_tipo_imovel: 0, desc_tipo_imovel: '', aliq: 0, data_cad: '', data_alt: '' });
  const [padrao, setPadrao] = useState({ id_ent: '', id_padrao: 0, cod_padrao: 0, desc_padrao: '', valor_unitario: 0, data_cad: '', data_alt: '' });
  const [apoio, modalApoio] = useState(false);

  const CloseM1 = () => { router.push(`/cadastro/dashboard`) }
  const CloseM2 = () => { modalApoio(false) }

  const [isChecked, setIsChecked] = useState(false);
  const [checkedVvi, setCheckedVvi] = useState(false);
  const [checkedDeconto_iptu, setCheckedDesc_iptu] = useState(false);
  const [modo, setModo] = useState('');


  const loadDados = async () => {
    const id_ent = provid.sessao?.id_ent;
    //const resp = await Api.get(`entidade/${id_ent}`);

    const resp = await Api.get(`EntId/${id_ent}`)
    setEntidad(resp.data.result[0]);
    if (resp.data.result[0].caminho) {
      setCaminho(resp.data.result[0].urlbras + resp.data.result[0].caminho);
    }else{
      setCaminho('');
    }
    // const resp = await Api.get(`getEnt/${id_ent}`);
    // setEntidad(resp.data.result[0]);
    // setloadModal(false);
    // if (!caminho) {
    //   setCaminho(resp.data.result[0].urlbras + resp.data.result[0].caminho);
    // }
  };
  const loadApoio = async () => {
    const id_ent = provid.sessao?.id_ent;
    await Api.get(`/getApoio/${id_ent}`)
      .then((res) => {
        setTiposimovel(res.data.result1);
        // setPadroes(res.data.result2);
      }).catch((err) => {
        console.log(err.res);
      })
  };


  useEffect(() => {
    loadDados(); loadApoio()
  }, [])


  const modalTipo = async (id_tipo_imovel: any) => {
    modalApoio(true); setModo('Tipo')
    const resp = await Api.get(`tipoImovel/${id_tipo_imovel}`)
    setTipo(resp.data.result[0]);
  }

  const modalPadrao = async (id_padrao: any) => {
    modalApoio(true); setModo('Padrao')
    const resp = await Api.get(`padraoImovel/${id_padrao}`)
    setPadrao(resp.data.result[0]);
  }

  function validation() {
    let nome = document.getElementById("rsNome");
    let email = document.getElementById("rsEmail");
    let cpfj = document.getElementById("rsCpfj");

    if (!entidad.entidade) { if (nome !== null) nome.style.cssText = 'color: brown'; }
    if (!entidad.email) { if (email !== null) email.style.cssText = 'color: brown'; }
    if (!entidad.cnpj) { if (cpfj !== null) cpfj.style.cssText = 'color: brown'; }
    toast.warning('Preencher Campos Obrigatórios!')
  }
  const imageRef = useRef<any>(null)
  const handlerImagem = (e: any) => {
    if (e.target.files[0]) { 
      imageRef.current!.src = URL.createObjectURL(e.target.files[0])
    }
    setArquivo(e.target.files[0])
  };
  const apagarImg = () =>{    
    //imageRef.current.src = null;
    imageRef.current!.src = '/simg.png';
    entidad.caminho = ''; 
    setArquivo('')
  }
  const [arquivo, setArquivo] = useState('');

  const SalvarEntidad = async (e: any) => {
    e.preventDefault();
    if (!entidad.entidade || !entidad.email || !entidad.cnpj) {
      return validation();
    } else {
      if (entidad.venc_unica.length < 10 || entidad.venc_antec.length < 10 || entidad.venc_dvexercicio.length < 10  || entidad.venc_dvtotal.length < 10){
        toast.warning('Data Inválida!')
      }else{
      entidad.data_alt = new Date().toLocaleString() + '';
      entidad.id_user = provid.sessao?.id_user as number;
      entidad.usu_cad = provid.sessao?.nome as string;
      const formData = new FormData();
      formData.append('id_ent', entidad.id_ent as any);
      formData.append('cod_ent', entidad.cod_ent as any);
      formData.append('id_user', entidad.id_user as any);
      formData.append('usu_cad', entidad.usu_cad as any);
      formData.append('entidade', entidad.entidade);
      formData.append('email', entidad.email);
      formData.append('telefone', entidad.telefone);
      formData.append('rua', entidad.rua);
      formData.append('numero', entidad.numero);
      formData.append('bairro', entidad.bairro);
      formData.append('cidade', entidad.cidade);
      formData.append('uf', entidad.uf);
      formData.append('cep', entidad.cep);
      formData.append('secretaria', entidad.secretaria);
      formData.append('lei', entidad.lei);
      formData.append('decreto', entidad.decreto);
      formData.append('msg1', entidad.msg1);
      formData.append('msg2', entidad.msg2);
      formData.append('msg3', entidad.msg3);
      formData.append('msg4', entidad.msg4);
      formData.append('cnpj', entidad.cnpj);
      formData.append('data_alt', entidad.data_alt);
      formData.append('caminho', entidad.caminho); 
      formData.append('venc_unica', entidad.venc_unica); 
      formData.append('venc_antec', entidad.venc_antec); 
      formData.append('venc_dvexercicio', entidad.venc_dvexercicio); 
      formData.append('venc_dvtotal', entidad.venc_dvtotal); 
      formData.append('arquivo', arquivo);
      Api.put(`/entidade/`, formData).then((res) => {
        if (res) (toast.success('Salvo!'))
      }).catch((err) => { console.log(err.res) });
    }
    }
  }
  const enviarArq = async (e: any) => {
    e.preventDefault();  
      entidad.data_alt = new Date().toLocaleString() + '';      
      const formData = new FormData();
      formData.append('cod_ent', entidad.cod_ent as any);
      formData.append('caminho', entidad.caminho);    
      formData.append('arquivo', arquivo);
      Api.put(`/entidade2/`, formData).then((res) => {
        if (res) (toast.success('Enviado!'))
      }).catch((err) => { console.log(err.res) });    
  }

  const SalvarTipo = async (e: any) => {
    e.preventDefault()
    if (!tipo_imovel.desc_tipo_imovel || !tipo_imovel.aliq) {
      toast.warn('Campos Obrigatórios!');
    } else {
      entidad.usu_cad = provid.sessao?.nome as string;
      tipo_imovel.data_alt = new Date().toLocaleString() + '';
      Api.put(`/tipoImovel/`, tipo_imovel).then(() => {
        loadApoio(); CloseM2();
      }).catch((erro) => { });
    }
  }
  const SalvarPadrao = async (e: any) => {
    e.preventDefault()
    if (!padrao.desc_padrao || !padrao.valor_unitario) {
      toast.warn('Campos Obrigatórios!');
    } else {
      entidad.usu_cad = provid.sessao?.nome as string;
      padrao.data_alt = new Date().toLocaleString() + '';
      Api.put(`/padraoImovel/`, padrao).then((res) => {
        loadApoio(); CloseM2();
      }).catch((erro) => { });
    }
  }

  const handleInput = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    setEntidad({ ...entidad, [name]: value.toUpperCase() });
    setTipo({ ...tipo_imovel, [name]: value });
    setPadrao({ ...padrao, [name]: value });
  };

  const handleOnCheck = (e: any) => {
    //e.preventDefault();
    const { name, value } = e.target;
    setIsChecked(!isChecked);
    setCheckedVvi(!checkedVvi);
    setCheckedDesc_iptu(!checkedDeconto_iptu);
    //usuario.prv = value;
    setEntidad({ ...entidad, [name]: value });
  };
  const [show, setShow] = useState(true);

  var label1 = <div id="label_form"><Image alt='preview' src='/ent.ico' width={21} height={21} /> Dados da Entidade</div>;
  var label2 = <div id="label_form" onClick={() => { loadDados(); loadApoio() }}><Image alt='preview' src='/pasta.png' width={21} height={21} /> Configurações Guia</div>;
  var label3 = <div id="label_form"><Image alt='preview' src='/pasta.png' width={21} height={21} /> Mensagens Diversas</div>;
  return (

    <div>
      {provid.auth &&
        <Modal className="modal" size="xl" show={show} animation={false}>
          <Modal.Header closeButton id="modalHeader">
            <Image alt='preview' src='/logoe.png' width={25} height={20} /><p>Configurações do Sistema</p>
          </Modal.Header>
          <Modal.Body id='modalBody'>
            <div id="btns">
              <button onClick={e => SalvarEntidad(e)}><Image alt='preview' src='/slv.png' width={30} height={30} /><p>Salvar</p></button>
              <button ><Image alt='preview' src='/atuali3.png' width={30} height={30} onClick={() => { loadDados(); loadApoio() }} /><p>Atualizar</p></button>
              <button onClick={CloseM1}><Image alt='preview' src='/x.png' width={30} height={30} /><p>Fechar</p></button>
            </div>
            {loadModal && (<div><LinearProgress variant="indeterminate" /></div>)}         
            <Form className="form">
              <Tabs defaultActiveKey="1" activeKey={key} onSelect={(k: any) => setKey(k)} className="mb-3" >
                <Tab eventKey="1" title={label1}>
                <div id='divTab'>
                  <div id="titulo">
                    <p>Entidade</p>
                  </div><hr />
                  <Row className="m-2 col-md-12">
                    <div className="form-group col-md-5">
                      <label>Nome<span id="rsNome" style={{ display: "none" }}> é Obrigatório</span></label>
                      <input type="text" id="rsInputNome" className="form-control" name="entidade" onChange={handleInput} value={entidad.entidade || ""}
                        disabled={provid.sessao?.role === 1 ? false : true} style={entidad.entidade === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}
                        placeholder="Nome completo" />
                    </div>
                    <div className="form-group col-md-3">
                      <label>CNPJ</label> <span id="rsCpfj" style={{ display: "none" }}> é Obrigatório</span>
                      <input type="text" disabled={provid.sessao?.role === 1 ? false : true} style={entidad.cnpj === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}
                        className="form-control" name="cnpj" onChange={handleInput} value={maskCPFJ(entidad['cnpj'])} placeholder="CNPJ" />
                    </div>
                  </Row>
                  <Row className="m-2 col-md-12">
                    <div className="form-group col-md-2">
                      <label >Endereço</label>
                      <input type="text" className="form-control" name="rua" onChange={handleInput} value={entidad.rua || ""} placeholder="Nome rua" />
                    </div>
                    <div className="form-group col-md-1">
                      <label >Nº</label>
                      <input type="text" className="form-control" name="numero" onChange={handleInput} value={entidad.numero || ""} placeholder="Numero" />
                    </div>
                    <div className="form-group col-md-1">
                      <label >Bairro</label>
                      <input type="text" className="form-control" name="bairro" onChange={handleInput} value={entidad.bairro || ""} placeholder="Bairro" />
                    </div>
                    <div className="form-group col-md-2">
                      <label >Cidade</label>
                      <input type="text" className="form-control" name="cidade" onChange={handleInput} value={entidad.cidade || ""} placeholder="Cidade" />
                    </div>
                    <div className="form-group col-md-1">
                      <label>Estado</label>
                      <input type="text" className="form-control" name="uf" onChange={handleInput} value={entidad.uf || ""} placeholder="uf" />
                    </div>
                    <div className="form-group col-md-1">
                      <label >CEP</label>
                      <input type="text" className="form-control" name="cep" onChange={handleInput} value={entidad.cep} placeholder="CEP" />
                    </div>
                  </Row>
                  <Row className="m-2 mb-4 col-md-12">
                    <div className="form-group col-md-4">
                      <label>Email<span id="rsEmailV" style={{ display: "none" }}>* Email Invalido</span><span id="rsEmail" style={{ display: "none" }}> é Obrigatório</span></label>
                      <input type="text" style={entidad.email === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}
                        className="form-control" name="email" onChange={handleInput} value={entidad.email || ""} id='input_lowercase' placeholder="email@dominio.com" />
                    </div>
                    <div className="form-group col-md-2">
                      <label>Telefone</label><span id="rsTel" style={{ display: "none" }}> é Obrigatório</span>
                      <input type="text" className="form-control" name="telefone" onChange={handleInput} value={maskFone(entidad['telefone'])} placeholder="telefone"
                        style={entidad.telefone === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>
                    <div className="form-group col-md-2">
                      <label>Fixo</label><span id="rsTel" style={{ display: "none" }}> é Obrigatório</span>
                      <input type="text" className="form-control" name="fixo" onChange={handleInput} value={maskFixo(entidad['fixo'])} placeholder="fixo"
                        style={entidad.fixo === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>
                  </Row>
                  <hr />
                  <div id="titulo">
                    <p>Mensagens / Brasão</p>
                  </div>
                  <Row className='mt-2 col-md-12'>
                    <div className='form-group col-md-8 ms-4'>
                      <label>Nome Diretoria</label>
                      <input type="text" className="form-control" name="secretaria" onChange={handleInput} value={entidad.secretaria || ""} />
                      <Row className='mt-2 col-md-12'>
                        <div className="form-group col-md-6">
                          <label>Decreto</label>
                          <input type="text" className="form-control" name="decreto" onChange={handleInput} value={entidad.decreto || ""} placeholder="Decreto" />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Lei</label>
                          <input type="text" className="form-control" name="lei" onChange={handleInput} value={entidad.lei || ""} />
                        </div>
                      </Row>
                    </div>
                    <div className="form-group col-md-3 ms-4">
                    <div className="form-group">
                      <label className="custom-file-upload">Brasão
                        <input id="inputImagem" type="file" name="arquivo" onChange={handlerImagem} />
                        <div id="brasao">
                          <picture>
                            <img ref={imageRef} src={caminho === '' ? '/simg.png' : caminho} alt="picture" width={73} height={73} />
                          </picture>
                        </div>
                      </label>
                      
                    </div><span style={{marginTop:'20px', color:'green', cursor:'pointer'}} onClick={apagarImg}>Apagar Imagem</span>
                    </div>

                    <div className="form-group col-md-3 ms-4">
                    <div className="form-group">
                      <label className="custom-file-upload">Brasão
                        <input id="inputImagem" type="file" name="arquivo" onChange={handlerImagem} />
                        <div id="brasao">
                          <picture>
                            <img ref={imageRef} src={caminho === '' ? '/simg.png' : caminho} alt="picture" width={73} height={73} />
                          </picture>
                        </div>
                      </label>                      
                    </div><span style={{marginTop:'20px', color:'green', cursor:'pointer'}} onClick={apagarImg}>Apagar Imagem</span>
                    </div>  
                    <button className="primary"  type="submit" onClick={enviarArq}>
                                                 enviar
                                                </button>

                    <hr />
                    <h6 className="mt-1 ms-4">*Se não for selecionado imagem, sistema irá definir um brasão padrão!</h6>
                  </Row>
                  </div>
                </Tab>
                <Tab eventKey="2" title={label2} >
                  <div id='divTab'>
                  <Row className='col-md-12'>
                    <div className="form-group col-md-9">
                      <label>Aviso Débitos</label>
                      <input type="text" className="form-control" name="msg4" onChange={handleInput} value={entidad.msg4 || ""} />
                  
                      <label>Mensagem da Guia 01</label>
                      <input type="text" className="form-control" name="msg1" onChange={handleInput} value={entidad.msg1 || ""} />
                 
                      <label>Mensagem da Guia 02</label>
                      <input type="text" className="form-control" name="msg2" onChange={handleInput} value={entidad.msg2 || ""} />
                    </div>
                    <div className="form-group col-md-3">
                        <div id='inputsValor'>
                          <div id='ajustes2'>
                            <label id='titleR'>Datas DAMs Diversos</label>
                            <div>
                              <label>Vencimento 1:<input type="date"/></label>                          
                            </div>       
                          </div>
                        </div>
                      </div>
                    </Row>
                    <hr />
                    <Row className='mt-2 col-md-12'>
                      <div className="form-group col-md-9">
                       
                        <label id='titleR'>Corpo da Mensagem da Guia</label>
                        <textarea className="form-control my_textarea" name="msg3" onChange={handleInput} value={entidad.msg3 || ''} placeholder="Maximo de 400" rows={4}></textarea>
                      </div>
                      <div className="form-group col-md-3">
                        <div id='inputsValor'>
                          <div id='ajustes2'>
                            <label id='titleR'>Datas DAMs IPTU</label>
                            <div>
                              <label>Cota Unica:<input type="text" onChange={handleInput} name="venc_unica" value={maskDate(entidad.venc_unica)}
                              /></label>
                              <label>Antecipada:<input type="text" onChange={handleInput} name="venc_antec" value={maskDate(entidad.venc_antec)} 
                              /></label>
                              <label>Divida Exercicio:<input type="text" onChange={handleInput} name="venc_dvexercicio" value={maskDate(entidad.venc_dvexercicio)}/></label>
                              <label>Divida Ativa Total:<input type="text" onChange={handleInput} name="venc_dvtotal" value={maskDate(entidad.venc_dvtotal)} /></label>
                            </div>       
                          </div>
                        </div>
                      </div>
                    </Row>
                  </div>
                </Tab>
                <Tab eventKey="3" title={label3} >
                  <div id='divTab'>
                    msgs
                  </div>
                </Tab>
              </Tabs>
            </Form>
          </Modal.Body>
        </Modal>}
      {/*}
                  <div className="form-group m-2 col-md-3">  
                    <div  id='inputsValor'>                      
                      <div id='ajustes'>
                      <label id='titleR'>Organização inscrição Imovel</label>
                        <div>
                          <label>
                            Campo1:
                            <input type="text" className="form-control" name="campo1_nome" onChange={handleInput} value={entidad.campo1_nome || ""} placeholder="ST" />
                          </label>
                          <label>
                            Tamanho:
                            <input type="number" className="form-control" name="campo1_tam" onChange={handleInput} value={entidad.campo1_tam || ""} placeholder="00" />
                          </label>
                      
                          <label>
                            Campo2:
                            <input type="text" className="form-control" name="campo2_nome" onChange={handleInput} value={entidad.campo2_nome || ""} placeholder="QD" />
                          </label>
                          <label>
                            Tamanho:
                            <input type="number" className="form-control" name="campo2_tam" onChange={handleInput} value={entidad.campo2_tam || ""} placeholder="000" />
                          </label>
                        </div>

                        <div>
                          <label>
                            Campo3:
                            <input type="text" className="form-control" name="campo3_nome" onChange={handleInput} value={entidad.campo3_nome || ""} placeholder="LT" />
                          </label>
                          <label>
                            Tamanho:
                            <input type="number" className="form-control" name="campo3_tam" onChange={handleInput} value={entidad.campo3_tam || ""} placeholder="000" />
                          </label>
                        </div>

                        <div>
                          <label>
                            Campo4:
                            <input type="text" className="form-control" name="campo4_nome" onChange={handleInput} value={entidad.campo4_nome || ""} placeholder="LT" />
                          </label>
                          <label>
                            Tamanho:
                            <input type="number" className="form-control" name="campo4_tam" onChange={handleInput} value={entidad.campo4_tam || ""} placeholder="000" />
                          </label>
                        </div>

                        <div>
                          <label>
                            Campo5:
                            <input type="text" className="form-control" name="campo5_nome" onChange={handleInput} value={entidad.campo5_nome || ""} placeholder="LT" />
                          </label>
                          <label>
                            Tamanho:
                            <input type="number" className="form-control" name="campo5_tam" onChange={handleInput} value={entidad.campo5_tam || ""} placeholder="000" />
                          </label>
                        </div>

                      </div>
                    </div>
                    </div>
         */}

      <Modal className="modal" size="lg" centered show={apoio} onHide={CloseM2}>
        <Modal.Header closeButton id="modalHeader">
          <Image alt='preview' src='/logoe.png' width={25} height={20} /><p>Atualizar {modo}</p>
        </Modal.Header>
        <Modal.Body id="modalDiag">

          <div id="btns">
            <button style={{ opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' }}><Image alt='preview' src='/new.png' width={30} height={30} /><p>Novo</p></button>
            <button><Image alt='preview' src='/atuali.png' width={30} height={30} /><p>Atualizar</p></button>
            <button onClick={() => CloseM2()}><Image alt='preview' src='/x.png' width={30} height={30} /><p>Fechar</p></button>
          </div>


          <Form id="tablepesq">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">

            </Form.Group>
          </Form>

        </Modal.Body>
      </Modal>

      <div id="container_body">
        <div id='iPnl'>
          <div id='tbody_dahsb'>
            <div className='entidade'>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}