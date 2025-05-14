//"use client"
import React, { useState, useMemo, useContext, useEffect, Fragment, lazy } from "react";
import 'react-toastify/dist/ReactToastify.min.css';
import { Table, Form, Dropdown, InputGroup, Button, Badge, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import LinearProgress from '@mui/material/LinearProgress';
import { Box, TableBody, TableCell, TableRow } from "@mui/material";
//import { useDebounce } from "../../services/debouces";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


//icones material ui
import { INatureza, IAtivcnae, IAtivcnaeGrp, IReceitas, IlistaLancmto, IlistaLograd, IlistaPessoas, IlistaTumulos, IAlvara, IAssinaturas } from "../../services/interfaces";
import { maskCPFJ, maskFone, maskCEP, maskFixo, maskDate } from "../../util/validacao";
//import Api from "../../services/Api";

import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { useDebounce } from "@/services/debouces";
import Image from 'next/image';
//import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DataGrid, GridColDef, useGridApiRef } from "@mui/x-data-grid";
import Api from "@/services/Api";

export default function Pessoas() {
  //const { debounce } = useDebounce(500);
  const initialState = {
    id_user: 0, id_pessoa: 0, id_ent: 0, id_lanc: 0, cod_lancdet:0, id_rec:0, cod_pessoa: 0, nome_pessoa: '', nome_socio: '', cpf_cnpj_socio: '', cargo: '', cpf_cnpj: '', numero: '', rua: '', bairro: '', cidade: '', uf: '', cep: '', email: '', telefone: '', fixo: '',
    situacao: '', pago: '', nossonum: '', vltotal: 0, data_pgmto: '', vencmto: '', desc_lanc: '', cod_rec: 0, des_rec: '', valor_real: '', data_cad: '', data_alt: '', data_lanc: '', data_venc: '', caminho: '', usu_cad: '',
    situacao_cad: '', porte: '', vigilancia: '', regime_trib: '', obs: '', obs_encerramento: '', cod_natureza: '', ultima_atualizacao: '', fantasia: '', complemento: '', site: '', area_mercantil: '', basecalculo: '', numero_proc: '', parc: '', data_abertura: '', data_encerramento: '', 
    insc_muni: '', insc_estad: '', insc_junta: '', cod_segmentoativ: '', classetrib: '', tipo_alvara: '', recolhimento: '', cod_cnae: '', cod_cnae_grupo: '', tipocad: '',
    iss: '', iss_retido: '', tx_virgilancia: '', alvara: '', alvara_trans: '', ativsecund: [{ id_ativ: '', code: '', descricao_cnae: '' }], socios: [{ id_socios: '', nome: '', cpf_cnpj: '', qual: '' }]
  };
  /* lancmtos: [{id_lanc:0,id_pessoa:0,cod_rec:0,des_rec:'',data_lanc:'',vltotal:0,valor_rec:'',data_venc:'',pago:'',data_pgmto:'',situacao:'',
    lancmtosDt: [{id_lancdet:'',cod_lancdet:0,cod_rec:0,des_rec:'',valor_real:0 }]] */
  const initDocs = {
    id_user: 0, id_pessoa: 0, id_ent: 0, id_lanc: 0, cod_pessoa: 0, num_processo: '', nome_pessoa: '', cpf_cnpj: '', numero: '', rua: '', bairro: '', cidade: '', uf: '', cep: '', email: '', telefone: '', fixo: '',
    data_cad: '', data_alt: '', data_lanc: '', usu_cad: '', fantasia: '', complemento: '', numero_proc: '', tipo_cad: '', insc_muni: '', insc_estad: '', tipo_doc: '', finalidade_doc: '', obs_doc: '', data_emissao: '',
    id_assin1: 0, id_assin2: 0, id_assin3: 0, cod_verificacao: '', emissao: '', validade: '', cod_doc: '', 
    assinaturas: [{ id_assin: 0, nome: '', cargo: '', matricula: '' }], documentos: [{ id_doc: 0, cod_doc: 0, finalidade_doc: '', data_emissao: '', cod_verificacao: '' }], lancmtos: [{ id_lanc: 0, id_pessoa: 0, cod_rec: 0, des_rec: '', data_lanc: '', vltotal: 0, valor_rec: '', data_venc: '', pago: '', data_pgmto: '', situacao: '' }]
  };
  const initLancmto = { id_lanc: 0,cod_lanc:0, id_pessoa: 0, nome_pessoa: '', cpf_cnpj: '', id_user: 0, desc_lanc: '', convenio: '', valor_real: '', data_venc: '', data_lanc: '', cod_rec: '', des_rec: '', nossonum: '', numero_proc: '', parc: '', referencia: '',exercicio:'', situacao: '' };

  const [state, setState] = useState(initialState);
  const [docs, setDocs] = useState(initDocs);
  const [allAssin, setAllAssin] = useState<IAssinaturas[]>([]);
  const [assin1, setAssin1] = useState({ id_assin: '', nome: '', cargo: '', matricula: '' });
  const [assin2, setAssin2] = useState({ id_assin: '', nome: '', cargo: '', matricula: '' });
  const [assin3, setAssin3] = useState({ id_assin: '', nome: '', cargo: '', matricula: '' });
  const provid = useContext(AuthContext);
  const [pessoas, setPessoas] = useState<IlistaPessoas[]>([]);
  const [pesqPessoas, setPessoas2] = useState<IlistaPessoas[]>([]);
  const [logradouros, setLograd] = useState<IlistaLograd[]>([]);
  const [tumulos, setTumulos] = useState<IlistaTumulos[]>([]);
  const [lancmto, setLancmto] = useState(initLancmto);
  //  banco_ativo: [{	agencia: '',conta: '',convenio:'',cod_banco:'',nome_banco: '',local_pgto:'',brasao:''} ] });
  const initBanco = { agencia: '', conta: '', convenio: '', cod_banco: '', nome_banco: '', local_pgto: '', brasao: '', linhadigitavel: '', codigobarra: '', };
  const [banco, setBanco] = useState(initBanco);
  const [lancmtos, setLancmtos] = useState<IlistaLancmto[]>([]);
  const [lancmtosDt, setLancmtosDt] = useState<IlistaLancmto[]>([]);
  const [receitas, setReceitas] = useState<IReceitas[]>([]);
  const [dadosReceita, setDadosReceita] = useState({ id_rec:0, cod_rec: 0, des_rec: '', valor: '' });
  const [naturezaAll, setNaturezaAll] = useState<INatureza[]>([]);
  const initALv = {
    id_ent: 0, id_alvara: 0, id_pessoa: 0, id_user: 0, cod_alvara: 0, data_emissao: '', num_processo: '', tipo_alvara: '', data_validade: '', exercicio: '', descricao_cnae_grupo: '',
    natureza: '', num_dam: '', obs_alvara: '', recolhimento: '', placa: '', anofabricacao: '', chassis: '', cor_veiculo: '', modelo_veiculo: '', obs_veiculo: '', emissao: '', id_assin1: '', id_assin2: '', id_assin3: ''
  }
  const [alvara, setAlvara] = useState(initALv);
  const [alvaras, setAlvaras] = useState<IAlvara[]>([]);
  const [ativcnaeAll, setAtivCnaeAll] = useState<IAtivcnae[]>([]);
  const [ativcnaeGrpAll, setAtivcnaeGrp] = useState<IAtivcnaeGrp[]>([]);
  const initPesq = {id_ent: 0, campo: 'nome_pessoa', text1: '', text2: '',limit_rows: provid.entidade?.limit_rows }
  const [pesq4, setPesq4] = useState(initPesq);
  const resetState = () => { setState(initialState); setTumulos([]); setLancmtos([]); setAlvaras([]) };
  const resetDadosRec = () => { setDadosReceita({ id_rec:0, cod_rec: 0, des_rec: '', valor: '' }); setLancmtosDt([]); };
  

  const CloseMGeral = () => {
    if (modo === 'CND') { gerarCND(rowId) } else {
      setShowGerl(false); setPessoas2([]); setRowDva({ id_lanc: '',pago:''})
      setloadDiag(false); setAlvara(initALv); setDocs(initDocs); setLograd([]); setNovaCnd('0');
      setLancmto(initLancmto); setBanco(initBanco); 
    }
  }
  const [show, setShow] = useState(false);
  //modal Lançamentos 
  const [total, setTotal] = useState({ soma: 0 });
  const [showLanc, setShowLanc] = useState(false);
  const resetlanc = () => { resetDadosRec(); state.desc_lanc = ''; state.vltotal = 0; state.id_lanc = 0 /* setTotal({soma: 0}) */ }
  const CloseMLanc = () => { setShowLanc(false); loadLancmtos(); resetlanc() }
  const CloseModal = () => { setShow(false); resetState(); setKey('1'); setloadModal(false) }
  const [busca, setBusca] = useState('');
  const [rowId, setRowId] = useState(null);
  const [rowIdLanc, setIdLanc] = useState(null);
  const [loading, setloading] = useState(false);
  const [loadModal, setloadModal] = useState(false);
  const [loadDiag, setloadDiag] = useState(false);
  const [key, setKey] = useState('1');
  const [modo, setModo] = useState('');
  const [modalGerl, setShowGerl] = useState(false);
   const [data_lanc, setDataLanc] = useState(new Date());
   const [data_venc, setDataVenc] = useState(new Date());
   const [data_emissao, setDataEmissao] = useState(new Date());
  // const [data_validade, setDataValidade] = useState(new Date());

  // const loadPessoas = () => {
  //   const id_ent = provid.sessao?.id_ent;
  //   Api.get(`/pessoas/${id_ent}`).then((response) => {
  //     if (response) {
  //       setloading(false);
  //       setPessoas(response.data);
  //     }
  //   }).catch(() => { setPessoas([]) });
  // }

  const loadLograd = () => {
    const id_ent = provid.sessao?.id_ent;
    Api.get(`/logradouros/${id_ent}`).then((response) => {
      if (response) {
        setloadDiag(false);
        setLograd(response.data);
      }
    }).catch(() => { setLograd([]) });
  }

  const loadNatureza = () => {
    //e.preventDefault();  
    Api.get(`/naturezaAll`)
      .then((res) => {
        if (res instanceof Error) {
          alert(res.message);
        } else {
          setNaturezaAll(res.data);
        }
      }).catch(() => { });
  };

  const loadAtivCnaeGrp = () => {
    Api.get(`/ativCnaeGrp`)
      .then((res) => {
        if (res) {
          setloading(false);
          setAtivcnaeGrp(res.data);
        }
      }).catch(() => { setAtivcnaeGrp([]) });
  };
  /*   const setAtivCnaeId = (e: any) => {
     e.preventDefault();       
     const id = e.target.value;
     if (id){ 
       Api.get(`/ativCnaeId/${id}`)
       .then((res) => { setNatureza(res.data[0]) }).catch(()=>{}) }
     };
 */
  const loadAtivCnaeAll = () => {
    Api.get(`/ativCnaeAll`)
      .then((res) => {
        if (res) {
          setloadDiag(false);
          setAtivCnaeAll(res.data);
        }
      }).catch(() => { setAtivCnaeAll([]) });
  };

  const setAtivCnaeId = (e: any) => {
    e.preventDefault();
    const id = e.target.value;
    if (id) {
      Api.get(`/ativCnaeGrpId/${id}`)
        .then((res) => { setAtivCnaeAll(res.data) }).catch(() => { })
    }
  };

  const handleInput = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    setState({ ...state, [name]: value.toUpperCase() });
    setDadosReceita({ ...dadosReceita, [name]: value });
  };
  const handleInputLc = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    setLancmto({ ...lancmto, [name]: value.toUpperCase() });
  };
  const handInputDc = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    setDocs({ ...docs, [name]: value.toUpperCase() });
  };

  const ConsultaLog = async () => {
    setModo('Logradouros'); setShowGerl(true);
  }

  const { debounce } = useDebounce(500);
  const [buscaLograd, setBuscaL] = useState('');

  const [pesqLog, setPesqL] = React.useState(2);
  const pesqLograd = (e: any) => {
    e.preventDefault();
    handleInput(e);
    setloadDiag(true)
    debounce(() => {
      //setTimeout(setBuscaL(e.target.value), 3000);
      setBuscaL(e.target.value)
    });
    loadLograd();
  };

  const FiltroLograds = useMemo(() => {
    const numBusca = buscaLograd;
    const lowerBusca = buscaLograd.toLowerCase();
    switch (pesqLog) {
      case 1: return logradouros.filter((item) => item.cod_log.toString().includes(numBusca)); break;
      case 2: return logradouros.filter((item) => item.nome_log.toLowerCase().includes(lowerBusca.toLowerCase())); break;
      case 3: return logradouros.filter((item) => item.bairro_log.toLowerCase().includes(lowerBusca.toLowerCase())); break;
    }
  }, [buscaLograd, pesqLog, logradouros]);

  const [pesqCnae, setPesqCnae] = React.useState(2);
  const [buscaCnae, setBuscaCnae] = useState('');

  const listarCnae = () => { setloadDiag(true); loadAtivCnaeAll(); setTimeout(() => { setPesqCnae(2); setBuscaCnae(' ') }, 500) };

  const ConsultaCnae = async () => {
    setModo('CNAE'); setShowGerl(true);
  }
  const ConsultaSocios = async () => {
    setModo('Socios'); setShowGerl(true);
  }
  const AlterarDam = async (id: any) => {
    if (!rowDva.id_lanc) {
      toast.warning('Selecione um Registro!');
    } else {
      setloadModal(true); setModo('Alterar'); setShowGerl(true);
      Api.get(`/lancmtoIdAlt/${rowDva.id_lanc}`).then((resp) => {
        if (resp) {
          setLancmto(resp.data.result[0]); setloadModal(false)
        }
      }).catch(() => { });
    }
  }
  const impDam = async () => {
    if (!rowDva.id_lanc) {
      toast.warning('Selecione um Registro!');
    } else {
      setloadModal(true); setModo('DAMs'); setShowGerl(true);
      Api.get(`/lancmtoId/${rowDva.id_lanc}`).then((resp) => {
        if (resp) {
          setLancmto(resp.data.result[0]); setBanco(resp.data.result[0].banco_ativo[0]);
          setLancmtosDt(resp.data.result[0].lancmtos_detalhado); setloadModal(false)
        }
      }).catch(() => { });
    }
  }

  const gerarCND = async (rowId: any) => {
    setNovaCnd('0');
    if (!rowId) {
      toast.warning('Selecione um Registro!');
    } else {
      let id_ent = provid.sessao?.id_ent as number;
      setloadModal(true); setModo('gerarCND'); setShowGerl(true);
      Api.get(`/pessoaIdlanc/${rowId}/${id_ent}`).then((resp) => {
        if (resp) {
          setDocs(resp.data.result[0]); setloadModal(false);
        }
      }).catch(() => { });
    }
  }

  const cancDoc = async (id_doc: any, emissao: any) => {
    if (id_doc) {
      Api.put(`/docPut/${id_doc}/${docs.id_pessoa}/${emissao}/${provid.sessao?.username}`).then((res) => {
        if (res) {
          setloadModal(true);
          gerarCND(res.data.id_pessoa);
          setTimeout(() => setloadModal(false), 400)
        }
      }).catch(() => { });
    }
  }
  const impDoc = async (id_doc: any) => {
    setModo('CND'); setShowGerl(true);
    Api.get(`/docGet/${id_doc}`).then((res) => {
      if (res) {
        setloadModal(true); setModo('CND');
        setDocs(res.data.result[0]);
        setAssin1(res.data.assin1[0])
        setAssin2(res.data.assin2[0])
        setAssin3(res.data.assin3[0])
        setTimeout(() => setloadModal(false), 400)
      }
    }).catch(() => { });
  }

  const pesq_Cnae = (e: any) => {
    e.preventDefault();
    handleInput(e);
    setloadDiag(true)
    debounce(() => {
      //setTimeout(setBuscaL(e.target.value), 3000);
      setBuscaCnae(e.target.value);
      loadAtivCnaeAll();
    });
  };

  const FiltroCnae = useMemo(() => {
    const numBusca = buscaCnae;
    const lowerBusca = buscaCnae.toLowerCase();
    switch (pesqCnae) {
      case 1: return ativcnaeAll.filter((item) => item.cod_cnae.toString().includes(numBusca)); break;
      case 2: return ativcnaeAll.filter((item) => item.descricao_cnae.toLowerCase().includes(lowerBusca.toLowerCase())); break;
    }
  }, [buscaCnae, pesqCnae, ativcnaeAll]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    switch (name) {
      case 'data_lanc': lancmto.data_lanc = value.toLocaleDateString(); setDataLanc(value); break;
      case 'data_venc': lancmto.data_venc = value.toLocaleDateString(); setDataVenc(value); break;
    }
  }
  const handleChangeAlv = (e: any) => {
    const { name, value } = e.target;
    switch (name) {
      case 'data_emissao': alvara.data_emissao = value.toLocaleDateString(); setDataEmissao(value); break;
    }
    setAlvara({ ...alvara, [name]: value });
  }

  const Novo = () => {
    loadNatureza();
    loadAtivCnaeGrp();
    setShow(true); setloading(false)
    setRowId(null);
    resetState()
  }

  const Editar = (rowId: any) => {
    if (rowId) {
      setPesq4(initPesq)
      loadNatureza();
      loadAtivCnaeGrp();
      setloadModal(true);
      setShow(true);
      //ClienteServices.getById(Number(id))
      Api.get(`/pessoaId/${rowId}`).then((res) => {
        if (!res.data.result[0]) {
          toast.warn('Não Encontrado!');
          setShow(false);
          setloadModal(false);
         // listar();
        } else {
          setState(res.data.result[0]);
          setTumulos(res.data.result[0].tumulos);
          //  setLancmtos(res.data.result[0].lancmtos); desligar chamada de pessoas 
          setloadModal(false)
        }
      }).catch(() => { setloadModal(false);setShow(false); });;
    } else { toast.warn('Selecione um registro!') }
  }

  const Alterar = () => {
    setKey('1')
    setRowId(null)
  }

  const Cancelar = (rowId: any) => {
    if (rowId) {
      setRowId(rowId);
      Editar(rowId);
    } else { CloseModal(); }
  }

   const listarL = () => {
    setloadDiag(true); loadLograd();
    setTimeout(() => { setPesqL(2); setBuscaL(' ') }, 500)
  };
  const pesquisar = async (e: any) => {
    e.preventDefault();
    handleInput(e);
    setloading(true)
    debounce(() => {
      //setTimeout(setBuscaL(e.target.value), 3000);
      setBusca(e.target.value);
    });
    //  setTimeout(() => { setBusca(e.target.value); loadPessoas() }, 500)
  };


  /*const columns: GridColDef[] = [
    { field: 'id_pessoa', headerName: 'ID', width: 10 },
    { field: 'nome_pessoa', headerName: 'nome_pessoa', width: 130  },
    { field: 'cpf_cnpj', headerName: 'CPF', type: 'number', width: 90,},
    { field: 'cidade', headerName: 'CIDADE', type: 'number', width: 90,},
    { field: 'cep', headerName: 'cep', type: 'number', width: 90,},
    {
      field: 'tipocad', headerName: 'Tipo', width: 70,
      renderCell: (params) => {
        return (
          <div> {(() => {
            switch (params.row.tipocad) {
              case 'C': return 'CONTRIBUINTE';
              case 'E': return 'MERCANTIL';        
              default: return null;
            }
          })()}
          </div>
        )
      }
    },
    { field: 'tipocad', headerName: 'tipocad', type: 'number', width: 90,},
    { field: 'data_cad', headerName: 'DTALT', type: 'number', width: 90,},    
  ];
  const rows2 = [
    {...pessoasFiltrados?.map((item:any ) => {
      return (
    { id: item.id_pessoa, nome: item.nome, cpf_cnpj: item.cpf_cnpj, cidade: item.cidade}
  )})}]; */

  const RowClicked = (event: any) => {
    const { id } = event.currentTarget; setRowId(id);
    if (rowId !== id) {//lidar se o usuário clicar novamente na mesma linha
      setRowId(id);
      //} else { setRowId(null); //definir a linha clicada como nula se a mesma linha for selecionada
    }
  };
  const RowDbClicked = (event: any) => {
    const { id } = event.currentTarget;
    Editar(id)
    setRowId(id);
    if (rowId !== id) {
      setRowId(id);
      //  } else { setRowId(null); //definir a linha clicada como nula se a mesma linha for selecionada
    }
  };
  const [rowIdLanc2, setIdLanc2] = useState('');

  const RowClickedLanc = (e: any) => {
    const { id } = e.currentTarget; 
    if (rowDva.id_lanc !== id) {
      setRowDva({ id_lanc: id.replace(/[^0-9]/g, ''), pago: id.replace(/[^A-Z]/g, '') });
      if (rowIdLanc2 !== id) {
        setIdLanc2(id);
      }
    }
  };

  const exibirLancDeta = (e: any) => {
    const { id } = e.currentTarget;
    setRowDva({ id_lanc: id.replace(/[^0-9]/g, ''), pago: id.replace(/[^A-Z]/g, '') });
    setIdLanc2(rowDva.id_lanc);
    if (rowDva.id_lanc !== id) {//lidar se o usuário clicar novamente na mesma linha
      setIdLanc(id);
      if (rowIdLanc2 !== id) {
        setIdLanc2('');
      }
    }
  }
  // const exibirLancDeta = (e: any) => {
  //   const { id } = e.currentTarget;
  //   setIdLanc2(id);
  //   if (rowIdLanc2 !== id) {    
  //     setIdLanc2(id);
  //     //  } else { setRowId(null); //definir a linha clicada como nula se a mesma linha for selecionada
  //   }
  // }

  const [rowDva, setRowDva] = useState({ id_lanc: '',pago:''});

  // const RowClickedDv = (event: any) => {
  //   let { id } = event.currentTarget; 
  //   setRowDva({id_lanc: id.replace(/[^0-9]/g, ''),pago:id.replace(/[^A-Z]/g, '')}) 
  // };



  const loadReceitas = () => {
    let id_ent = provid.sessao?.id_ent as number;
    let grp = '4';
    if(state.tipocad === 'E'){ grp = '2'}
    Api.get(`/recAtivas/${id_ent}/${grp}`)
      .then((res) => {
        if (res instanceof Error) {
          alert(res.message);
        } else { setReceitas(res.data); }
      }).catch(() => { });
  };

  const setReceitaId = (e: any) => {
    e.preventDefault();
    const id = e.target.value;
    if (id) {
      Api.get(`/receitaId/${id}`)
        .then((res) => { setDadosReceita(res.data.result[0]) }).catch(() => { })
    }
  };
  //com R$ valor_real.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
  //sem R$ valor_real.toLocaleString('pt-br', {minimumFractionDigits: 2});

  const formater$ = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const formater = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 });

  const AddSocios = async (nome_socio: any, cpf_cnpj_socio: any, qual: any) => {
    if (!state.id_pessoa || !nome_socio) {
      toast.warn('Selecione um Registro!');
    } else {
      Api.post(`/socios/${state.id_pessoa}/${nome_socio.replace('/', '')}/${cpf_cnpj_socio.replace('/', '')}/${qual}`).then((res) => {
        Editar(res.data.id_pessoa);
      }).catch((erro) => { });
    }
  }
  const delSocios = (id: any) => {
    Api.delete(`/delSocios/${id}/${state.id_pessoa}`).then((res) => {
      Editar(res.data.id_pessoa)
    }).catch((err) => { err });
  };

  const AddAtiv = async (cod_cnae: any) => {
    if (!state.id_pessoa || !cod_cnae) {
      toast.warn('Selecione um Registro!');
    } else {
      Api.post(`/ativsecundaria/${state.id_pessoa}/${cod_cnae}`).then((res) => {
        Editar(res.data.id_pessoa);
      }).catch((erro) => { });
    }
  }
  const delAtiv = (id: any) => {
    Api.delete(`/delAtivs/${id}/${state.id_pessoa}`).then((res) => {
      Editar(res.data.id_pessoa);
    }).catch((err) => { err });

  };

  const addRec = (id_rec:number, cod_rec: number, valor: string) => {
    if (!cod_rec || !valor) {
      toast.warn('Preencher, campos Obrigatórios!');
      let cpValor = document.getElementById("rsValor");
      let cpValor1 = document.getElementById("rsValor1");
      if (!valor) { if (cpValor !== null) cpValor.style.cssText = 'color: brown'; }
      if (!cod_rec) { if (cpValor1 !== null) cpValor1.style.cssText = 'color: brown'; }
    } else {
      let cpValor = document.getElementById("rsValor");
      let cpValor1 = document.getElementById("rsValor1");
      if (valor) { if (cpValor !== null) cpValor.style.cssText = 'display: none'; }
      if (cod_rec) { if (cpValor1 !== null) cpValor1.style.cssText = 'display: none'; }
      state.id_ent = provid.sessao?.id_ent as number;
      state.situacao = 'E',
        state.pago = 'N',
        state.id_user = provid.sessao?.id_user as number;
      state.id_pessoa;
      state.cod_pessoa;
      state.id_rec = id_rec;
      state.cod_rec = cod_rec;
      state.valor_real = valor.toLocaleString().replace(".", "").replace(",", ".");
      state.data_cad = new Date().toLocaleDateString('pt-BR')
      resetDadosRec();
      Api.post(`/lancPost`, state).then((res) => {
        if (res) {
          setLancmtosDt(res.data.result1);
          if (!state.desc_lanc) { state.desc_lanc = res.data.desc_lanc; }
          state.id_lanc = res.data.id_lanc;
          if(!state.numero_proc){state.numero_proc = res.data.numero_proc}          
          state.nossonum = res.data.nossonum;
          // state.nossonum = new Date().getFullYear() + ("000000" + state.cod_pessoa).slice(-6) + ("000000" + state.id_lanc).slice(-6); console.log('nossoNUm',state.nossonum)
          setTimeout(() => { somaTotal() }, 500);
        }
      }).catch(() => { });
    }
  };

  const SalvarLanc = async (e: any) => {
    e.preventDefault();
    if (!state.id_lanc) {
      toast.warn('Sem Receitas!')
    } else {
      if(!state.data_venc){
        toast.warning('Vencimento Inválido')
      }else{
        //state.data_cad = state.data_cad.format('YYYY-MM-DD')      
      lancmto.id_lanc = state.id_lanc;
      //lancmto.valor_real = total.replace(".", "").replace(",", ".");
      lancmto.valor_real = state.vltotal as any;
      lancmto.desc_lanc = state.desc_lanc;
      lancmto.nossonum = state.nossonum;
      lancmto.id_pessoa = state.id_pessoa;
      lancmto.id_user = state.id_user;
      if (!state.numero_proc) {
        lancmto.numero_proc = ("000000" + state.id_lanc).slice(-6) + '/' + new Date().getFullYear();
      }
      else { lancmto.numero_proc = state.numero_proc }
      if (!state.parc) { lancmto.parc = '1/1' }
      else { lancmto.parc = state.parc }  
        lancmto.data_lanc = data_lanc.toLocaleDateString();
       lancmto.data_venc = state.data_venc;
      Api.put(`/lancmto`, lancmto).then((res) => {
        setShowLanc(false);
        setLancmtosDt([]);
        Editar(state.id_pessoa);
        loadLancmtos();
        setKey('3')
      }).catch(() => { });
      }      
    }
  };
  const AltLanc = async (e: any) => {
    e.preventDefault();
    if (!lancmto.id_lanc) {
      toast.warn('Sem Registro!'); CloseMGeral();
    } else {
      // lancmto.data_venc = data_venc.toLocaleDateString()
      Api.put(`/altlanc`, lancmto).then((res) => {
        setShowGerl(false); loadLancmtos(); setIdLanc(rowIdLanc);
      }).catch(() => { });
    }
  };

  const salvarAlv = () => {
    if (!alvara.data_validade || !alvara.tipo_alvara || !alvara.exercicio) {
      toast.warn('Preencher, campos Obrigatórios!');
    } else {
      alvara.id_ent = provid.sessao?.id_ent as number;
      alvara.emissao = 'E',
        alvara.id_user = provid.sessao?.id_user as number;
      alvara.id_pessoa = state.id_pessoa;
      // alvara.data_emissao = data_emissao.toLocaleDateString()
      // alvara.data_validade = data_validade.toLocaleDateString()
      Api.post(`/alvaraPost`, alvara).then((res) => {
        if (res) {
          setAlvaras(res.data.result);
        }
      }).catch(() => { });
    }
  };

  const loadAlvaras = () => {
    setloadModal(true);
    const id_pessoa = state.id_pessoa;
    Api.get(`/alvaras/${provid.sessao?.id_ent}/${id_pessoa}`).then((resp) => {
      if (resp) {
        setloadModal(false);
        setAlvaras(resp.data.result);
        setAllAssin(resp.data.result_assin);
      }
    }).catch(() => { setLograd([]) });
  }
  const loadLancmtos = () => {
    setloadModal(true);
    const id_pessoa = state.id_pessoa;
    Api.get(`/lancmtosAll/${id_pessoa}`).then((resp) => {
      if (resp) {
        setloadModal(false);
        setLancmtos(resp.data.result);
      }
    }).catch(() => { setLograd([]) });
  }
  const [novaCnd, setNovaCnd] = useState('0');

  const novoCnd = () => {
    if (docs.lancmtos) {
      toast.warning('Não é Possível Emissão!')
    } else { setNovaCnd('1') }

  }

  const salvarCND = () => {
    if (!docs.id_pessoa || !docs.finalidade_doc) {
      toast.warn('Campos Obrigatórios!');
    } else {
      //GERA O CODIGO DE VERIFICACAO
      //alfanum += numero%2 == 0 ? letra : numero; // verifico se 'numero' é par para formar a sequência alfanumérica
      let num;
      for (var x = 1, alfanum = num = ""; x < 5; x++) {
        var letra = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var numero = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var numero2 = Math.floor(Math.random() * 9);
        alfanum += letra;
        num += numero2;
      }
      //let Codveri = alfanum+"-"+num; 
      docs.cod_verificacao = alfanum + "-" + num;
      docs.tipo_doc = 'Certidão Negativa de Débitos'
      docs.id_ent = provid.sessao?.id_ent as number;
      docs.usu_cad = provid.sessao?.username as string;
      docs.data_emissao = data_emissao.toLocaleDateString();
      docs.data_cad = new Date().toLocaleDateString('pt-br');
      Api.post(`/docPost`, docs).then((res) => {
        if (res) {
          setloadModal(true); setModo('CND');
          setDocs(res.data.result[0]);
          setAssin1(res.data.assin1[0])
          setAssin2(res.data.assin2[0])
          setAssin3(res.data.assin3[0])
          setTimeout(() => setloadModal(false), 400)
        }
      }).catch(() => { });
    }
  };

  const delPessoa = (rowId: any) => {
    setRowId(null);
    if (rowId) {
      let id_user = provid.sessao?.id_user;
      Api.delete(`/delPessoa/${rowId}/${id_user}`).then((res) => {
        if (!res) { setRowId(rowId) }
        else {
          setShow(false);
        }
      }).catch((err) => { err });
    } else {
      toast.warn('Selecione um registro!')
    }
  };

  const delLanc = () => {   
      if (rowDva.id_lanc) {
        let iduser = provid.sessao?.id_user;
        Api.delete(`/delLanc/${iduser}/${rowDva.id_lanc}/${state.id_pessoa}`).then((res) => {
          if (res) {
            Editar(res.data.id_pessoa);
            loadLancmtos();
          }
        }).catch((err) => { err });
      } else {        
        toast.warn('Selecione um registro!')
      }
    
  };

  const delLanc2 = (id_lanc: any) => {
    setIdLanc(null);
    if (id_lanc) {
      let iduser = provid.sessao?.id_user;
      Api.delete(`/delLanc/${iduser}/${id_lanc}/${state.id_pessoa}`).then((res) => {
        if (res) {
          Editar(state.id_pessoa)
          setKey('3');
          loadLancmtos();
          
        }
      }).catch((err) => { err });
    } else {
      toast.warn('Selecione um registro!')
    }
  };

  const delLancDt = (id: any) => {
    if (id) {
      let id_user = provid.sessao?.id_user;
      Api.delete(`/delLancDt/${id}/${id_user}`).then((res) => {
        if (res) {
          setLancmtosDt(res.data.result1);
          state.id_lanc = res.data.id_lanc;
          setTimeout(() => { somaTotal() }, 500);
        }
      }).catch((err) => { err });
    } else {
      toast.warn('Selecione um registro!')
    }
  };

  const delAlvara = (id: any) => {
    if (id) {
      Api.delete(`/delAlvara/${id}/${state.id_pessoa}`).then((res) => {
        if (res) {
          Editar(res.data.id_pessoa);
          loadAlvaras()
        }
      }).catch((err) => { err });
    } else {
      toast.warn('Selecione um registro!')
    }
  };
  const impAlv = (id: any) => {
    setModo('Alvara');
    setShowGerl(true)
    if (id) {
      Api.get(`/alvaraId/${id}`).then((res) => {
        if (res) {
          setShowGerl(true);
          setAlvara(res.data.result[0]);
          setAssin1(res.data.assin1[0])
          setAssin2(res.data.assin2[0])
          setAssin3(res.data.assin3[0])
        }
      }).catch((err) => { err });
    } else {
      toast.warn('Selecione um registro!')
    }
  };
  function imprimir() {
    //    var title = document.title;  
    var css2 = ` * {
    box-sizing: border-box;
    -moz-box-sizing: border-box;}
#container{ padding: 5mm; margin-top: 3px; width: 220mm; zoom: 90%;  background: rgb(203, 202, 202);overflow: hidden; border: #808080 solid 1px; }
.ent_print{ text-align: left; width: 100%;  background-color: #177e47; line-height: 3px;}
.ent_print .ent_texto h3{color: #020917; font-size: 12pt; opacity: 0.8; }
.ent_print .ent_brasao, .ent_texto{ float: left; color: #545554}
.ent_print .ent_brasao {margin-top: -10px;}
.tableDAM{float: right; }
.tableDAM tr th{font-size: 8pt; text-transform: uppercase; padding: 4px; border: 1px solid;background-color: #CCCCCC}
.tableDAM tr td{font-size: 8pt;line-height: 15px; }

.page{ padding: 1cm; width: 210mm; height: 297mm;  background: white; box-shadow: #020917 3px 5px 8px; }  
.subpageDAM { overflow: hidden; width: 19cm;height: 285mm}
.subpage { overflow: hidden; margin-left: 5px; height: 280mm;border: #177e47 solid 3px; padding: 1cm;   border-radius: 20px; }

.subpage  #cabecalho{ width: 100%;;line-height: 8px;display: flex; flex-direction: column; justify-content: center; align-items: center }

.subpage  #cabecalho{ width: 100%;line-height: 3px;display: flex; flex-direction: column; justify-content: center; align-items: center }
.subpage #cabecalho img{margin-bottom: 10px;}

.subpage h1{text-align: center; opacity: 0.8; margin-top: 5px;font-size:40pt; color: #177e47; font-weight:bolder}
.subpage h2{text-align: center; opacity: 0.8; font-size: 10pt;font-weight: bolder; margin-top: -5px; }
.subpage h3{text-align: center; text-transform: uppercase;margin-top: -15px; opacity: 0.8; font-size: 18pt;font-weight: bolder; }
.subpage span{text-align: center; opacity: 0.8; font-size: 12pt;font-weight: bolder; }
.subpage #numAlv{float: right;}
.subpage label{font-size: 9pt}
.subpage input{background-color: #dbfcce; height: 21px; font-size: 8pt; border-radius: 2px; pointer-events: none; }
.subpage .my_textarea{background-color: #dbfcce; font-size: 8pt;}
.subpage #my_textarea{background-color: #dbfcce; font-size: 8pt; padding: 3px; }
.subpage #my_textarea td{font-size: 7pt; line-height: 12px; }
.subpage #exercAlv{position: absolute; font-size: 47pt; margin-top: -85px; margin-left: 48px; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;}
.subpage #cancelado{ color: #ad0a0a; font-size: 52pt; position: absolute;
  transform:rotate(-45deg);
-ms-transform:rotate(-45deg); /* IE 9 */
-webkit-transform:rotate(-45deg); /* Opera, Chrome, and Safari */
}


#emissao{text-align: center; line-height: 3px;}
#assinatura{text-align: center; line-height: 3px; margin-top: 10px;}
#assinatura p{ font-size: 8pt; margin-top: 12px;}
#assinatura span{font-size: 9pt;}
#footerRel {position: relative;
  left: 0; text-align: center; bottom: 5px; margin-top: -20px;
  width: 100%; color: #24611dc3; text-align: center;}
@page {
    size: A4;
    margin: 0;}
@media print {
    html, body {
        width: 200mm; }
    .page {
        margin: 0;  border: initial;  border-radius: initial; width: initial;
        min-height: initial; box-shadow: initial;  background: initial; page-break-after: always;
    }}
   `;
    var conteudo = document.getElementById('container')?.innerHTML;
    var tela_impressao: any = window.open(' ', ' ', 'width=850px,zoom:60%, height=800px, overflow=auto');
    tela_impressao.document.write(`<head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"></head>`);

    tela_impressao.document.write(
      //head + conteudo
      `<style/>` + css2 + `</style>` + conteudo
      //`<link rel="stylesheet" type="text/css" href="../print.css" />`+conteudo
    );
    tela_impressao.window.print();
    setTimeout(function () {
      tela_impressao.window.close();
    }, 25000);
  }

  function imprimiDAM() {
    //    var title = document.title;  
    var css2 = `  
    * {box-sizing: border-box;
    -moz-box-sizing: border-box;}
#container{ padding: 5mm; margin-top: 3px; width: 220mm; zoom: 90%;  background: rgb(203, 202, 202);overflow: hidden; border: #808080 solid 1px; }
.ent_print{ text-align: center; width: 100%;  line-height: 3px; overflow: hidden; padding: 3px;}
.ent_print  h3{color: #020917; font-size: 12pt; opacity: 0.8; }
.ent_print .ent_brasao {margin-top: -5px;  position: absolute; float: left; margin-left: -340px;}
.ent_print p{font-size: 9pt;}
.tableDAM{float: right; }
.tableDAM tr th{font-size: 8pt; text-transform: uppercase; padding: 4px; border: 1px solid; background-color: #CCCCCC}
.tableDAM tr td{font-size: 8pt;line-height: 15px; }
.page{ padding: 1cm; width: 210mm; height: 297mm;  background: white; box-shadow: #020917 3px 5px 8px; }  
.subpageDAM { overflow: hidden; width: 19cm}
.subpage  #cabecalho{ width: 100%;;line-height: 8px;display: flex; flex-direction: column; justify-content: center; align-items: center }
.subpage h1{text-align: center; opacity: 0.8; margin-top: 5px;font-size:40pt; color: #177e47; font-weight:bolder}
.subpage h2{text-align: center; opacity: 0.8; font-size: 15pt;font-weight: bolder; }
.subpage h3{text-align: center; text-transform: uppercase;margin-top: -15px; opacity: 0.8; font-size: 18pt;font-weight: bolder; }
.subpage span{text-align: center; opacity: 0.8; font-size: 12pt;font-weight: bolder; }
.subpage #numAlv{float: right}
.subpage label{font-size: 9pt}
.subpage input{background-color: #dbfcce; height: 21px; font-size: 8pt; border-radius: 2px;}
.subpage textarea,.my_textarea{background-color: #dbfcce; font-size: 8pt;}
.subpage #my_textarea{background-color: #dbfcce; font-size: 8pt; padding: 3px;  }
.subpage #my_textarea td{font-size: 7pt; line-height: 12px; }
.subpage #exercAlv{position: absolute; font-size: 46pt; margin-top: -85px; margin-left: 50px; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;}
#emissao{text-align: center; line-height: 3px;}
#assinatura{text-align: center; line-height: 3px; margin-top: 10px;}
.subpage #cancelado{ color: #ad0a0a; font-size: 52pt; position: absolute;
  transform:rotate(-45deg);
-ms-transform:rotate(-45deg); /* IE 9 */
-webkit-transform:rotate(-45deg); /* Opera, Chrome, and Safari */
}

@page {
    size: A4;
    margin: 0;
}
@media print {
    html, body {
        width: 200mm;   
    }
    .page {
        margin: 0;
        border: initial;
        border-radius: initial;
        width: initial;
        min-height: initial;
        box-shadow: initial;
        background: initial;
        page-break-after: always;
    }
}
    body{  color:#000000; background-color:#ffffff;
  margin-top:0; margin-right:0;}
*{margin:0px;padding:0px}
 table{border:0;border-collapse:collapse;padding:0}
 table tr td {padding: 3px; text-transform: uppercase}
 table td {padding: 3px;}
img{border:0}
.cp{font: bold 10px arial; color: black}
.ti{ font: 9px arial, helvetica, sans-serif}
.ld{  font: bold 14px arial; color: #000000}
.ct{ font: 9px "arial narrow"; color: #000033}
.cn{  font: 9px arial;  color: black}
.bc{  font: bold 22px arial;  color: #000000}
.cut{width:665px;height:1px;border-top:dashed 1px #000}
.Ac{text-align:center}.Ar{text-align:right}.Al{text-align:left}.At{vertical-align:top}
.ct td, .cp td{padding-left:6px;border-left:solid 1px #000;border-right:solid 1px #000}
.cpN{font:bold 10px arial;color:black}.Ab{vertical-align:bottom}
.ctN{font:9px "arial narrow";color:#000033}
.pL0{padding-left:0px}.pL6{padding-left:6px;}.pL10{padding-left:10px}.imgLogo{width:140px;height:33px;}
.barra{width:2px;height:15px; border-left:solid 1px #000;}
.rBb td{border-bottom:solid 1px #000;}.BB{border-bottom:solid 1px #000}.BL{border-left:solid 1px #000}
.BR{border-right:solid 1px #000}.BT1{border-top:dashed 1px #000}.BT2{border-top:solid 2px #000}
.h1{height:1px}.h13{height:13px}.h12{height:12px}.h13 td{vertical-align:top}.h12 td{vertical-align:top;}
.w6{width:6px}.w7{width:7px;}.w34{width:34px}.w45{width:45px}.w53{width:53px}.w62{width:62px}
.w65{width:65px}.w72{width:72px}.w83{width:83px}.w88{width:88px}.w104{width:104px}.w105{width:105px}
.w106{width:106px}.w113{width:113px}.w112{width:112px}.w123{width:123px}.w126{width:126px}
.w128{width:128px}.w132{width:132px}.w134{width:134px}.w150{width:150px}.w163{width:163px}
.w164{width:164px}.w180{width:180px}.w182{width:182px}.w186{width:186px}.w192{width:192px}
.w250{width:250px}.w298{width:298px}.w409{width:409px}.w472{width:472px}.w478{width:478px}
.w500{width:500px}.w544{width:544px}.w564{width:564px}.w659{width:659px}.w666{width:19cm}.w667{width:667px}
.BHead h3 {font-size: 13pt;}.w666 .BHead {border:solid 1px #000}
.EcdBar{height:50px;vertical-align:bottom}
.rc6 td{vertical-align:top;border-bottom:solid 1px #000;border-left:solid 1px #000; border-right:solid 1px #000 }
.rc6 div{padding-left:6px}
.rc6 .t{font:9px "arial narrow";color:#000033;height:13px}
.rc6 .c{font:bold 10px arial;color:black;height:12px}
.mt23{margin-top:23px;}
.pb4{padding-bottom:14px;}
.ebc{width:4px;height:440px;border-right:dotted 1px #000000;margin-right:4px;}
.barcode span {font-size: 11pt; font-weight: 100; margin-left: 40px; }
@media print
{  * {-webkit-print-color-adjust:exact;}
  .no-print, .no-print *
  {    display: none !important;  }
}
   `;
    var conteudo = document.getElementById('container')?.innerHTML;
    var tela_impressao: any = window.open(' ', ' ', 'width=' + '850px' + ', height=' + '800px' + ', overflow-y=' + 'auto');
    tela_impressao.document.write(`<head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"></head>`);
    tela_impressao.document.write(
      //head + conteudo
      `<style/>` + css2 + `</style>` + conteudo
      //`<link rel="stylesheet" type="text/css" href="../print.css" />`+conteudo
    );
    tela_impressao.window.print();
    setTimeout(function () {
      tela_impressao.window.close();
    }, 15000);
  }
  function imprimiAlv() {
    //    var title = document.title;  
    var css2 = ` * {
    box-sizing: border-box;
    -moz-box-sizing: border-box;}
#container{ padding: 5mm; width: 220mm;  background: rgb(177, 177, 177);overflow: hidden; border: #808080 solid 1px; }
.page{ padding: 1cm; width: 210mm; height: 297mm;  background: white; box-shadow: #020917 3px 5px 8px; }  
.subpage { overflow: hidden; width: 19cm; height: 277mm;border: #177e47 solid 3px;
  padding: 1cm; border-radius: 20px; }
.subpage  #cabecalho{ width: 100%;;line-height: 8px;display: flex; flex-direction: column; justify-content: center; align-items: center }
.subpage h1{text-align: center; opacity: 0.8; margin-top: 5px;font-size:40pt; color: #177e47; font-weight:bolder}
.subpage h2{text-align: center; opacity: 0.8; font-size: 15pt;font-weight: bolder; }
.subpage h3{text-align: center; text-transform: uppercase;margin-top: -15px; opacity: 0.8; font-size: 18pt;font-weight: bolder; }
.subpage span{text-align: center; opacity: 0.8; font-size: 12pt;font-weight: bolder; }
.subpage #numAlv{float: right}
.subpage label{font-size: 9pt}
.subpage input{background-color: #dbfcce; height: 21px; font-size: 8pt; border-radius: 2px;}
.subpage textarea,.my_textarea{background-color: #dbfcce; font-size: 8pt;}
.subpage #my_textarea{background-color: #dbfcce; font-size: 8pt; padding: 3px;  }
.subpage #my_textarea td{font-size: 7pt; line-height: 12px; }
.subpage #exercAlv{position: absolute; font-size: 46pt; margin-top: -85px; margin-left: 50px; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;}
.subpage #cancelado{ color: #ad0a0a; font-size: 50pt; position: absolute;
  transform:rotate(-45deg);
-ms-transform:rotate(-45deg); /* IE 9 */
-webkit-transform:rotate(-45deg); /* Opera, Chrome, and Safari */
}
#emissao{text-align: center; line-height: 3px;}
#assinatura{text-align: center; line-height: 3px; margin-top: 10px;}
#footerRel {position: relative;
  left: 0; text-align: center; bottom: 8px; margin-top: -20px;
  width: 100%; color: #24611dc3; text-align: center;}
@page {
    size: A4;
    margin: 0;}
@media print {
    html, body {
        width: 200mm; }
    .page {
        margin: 0;  border: initial;  border-radius: initial; width: initial;
        min-height: initial; box-shadow: initial;  background: initial; page-break-after: always;
    }}
   `;
    var conteudo = document.getElementById('container')?.innerHTML;
    var tela_impressao: any = window.open(' ', ' ', 'width=850px,zoom:60%, height=800px, overflow=auto');
    tela_impressao.document.write(`<head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"></head>`);

    tela_impressao.document.write(
      //head + conteudo
      `<style/>` + css2 + `</style>` + conteudo
      //`<link rel="stylesheet" type="text/css" href="../print.css" />`+conteudo
    );
    tela_impressao.window.print();
    setTimeout(function () {
      tela_impressao.window.close();
    }, 15000);
  }


  const sel_log = (nome_log: any, bairro_log: any, cidade_log: any, uf_log: any, cep_log: any) => {
    setShowGerl(false);
    setShow(true);
    state.rua = nome_log;
    state.bairro = bairro_log;
    state.cidade = cidade_log;
    state.uf = uf_log;
    state.cep = cep_log;
  }
  const sel_cnae = (cod_cnae: any, cod_grupo: any) => {
    setShowGerl(false);
    setShow(true);
    state.cod_cnae_grupo = cod_grupo;
    state.cod_cnae = cod_cnae;
  }
  const sel_pessoa = (nome_pessoa: any, cpf_cnpj: any) => {
    setPesq4(initPesq);
    setShowGerl(false);
    setShow(true);
    state.nome_socio = nome_pessoa;
    state.cpf_cnpj_socio = cpf_cnpj;
  }

  function validation() {
    let nome_pessoa = document.getElementById("rsNome");
    let rua = document.getElementById("rsRua");
    let cpfj = document.getElementById("rsCpfj");
    let cpfj1 = document.getElementById("rsCpfj1");
    let tel = document.getElementById("rsTel");

    if (!state.nome_pessoa) { if (nome_pessoa !== null) nome_pessoa.style.cssText = 'color: brown'; }else{ if (nome_pessoa !== null) nome_pessoa.style.cssText = 'display:none'}
    if (!state.rua) { if (rua !== null) rua.style.cssText = 'color: brown'; }else{ if (rua !== null) rua.style.cssText = 'display:none'}
    if (!state.cpf_cnpj) { if (cpfj !== null) cpfj.style.cssText = 'color: brown'; }else{ if (cpfj !== null) cpfj.style.cssText = 'display:none';
      if (state.cpf_cnpj.length < 11 ) { if (cpfj1 !== null) cpfj1.style.cssText = 'color: brown'; }else{ if (cpfj1 !== null) cpfj1.style.cssText = 'display:none'}
    }    
    if (!state.telefone) { if (tel !== null) tel.style.cssText = 'color: brown'; }else{ if (tel !== null) tel.style.cssText = 'display:none'}
    toast.warning('Vericar Campos Obrigatórios')
  }
  const webservice = (cpf_cnpj: any) => {
    setloadModal(true);
    if (cpf_cnpj) {
      if (state.tipocad === 'E') {        
        Api.get(`/consultarCnpj/${cpf_cnpj.replace(/[^0-9]/g, '')}`)
          .then((result) => {
            if (result) {
              state.data_abertura = result.data.abertura;
              state.situacao_cad = result.data.situacao;
              state.nome_pessoa = result.data.nome;
              state.cod_natureza = result.data.natureza_juridica.replace(/[^0-9]/g, '');
              state.cod_cnae_grupo = result.data.atividade_principal[0].code.replace(/[^0-9]/g, '').substring(0, 2);
              state.cod_cnae = result.data.atividades_secundarias[0].code.replace(/[^0-9]/g, '');
              state.socios = result.data.qsa;
              state.ativsecund = result.data.atividades_secundarias;
              state.rua = result.data.logradouro;
              state.numero = result.data.numero;
              state.bairro = result.data.bairro;
              state.cidade = result.data.municipio;
              state.uf = result.data.uf;
              state.cep = result.data.cep;
              state.email = result.data.email;
              state.telefone = result.data.telefone;
              state.cpf_cnpj = result.data.cnpj;
              state.ultima_atualizacao = result.data.ultima_atualizacao;
              state.fantasia = result.data.fantasia;
              state.complemento = result.data.complemento;
              switch (result.data.porte) {
                case 'MICRO EMPRESA': state.porte = '1' }
              setloadModal(false);
            }
          }).catch((erro) => { console.log('erro:', erro) });
      } else {  //<----- CONTRIBUINTE NORMAL  
        // Api.get(`/consultaCnpj2/${cpf_cnpj.replace(/[^0-9]/g, '')}`)
        Api.get(`/consultarCnpj/${cpf_cnpj.replace(/[^0-9]/g, '')}`)
          .then((result) => {
            if (result) {
              state.situacao_cad = result.data.situacao;
              state.nome_pessoa = result.data.nome;
              state.rua = result.data.logradouro;
              state.numero = result.data.numero;
              state.bairro = result.data.bairro;
              state.cidade = result.data.municipio;
              state.uf = result.data.uf;
              state.cep = result.data.cep;
              state.email = result.data.email;
              state.telefone = result.data.telefone;
              state.cpf_cnpj = result.data.cnpj;
              state.data_abertura = result.data.abertura;
              setloadModal(false);
            }
          }).catch((erro) => { console.log('erro:', erro) });
      }
    } else { toast.warn('Digite um CNPJ!'); setloadModal(false); }
  }

  const Salvar = async (e: any) => {
    e.preventDefault()
    if (!state.nome_pessoa || !state.cpf_cnpj || !state.rua) {
      return validation();
    } else {
      setloadModal(true);
      if (!state.tipocad) {
        state.tipocad = 'C';
      }
      //   state.data_cad = state.data_cad.format('YYYY-MM-DD')      
      state.id_user = provid.sessao?.id_user as number;
      state.id_ent = provid.sessao?.id_ent as number;
      state.usu_cad = provid.sessao?.nome as string;
      state.cpf_cnpj = state.cpf_cnpj.replace(/[^0-9]/g, '');
      switch (state.situacao_cad) {
        case 'ATIVO': return state.situacao_cad = 'A'; break;
        case 'INATIVO': return state.situacao_cad = 'I'; break;
        case 'BAIXADO': return state.situacao_cad = 'B'; break;
        case 'CANCELADO': return state.situacao_cad = 'C'; break;
      }
      if (!state.data_cad) { state.data_cad = new Date().toLocaleDateString('pt-BR') }
      //state.data_cad = new Date().toLocaleString() + '';
      //var today = new Date();
      //state.data_cad = state.data_cad.toISOString().substring(0, 10);
      if (!state.id_pessoa) {
        Api.post(`/pessoa`, state).then((res) => {
          Cancelar(res.data.result2.insertId)
          setloadModal(false);
        }).catch(() => { setPessoas([]);setloadModal(false); });
      } else {
        state.data_alt = new Date().toLocaleString(); console.log(state.data_alt);
        //ClienteServices.update(state)
        Api.put(`/pessoa/`, state).then((res) => {
         // listar();
          Cancelar(res.data.id_pessoa)
          setloadModal(false);
        }).catch(() => { setPessoas([]);setloadModal(false); });
      }
    }
  }
  //const [tipocad, setTipocad] = useState('E')

  var label1 = <div id="label_form"><Image alt='preview' src={`${state.tipocad === 'E' ? '/maleta.png' : '/pessoa.png'}`} width={30} height={30} /> <span>{state.tipocad === 'E' ? 'Econômico Mercantil' : 'Pessoas'}</span></div>;
  var label2 = <div id="label_form"><Image alt='preview' src='/tum.png' width={30} height={30} /> <span>Tumulos</span></div>;
  var label3 = <div id="label_form" onClick={loadLancmtos}><Image alt='preview' src='/lanc3.png' width={30} height={30} /> <span>Lançamentos</span></div>;

  var label4 = <div id="label_form"><Image alt='preview' src='/dbase.png' width={30} height={30} /> <span>Pricipal</span></div>;
  var label5 = <div id="label_form"><Image alt='preview' src='/pasta.png' width={30} height={30} /> <span>Endereço</span></div>;
  var label6 = <div id="label_form"><Image alt='preview' src='/pasta.png' width={30} height={30} /> <span>Sócios / Atividades</span></div>;
  var label7 = <div id="label_form" onClick={loadAlvaras}><Image alt='preview' src='/alvara.png' width={30} height={30} /> <span>Alvaras</span></div>;

  const incluir_lanc = (rowId: any) => {
    setLancmtosDt([]);
    if (rowId) {
      setShowGerl(false)
      setloadModal(true);
      setShowLanc(true);
      loadReceitas();
      if (!state.id_pessoa) {
        Api.get(`/pessoasIdLancmto/${rowId}`).then((res) => {
          if (res) {
            setState(res.data.result[0]);
            setloadModal(false)
          } else {
            setloadModal(false); CloseMLanc();
          }
        });
      } else { setloadModal(false) }
    } else {
      setloadModal(false);
      toast.warn('Selecione um registro!')
    }
  }

  const calcEncargos = () => {
    let id_user = provid.sessao?.id_user as number;
    if (!rowDva.id_lanc) {
      toast.warn('Selecione um registro!')
    } else {
      Api.put(`/calcEnc/${rowDva.id_lanc}/${id_user}`).then((res) => {
        if (res) {
          Editar(rowId);
          loadLancmtos();
          setKey('3');
        }
      }).catch((err) => { err });
    }
  };

  function somaTotal() {
    var soma = 0 as number;
    //forma Principal
    var valor = document.getElementsByClassName("vlrec");
    for (let i = 0; i < valor.length; i++) {
      soma = soma + Number(valor[i].innerHTML.replace(".", "").replace(",", "."))
    }
    setTotal({ soma })
    state.vltotal = soma;
    /*
                  let valorSomado = 0;
                 [].forEach.call(els, function (el) 
                  { valorSomado += parseInt((el as any).innerText);                
                    console.log('Dentro',valorSomado)  });                 
                console.log('Fora',valorSomado);   */
  }
  const [isChecked, setIsChecked] = useState(false);

  const handleOnCheck = (e: any) => {
    //e.preventDefault();
    const { name, value } = e.target;
    setIsChecked(!isChecked);
    setState({ ...state, [name]: value });
  };
  const situacaoCad = [['A', "ATIVO"], ['I', 'INATIVO'], ['B', 'BAIXADO'], ['C', 'CANCELADO']];
  //const tipoPessoa = [[],['F',"FISICA"], ['J','JURIDICA']];
  const tipocad1 = [['C', "CONTRIBUINTE"], ['E', 'MERCANTIL']];
  const regimeTrib = [['0', "INDEFINIDO"], ['1', "DES CONSOLIDADA"], ['2', 'DES SIMPLIFICADA'], ['3', 'SIMPLES NACIONAL'], ['4', 'MEI'], ['5', 'LUCRO ARBITRADO'], ['6', 'LUCRO PRESUMIDO'], ['7', 'LUCRO REAL'], ['8', 'OUTROS']];
  const opcoes = [["Sujeito a ISS", 'iss', `${state.iss}`], ["ISS Retido Na Fonte", 'iss_retido', `${state.iss_retido}`], ["Taxa da Virgilância", 'tx_virgilancia', `${state.tx_virgilancia}`],
  ["Gera Alvara Funcionamento", 'alvara', `${state.alvara}`], ["Alvara Transporte (Veiculos)", 'alvara_trans', `${state.alvara_trans}`]];
  const cod_segmentoAtiv = [['0', "INDEFINIDO"], ['1', "INDÚSTRIA"], ['3', "COMÉRCIO"], ['5', "PRESTAÇÃO DE SERVIÇOS"], ['6', "AGROPECUÁRIA"], ['7', "COMÉRCIO E SERVIÇOS"], ['8', "FÁBRICA"], ['9', "INSTITUIÇÃO FINANCEIRA"], ['10', "INDÚSTRIA E COMÉRCIO"], ['11', "COMÉRCIO E REPRESENTAÇÃO"], ['20', "ENTIDADES REGIDAS PELO PODER PÚBLICO"],
  ['21', "FUND. ASSOC. CONC. S.P. & SOC. AFINS N LUCRA"], ['22', "TEMPLOS"], ['23', "EDUCAÇÃO"],];
  const classeTrib = [['0', "INDEFINIDO"], ['1', "FEIRANTES (BANCOS)"], ['2', 'ISS AUTONOMO'], ['3', 'ISS-OBRAS'], ['4', 'ISS-PF'], ['5', 'ISS-PJ']];
  const porte = [['0', "INDEFINIDO"], ['1', "MICRO EMPRESA", '18.61'], ['2', 'EMPRESA DE PEQUENO PORTE - EPP', '40.63'], ['3', 'EMPRESA DE MEDIO PORTE - EMP', '57.94'], ['4', 'EMPRESA DE GRANDE PORTE', '74.44'], ['8', 'ASSOCIAÇÃO', '16.67'],
  ['9', 'MICROEMPREENDEDOR INDIVIDUAL', '16.67'], ['10', 'EIRELI (EMPRESA INDIVIDUAL DE RESPONSABILIDADE LIMITADA)', '16.67']];
  const vigilancia = [['0', "INDEFINIDO"], ['1', "AGROPECUÁRIA ATÉ 10 EMPREGADOS"], ['2', 'AGROPECUÁRIA ACIMA DE 10 EMPREGADOS'], ['3', "INDÚSTRIAS E FÁBRICAS ATÉ 10 EMPREGADOS"], ['4', 'INDÚSTRIAS E FÁBRICAS ACIMA DE 10 EMPREGADOS'],
  ['5', "COMÉRCIO - FARMÁCIAS, MERCEARIAS COM VENDAS DE PRODUTOS PERECÍVEIS, CONSERVAS OU CONGELADOS"], ['6', "COMÉRCIO - MERCADINHOS E SUPERMERCADOS"], ['7', "COMÉRCIO - BARES, LANCHONETES E RESTAURANTES"], ['8', "COMÉRCIO - FRIGORÍFICOS E MATADOUROS"],
  ['9', 'COMÉRCIO - ATACADISTAS EM GERAL, COM VENDAS DE PRODUTOS PERECÍVEIS, CONSERVAS E CONGELADOS'], ['10', "COMÉRCIO - ESTABELECIMENTOS PRECÁRIOS (SEM EMPREGADOS), COM VENDAS DE PRODUTOS PERECÍVEIS, CONSERVAS OU CONGELADOS"],
  ['11', "PRESTADORES DE SERVIÇOS - HOTÉIS, MOTEIS, PENSÕES E SIMILARES"], ['12', "EVENTUAL OU AMBULANTE - COMÉRCIO OU ATIVIDADE DE PRETAÇÃO DE SERVIÇO COM OU SEM UTILIZAÇÃO DE VEÍCULO, APARELHO, MÁQUINA"]];
  const cargoSocios = [['1', "DIRETOR"], ['2', 'DIRETOR PRESIDENTE'], ['3', 'DIRETOR EXECUTIVO'], ['4', 'DIRETOR FINANCEIRO'], ['5', 'DIRETOR TECNICO'], ['6', 'DIRETOR COMERCIAL'], ['7', 'DIRETOR INDUSTRIAL'], ['8', 'DIR VICE-PRESIDENTE'], ['9', 'GERENTE'],
  ['10', 'SÓCIO'], ['11', 'SÓCIO COTISTA'], ['12', 'SÓCIO GERENTE'], ['13', 'SÓCIO PROPRIETÁRIO'], ['14', 'SÓCIO ADMINISTRADOR'], ['15', 'VICE PRESIDENTE']];
  const tipoAlvara = [[""], ["LOCALIZAÇÃO E FUNCIONAMENTO"], ["TAXA DE FISCALIZAÇÃO DO FUNCIONAMENTO"], ["TAXISTA"], ["MOTO TAXISTA"], ['VIGILANCIA SANITARIA'], ['TRANSPORTE ALTERANTIVO']];

  /*   const handleChange = (e:any)=> {
       //name n esta em uso
       const { name, value } = e.target;   
         setDataLanc(value);
         setDataVenc(value);
         state.data_cad = value.toLocaleDateString(); console.log(state.data_cad);
         state.vencmto = value.toLocaleDateString(); console.log(state.vencmto)
         }
            selected={date} onChange={(date) => setDate(date)}              
               <div className="form-group col-md-2" >
                   <label>Data Cadastro</label>
                   <DatePicker className='form-control form-control-solid w-250px' selected={data_lanc} dateFormat="dd/MM/yyyy"
                   onChange={(data_lanc) => handleChange({target: { name: "data_lanc", value: data_lanc }})} />
               </div>
               */
  const apiRef = useGridApiRef();
  
  const handlePesq = (e: any) => {
    pesq4.id_ent = provid.sessao?.id_ent as number;
    const { name, value } = e.target;
    setPesq4({ ...pesq4, [name]: value });
    debounce(() => {
      setloading(true);
      if (!pesq4.text1) { pesq4.text1 = '*' }
      if (!pesq4.text2) { pesq4.text2 = '*' };
      Api.post(`/pessoasPesq`,pesq4).then((response) => {
        if (response) {
          setloading(false);
          setPessoas(response.data)
        }
      }).catch((err) => { if (err) { setPessoas([]); setloading(false); console.log('err', err) } });
    });
  }

  const handlePesq2 = (e: any) => {
    pesq4.id_ent = provid.sessao?.id_ent as number;
    const { name, value } = e.target;
    setPesq4({ ...pesq4, [name]: value });
    debounce(() => {    
      if (!pesq4.text1) { pesq4.text1 = '*' }
      if (!pesq4.text2) { pesq4.text2 = '*' };
      Api.post(`/pessoasPesq`,pesq4).then((response) => {
        if (response) {
          setPessoas2(response.data)
        }
      }).catch((err) => { if (err) { setPessoas2([]); console.log('err', err) } });
    });
  }
  return (
    <>
      {provid.auth &&
        <div id="container_body">
          <div id="iPnl">
            <div id="iPnl1">
              <div id="btns">
                <div id="titulo1">
                  <h5><Image alt='preview' width={30} height={30} src='/pessoa.png' /> Pessoas</h5>
                </div>
              </div>
              <div id="btns" className="col-md-3" style={{overflow:'hidden'}}>
                <div className="col-md-12">                
                  <label className="form-group me-4">Pesquisar por:</label>
                  <select className="form-group col-md-7" id="campo" name="campo" value={pesq4.campo} onChange={handlePesq}>
                    <option value='cod_pessoa'>CODIGO</option>
                    <option value='nome_pessoa'>NOME</option>
                    <option value='cpf_cnpj'>CPF/CNPJ</option>
                    <option value='data_cad'>DATA</option>
                  </select> <br />                  
                    <div className="form-group col-md-12 mt-1 float-start">
                     {pesq4.campo === 'data_cad' ? <div>
                      <input type="date" className="form-group col-md-6 me-1 float-start" alt="Pesquisar" onChange={handlePesq} name="text1" value={pesq4.text1} />
                      <input type="date" className="form-group col-md-5 float-start" alt="Pesquisar" onChange={handlePesq} name="text2" value={pesq4.text2} />
                      </div> :
                    <input className="form-group col-md-9 float-start" alt="Pesquisar" name="text1" onChange={handlePesq} value={pesq4.text1} placeholder="Pesquisar.."/> }
                  <button id="btPesq" type="button" className="btn-outline-primary btn-sm float-start" onClick={handlePesq}><Image alt='preview' src='/lup.png' width={15} height={15} /></button>
                    </div>   
                </div>
              </div>
              
              <div id="btns">       
                <ul className="pnl">  
                  <li onClick={Novo} ><Link className='menu' href='#'><Image alt='preview' src='/new.png' width={30} height={30} /><p>Novo</p></Link></li>
                  <li onClick={() => Editar(rowId)}><Link className='menu' href='#'><Image alt='preview' src='/lup.png' width={30} height={30} /><p>Alterar</p></Link></li>
                  <li onClick={() => delPessoa(rowId)}><Link className='menu' href='#'><Image alt='preview' src='/exc.png' width={30} height={30} /><p>Excluir</p></Link></li>
                  <li onClick={handlePesq}><Link className='menu' href='#'><Image alt='preview' src='/atuali3.png' width={30} height={30} /><p>Atualizar</p></Link></li>
                  <li>
                    <Link className='menu' href='#'><Image alt='preview' src='/relat.png' width={30} height={30} /><p>Dados</p></Link>
                    <ul>
                      <li><Image alt='preview' src='/lanc2.png' width={30} height={30} /> <span>Exportar(Inativo)</span></li>
                    </ul>
                  </li>
                  <li>
                    <Link className='menu' href='#'><Image alt='preview' src='/relat.png' width={30} height={30} /><p>Relatórios</p></Link>
                    <ul>
                      <li onClick={() => gerarCND(rowId)}><Image alt='preview' src='/rel.png' width={30} height={30} /> <span>Certidão Negativa</span> </li>                      
                    </ul>
                  </li>
                  <li onClick={() => incluir_lanc(rowId)}>
                    <Link className='menu' href='#'><Image alt='preview' src='/lancmto.png' width={30} height={30} /><p>Lançamentos</p></Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Modal className="modal" size='xl' show={show} onHide={CloseModal} animation={false}>
            <Modal.Header closeButton id="modalHeader">
              <Image alt='preview' src='/logoe.png' width={25} height={20} title={`#${state.id_ent} ${state.id_pessoa}`}/><p>Cadastro {state.tipocad === 'E' ? 'Econômico [ Mercantil ].' : 'de Pessoas.'}</p>
            </Modal.Header>
            <Modal.Body id='modalBody'>
              <div id="btns">        
                <button onClick={Novo} disabled={!rowId ? true : false} id={!rowId ? 'id_disabled3' : '' }><Image alt='preview' src='/new.png' width={30} height={30} /><p>Novo</p></button>
                <button onClick={() => Alterar()} disabled={!rowId ? true : false} id={!rowId ? 'id_disabled3' : '' }><Image alt='preview' src='/lup.png' width={30} height={30} /><p>Alterar</p></button>
                <button onClick={() => delPessoa(state.id_pessoa)} disabled={rowId ? true : false} id={rowId ? 'id_disabled3' : '' }><Image alt='preview' src='/exc.png' width={30} height={30} /><p>Excluir</p></button>
                <button onClick={() => Cancelar(state.id_pessoa)} disabled={rowId ? true : false} id={rowId ? 'id_disabled3' : '' }><Image alt='preview' src='/voltar.png' width={30} height={30} /><p>Cancelar</p></button>
                <button onClick={e => Salvar(e)} disabled={rowId ? true : false} id={rowId ? 'id_disabled3' : '' }><Image alt='preview' src='/slv.png' width={30} height={30} /><p>Salvar</p></button>
                <button onClick={CloseModal}><Image alt='preview' src='/x.png' width={30} height={30} /><p>Fechar</p></button>         
              </div>
              {loadModal && (<div><LinearProgress variant="indeterminate" /></div>)}

              <Form className="form">
                <Tabs defaultActiveKey="1" activeKey={key} onSelect={(k: any) => setKey(k)} className="mb-3" >
                  <Tab eventKey="1" title={label1} disabled={rowId === 0 ? true : false} style={rowId === 0 ? { pointerEvents: 'none' } : {}}>
                    <input type="hidden" id="id_pessoa" name="id_pessoa" onChange={handleInput} value={state.id_pessoa} />
                    <input type="hidden" id="data_cad" name="data_cad" onChange={handleInput} value={state.data_cad} />
                    <input type="hidden" id="data_alt" name="data_alt" onChange={handleInput} value={state.data_alt} />
                    <input type="hidden" id="cod_pessoa" name="cod_pessoa" onChange={handleInput} value={state.cod_pessoa} />

                    <div id="titulo" style={{ marginBottom: '3px' }} >
                      <p>Dados {state.tipocad === 'C' ? 'Contribuintes' : 'Cadastro Econômico Mercantil'}</p> {provid.entidade?.tributos}
                    </div>
                    {provid.entidade?.tributos === 'S' && <div>
                    <Row className="flex-row-reverse col-md-8 mb-2 me-2 float-end">
                      {state.tipocad === 'C' &&
                        <div className="form-group col-md-2">
                          <label style={{ color: '#153a64' }}>Data Cadastro</label>
                          <input type="text" className="form-control" name="data_cad" onChange={handleInput} value={state.data_cad || ""} placeholder="00/00/0000" id="id_disabled" />
                        </div>}
                      {state.tipocad === 'E' &&
                        <div className="form-group col-md-2">
                          <label style={{ color: '#153a64' }}>Data Abertura</label>
                          <input type="text" className="form-control" name="data_abertura" onChange={handleInput} value={state.data_abertura || ""} id="id_disabled" />
                        </div>}

                      <div className="form-group col-md-2">
                        <label style={{ color: '#153a64' }}>Situação</label>
                        <select className="form-control" name="situacao_cad" onChange={handleInput} value={state.situacao_cad || ""}>
                          {situacaoCad.map(([val, text]) => (
                            <option key={val} value={val}>{text}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-md-2">
                        <label >Inscr. Muncipal</label>
                        <input type="text" className="form-control" name="insc_muni" onChange={handleInput} value={state.insc_muni || ""} />
                      </div>
                      {state.tipocad === 'E' &&
                        <div className="form-group col-md-2">
                          <label >Inscr. Estadual</label>
                          <input type="text" className="form-control" name="insc_estad" onChange={handleInput} value={state.insc_estad || ""} />
                        </div>}
                      {state.tipocad === 'E' &&
                        <div className="form-group col-md-2">
                          <label >Inscr. Junta</label>
                          <input type="text" className="form-control" name="insc_junta" onChange={handleInput} value={state.insc_junta || ""} />
                        </div>}
                    </Row>

                    <Row className="mb-1 me-1 col-md-3">

                      <div className="col-md-8">
                        <label>Tipo Cadastro</label>
                        <select className="form-control" name="tipocad" onChange={handleInput} value={state.tipocad} disabled={rowId ? true : false} style={rowId ? { pointerEvents: 'none' } : {}}>
                          {tipocad1.map(([val, text]) => (
                            <option key={val} value={val}>{text}</option>
                          ))}
                        </select>
                      </div>
                      {state.id_pessoa > 0 &&
                        <div className="col-md-4">
                          <label>Codigo</label>
                          <input id="id_disabled" disabled type="text" className="form-control text-center" name="cod_pessoa" onChange={handleInput} value={state.cod_pessoa || ""} />
                        </div>}
                    </Row>
                    <hr />
                    </div>}
                    <Row className="m-2 mb-2 col-md-12">

                      <div className="form-group col-md-3">
                        <label>CPF/CNPJ</label> <span id="rsCpfj" style={{ display: "none" }}> é Obrigatório</span>
                        <InputGroup>
                          <Form.Control aria-label="Recipient's username" aria-describedby="basic-addon2" alt="Pesquisar da web"
                            name="cpf_cnpj" onChange={handleInput} value={maskCPFJ(state['cpf_cnpj'])} placeholder="CPF ou CNPJ"
                            style={state.cpf_cnpj === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                          <Button variant="outline-secondary btn-sm" id="button-addon2" onClick={() => webservice(state.cpf_cnpj)}>
                            WS..
                          </Button>
                        </InputGroup>
                        <span id="rsCpfj1" style={{ display: "none" }}> CPF/CNPJ Inválido!</span>
                      </div>

                      <div className={`form-group  ${state.tipocad === 'E' ? 'col-md-5' : 'col-md-9'}`}>
                        <label>{state.tipocad === 'E' ? 'Razão Social' : 'Nome'}<span id="rsNome" style={{ display: "none" }}> é Obrigatório</span></label>
                        <input type="text" id="rsInputNome" className="form-control" name="nome_pessoa" onChange={handleInput} value={state.nome_pessoa || ""}
                          style={state.nome_pessoa === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}
                          placeholder="Nome" />
                      </div>
                      {state.tipocad === 'E' &&
                        <div className="form-group col-md-4">
                          <label>Nome Fantasia</label>
                          <input type="text" id="rsInputNome" className="form-control" name="fantasia" onChange={handleInput} value={state.fantasia || ""} placeholder="Nome Fantasia" />
                        </div>
                      }
                    </Row>
                    <hr />
                    {state.tipocad === 'E' &&                      <div>  
                        <div id="titulo"><p>*Grupo da Atividade Econômica (CNAE)</p></div>   
                        <Row className="m-2 mb-2">
                          <div className="form-group col-md-6">
                            <label>Natureza Juridica</label>
                            <Form.Select id="cod_natureza" className="form-control" name="cod_natureza"
                              onChange={handleInput} value={state.cod_natureza || ""}
                              style={state.cod_natureza === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}>
                              <option></option>
                              {naturezaAll.map((item: any) => (
                                <option id={item.cod_natureza} key={item.cod_natureza} value={item.cod_natureza}>{item.natureza}</option>
                              ))}
                            </Form.Select>
                          </div>

                          <div className="form-group col-md-6">
                            <label>Segmento da Atividade Principal</label>
                            <select className="form-control" name="cod_segmentoativ" onChange={handleInput} value={state.cod_segmentoativ || ""}>
                              {cod_segmentoAtiv.map(([val, text]) => (
                                <option key={val} value={val}>{text}</option>
                              ))}
                            </select>
                          </div>

                        </Row>
                        <Row className="m-2 mb-12">
                          <div className="form-group col-md-12">
                            <label>Grupo da Atividade Econômica (CNAE)<span id="rsNome" style={{ display: "none" }}> é Obrigatório</span></label>
                            <InputGroup>
                              <Form.Select id="cod_cnae_grupo" className="form-control" name="cod_cnae_grupo"
                                onChange={handleInput} onClick={setAtivCnaeId} value={state.cod_cnae_grupo || ""}
                                style={state.cod_cnae_grupo === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}>
                                <option></option>
                                {ativcnaeGrpAll.map((item: any) => (
                                  <option id={item.cod_cnae_grupo} key={item.cod_cnae_grupo} value={item.cod_cnae_grupo}>{item.cod_cnae_grupo} - {item.descricao_cnae_grupo}</option>
                                ))}
                              </Form.Select>
                              <Button onClick={ConsultaCnae} variant="outline-secondary btn-sm" id="button-addon2">
                                ... <Image alt='preview' width={21} height={21} src='/lup.png' />
                              </Button>
                            </InputGroup>
                          </div>
                        </Row>
                        <Row className="m-2 mb-12">
                          <div className="form-group col-md-12">
                            <label>Descrição da Atividade Econõmica (CNAE)</label>
                            <InputGroup>
                              <Form.Select id="cod_cnae" className="form-control" name="cod_cnae"
                                onChange={handleInput} value={state.cod_cnae || ""}
                                style={state.cod_cnae === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}>
                                <option></option>
                                {ativcnaeAll.map((item: any) => (
                                  <option id={item.cod_cnae} key={item.cod_cnae} value={item.cod_cnae}>{item.cod_cnae} - {item.descricao_cnae}</option>
                                ))}
                              </Form.Select>
                              <Button onClick={ConsultaCnae} variant="outline-secondary btn-sm" id="button-addon2">
                                ... <Image alt='preview' width={21} height={21} src='/lup.png' />
                              </Button>
                            </InputGroup>
                          </div>
                        </Row>
                        <hr />
                        <Row className="m-2 mb-2">
                          <div className="form-group m-1 col-md-3">
                            <label id="titleR">Opções Mercantil</label>
                            {opcoes.map(([text, name, chek]) => (
                              <label key={name} className="container">
                                <input type="checkbox" id={name} name={name} checked={[`${chek}`].toString() === 'S' ? true : false}
                                  value={isChecked ? 'N' : 'S'} onChange={handleOnCheck} />
                                {text}</label>
                            ))}
                          </div>
                          <Row className="form-group col-md-9">
                            <div className="form-group col-md-4">
                              <label style={{ color: '#153a64' }}>Classe de Tributação (ANU/SIM)</label>
                              <select className="form-control" name="classetrib" onChange={handleInput} value={state.classetrib || ""}>
                                {classeTrib.map(([val, text]) => (
                                  <option key={val} value={val}>{text}</option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group col-md-8">
                              <label style={{ color: '#153a64' }}>Porte Ecônomico</label>
                              <select className="form-control" name="porte" onChange={handleInput} value={state.porte || ""}>
                                {porte.map(([val, text]) => (
                                  <option key={val} value={val}>{text}</option>
                                ))}
                              </select>
                            </div>
                            <Row className="form-group col-md-12">
                              <div className="form-group col-md-12">
                                <label style={{ color: '#153a64' }}>Vigilância Sanitária</label>
                                <select className="form-control" name="vigilancia" onChange={handleInput} value={state.vigilancia || ""}>
                                  {vigilancia.map(([val, text]) => (
                                    <option key={val} value={val}>{val}-{text}</option>
                                  ))}
                                </select>
                              </div>
                            </Row>
                          </Row>
                        </Row>
                        <Row className="m-2 mb-2">
                          <div className="form-group col-md-4">
                            <label style={{ color: '#153a64' }}>Regime de Tributação</label>
                            <select className="form-control" name="regime_trib" onChange={handleInput} value={state.regime_trib || ""}>
                              {regimeTrib.map(([val, text]) => (
                                <option key={val} value={val}>{val}-{text}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-md-8">
                            <label>Observações Gerais Mercantil</label>
                            <input type="text" className="form-control" name="obs" onChange={handleInput} value={state.obs || ""} />
                          </div>
                        </Row>
                        <hr />
                      </div>
                    }
                    <div>
                      <div id="titulo">
                        <p>*Endereço</p>
                      </div>
                      <Row className="m-2 ">
                        <div className="form-group col-md-6">
                          <label>Rua<span id="rsRua" style={{ display: "none" }}> é Obrigatório</span></label>
                          <InputGroup>
                            <Form.Control placeholder="Nome Rua" aria-label="Recipient's username" aria-describedby="basic-addon2"
                              name="rua" onChange={handleInput} value={state.rua || ""}
                              style={state.rua === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                            <Button variant="outline-secondary btn-sm" id="button-addon2" onClick={ConsultaLog}>
                              Pesq.. <Image alt='preview' width={28} height={25} src='/lup.png' />
                            </Button>
                          </InputGroup>
                        </div>

                        <div className="form-group col-md-2">
                          <label >Nº</label>
                          <input type="text" className="form-control" name="numero" onChange={handleInput} value={state.numero || ""} placeholder="Numero" />
                        </div>
                        <div className="form-group col-md-4">
                          <label >Bairro</label>
                          <input type="text" className="form-control" name="bairro" onChange={handleInput} value={state.bairro || ""} placeholder="Bairro" />
                        </div>
                      </Row>
                      <Row className="m-2 mb-2">
                        <div className="form-group col-md-6">
                          <label >Cidade</label>
                          <input type="text" className="form-control" name="cidade" onChange={handleInput} value={state.cidade || ""} placeholder="Cidade" />
                        </div>
                        <div className="form-group col-md-1">
                          <label>Estado</label>
                          <select id="uf" className="form-control" name="uf" onChange={handleInput} value={state.uf || ""}>
                            <option disabled>Selecionar...</option>
                            <option value="PB">PB</option>
                            <option value="RN">RN</option>
                            <option value="PE">PE</option>
                          </select>
                        </div>
                        <div className="form-group col-md-4">
                          <label >CEP</label>
                          <input type="text" className="form-control" name="cep" onChange={handleInput} value={maskCEP(state.cep || '')} placeholder="CEP" />
                        </div>
                      </Row>
                      <hr />
                      <div id="titulo">
                        <p>*Contato</p>
                      </div>
                      <Row className="m-2">
                        <div className="form-group col-md-4">
                          <label>Email</label>
                          <input type="text" className="form-control" name="email" onChange={handleInput} value={state.email || ""} id='input_lowercase' placeholder="email@dominio.com" />
                        </div>
                        <div className="form-group col-md-4">
                          <label>Telefone</label>
                          <input type="text" className="form-control" name="telefone" onChange={handleInput} value={maskFone(state['telefone'] || '')} placeholder="Telefone" />
                        </div>

                        <div className="form-group col-md-4">
                          <label>Fixo</label>
                          <input type="text" className="form-control" name="fixo" onChange={handleInput} value={maskFixo(state['fixo'] || '')} placeholder="Telefone Fixo" />
                        </div>
                      </Row>
                      <Row className="m-2 mt-4">
                        <div className="form-group col-md-6">
                          <label>Complemento</label>
                          <input type="text" className="form-control" name="complemento" onChange={handleInput} value={state.complemento || ""} />
                        </div>
                        <div className="form-group col-md-4">
                          <label>Pagina WEB</label>
                          <input type="text" className="form-control" name="site" onChange={handleInput} value={state.site || ''} id='input_lowercase' />
                        </div>
                        {state.tipocad === 'E' &&
                          <div className="form-group col-md-2">
                            <label>AREA do Mercantil(M2)</label>
                            <input type="text" className="form-control" name="area_mercantil" onChange={handleInput} value={state.area_mercantil || ''} />
                          </div>}
                      </Row>
                      <hr />
                      {state.tipocad === 'E' &&
                        <div>
                          <div id="titulo">
                            <p>Dados Processos de Fechamento</p>
                          </div>
                          <Row className="m-2">
                            <div className="form-group col-md-2">
                              <label>Nº Processo</label>
                              <input type="text" className="form-control" name="numero_proc" onChange={handleInput} value={state.numero_proc || ""} />
                            </div>
                            <div className="form-group col-md-3">
                              <label>Data do Fechamento</label>
                              <input type="text" className="form-control" name="data_encerramento" onChange={handleInput} value={state.data_encerramento || ""} />
                            </div>
                            <div className="form-group col-md-7">
                              <label>Motivo Fechamento/Observações</label>
                              <input type="text" className="form-control" name="obs_encerramento" onChange={handleInput} value={state.obs_encerramento || ""} />
                            </div>
                          </Row>
                          <hr />
                        </div>}
                    </div>
                  </Tab> {/*<<<< Fim de aba tab pessoas >>>>*/}
                    
                  {state.tipocad === 'E' &&
                    <Tab eventKey="contact" title={label6} disabled={!rowId ? true : false} style={!rowId ? { pointerEvents: 'none' } : {}}>
                      <div id="titulo" style={{ marginBottom: '-3px' }} >
                        <p>Dados Cadastro Econômico Mercantil</p>
                      </div>
                      <Row className="m-2 mb-2">
                        <div className="form-group col-md-2">
                          <label style={{ color: '#153a64' }}>Inscri. Municipal</label>
                          <input id='id_disabled' type="text" className="form-control" name="insc_muni" onChange={handleInput} value={state.insc_muni || ""} />
                        </div>
                        <div className="form-group col-md-3">
                          <label style={{ color: '#153a64' }}>CPF/CNPJ</label>
                          <input id='id_disabled' type="text" className="form-control" name="cpf_cnpj" onChange={handleInput} value={maskCPFJ(state['cpf_cnpj'])} />
                        </div>
                        <div className="form-group col-md-7">
                          <label style={{ color: '#153a64' }}>Razão Social</label>
                          <input id='id_disabled' type="text" className="form-control" name="nome_pessoa" onChange={handleInput} value={state.nome_pessoa || ""} />
                        </div>
                      </Row>
                      <hr />
                      <div id="titulo" style={{ marginBottom: '-3px' }} >
                        <p>Dados Responsáveis/Socios</p>
                      </div>
                      <Row className="m-2 mb-12">
                        <div className="form-group col-md-6">
                          <label>Nome (Resposavel)</label>
                          <InputGroup>
                            <input type="text" id="nome_socio" className="form-control col-md-6" name="nome_socio" onChange={handleInput} value={state.nome_socio || ""} onClick={ConsultaSocios} />
                            <input type="hidden" className="form-control col-md-6" name="cpf_cnpj_socio" onChange={handleInput} value={state.cpf_cnpj_socio || ""} />
                            <Button onClick={ConsultaSocios} variant="outline-secondary btn-sm" id="button-addon2">
                              ... <Image alt='preview' width={21} height={21} src='/lup.png' />
                            </Button>
                          </InputGroup>
                        </div>
                        <div className="form-group col-md-6">
                          <label>Cargo (Resposavel)</label>
                          <InputGroup>
                            <div className="form-group col-md-8">
                              <Form.Select id="cargo" className="form-control col-md-3" name="cargo"
                                onChange={handleInput} value={state.cargo || ""}>
                                <option></option>
                                {cargoSocios.map(([val, text]) => (
                                  <option key={val} value={text}>{text}</option>
                                ))}
                              </Form.Select>
                            </div>
                            <div className="col-md-4">
                              <div id="btns1">
                                <div className="pnl2" onClick={() => AddSocios(state.nome_socio, state.cpf_cnpj_socio, state.cargo)}>
                                  <Image alt='preview' src='/add.png' width={20} height={19} />
                                  <p>Adicionar</p>
                                </div></div>
                            </div>
                          </InputGroup>
                        </div>
                      </Row>
                      <Row className="m-2 mb-12">
                      </Row>
                      <hr />
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Nome</th>
                            <th>CPF/CNPJ</th>
                            <th>Cargo</th>
                            <th className="col_f text-center">Opções</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.socios?.map((item) => {
                            return (
                              // <tr key={item.nome}>
                              <tr key={item.id_socios}>
                                <td className="col_b">{item.nome}</td>
                                <td className="col_d">{item.cpf_cnpj}</td>
                                <td className="col_d">{item.qual}</td>
                                <td className="col_a text-center"> <span onClick={() => delSocios(item.id_socios)} id="badgedel">Excluir</span> </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                      <hr />
                      <div id="titulo" style={{ marginBottom: '-3px' }} >
                        <p>*Atividades Secundarias Mercantil</p>
                      </div>
                      <Row className="m-2 mb-12">
                        <div className="form-group col-md-9">
                          <label>Grupo da Atividade Econômica (CNAE)</label>
                          <InputGroup>
                            <Form.Select id="cod_cnae_grupo" className="form-control" name="cod_cnae_grupo"
                              onChange={handleInput} onClick={setAtivCnaeId} value={state.cod_cnae_grupo || ""}
                              style={state.cod_cnae_grupo === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}>
                              <option></option>
                              {ativcnaeGrpAll.map((item: any) => (
                                <option id={item.cod_cnae_grupo} key={item.cod_cnae_grupo} value={item.cod_cnae_grupo}>{item.cod_cnae_grupo} - {item.descricao_cnae_grupo}</option>
                              ))}
                            </Form.Select>

                          </InputGroup>
                        </div>
                      </Row>

                      <Row className="m-2 mb-12">
                        <div className="form-group col-md-12">
                          <label>Descrição da Atividade Econõmica (CNAE)</label>
                          <InputGroup>
                            <Form.Select id="cod_cnae" className="form-control" name="cod_cnae"
                              onChange={handleInput} value={state.cod_cnae || ""}
                              style={state.cod_cnae === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}>
                              <option></option>
                              {ativcnaeAll.map((item: any) => (
                                <option id={item.cod_cnae} key={item.cod_cnae} value={item.cod_cnae}>{item.cod_cnae} - {item.descricao_cnae}</option>
                              ))}
                            </Form.Select>
                            <Button onClick={ConsultaCnae} variant="outline-secondary btn-sm" id="button-addon2">
                              ... <Image alt='preview' width={21} height={21} src='/lup.png' />
                            </Button>
                            <div className="col-md-4">
                              <div id="btns1">
                                <div className="pnl2" onClick={() => AddAtiv(state.cod_cnae)}>
                                  <Image alt='preview' src='/add.png' width={20} height={19} />
                                  <p>Adicionar</p>
                                </div></div>
                            </div>
                          </InputGroup>
                        </div>

                      </Row>
                      <hr />
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th className="col_f text-center">Codigo</th>
                            <th>Descrição Atividades Secundarias</th>
                            <th className="col_f text-center">Opções</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.ativsecund?.map((item) => {
                            return (
                              <tr key={item.code} >
                                <td className="col_f text-center">{item.code}</td>
                                <td>{item.descricao_cnae}</td>
                                <td className="col_f text-center"> <span onClick={() => delAtiv(item.id_ativ)} id="badgedel">Excluir</span> </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                      <hr />
                    </Tab>
                  }
                  <Tab eventKey="3" title={label3} disabled={!rowId ? true : false} style={!rowId ? { pointerEvents: 'none' } : {}}>
                    <div id="table_modal">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th style={{ width: '35px' }}>#</th>
                            <th>N.DAM</th>
                            <th style={{ width: '400px' }}>Receita</th>
                            <th className="text-center">Data DAM</th>
                            <th className="text-center">Valor Total</th>
                            <th className="text-center">Valor Pago</th>
                            <th className="text-center">Data Pagmto</th>
                            <th style={{ width: '50px' }}>Pago</th>
                            <th className="text-center">Vencimento</th>
                            {/* <th className="text-center">Emissão</th> */}
                          </tr>
                        </thead>             
                        {lancmtos?.map((item: any) => {
                          return (
                            <Fragment key={item.id_lanc}>
                              <tr key={item.id_lanc} id={`${[item.id_lanc, item.pago]}`} onClick={RowClickedLanc} onDoubleClick={exibirLancDeta}
                                className={rowDva.id_lanc == item.id_lanc ? "bgactive" : ""} style={{borderBottom: 'solid 1px #d5d4d4'}}>
                                <td className="text-center">
                                  {rowIdLanc2 == item.id_lanc ?
                                    <svg onClick={exibirLancDeta} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="m-0 bi bi-cloud-minus" viewBox="0 0 16 16">
                                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                      <path d="M6 7.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z" />
                                    </svg>
                                    :
                                    <svg onClick={exibirLancDeta} id={item.id_lanc} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="m-0 bi bi-plus-square" viewBox="0 0 16 16">
                                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                    </svg>
                                  }</td>
                                <td className="text-center">{item.cod_lanc}</td>
                                <td>{item.des_rec}</td>
                                <td className="text-center">{item.data_lanc}</td>
                                <td className="text-end">{formater.format(item.valor_real as any)}</td>
                                <td className="text-end">{formater.format(item.valor_rec as any)}</td>
                                <td className="text-center">{item.data_pgmto}{item.situacao === 'C' ? 'Cancelado' : '' }</td>
                                {/* <td className="text-center">
                                    <Image id='testeimg' alt='preview' width={20} height={20} src={item.pago === 'S' ? '/p8.png' : '/x3.png' } />
                                    </td>            */}

                                <td className="text-center">{item.pago === 'S' ?
                                  <span id="badgeSuces">Sim</span> : <span id="badgeAlert">Não</span>}</td>
                                <td className="text-center">{item.data_venc}</td>

                                    {/* <td className="text-center">{item.situacao === 'C' ? 'Cancelado' : 'Emitido' }</td>  */}
                              </tr>
                              {item.lancmtosDt?.map((item2: any) => {
                                return (
                                  <>
                                    <tbody className="det_tr">
                                      <tr key={item2.id_lancdet}
                                        style={rowIdLanc2 == item.id_lanc ? {} : { display: 'table-column' }}>
                                        <td></td>
                                        <td className="text-center">{item2.cod_rec}</td>
                                        <td>{item2.des_rec}</td>
                                        <td></td>
                                        <td className="text-end">{formater.format(item2.valor_real as any)}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                      </tr>
                                    </tbody>
                                  </>)
                              })}
                            </Fragment>
                          )
                        })}
                  
                      </Table>
                    </div>
                    <hr />
                    <div className="form-group">
                      <div id="btns1">
                        <div className="pnl2" title="Incluir um novo DAM" onClick={() => incluir_lanc(state.id_pessoa)}>
                          <Image alt='preview' src='/add.png' width={20} height={19} />
                          <p> Incluir DAM</p>
                        </div>
                        <div className="pnl2" title="Excluir DAM" onClick={delLanc}>
                          <Image alt='preview' src='/remov.png' width={20} height={19} />
                          <p> Cancelar DAM</p>
                        </div>
                        <div className="pnl2" onClick={AlterarDam} title="Alterar Dados DAM">
                        <Image alt='preview' src='/lancmto.png' width={21} height={20} />
                          <p>Alterar DAM</p>
                        </div>
                          <div className="pnl2" title="Caclcular Juros/Multa/Correção" onClick={calcEncargos}>
                                                 <Image alt='preview' src='/calc.png' width={20} height={19} />
                                                <p>Calc Encargos</p>
                                              </div>
                        <div className="pnl2"
                          onClick={() => impDam()}>
                        <Image alt='preview' src='/print.png' width={20} height={19} />
                          <p>Imprimir</p>
                        </div>
                        <div className="pnl2" title="Enviar DAM por Email">
                        <Image alt='preview' src='/lancmto.png' width={20} height={19} />
                          <p>DAM Email</p>
                        </div>
                      </div>
                    </div>
                  </Tab>
                  {state.tipocad === 'E' &&
                    <Tab eventKey="contact1" disabled={!rowId ? true : false} style={!rowId ? { pointerEvents: 'none' } : {}} title={label7}>
                      <div id="titulo" style={{ marginBottom: '-3px' }} >
                        <p>Dados Cadastro Econômico Mercantil</p>
                      </div>
                      <Row className="m-2 mb-2">
                        <div className="form-group col-md-2">
                          <label style={{ color: '#153a64' }}>Inscri. Municipal</label>
                          <input id='id_disabled' type="text" className="form-control" name="insc_muni" value={state.insc_muni || ""} />
                        </div>
                        <div className="form-group col-md-3">
                          <label style={{ color: '#153a64' }}>CPF/CNPJ</label>
                          <input id='id_disabled' type="text" className="form-control" name="cpf_cnpj" value={maskCPFJ(state['cpf_cnpj'])} />
                        </div>
                        <div className="form-group col-md-7">
                          <label style={{ color: '#153a64' }}>Razão Social</label>
                          <input id='id_disabled' type="text" className="form-control" name="nome_pessoa" value={state.nome_pessoa || ""} />
                        </div>
                      </Row>
                      <hr />
                      <Row className="col-md-12 mb-2">
                        <div className="form-group col-md-8">
                          <label id="titleR">Dados Alvará</label>
                          <Row className="col-md-12 m-2 mb-2">
                            <div className="form-group col-md-3">
                              <label>Data Emissão</label>
                              <input className='form-control form-control-solid w-250px' type='date' onChange={handleInput} name='data_emissao' value={alvara.data_emissao || ''}
                      style={!alvara.data_emissao ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}/>
                            </div>
                            <div className="form-group col-md-2 ">
                              <label>Nº.Processo</label>
                              <input type="text" className="form-control" onChange={handleChangeAlv} name="num_processo" value={alvara.num_processo || ""} maxLength={12} />
                            </div>
                            <div className="form-group col-md-3" >
                              <label>Validade</label>
                              <input type="date" className="form-control" name="data_validade" onChange={handleChangeAlv} value={alvara.data_validade}
                                style={!alvara.data_validade ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                            </div>
                            <div className="form-group col-md-2">
                              <label >Exercicio</label>
                              <input type="text" className="form-control" name="exercicio" onChange={handleChangeAlv} value={alvara.exercicio || ""} maxLength={4}
                                style={!alvara.exercicio ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                            </div>
                            <div className="form-group col-md-2">
                              <label >N.DAM</label>
                              <input type="text" className="form-control" name="num_dam" onChange={handleChangeAlv} value={alvara.num_dam || ""} />
                            </div>
                            <div className="form-group col-md-12">
                              <hr />
                              <label >Observações Alvará</label>
                              <textarea className="form-control my_textarea" name="obs_alvara" onChange={handleChangeAlv} value={alvara.obs_alvara || ''} placeholder="Maximo de 300" rows={2}></textarea>
                            </div>

                          </Row>
                          <hr />
                         
                        </div>
                        <div className="form-group col-md-4">
                          <label id="titleR" >Tipo Alvará</label>
                          <select className="form-control" name="tipo_alvara" onChange={handleChangeAlv} value={alvara.tipo_alvara || ""}
                            style={!alvara.tipo_alvara ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}>
                            {tipoAlvara.map(([text, val]) => (
                              <option key={val} value={text}>{text}</option>
                            ))}
                          </select>
                          <hr />
                          <div className="form-group col-md-12 mt-3">
                            <label id="titleR">Recolhimento</label>
                            <div className="radiosTipo">
                              <label className="container">
                                <input type="radio" id='recolhimento' name="recolhimento"
                                  value='1' checked onChange={handleChangeAlv} />Anual</label>
                              <label className="container">
                                <input type="radio" id='recolhimento' name="recolhimento"
                                  value='2' onChange={handleChangeAlv} />Mensal</label>
                              <label className="container">
                                <input type="radio" id='recolhimento' name="recolhimento"
                                  value='3' onChange={handleChangeAlv} />Eventual</label>
                            </div>
                          </div>
                          <div className="form-group col-md-4 mt-4 me-4 float-end">
                            <div id="btns1">
                              <div className="pnl2" onClick={salvarAlv}>
                                <Image alt='preview' src='/add.png' width={20} height={19} />
                                <p>Adicionar</p>
                              </div></div>
                          </div>
                        </div>
                      </Row>
                      {state.alvara_trans === 'S' && <div>
                        <label id="titleR"> Dados Alvará Taxistas/Veiculo</label>
                        <Row className="col-md-12 mb-2" >
                          <div className="form-group col-md-10">
                            <Row className={state.alvara_trans === 'S' ? 'col-md-12 m-2 mb-2' : 'id_disable col-md-12 m-2 mb-2'}>
                              <div className="form-group col-md-2 ">
                                <label>Placa</label>
                                <input type="text" className="form-control" name='placa' onChange={handleChangeAlv} value={alvara.placa || ""} />
                              </div>
                              <div className="form-group col-md-2 ">
                                <label>Ano Fabricação</label>
                                <input type="text" className="form-control" name='anofabricacao' onChange={handleChangeAlv} value={alvara.anofabricacao || ""} />
                              </div>
                              <div className="form-group col-md-3 ">
                                <label>Chassis</label>
                                <input type="text" className="form-control" name='chassis' onChange={handleChangeAlv} value={alvara.chassis || ""} />
                              </div>
                              <div className="form-group col-md-2">
                                <label >Cor Predominante</label>
                                <input type="text" className="form-control" name="cor_veiculo" onChange={handleChangeAlv} value={alvara.cor_veiculo || ""} />
                              </div>
                              <div className="form-group col-md-3">
                                <label >Modelo</label>
                                <input type="text" className="form-control" name="modelo_veiculo" onChange={handleChangeAlv} value={alvara.modelo_veiculo || ""} />
                              </div>
                              <div className="form-group col-md-12">
                                <label >Observações (renavam, Praça)</label>
                                <input type="text" className="form-control" name="obs_veiculo" onChange={handleChangeAlv} value={alvara.obs_veiculo || ""} />
                              </div>
                            </Row>
                          </div>
                        </Row>
                        <hr />
                      </div>}
                      <div id="titulo">
                        <p> Assinaturas</p>
                      </div>
                      <div className="form-group m-2 col-md-3 float-start">
                            <label>Assinatura 1º</label>
                            <Form.Select id="id_assin1" className="form-control" name="id_assin1" onChange={handleChangeAlv}>
                              <option></option>
                              {allAssin?.map((item: any) => (
                                <option id={item.id_assin} key={item.id_assin} value={item.id_assin}> {item.nome} - ({item.cargo})</option>
                              ))}
                            </Form.Select>
                          </div>
                          <div className="form-group m-2 col-md-3 float-start"> 
                            <label>Assinatura 2º</label>
                            <Form.Select id="id_assin2" className="form-control" name="id_assin2" onChange={handleChangeAlv}>
                              <option></option>
                              {allAssin?.map((item: any) => (
                                <option id={item.id_assin} key={item.id_assin} value={item.id_assin}> {item.nome} - ({item.cargo})</option>
                              ))}
                            </Form.Select>
                          </div>
                      <div className="form-group m-2 col-md-3 float-start">
                            <label>Assinatura 3º</label>
                            <Form.Select id="id_assin3" className="form-control" name="id_assin3" onChange={handleChangeAlv}>
                              <option></option>
                              {allAssin?.map((item: any) => (
                                <option id={item.id_assin} key={item.id_assin} value={item.id_assin}>{item.nome} - ({item.cargo})</option>
                              ))}
                            </Form.Select>
                          </div>                        
                      <div id="titulo">
                        <p> Alvarás</p>
                      </div>
                      <div id="table_modal1">
                        <Table striped bordered hover>
                          <thead>
                            <tr >
                              <th style={{ width: '2px', textAlign: 'center' }}>Codigo</th>
                              <th style={{ width: '2px', textAlign: 'center' }}>Exercicio</th>
                              <th style={{ width: '2px', textAlign: 'center' }}>Nº.Processo</th>
                              <th style={{ width: '400px' }}>Tipo Alvara</th>
                              <th style={{ width: '2px', textAlign: 'center' }}>data_emissao</th>
                              <th style={{ width: '2px', textAlign: 'center' }}>data_validade</th>
                              <th style={{ width: '1px' }}>Emissão</th>
                              <th style={{ width: '1px' }} className="text-center">Opções</th>
                            </tr>
                          </thead>
                          <tbody id="tboddy">
                            {/* <td id="vlrec" style={{textAlign:'right'}}>{formater.format(item.valor_real as any)}</td> */}
                            {alvaras?.map((item: any) => {
                              return (
                                <tr key={item.id_alvara}>
                                  <td className="text-center">{item.cod_alvara}</td>
                                  <td className="text-center">{item.exercicio}</td>
                                  <td className="text-center">{item.num_processo}</td>
                                  <td>{item.tipo_alvara}</td>
                                  <td className="text-center">{item.data_emissao}</td>
                                  <td className="text-center">{item.data_validade}</td>
                                  <td className="text-center">{item.emissao === 'E' ?
                                    <span id="badgeSuces">Gerado</span> :
                                    <span id="badgeAlert">Cancelad</span>}</td>
                                  <td className="col_f text-center"> <span onClick={() => delAlvara(item.id_alvara)} id="badgedel">Cancelar</span>
                                    <span onClick={() => impAlv(item.id_alvara)} id="badgeinf">Imprimir</span> </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </Table>
                      </div>
                      <hr />
                    </Tab>}
                </Tabs>
              </Form>
            </Modal.Body>
          </Modal>
          <Modal className="modal" size="xl" centered show={modalGerl} onHide={CloseMGeral}>
            <Modal.Header closeButton id="modalHeader">
              <Image alt='preview' src='/logoe.png' width={25} height={20} /><p>Elmar Tecnologia {modo}</p>
            </Modal.Header>
            <Modal.Body id="modalBody">
              {/* <iframe id="iflameGuia" src={`../../relat/guiapgmto2/${rowIdLanc}`}></iframe>   */}
              {modo === 'Logradouros' &&
                <div>
                  <div id="btns">
                    <button style={{ opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' }}><Image alt='preview' width={30} height={25} src='/new.png' /><p>Novo</p></button>
                    <button onClick={listarL}><Image alt='preview' width={30} height={25} src='/atuali.png' /><p>Atualizar</p></button>
                    <button onClick={CloseMGeral}><Image alt='preview' width={30} height={25} src='/x.png' /><p>Fechar</p></button>
                  </div>

                  <div className="form-group mb-2 col-md-12 ">
                    <label id="titleR">Pesquisar por &nbsp;
                      {(() => { switch (pesqLog) { case 1: return 'Codigo'; case 2: return 'Nome Logradouro'; case 3: return 'Bairro'; } })()}</label>
                    <hr />
                    <div>
                      <label className="ms-4 ">
                        <input type="radio" name="pesq" value='1' defaultChecked={true} onClick={() => setPesqL(1)} />
                        &nbsp;Codigo</label>
                      <label className="ms-4 ">
                        <input type="radio" name="pesq" value='2' defaultChecked={true} onClick={() => setPesqL(2)} />
                        &nbsp;Nome</label>
                      <label className="ms-4 ">
                        <input type="radio" name="pesq" value='3' defaultChecked={true} onClick={() => setPesqL(3)} />
                        &nbsp;Bairro</label>
                      <hr />
                      <div id="iPnl4">
                        {pesqLog === 1 && <input className="form-control" id="input6" type="number" onChange={pesqLograd} placeholder="Codigo da Rua" />}
                        {pesqLog === 2 && <input className="form-control" id="input6" type="text" onChange={pesqLograd} placeholder="Nome Rua" />}
                        {pesqLog === 3 && <input id="input6" className="form-control" type="text" onChange={pesqLograd} placeholder="Bairro" />}
                      </div>
                    </div>
                  </div>

                  <Form className="tablepesq2">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th className="col_a text-center" title="Pesquisar por Codigo da Rua" style={{ cursor: 'pointer', textAlign: 'center' }}>Codigo*</th>
                            <th className="col_b" title="Pesquisar por Nome Rua" style={{ cursor: 'pointer' }}>Nome*</th>
                            <th className="col_c" title="Pesquisar por Bairro" style={{ cursor: 'pointer' }}>Bairro*</th>
                            <th className="col_d">Cidade</th>
                          </tr>
                        </thead>
                        <TableBody>
                          {loadDiag && (
                            <TableRow>
                              <TableCell colSpan={11}>
                                <Box style={{ height: '100%' }}>
                                  <LinearProgress variant="indeterminate" />
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                        <tbody>
                          {FiltroLograds?.map((item) => {
                            return (
                              <tr key={item.id_log} onClick={() => sel_log(item.nome_log, item.bairro_log, item.cidade_log, item.uf_log, item.cep_log,)} style={{ cursor: 'pointer' }}>
                                <td className="text-center" width={5}>{item.cod_log}</td>
                                <td >{item.nome_log}</td>
                                <td >{item.bairro_log}</td>
                                <td >{item.cidade_log}</td>
                              </tr>)
                          })}
                        </tbody>
                      </Table>
                    </Form.Group>
                  </Form>
                </div>}
              {modo === 'DAMs' &&
                <div><Row className="flex-row-reverse col-md-8 mt-1 mb-1 float-end">
                  <div className="bt form-group">
                    <div id="btns1" className="align-center">
                      <div className="pnl2" onClick={imprimiDAM}>
                        <p><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
                          <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                          <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 
                          2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1" />
                        </svg></p>
                        <p>Imprimir</p>
                      </div>
                      <div className="pnl2" onClick={CloseMGeral}>
                        <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg></p>
                        <p>Fechar</p>
                      </div>
                    </div></div>
                </Row>
                  <div className="book" id="container">
                    {loadModal && (<div><LinearProgress variant="indeterminate" /></div>)}
                    <div className="page">
                      <div className="subpageDAM">
                      <table className="w666" style={{ border: 'solid 1px' }}>
                      <tr><td>
                        <div className="" style={{ marginLeft: '590px', marginTop: '10px', position: 'absolute' }}>
                          <span >Exercicio: {lancmto.exercicio}</span>
                        </div>
                        <div className='ent_print'>
                        <picture className='ent_brasao'>
                                <img src={!provid.entidade?.caminho ? '/simg.png' : `${provid.entidade?.urlbras}/${provid.entidade?.caminho}`} alt="pic" width={58} height={58}/>
                              </picture>
                         
                          <h3> {provid.sessao?.entidade}</h3>
                          <p className='text-nowrap'>{provid.entidade?.secretaria}</p>
                          <p className="text-nowrap">{provid.entidade?.msg1}</p>
                        </div>
                      </td></tr>
                    </table >
                        <table className="w666">
                          <tr>
                            <td className="cpN Ar"></td>
                          </tr>
                        </table>
                        <table className="w666">
                          <tr>
                            <td className="ctN cut"></td>
                          </tr>
                          <tr>
                            <td className="cpN Ar">Via Prefeitura</td>
                          </tr>
                        </table><table className="w666 mt-2">
                          <tr className="BHead">
                            <td> 
                            <picture>
                              <img className='imgLogo' src={!banco.brasao ? '/simg.png' : `${provid.entidade?.urlbras}/${banco.brasao}`} alt="pic" width={110} height={30} />
                            </picture> 
                            </td>
                            <td className="barra" />
                            <td className="w72 Ab bc Ac">{banco.cod_banco}</td>
                            <td className="barra" />
                            <td className="w500 Ar Ab ld text-center"><h3>D.A.M - RECEITAS DIVERSAS</h3></td>
                          </tr>
                        </table>
                        <table className="w666">
                          <tr className="ct h13 At">
                            <td className="w298">Beneficiário</td>
                            <td className="w126">Agência</td>
                            <td className="w34">Espécie</td>
                            <td className="w45">Convenio</td>
                            <td className="w128">Nº TItulo</td>
                          </tr>
                          <tr className="cp h12 At rBb">
                            <td>{provid.entidade?.entidade}</td>
                            <td>{banco.agencia}</td>
                            <td>R$</td>
                            <td>{banco.convenio}</td>
                            <td className="Ar text-center">{lancmto.cod_lanc}</td>
                          </tr>
                        </table><table className="w666">
                          <tr className="ct h13">
                            <td className="w192">Nosso Número</td>
                            <td className="w132">CPF/CNPJ</td>
                            <td className="w134">Valor do Documento</td>
                            <td className="w180">Vencimento</td>
                          </tr>
                          <tr className="cp h12 rBb">
                            <td>{lancmto.nossonum}</td>
                            <td>{maskCPFJ(lancmto.cpf_cnpj)}</td>
                            <td className="Ar" style={{ fontSize: '11pt' }}>{formater.format(lancmto.valor_real as any)}</td>
                            <td className='text-end' style={{ fontSize: '11pt' }}>{lancmto.data_venc}</td>
                          </tr>
                        </table>
                        <table className="w666">
                          <tr className="ctN h13">
                            <td className="pL6">
                              <div className="ctN pL10">Instruções (Texto de responsabilidade do beneficiário)</div>
                              <div className="cpN pL10">Sr. Caixa, não receber após o vencimento.</div>
                            </td>
                            <td className="w2409 Ar">
                              <Table className="tableDAM">
                                <tr >
                                  <th className="text-start">Descrição da Receita</th>
                                  <th className="col_b text-center">Valor R$</th>
                                </tr>
                                <tbody>
                                  {/* <td id="vlrec" style={{textAlign:'right'}}>{formater.format(item.valor_real as any)}</td> */}
                                  {lancmtosDt?.map((item: any) => {
                                    return (
                                      <tr key={item.id_lancdet}>
                                        <td style={{ textAlign: 'left' }}>{item.cod_rec} - {item.des_rec}</td>
                                        <td className="vlrec" style={{ textAlign: 'right' }}>{formater$.format(item.valor_real as any)}</td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </Table></td>
                          </tr>
                        </table><table className="w666">
                          <tr className="ct h13">
                            <td className="w472">Pagador</td>
                            <td className="w180">Valor Total</td>
                          </tr>
                          <tr className="cp h12 rBb">
                            <td className="At">{lancmto.nome_pessoa}<br />CPF: {maskCPFJ(lancmto.cpf_cnpj)}</td>
                            <td style={{ border: '1px solid', backgroundColor: '#CCCCCC' }} className="Ar">R$ {formater.format(lancmto.valor_real as any)}</td>
                          </tr>
                        </table><table className="w666">
                          <tr className="ctN h13">
                            <td className="pL6">Sacador / Avalista2</td>
                            <td className="w180 Ar">Autenticação mecânica</td>
                          </tr>
                          <tr className="cpN h12">
                            <td className="pL6 barcode">
                              <span>{banco.linhadigitavel}</span>
                              <picture>
                                <img src={'http://bwipjs-api.metafloor.com/?bcid=interleaved2of5&text=' + banco.codigobarra + '&scale=1'} alt="previw" width={450} height={50} />
                              </picture>
                              {/* <img width="500" height="60" src={'http://bwipjs-api.metafloor.com/?bcid=interleaved2of5&text=' + banco.codigobarra + '&scale=1'} /> */}
                            </td>
                            <td className="pL6 Ar"> </td>
                          </tr>
                        </table>
                        {lancmto.situacao === 'C' && <span id="cancelado">Documento Cancelado!</span>}
                        <table className="ctN w666">
                          <tr><td className="Ar">Corte aqui!</td></tr>
                          <tr><td className="cut" /></tr>
                          <tr>
                            <td className="cpN Ar">Via Contribuinte</td>
                          </tr>

                        </table><table className="w666 mt-2">
                          <tr className="BHead">
                            <td> <picture>
                              <img className='imgLogo' src={!banco.brasao ? '/simg.png' : `${provid.entidade?.urlbras}/${banco.brasao}`} alt="picture" width={110} height={30} />
                            </picture></td>
                            <td className="barra"></td>
                            <td className="w72 Ab bc Ac">{banco.cod_banco}</td>
                            <td className="barra"></td>
                            <td className="w500 Ar Ab ld text-center"><h3>D.A.M. - RECEITAS DIVERSAS</h3></td>
                          </tr>
                        </table><table className="w666">
                          <tr className="ct h13">
                            <td className="w472">Local de pagamento</td>
                            <td className="w180">Vencimento</td>
                          </tr>
                          <tr className="cp h12 rBb">
                            <td>{banco.local_pgto}</td>
                            <td className="Ar" style={{ fontSize: '11pt' }} >{lancmto.data_venc}</td>
                          </tr>
                        </table><table className="w666">
                          <tr className="ct h13">
                            <td className="w472">Beneficiário</td>
                            <td className="w180">Agência / Convênio</td>
                          </tr>
                          <tr className="cp h12 rBb">
                            <td>{provid.entidade?.entidade}</td>
                            <td className="Ar">{banco.agencia} / {banco.convenio}</td>
                          </tr>
                        </table><table className="w666">
                          <tr className="ct h13">
                            <td className="w113">Emissão</td>
                            <td className="w163">N<u>o</u> documento</td>
                            <td className="w62">Espécie doc.</td>
                            <td className="w34">Aceite</td>
                            <td className="w72">processamento</td>
                            <td className="w180">Carteira / Nosso número</td>
                          </tr>
                          <tr className="cp h12 rBb">
                            <td>{lancmto.data_lanc}</td>
                            <td>{lancmto.cod_lanc}</td>
                            <td>DM</td>
                            <td>N</td>
                            <td>{lancmto.data_lanc}</td>
                            <td className="Ar">{lancmto.nossonum}</td>
                          </tr>
                        </table><table className="w666">
                          <tr className="ct h13">
                            <td className="w113">Uso do banco</td>
                            <td className="w83">Carteira</td>
                            <td className="w53">Espécie</td>
                            <td className="w123">Quantidade</td>
                            <td className="w72">(x) Valor</td>
                            <td className="w180">(=) Valor documento</td>
                          </tr>
                          <tr className="cp h12 rBb">
                            <td>&nbsp;</td>
                            <td className="Al">25</td>
                            <td className="Al">R$</td>
                            <td></td>
                            <td></td>
                            <td style={{ border: '1px solid', backgroundColor: '#CCCCCC', fontSize: '11pt' }} className="Ar">R$ {formater.format(lancmto.valor_real as any)}</td>
                          </tr>
                        </table>
                        <table className="w666">
                          <tr className="ct h13">
                            <td className="w659">Descrição DAM:</td>
                          </tr>
                          <tr className="cp h12">
                            <td>{lancmto.desc_lanc}</td>
                          </tr>
                          <tr className="cp h12 rBb">
                            <td></td>
                          </tr>
                        </table><table className="w666">
                          <tr className="ctN h13">
                            <td className="pL6">
                              <div className="ctN pL10">Instruções (Texto de responsabilidade do beneficiário)</div>
                              <div className="cpN pL10">Sr. Caixa, aceitar o pagamento e não cobrar juros após o vencimento.</div>
                            </td>
                            <td className="w409 Ar">
                              <Table className="tableDAM">
                                <tr>
                                  <th className="text-start" >Descrição da Receita</th>
                                  <th className="col_b text-center">Valor R$</th>
                                </tr>
                                <tbody>
                                  {/* <td id="vlrec" style={{textAlign:'right'}}>{formater.format(item.valor_real as any)}</td> */}
                                  {lancmtosDt?.map((item: any) => {
                                    return (
                                      <tr key={item.id_lancdet}>
                                        <td style={{ textAlign: 'left' }}>{item.cod_rec} - {item.des_rec}</td>
                                        <td className="vlrec" >{formater$.format(item.valor_real as any)}</td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </Table></td>
                          </tr>
                        </table>
                        <table className="w666">
                          <tr className="ct h13">
                            <td className="w472">Pagador</td>
                            <td className="w180">Valor Total</td>
                          </tr>
                          <tr className="cp h12 rBb">
                            <td className="At">{lancmto.nome_pessoa}<br />CPF: {maskCPFJ(lancmto.cpf_cnpj)}</td>
                            <td style={{ border: '1px solid', backgroundColor: '#CCCCCC', fontSize: '11pt' }} className="Ar">R$ {formater.format(lancmto.valor_real as any)}</td>
                          </tr>
                        </table><table className="w666">
                          <tr className="ctN h13">
                            <td className="pL6">Sacador / Avalista</td>
                            <td className="w180 Ar">Autenticação mecânica</td>
                          </tr>
                          <tr className="cpN h12">
                            <td className="pL6 barcode">
                              <span>{banco.linhadigitavel}</span>
                              <picture>
                                <img src={'http://bwipjs-api.metafloor.com/?bcid=interleaved2of5&text=' + banco.codigobarra + '&scale=1'} alt="previw" width={450} height={50} />
                              </picture>
                            </td>
                          </tr>
                        </table>
                      </div> </div> </div></div>}
              {modo === 'Alterar' &&
                <div>
                  <div id="btns">
                    <button onClick={incluir_lanc}><Image alt='preview' src='/new.png' width={30} height={30} /><p>Novo</p></button>
                    <button onClick={e => AltLanc(e)}><Image alt='preview' src='/slv.png' width={30} height={30} /><p>Salvar</p></button>
                    <button onClick={CloseMGeral}><Image alt='preview' src='/x.png' width={30} height={30} /><p>Fechar</p></button>
                  </div>
                  {loadModal && (<div><LinearProgress variant="indeterminate" /></div>)}
                  <hr />
                  <div id="titulo">
                    <p>Dados Pessoa - {state.cod_pessoa}</p>
                  </div>
                  <Row className="ms-2 me-2">
                    <div className="form-group col-md-2">
                      <label>Nº Titulo</label>
                      <input type="text" className="form-control" name="id_lanc" id="id_disabled" onChange={handleInput} value={lancmto.id_lanc}
                        style={lancmto.id_lanc === 0 ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>

                    <div className="form-group col-md-4">
                      <label>CPF/CNPJ</label>
                      <input type="text" className="form-control" name="cpf_cnpj" id="id_disabled" onChange={handleInput} value={maskCPFJ(state['cpf_cnpj'])}
                        style={state.cpf_cnpj === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>

                    <div className="form-group col-md-6">
                      <label>Nome</label>
                      <input type="text" className="form-control" name="nome_pessoa" id="id_disabled" onChange={handleInput} value={state.nome_pessoa || ""}
                        style={state.nome_pessoa === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>
                  </Row>
                  <hr />
                  <div id="titulo">
                    <p>Dados do Lançamento</p>
                  </div>
                  <Row className="col-md-12 ms-2 mb-2">
                    <div className="form-group col-md-2">
                      <label>Parcela</label>
                      <input type="text" className="form-control" name="parc" onChange={handleInputLc} value={lancmto.parc} />
                    </div>
                    <div className="form-group col-md-3" >
                      <label>Data Vencimento</label>
                      <input className='form-control form-control-solid w-250px' type='date' onChange={handleInputLc} name='data_venc' value={lancmto.data_venc || ''}
                      style={!lancmto.data_venc ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}/>                   
                    </div>
                    <div className="form-group col-md-3">
                      <label >Nº.Processo</label>
                      <input type="text" className="form-control" name="numero_proc" onChange={handleInputLc} value={lancmto.numero_proc} />
                    </div>
                  </Row>
                  <hr />
                  <div className="form-group col-md-12">
                    <label>Descrição do Lançamento</label>
                    <div className="form-group ">
                      <textarea className="my_textarea form-control" placeholder="Descrição DAM..." rows={4} style={{ background: 'white' }}
                        name="desc_lanc" onChange={handleInputLc} value={lancmto.desc_lanc || ""}></textarea>
                    </div>

                  </div>
                  <hr />
                </div>}
              {modo === 'Alvara' &&
                <div><Row className="flex-row-reverse col-md-8 mt-1 mb-1 float-end">
                  <div className="bt form-group">
                    <div id="btns1">
                      <div className="pnl2" onClick={imprimiAlv}>
                        <p><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
                          <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                          <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 
                          2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1" />
                        </svg></p>
                        <p>Imprimir</p>
                      </div>

                      <div className="pnl2" onClick={CloseMGeral}>
                        <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg></p>
                        <p>Fechar</p>
                      </div>
                    </div></div>
                </Row>
                  <div className="book" id="container">
                    {loadModal && (<div><LinearProgress variant="indeterminate" /></div>)}
                    <div className="page" >
                      <div className="subpage">
                        <div id="cabecalho" style={{ marginTop: '-13px' }} >
                        <picture>
                                        <img className='ent_brasao' src={!provid.entidade?.caminho ? '/bzpadrao.png' : `${provid.entidade?.urlbras}/${provid.entidade?.caminho}`} alt="picture" width={90} height={90} />
                                    </picture>
                          <h2> {provid.sessao?.entidade}</h2>
                          <span>{provid.entidade?.secretaria}</span>
                        </div>
                        <div id='numAlv'>
                          <span style={{ color: '#153a64' }}>Nº {("000000" + alvara.cod_alvara).slice(-6)}</span>
                        </div>
                        <h1 className="ms-5">ALVARÁ</h1>
                        <h3>Licença para {alvara.tipo_alvara}</h3>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">Inscrição:</label>
                          <div className="col-sm-3">
                            <input type="text" className="form-control" value={state.insc_muni} id="inputPassword3" />
                          </div>
                          <label className="col-sm-2 col-form-label">CPF/CNPJ:</label>
                          <div className="col-sm-5">
                            <input type="text" className="form-control" id="inputPassword3" value={maskCPFJ(state['cpf_cnpj'])} />
                          </div>
                        </div>
                        <div className="form-group row ">
                          <label className="col-sm-2 col-form-label">Razão Social:</label>
                          <div className="col-sm-10">
                            <input type="email" className="form-control" id="inputEmail3" value={state.nome_pessoa} />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">Nom.Fantasia:</label>
                          <div className="col-sm-10">
                            <input type="text" className="form-control" id="inputPassword3" value={state.fantasia} />
                          </div>
                        </div>
                        <div className="form-group row ">
                          <label className="col-sm-2 col-form-label">Endereço:</label>
                          <div className="col-sm-10">
                            <input type="email" className="form-control" id="inputEmail3" value={alvara.natureza} />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">Numero:</label>
                          <div className="col-sm-2">
                            <input type="text" className="form-control" id="inputPassword3" value={state.numero} />
                          </div>
                          <label className="col-sm-2 col-form-label">Complemento:</label>
                          <div className="col-sm-6">
                            <input type="text" className="form-control" id="inputPassword3" value={state.complemento} />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">Bairro:</label>
                          <div className="col-sm-4">
                            <input type="text" className="form-control" id="inputPassword3" value={state.bairro} />
                          </div>
                          <label className="col-sm-2 col-form-label">Cidade:</label>
                          <div className="col-sm-4">
                            <input type="text" className="form-control" id="inputPassword3" value={state.cidade} />
                          </div>
                        </div>
                        <div className="form-group row ">
                          <label className="col-sm-2 col-form-label">Atividade:</label>
                          <div className="col-sm-10">
                            <input type="email" className="form-control" id="inputEmail3" value={alvara.natureza} />
                          </div>
                        </div>
                        {alvara.emissao === 'C' && <p id="cancelado">Documento Cancelado!</p>}
                        <Row className="col-md-12">
                          <div className="form-group mt-3 col-md-6">
                            <label>Classificação da Atividade Principal (CNAE):</label>
                          </div>
                          <div className="form-group mt-2 col-md-12">
                            <input type="text" className="form-control" value={alvara.descricao_cnae_grupo} />
                          </div>
                        </Row>
                        <Row className="col-md-12">
                          <div className="form-group col-md-2">
                            <label>Observações</label>
                          </div>
                          <div className="form-group mt-2 col-md-12">
                            <textarea className="form-control my_textarea" value={alvara.obs_alvara} rows={1}></textarea>
                          </div>
                        </Row>
                        <Row className="mt-3 col-md-12">
                          <div className="form-group col-md-7">
                            <label>Classificação das Atividades Secundarias (CNAE):</label>
                          </div>
                          <div className="form-group mt-2 col-md-12" id="my_textarea">
                            <table className="col-md-12">
                              {state.ativsecund?.map((item) => {
                                return (
                                  <tr key={item.code} >
                                    <td>{item.descricao_cnae}</td>
                                  </tr>)
                              })}
                            </table>
                          </div>
                        </Row><br /><br />
                        <div className="col-md-6 float-start">
                          <div className=" col-md-12">
                            <label >Inicio Atividade:</label>
                            <div className="form-group col-md-6">
                              <input type="text" className="form-control text-center" value={state.data_abertura} />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-2 float-end">
                          <div className="col-md-8 float-end">
                            <Image alt='preview' src={'/marcad.png'} width={230} height={80} />
                            <p id="exercAlv">{alvara.exercicio}</p>
                          </div>
                        </div>
                        <div className="row col-sm-12 float-start">
                          <div className="form-group row col-md-12">
                            <label className="col-sm-2 col-form-label">EMITIDO:</label>
                            <div className="col-sm-3">
                              <input type="text" className="form-control text-center" value={alvara.data_emissao} />
                            </div>
                            <label className="col-sm-2 col-form-label">VALIDADE:</label>
                            <div className="col-sm-3">
                              <input type="text" className="form-control text-center" value={alvara.data_validade} />
                            </div>
                          </div>
                        </div>
                        {/* SE NÃO HOUVER NENHUMA ASSINATURA, SISTEMA MOSTRA APENAS UMA LINHA COM UM NOME FIXO, ENTENDEU?*/}
                        {assin1?.id_assin || assin2?.id_assin || assin3?.id_assin ?
                          <div>
                            <table style={{ width: "230", height: "30", float: 'left', marginLeft: '20px' }} border={0} cellPadding="0" cellSpacing="0">
                              <tbody>
                                <tr>

                                  <td>{assin1?.nome && <div className="text-center">
                                    <div id="assinatura" >
                                      <p className="mt-4">________________________________________</p>
                                      <span>{assin1?.nome}</span>
                                      <p>{assin1?.cargo}</p>
                                    </div></div>}</td>
                                </tr>
                              </tbody></table>

                            <table style={{ width: "200px", height: "30", float: 'left', marginLeft: '80px' }} border={0} cellPadding="0" cellSpacing="0">
                              <tbody>
                                <tr>
                                  <td>{assin2?.nome && <div className="text-center">
                                    <div id="assinatura" >
                                      <p className="mt-4">________________________________________</p>
                                      <span>{assin2?.nome}</span>
                                      <p>{assin2?.cargo}</p>
                                    </div></div>}
                                  </td>					 </tr>
                                <tr>
                                </tr>
                              </tbody></table>

                            <div className='row col-md-12 mb-4 float-end'>{assin3?.nome &&
                              <div id="assinatura" className='row col-md-12 mt-4'>
                                <p className="">____________________________________</p>
                                <span>{assin3?.nome}</span>
                                <p>{assin3?.cargo}</p>
                              </div>}
                            </div>
                          </div>
                          :
                          <div className="row col-md-12 mb-4 float-end text-center">
                            <div style={{ marginTop: '80px', lineHeight: '5px' }}>
                              <p >________________________________________</p>
                              <p>Resposavel pela Emissão</p>
                            </div></div>}
                        <br />
                        <div className="form-group col-md-12 text-center float-end">
                          <p> {provid.sessao?.cidade}, {new Date().toLocaleDateString('pt-br', { dateStyle: ('long') })}</p>

                        </div>
                      </div>
                      <div id="footerRel">
                        <span >ESTE ALVARA DEVE SER COLOCADO EM LOCAL DE DESTAQUE</span>
                      </div>
                    </div>
                  </div>
                </div>}
              {modo === 'gerarCND' &&
                <div>
                  <div id="btns">
                    <button onClick={novoCnd} disabled={novaCnd === '1' ? true : false} style={novaCnd === '1' ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' src='/new.png' width={30} height={30} /><p>Novo</p></button>
                    <button onClick={() => setNovaCnd('0')} disabled={novaCnd === '0' ? true : false} style={novaCnd === '0' ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' src='/voltar.png' width={30} height={30} /><p>Cancelar</p></button>
                    <button onClick={salvarCND} disabled={novaCnd === '0' ? true : false} style={novaCnd === '0' ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' src='/slv.png' width={30} height={30} /><p>Salvar</p></button>
                    <button onClick={CloseMGeral}><Image alt='preview' src='/x.png' width={30} height={30} /><p>Fechar</p></button>
                  </div>
                  {loadModal && (<div><LinearProgress variant="indeterminate" /></div>)}
                  <hr />
                  <h3 className="ms-4">Certidão Negativa de Débitos: {state.tipocad === 'C' ? 'Contribuinte' : 'Mercantil'} </h3>
                  <hr />
                  <div id="titulo">
                    <p>Dados Pessoa - {docs.cod_pessoa}</p>
                  </div>
                  <Row className="ms-2 me-2">
                    <input type="hidden" name="tipocad" onChange={handInputDc} value={docs.tipo_cad} />
                    {docs.tipo_cad === 'C' ?
                      <div className="form-group col-md-2">
                        <label>Insc.Municipal</label>
                        <input type="text" className="form-control" name="insc_muni" id="id_disabled" onChange={handInputDc} value={docs.insc_muni}
                          style={docs.insc_muni === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                      </div>
                      :
                      <div className="form-group col-md-2">
                        <label>Insc.Estadual</label>
                        <input type="text" className="form-control" name="insc_estad" id="id_disabled" onChange={handInputDc} value={docs.insc_estad}
                          style={docs.insc_estad === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                      </div>}

                    <div className="form-group col-md-3">
                      <label>CPF/CNPJ</label>
                      <input type="text" className="form-control" name="cpf_cnpj" id="id_disabled" onChange={handInputDc} value={maskCPFJ(docs['cpf_cnpj'])}
                        style={docs.cpf_cnpj === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>

                    <div className="form-group col-md-7">
                      <label>Nome</label>
                      <input type="text" className="form-control" name="nome_pessoa" id="id_disabled" onChange={handInputDc} value={docs.nome_pessoa || ""}
                        style={docs.nome_pessoa === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>
                  </Row>
                  <hr />
                  {docs.lancmtos ?
                    <div>
                      <div className="text-center">
                        <label htmlFor="" style={{ color: '#ce4545' }}>Não é Possivel Emitir Certidão, hà débitos em aberto!</label>
                      </div>
                      <hr />
                      <div id="titulo">
                        <h6 className="ms-4">Lançamentos</h6>
                      </div>
                      <div id="table_modal2">
                        <Table striped bordered >
                          <thead>
                            <tr >
                              <th className="col_a text-center">Nº.Titulo</th>
                              <th className="col_b">Receita</th>
                              <th className="col_e text-end">Valor R$</th>
                              <th className="col_a text-center">Pago</th>
                              <th className="col_a text-center">Data</th>
                              <th className="col_a text-center">Nosso Número</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* <td id="vlrec" style={{textAlign:'right'}}>{formater.format(item.valor_real as any)}</td> */}
                            {docs.lancmtos?.map((item: any) => {
                              return (
                                <tr key={item.id_lancdet}>
                                  <td className="text-center">{item.cod_lanc}</td>
                                  <td>{item.des_rec}</td>
                                  <td className="vlrec" style={{ textAlign: 'right' }}>{formater.format(item.vltotal as any)}</td>
                                  <td className="text-center">{item.pago}</td>
                                  <td className="text-center">{item.data_lanc}</td>
                                  <td className="text-center">{item.nossonum}</td>
                                </tr>)
                            })}
                          </tbody>
                        </Table>
                      </div> </div>
                    :
                    ''
                  }
                  {novaCnd === '1' ?
                    <div>
                      <div id="titulo">
                        <p>Dados para Certidão</p>
                      </div>
                      <Row className="col-md-12 ms-2 mb-2">
                        <div className="form-group col-md-3" >
                          <label>Data Emissão</label>
                          <DatePicker className='form-control form-control-solid w-250px' selected={data_emissao} dateFormat="dd/MM/yyyy"
                            onChange={(data_emissao) => handleChangeAlv({ target: { name: "data_emissao", value: data_emissao } })} showIcon />
                        </div>
                        <div className="form-group col-md-3">
                          <label >Nº.Processo</label>
                          <input type="text" className="form-control" name="numero_proc" onChange={handInputDc} value={docs.numero_proc} maxLength={12} />
                        </div>
                        <div className="form-group col-md-3">
                          <label >Validade (Dias)</label>
                          <input type="text" className="form-control" name="validade" onChange={handInputDc} value={docs.validade} maxLength={3} />
                        </div>
                      </Row>
                      <hr />
                      <div className="form-group col-md-12">
                        <label>Finalidade</label>
                        <div className="form-group ">
                          <textarea className="my_textarea form-control" placeholder="Finalidade..." rows={1}
                            name="finalidade_doc" onChange={handInputDc} value={docs.finalidade_doc || ""}
                            style={!docs.finalidade_doc ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}></textarea>
                        </div>
                      </div>
                      <div className="form-group col-md-12">
                        <label>Observações / Descrição</label>
                        <div className="form-group ">
                          <textarea className="my_textarea form-control" placeholder="Descrição CND..." rows={2}
                            name="obs_doc" onChange={handInputDc} value={docs.obs_doc || ""}></textarea>
                        </div>
                      </div>

                      <div className="form-group ms-4 col-md-10">
                        <label>Assinatura 1º</label>
                        <Form.Select id="id_assin1" className="form-control" name="id_assin1" onChange={handInputDc}>
                          <option></option>
                          {allAssin?.map((item: any) => (
                            <option id={item.id_assin} key={item.id_assin} value={item.id_assin}> {item.nome} - ({item.cargo})</option>
                          ))}
                        </Form.Select>
                        <label>Assinatura 2º</label>
                        <Form.Select id="id_assin2" className="form-control" name="id_assin2" onChange={handInputDc}>
                          <option></option>
                          {allAssin?.map((item: any) => (
                            <option id={item.id_assin} key={item.id_assin} value={item.id_assin}> {item.nome} - ({item.cargo})</option>
                          ))}
                        </Form.Select>
                        <label>Assinatura 3º</label>
                        <Form.Select id="id_assin3" className="form-control" name="id_assin3" onChange={handInputDc}>
                          <option></option>
                          {allAssin?.map((item: any) => (
                            <option id={item.id_assin} key={item.id_assin} value={item.id_assin}>{item.nome} - ({item.cargo})</option>
                          ))}
                        </Form.Select>
                      </div>
                    </div>
                    :
                    <div>
                      {!docs.lancmtos &&
                        <div>
                          <h3 className="ms-4">Certidões Anteriores</h3>
                          <hr />
                          <div id="titulo">
                            <p>Certidões</p>
                          </div>
                          <div id="table_modal2">
                            <Table striped bordered >
                              <thead>
                                <tr >
                                  <th className="col_a text-center">Nº.Certidão</th>
                                  <th id="txt_ellipsis" className="col_c">Finalidade</th>
                                  <th className="col_e text-center">Data Emissão</th>
                                  <th className="col_a text-center">Verificação</th>
                                  <th className="col_a text-center">Emissão</th>
                                  <th className="col_a text-center">Opções</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* <td id="vlrec" style={{textAlign:'right'}}>{formater.format(item.valor_real as any)}</td> */}
                                {docs.documentos?.map((item: any) => {
                                  return (
                                    <tr key={item.id_doc}>
                                      <td className="text-center">{("000000" + item.cod_doc).slice(-6)}</td>
                                      <td id="txt_ellipsis" className="nowrap col_c">{item.finalidade_doc}</td>
                                      <td className="text-center">{item.data_emissao}</td>
                                      <td className="text-center">{item.cod_verificacao}</td>
                                      <td className="text-center">{item.emissao === 'E' ?
                                        <span id="badgeSuces">Gerado</span> :
                                        <span id="badgeAlert">Cancelad</span>}</td>
                                      <td className="col_a text-center">
                                        {item.emissao === 'E' ? <span onClick={() => cancDoc(item.id_doc, item.emissao)} id="badgedel">Cancelar</span> :
                                          <span onClick={() => cancDoc(item.id_doc, item.emissao)} id="badgedel">Desfazer</span>}
                                        <span onClick={() => impDoc(item.id_doc)} id="badgeinf">Imprimir</span> </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </Table>
                          </div> </div>}
                    </div>}

                </div>
              }
              {modo === 'CND' &&
                <div><Row className="flex-row-reverse col-md-8 mt-1 mb-1 float-end">
                  <div className="bt form-group">
                    <div id="btns1">
                      <div className="pnl2" onClick={imprimir}>
                        <p><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
                          <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                          <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 
                          2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1" />
                        </svg></p>
                        <p>Imprimir</p>
                      </div>

                      <div className="pnl2" onClick={CloseMGeral}>
                        <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg></p>
                        <p>Fechar</p>
                      </div>
                    </div></div>
                </Row>
                  {loadModal && (<div><LinearProgress variant="indeterminate" className="col-md-12" /></div>)}
                  <div className="book" id="container">
                    <div className="page" >
                      <div className="subpage">

                        <div id="cabecalho" style={{ marginTop: '-13px' }} >
                          <Image alt='preview'
                            loader={() => !provid.sessao?.imgbras ? '/simg.jpg' : provid.sessao?.imgbras}
                            src={!provid.sessao?.imgbras ? '/simg.jpg' : provid.sessao?.imgbras} width={90} height={90} />
                          <p>ESTADO DA PARAIBA</p>
                          <h2> {provid.sessao?.entidade}</h2>
                          <p> {provid.entidade?.secretaria}</p>
                        </div>
                        <div id='numAlv'>
                          <span style={{ color: '#153a64' }}>Nº: {("000000" + docs.cod_doc).slice(-6)}</span>
                        </div>

                        <table style={{ width: '100%' }} border={1} cellSpacing="0" cellPadding="0">
                          <tbody><tr>
                            <td style={{ background: '#CCCCCC', fontSize: '10pt' }}><div className="text-center">CERTIDAO NEGATIVA DE DÉBITOS MUNICIPAIS</div></td>
                          </tr>
                          </tbody></table>
                        <br />
                        <table style={{ width: "230", height: "45", float: 'left', marginLeft: '20px' }} border={0} cellPadding="0" cellSpacing="0">
                          <tbody><tr>
                            <td className="text-center" valign="middle" style={{ background: '#CCCCCC', padding: '2px', width: '200px', fontSize: '9pt' }}><div className="text-center">Nº do Processo</div></td>
                          </tr>
                            <tr>

                              <td><div className="text-center">
                                <span>{docs.num_processo} </span></div></td>
                            </tr>
                          </tbody></table>

                        <table style={{ width: "200px", height: "45", float: 'left', marginLeft: '150px' }} border={0} cellPadding="0" cellSpacing="0">
                          <tbody><tr >
                            <td style={{ background: '#CCCCCC', padding: '2px', fontSize: '9pt' }}><div className="text-center">Nº Autenticação</div></td>
                          </tr>
                            <tr>
                              <td><div className="text-center">
                                <span>{docs.cod_verificacao} </span></div></td>
                            </tr>
                            <tr>
                            </tr>
                          </tbody></table>
                        <br /><br />

                        <table style={{ width: '100%' }} border={1} cellSpacing="0" cellPadding="0">
                          <tr>
                            <td height="22" colSpan={2} style={{ background: '#CCCCCC', fontSize: '10pt' }} className="text-center">IDENTIFICAÇÃO DO REQUERENTE</td>
                          </tr></table>
                        <table className="col-md-12 mt-2" cellSpacing="0" cellPadding="0" style={{ lineHeight: '20px' }}>
                          <strong>CNPJ/CPF:</strong>&nbsp;{docs.cpf_cnpj}{!docs.cpf_cnpj && 'Não Definido'}
                          <div className="float-end"><strong> Inscrição Municipal: </strong>&nbsp;{docs.insc_muni}{!docs.insc_muni && 'Não Definido'}</div><br />
                          <strong>Razão Social:</strong>&nbsp;{docs.nome_pessoa}{!docs.nome_pessoa && 'Não Definido'}<br />
                          <strong>Nome Fantasia: </strong>&nbsp;{docs.fantasia}{!docs.fantasia && 'Não Definido'}<br />
                          <strong>Endereço:</strong>&nbsp;{docs.rua}&nbsp;&nbsp;&nbsp;&nbsp;
                          <strong className="float-end">Número:</strong>&nbsp;{docs.numero}{!docs.numero && 'Não Definido'}<br />
                          <strong>Bairro:</strong>&nbsp;{docs.bairro}{!docs.bairro && 'Não Definido'}&nbsp;&nbsp;<strong> Cidade:</strong>&nbsp;{docs.cidade}{!docs.cidade && 'Não Definido'} - {docs.uf}&nbsp;
                          <strong> Cep:</strong>&nbsp;{docs.cep}{!docs.cep && 'Não Definido'}
                        </table>
                        {docs.emissao === 'C' && <p id="cancelado">Documento Cancelado!</p>}
                        <br />
                        <table style={{ width: '100%' }} border={1} cellSpacing="0" cellPadding="0">
                          <tr>
                            <td height="22" colSpan={2} style={{ background: '#CCCCCC', fontSize: '10pt' }} className="text-center">Finalidade / Observações</td>
                          </tr></table>
                        <div className="col-md-12">
                          <strong >Finalidade:</strong>
                          <div className="form-group col-md-12">
                            <p>{docs.finalidade_doc}</p>
                          </div>
                        </div>
                        <hr />

                        <table className="col-md-12" border={0} cellPadding="0" cellSpacing="0">

                          <tbody><tr>
                            <td height="70"><div>
                              <p>Certificamos, a requerimento da parte interessada, e de acordo com as informações prestadas pelo setor tributário que, NÃO CONSTA DÉBITOS referente a Tributos Municipais,
                                inscritos ou não em Dívida Ativa, até a presente data, para o requerimento acima.
                              </p>
                            </div></td></tr></tbody></table>

                        <table className="col-md-12" border={0} cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td height="88">
                                <div>Esta certidão é valida por {docs.validade} dias.  A aceitação desta certidão está condicionada à inexistência de emendas ou rasuras, bem como à verificação de sua autenticidade na Internet, no portal do contribuinte.<br />

                                </div></td>
                            </tr>
                          </tbody></table>
                        <hr />
                        <div className="col-md-12">
                          <strong >Observações:</strong>
                          <div className="form-group col-md-12">
                            <p>{docs.obs_doc}</p>
                          </div>
                        </div>

                        <div className="row col-sm-12 float-start">
                          <div className="form-group row col-md-12">
                            <label className="col-sm-2 col-form-label">EMITIDO EM:</label>
                            <div className="col-sm-3">
                              <input type="text" className="form-control text-center" value={docs.data_emissao} />
                            </div>
                            <label className="col-sm-2 col-form-label">VALIDADE:</label>
                            <div className="col-sm-3">
                              <input type="text" className="form-control text-center" value={docs.validade + ' ' + 'Dias'} />
                            </div>
                          </div>
                        </div>
                        {/* SE NÃO HOUVER NENHUMA ASSINATURA, SISTEMA MOSTRA APENAS UMA LINHA COM UM CARGO FIXO, ENTENDEU Rodrigo? engenheiro de software! é nois*/}
                        {assin1?.id_assin || assin2?.id_assin || assin3?.id_assin ?
                          <div>
                            <table style={{ width: "230", height: "30", float: 'left', marginLeft: '20px' }} border={0} cellPadding="0" cellSpacing="0">
                              <tbody>
                                <tr>
                                  <td>{assin1?.nome && <div className="text-center">
                                    <div id="assinatura" >
                                      <p className="mt-4">________________________________________</p>
                                      <span>{assin1?.nome}</span>
                                      <p>{assin1?.cargo}</p>
                                    </div></div>}</td>
                                </tr>
                              </tbody></table>

                            <table style={{ width: "200px", height: "30", float: 'left', marginLeft: '80px' }} border={0} cellPadding="0" cellSpacing="0">
                              <tbody>
                                <tr>
                                  <td>{assin2?.nome && <div className="text-center">
                                    <div id="assinatura" >
                                      <p className="mt-4">________________________________________</p>
                                      <span>{assin2?.nome}</span>
                                      <p>{assin2?.cargo}</p>
                                    </div></div>}
                                  </td>					 </tr>
                                <tr>
                                </tr>
                              </tbody></table>

                            <div className='row col-md-12 mb-4 float-end'>{assin3?.nome &&
                              <div id="assinatura" className='row col-md-12 mt-4'>
                                <p className="">____________________________________</p>
                                <span>{assin3?.nome}</span>
                                <p>{assin3?.cargo}</p>
                              </div>}
                            </div>
                          </div>
                          : <div className="text-center">
                            <div style={{ marginTop: '80px', lineHeight: '5px' }}>
                              <p >________________________________________</p>
                              <p>Resposavel pela Emissão</p>
                            </div></div>}

                        <br />
                        <div className="form-group col-md-12 text-center float-end">
                          <p> {provid.sessao?.cidade}, {new Date().toLocaleDateString('pt-br', { dateStyle: ('long') })}</p>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>}
              {modo === 'CNAE' &&
                <div>
                  <div id="btns">
                    <button style={{ opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' }}><Image alt='preview' src='/new.png' width={30} height={30} /><p>Novo</p></button>
                    <button onClick={listarCnae}><Image alt='preview' src='/atuali.png' width={30} height={30} /><p>Atualizar</p></button>
                    <button onClick={() => CloseMGeral()}><Image alt='preview' src='/x.png' width={30} height={30} /><p>Fechar</p></button>
                  </div>
                  <div id="iPnl4">
                    {pesqCnae === 1 && <div><h6>Pesquisar por Codigo</h6><input className="form-control" id="input6" type="text" onChange={pesq_Cnae} placeholder="Codigo CNAE" /></div>}
                    {pesqCnae === 2 && <div><h6>Pesquisar por Descrição</h6><input className="form-control" id="input6" type="text" onChange={pesq_Cnae} placeholder="Descrição CNAE" /></div>}

                  </div>
                  <Form className="tablepesq">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th className='col_a' onClick={() => setPesqCnae(1)} title="Pesquisar por Codigo" style={{ cursor: 'pointer', textAlign: 'center' }}>Codigo*</th>
                            <th className='col_c' onClick={() => setPesqCnae(2)} title="Pesquisar por Nome" style={{ cursor: 'pointer' }}>Descrição*</th>
                          </tr>
                        </thead>
                        <TableBody>
                          {loadDiag && (
                            <TableRow>
                              <TableCell colSpan={2}>
                                <Box style={{ height: '100%' }}>
                                  <LinearProgress variant="indeterminate" />
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                        <tbody>
                          {FiltroCnae?.map((item) => {
                            return (
                              <tr key={item.cod_cnae} onClick={() => sel_cnae(item.cod_cnae, item.cod_grupo)} style={{ cursor: 'pointer' }}>
                                <td className="text-center" width={5}>{item.cod_cnae}</td>
                                <td >{item.descricao_cnae}</td>
                              </tr>)
                          })}
                        </tbody>
                      </Table>
                    </Form.Group>
                  </Form>
                </div>}
              {modo === 'Socios' &&
                <div>
                  <div id="btns" className="col-md-12" style={{ overflow: 'hidden', padding: '10px', height: '70px' }}>
                                    <div className="float-start">
                                    <button style={{ opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' }}><Image alt='preview' width={30} height={25} src='/new.png' /><p>Novo</p></button>
                    <button onClick={handlePesq2}><Image alt='pic' width={30} height={25} src='/atuali.png' /><p>Atualizar</p></button>
                    <button onClick={() => CloseMGeral()}><Image alt='preview' width={30} height={25} src='/x.png' /><p>Fechar</p></button>
                                    </div>
                                    <div className="col-md-4 ms-4 float-start">
                                    <label className="form-group col-md-6">Pesquisar por:</label>
                  <select className="form-group col-md-6" id="campo" name="campo" value={pesq4.campo} onChange={handlePesq2}>
                    <option value='cod_pessoa'>CODIGO</option>
                    <option value='nome_pessoa'>NOME</option>
                    <option value='cpf_cnpj'>CPF/CNPJ</option>
                    <option value='data_cad'>DATA</option>
                  </select> <br />                  
                    <div className="form-group col-md-12 mt-1 float-start">
                     {pesq4.campo === 'data_cad' ? <div>
                      <input type="date" className="form-group col-md-6 me-1 float-start" alt="Pesquisar" onChange={handlePesq2} name="text1" value={pesq4.text1} />
                      <input type="date" className="form-group col-md-5 float-start" alt="Pesquisar" onChange={handlePesq2} name="text2" value={pesq4.text2} />
                      </div> :
                    <input className="form-group col-md-9 float-start" alt="Pesquisar" name="text1" onChange={handlePesq2} value={pesq4.text1} placeholder="Pesquisar.."/> }
                  <button id="btPesq" type="button" className="btn-outline-primary btn-sm float-start" onClick={handlePesq2}><Image alt='preview' src='/lup.png' width={15} height={15} /></button>
                    </div> 
                                    </div>
                                  </div>                 
            
                <div className="tablepesq2"> 
                      <Table  striped bordered hover>
                        <thead>
                          <tr>
                            <th className="col_a" title="Pesquisar por Codigo" style={{ cursor: 'pointer', textAlign: 'center' }}>Codigo</th>
                            <th className="col_b" title="Pesquisar por Nome" style={{ cursor: 'pointer' }}>Nome</th>
                            <th className="col_a" title="Pesquisar por CPF/CNPJ" style={{ cursor: 'pointer' }}>Cpf/Cnpj</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pesqPessoas?.map((item: any) => {
                            return (
                              <tr key={item.id_pessoa} onClick={() => sel_pessoa(item.nome_pessoa, item.cpf_cnpj)} style={{ cursor: 'pointer' }}>
                                <td className="text-center" >{item.cod_pessoa}</td>
                                <td >{item.nome_pessoa}</td>
                                <td>{item.cpf_cnpj}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                      </div>
                </div>}

            </Modal.Body>
          </Modal>

          <Modal className="modal" size="lg" centered show={showLanc} onHide={CloseMLanc}>
            <Modal.Header closeButton id="modalHeader">
              <Image alt='preview' src='/logoe.png' width={25} height={20} /><p>Incluir Lançamentos </p>
            </Modal.Header>
            <Modal.Body id="modalBody">

              <div id="btns">
                <button onClick={CloseMLanc}><Image alt='preview' src='/voltar.png' width={30} height={30} /><p>Cancelar</p></button>
                <button onClick={e => SalvarLanc(e)}><Image alt='preview' src='/slv.png' width={30} height={30} /><p>Salvar</p></button>
                <button onClick={CloseMLanc}><Image alt='preview' src='/x.png' width={30} height={30} /><p>Fechar</p></button>
              </div>
              <hr />
              {loadModal && (<div><LinearProgress variant="indeterminate" /></div>)}
              <div id="titulo">
                <p>Dados do Contribuinte</p>
              </div>
              <Row className="ms-2 me-2">
                <div className="form-group col-md-2">
                  <label>Insc. Municipal</label>
                  <input type="text" className="form-control" name="cpf_cnpj" id="id_disabled" onChange={handleInput} value={state.insc_muni}
                    style={state.insc_muni === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                </div>

                <div className="form-group col-md-4">
                  <label>CPF/CNPJ</label>
                  <input type="text" className="form-control" name="cpf_cnpj" id="id_disabled" onChange={handleInput} value={maskCPFJ(state['cpf_cnpj'])}
                    style={state.cpf_cnpj === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                </div>

                <div className="form-group col-md-6">
                  <label>Nome<span id="rsNome" style={{ display: "none" }}> é Obrigatório</span></label>
                  <input type="text" className="form-control" name="nome_pessoa" id="id_disabled" onChange={handleInput} value={state.nome_pessoa || ""}
                    style={state.nome_pessoa === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                </div>
              </Row>
              <hr />
              <div id="titulo">
                <p>Dados da Receitas</p>
              </div>
              <Row className="col-md-12 ms-2 mb-2">
                <div className="form-group col-md-3" >
                  <label>Data Cadastro</label>
                  {/* <input className='form-control form-control-solid w-250px' type='date' onChange={handleInput} name='data_lanc' value={state.data_lanc || ''} /> */}
                  <DatePicker className='form-control form-control-solid w-250px' selected={data_lanc} dateFormat="dd/MM/yyyy"
                    onChange={(data_lanc) => handleChange({ target: { name: "data_lanc", value: data_lanc } })} showIcon />
                </div>
                <div className="form-group col-md-1">
                  <label>Parcela</label>
                  <input type="text" className="form-control" name="parc" onChange={handleInput} value={state.parc || ""} />
                </div>
                <div className="form-group col-md-3" >
                  <label>Dt Vencimento</label>
                  <input className='form-control form-control-solid w-250px' type='date' onChange={handleInput} name='data_venc' value={state.data_venc || ''}
                      style={!state.data_venc ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}/>
                </div>
                <div className="form-group col-md-3">
                  <label >Base de Calculo</label>
                  <input type="text" className="vltotal form-control" value={formater$.format(state.vltotal || 0)} placeholder="0,00" disabled
                  name="vltotal" onChange={handleInput}/>
                </div>
                <div className="form-group col-md-2">
                  <label >Nº.Processo</label>
                  <input type="text" className="form-control" name="numero_proc" onChange={handleInput} value={state.numero_proc || ""} />
                </div>
              </Row>
              <Row className="m-2 mb-12">
                <div className="form-group col-md-2">
                  <label>Código Rec<span id="rsValor1" style={{ display: "none" }}>*</span></label>
                  <input type="text" id="id_disabled" className="form-control" name="cod_rec" onChange={handleInput} value={dadosReceita.cod_rec || ''}
                    style={dadosReceita.cod_rec === 0 ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                </div>
                <div className="form-group col-md-6">
                  <label>Receitas<span id="rsValor1" style={{ display: "none" }}> Código Receita é Obrigatório</span></label>
                  <Form.Select id="cod_rec" className="form-control" name="cod_rec"
                    style={dadosReceita.des_rec === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }}
                    onChange={handleInput} onClick={setReceitaId}>
                      <option value=""></option>
                    {receitas.map((item: any) => (
                      
                      <option id={item.id_rec} key={item.id_rec} value={item.id_rec}>{item.cod_rec} - {item.des_rec}</option>
                    ))}
                  </Form.Select>
                </div>
                <div className="form-group col-md-2">
                  <label>Valor<span id="rsValor" style={{ display: "none" }}> R$ Obrigatório</span></label>
                  <input type="text" className="form-control" name="valor" onChange={handleInput} value={dadosReceita.valor || ""} placeholder="0,0"
                    style={dadosReceita.valor === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px', textAlign: 'right' } : { borderLeftColor: 'green', borderLeftWidth: '5px', textAlign: 'right' }} />
                </div>
                <div className="form-group col-md-2 mt-4">
                  <div id="btns1">
                    <div className="pnl2" onClick={() => addRec(dadosReceita.id_rec,dadosReceita.cod_rec, dadosReceita.valor)}>
                      <Image alt='preview' src='/add.png' width={18} height={17} />
                      <p>Adicionar</p>
                    </div></div>
                </div>
              </Row>
              <hr />
              <div id="titulo">
                <h6 className="ms-4">Lançamentos</h6>
              </div>
              <div id="table_modal1">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{width:'10px'}} className="text-center">codRec</th>
                      <th >Receita</th>
                      <th className="text-end">Valor R$</th>
                      <th style={{width:'10px'}} className="text-center">Opções</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* <td id="vlrec" style={{textAlign:'right'}}>{formater.format(item.valor_real as any)}</td> */}
                    {lancmtosDt?.map((item: any) => {
                      return (
                        <tr key={item.id_lancdet}>
                          <td style={{width:'10px'}} className="text-center">{item.cod_rec}</td>
                          <td>{item.des_rec}</td>
                          <td className="vlrec" style={{ textAlign: 'right' }}>{formater.format(item.valor_real as any)}</td>
                          <td style={{width:'10px'}} className="text-center"> <span onClick={() => delLancDt(item.id_lancdet)} id="badgedel">Excluir</span> </td>
                        </tr>
                      ) })}
                  </tbody>
                </Table>
              </div>
              <hr />
              <Row className="d-flex flex-row-reverse mb-2">
                <div className="form-group col-md-3">
                  <h6>Valor Total:</h6>
                  <input type="text" id="id_disabled" className="vltotal form-control" name="vltotal" onChange={handleInput}
                    value={formater$.format(state.vltotal || 0)} placeholder="0,00" />
                </div>
                <div className="form-group col-md-3">
                  <h6>Vencimento:<span id="rsNome" style={{ display: "none" }}> é Obrigatório</span></h6>
                  <DatePicker className='form-control form-control-solid w-250px' selected={data_venc} dateFormat="dd/MM/yyyy"
                    onChange={(data_venc) => handleChange({ target: { name: "data_venc", value: data_venc } })} showIcon />
                </div>
              </Row>
              <div className="form-group col-md-12">
                <div id="titulo">
                  <h6>Descrição do Lançamento</h6>
                </div>
                <div className="form-group ">
                  <textarea className="my_textarea form-control" placeholder="Descrição DAM..." rows={2} style={{ backgroundColor: 'white' }}
                    name="desc_lanc" onChange={handleInput} value={state.desc_lanc || ""}></textarea>
                </div>

              </div>
              <hr />
            </Modal.Body>
          </Modal>

          <div id='table_body'>
            {/*<DataGrid getRowId={(row) => row.id_pessoa} columnHeaderHeight={20} rowHeight={21}
              columns={columns}
              rows={pessoasFiltrados}
              hideFooterPagination
        
              //slots={{loadingOverlay: LinearProgress as GridSlots['loadingOverlay'], }}
              sx={{
                boxShadow: 0,
                border: 0,
                borderColor: 'primary.light'
              }}
              loading={loading}
            
              //disableRowSelectionOnClick 
              //disableMultipleRowSelection
              apiRef={apiRef}
              localeText={{
                footerRowSelected: (count) => `Selecionados: ${count}`
              }} striped
            /> */}
            <Table  hover>
              <thead>
                <tr>
                  <th className="col_a text-center">codigo</th>
                  <th >Nome</th>
                  <th >Cpf/Cnpj</th>
                  <th className="display_none">Cidade</th>
                  <th className="display_none">CEP</th>
                  <th className="display_none text-center">TIPO</th>
                  <th className="text-center">Cadastro</th>
                </tr>
              </thead>
              <TableBody>
                {loading && (
                  <tr>
                    <TableCell colSpan={8}>
                      <LinearProgress variant="indeterminate" />
                    </TableCell>
                  </tr>
                )}
              </TableBody>
              <tbody>
                {pessoas?.map((item: any) => {
                  return (
                    <tr key={item.id_pessoa} id={item.id_pessoa} onClick={RowClicked} onDoubleClick={RowDbClicked} className={rowId == item.id_pessoa ? "bgactive" : ""}>
                      <td style={{ textAlign: 'center' }}>{item.cod_pessoa}</td>
                      <td style={{ }}>{item.nome_pessoa}</td>
                      <td >{item.cpf_cnpj}</td>
                      <td className="display_none">{item.cidade}</td>
                      <td className="display_none">{item.cep}</td>
                      <td className="display_none text-center">{item.tipocad === 'E' ? 'MERCANT' : 'CONTRIB'}</td>
                      <td className="text-center">{item.data_cad}</td>
                    </tr>
                  )
                })} </tbody>
            </Table>
          </div>
        </div>}
    </>
  );
}