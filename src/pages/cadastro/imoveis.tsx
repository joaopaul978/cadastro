//"use client"
import React, { useState, useMemo, useContext, useEffect, Fragment } from "react";
import 'react-toastify/dist/ReactToastify.min.css';
import { Table, Form, InputGroup, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import LinearProgress from '@mui/material/LinearProgress';
import { Box, TableBody, TableCell, TableRow } from "@mui/material";
//import { useDebounce } from "../../services/debouces";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Row from 'react-bootstrap/Row';
//icones material ui

import { maskCPFJ, currencyBRL, maskOnlyNumbers, maskInsc, maskCEP, maskFone, maskFixo } from "../../util/validacao";

import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { useDebounce } from "@/services/debouces";
import Image from 'next/image';
import { IlistaLograd, IlistaImoveis, IlistaPessoas, IlistaLote, IlistaDividas } from "@/services/interfaces";
//import { maskInsc5 } from "./dashboard";
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import logout from "@/services/logout";
import { set } from "react-datepicker/dist/date_utils";
import { Height } from "@mui/icons-material";
import Api from "@/services/Api";

export default function Imoveis() {
  //const { debounce } = useDebounce(500);
  const [show, setShow] = useState(false);
  //modal Lançamentos 

  const provid = useContext(AuthContext);
  const initialState = {
    id_ent: 0, id_imovel: 0, inscricao: '', inscricao_ant: '', cod_imovel: 0, id_pessoa: 0, id_user: 0, cod_pessoa: 0, id_pessoa_resp: 0, nome_pessoa: '', cpf_cnpj: '', nome_resp: '', cpf_cnpj_resp: '', rua: '', numero: '', bairro: '', cidade: '', uf: '', cep: '',
    email: '', telefone: '', fixo: '', id_log: 0, situacao: 0, cod_log: 0, nome_log: '', bairro_log: '', cidade_log: '', uf_log: '', cep_log: '', num_imovel: '', id_lote: 0, cod_lote: 0, nome_lote: '', lote: '', quadra: '', tipo_imovel: '', tipo_localizacao: '',
    situacao_imovel: 0, isencao: 0, patrimonio_terr: '', patrimonio_constru: '', uso_solo: '', coleta: 0, coletor: 0, elevacao: '', coberta: '', conservacao: '', padrao: '', pedologia: '', especie: '', construcao_piso: 0, topografia: 0, serv_agua: 0,
    serv_ilumin: 0, serv_pavimen: 0, serv_energ: 0, serv_esgoto: 0, serv_galeria: 0, serv_lixo: 0, serv_canal: 0, limit_alagado: 0, limit_scalc: 0, limit_smuro: 0, sanitaria: '', alinhamento: '', limit_encrav: 0, limit_acident: 0, posicao: '', complemento: '',
    face: '', area_terreno: '', area_construida: '', tx1: '', tx2: '', tx3: '', profund: '', num_frente: '', num_unid: '', num_pav: '', testada_r: '', testada_f: '', lateral_esq: '', lateral_dir: '', m_fundos: '', valor_m2: '', valor_vlog: '',
    valor_unitario: '', valor_venal: '', venal_inf: '', aliquota: '', valor_iptu: '', desconto: '', valor_total: '', obs: '', exercicio: '', pago: '', tipo_pgmto: '', nossonum: '', data_cad: '', data_alt: '', data_pgmto: '', caminho: '', usu_cad: '', tipocad: '',
    aliq_terreno: 0, aliq_construcao: 0, ft_terreno: 0, ft_construcao: 0
  };
  const [state, setState] = useState(initialState);
  const [calc, setCalc] = useState({ id_ent: 0, id_user: 0, id_imovel: 0, tipo_imovel: '', area_terreno: '', area_construida: '', padrao: '', valor_m2: '', desconto: 0, desconto_antec: '', perc_ant: 0, tx1: '', tx2: '', tx3: '', data_alt: '', usu_cad: '' });
  //const [tumulos, setTumulos] = useState({id_tum:0, cod_tum:0,tipo:'',nome_cemi:''});
  //const [state, setState] = useState<{[key: str,ing]: any}>({});
  const [imoveis, setImoveis] = useState<IlistaImoveis[]>([]);
  const [logradouros, setLograd] = useState<IlistaLograd[]>([]);
  const [loteamentos, setLote] = useState<IlistaLote[]>([]);
  const [pessoas, setPessoas] = useState<IlistaPessoas[]>([]);
  const [dividas, setDividas] = useState<IlistaDividas[]>([]);
  const [dadosReceita, setDadosReceita] = useState({ cod_rec: 0, des_rec: '', valor: '' });
  const [modalGeral, setMGeral] = useState(false);
  const [modalDiv, setModalDiv] = useState(false);
  const initDivida = {
    id_ent: 0, id_divida: 0, cod_divida: 0, inscricao: '', id_imovel: 0, cod_imovel: 0, id_pessoa: 0, cod_pessoa: 0, exercicio: '', valor_original: 0, valor_juros: 0, valor_multa: '', valor_corr: '', desconto: '', aliq_desconto: '', valor_total: 0, vltotal: 0, sobjudice: '', parcelado: '', pago: '', nossonum: '', data_cad: '', data_alt: '', id_user: 0, usu_cad: ''
  }
  const initPesq = { id_ent: 0, campo: 'nome_pessoa', text1: '', text2: '',limit_rows: provid.entidade?.limit_rows }
  const [divida, setDivida] = useState(initDivida);
  const resetState = () => { setState(initialState); /*setDividas([])*/ };
  // const CloseMGeral = () => { setMGeral(false); resetState() }
  const CloseModal = () => { setShow(false); resetState(); setKey('1'); setloadModal(false) }
  const CloseMDiv = () => { setModalDiv(false); setDivida(initDivida); setKey('4'); }
  //modal Guias
  const [mGuias, setMGuias] = useState(false);
  const [mGuias2, setMGuias2] = useState(false);
  const [pesqPessoa, setPesqP] = React.useState(2);

  const [modo, setModo] = useState('');
  const handleClose = () => { setMGuias(false); setMGuias2(false); setLograd([]); setLote([]); setPessoas([]); setloadDiag(false); setModo('') }
  const CloseMGeral = () => { setLograd([]); setLote([]); setPessoas([]); setMGeral(false); setloadModal(false); setModo('') }
  //const resetState = () => {setImoveis([])};
  const [busca, setBusca] = useState('');
  //const [id, setId] = useState('');
  const [rowId, setRowId] = useState(null);
  const [rowDva, setRowDva] = useState({ id_div: '', pago: '' });
  const [loading, setloading] = useState(false);
  const [loadModal, setloadModal] = useState(false);
  const [loadingDiag, setloadDiag] = useState(false);
  const [key, setKey] = useState('1');

  const [modoP, setModoP] = useState('P');

  const initLancmto = {
    id_lanc: 0, id_pessoa: 0, id_imovel: 0, nome_pessoa: '', cpf_cnpj: '', rua: '', numero: '', bairro: '', cidade: '', uf: '', cep: '', id_user: 0, desc_lanc: '', convenio: '', valor_iptu: '', tx1: '', tx2: '', tx3: '', desc_tipo_imovel: '', area_construida: '', area_terreno: '', uso_solo: '', lote: '', quadra: '',
    valor_total: '', valor_venal: '', data_cad: '', nossonum: '', cod_imovel: '', inscricao: '', numero_proc: '', parc: '', exercicio: '', situacao: '', valor_antec: '', original: 0, juros: 0, multa: 0, corr: 0, divida_total: 0,
    dados_Ent: [{ msg1: '', msg2: '', msg3: '', msg4: '', venc_dvtotal: '', exercicio: '' }], banco_ativo: [{ agencia: '', conta: '', convenio: '', cod_banco: '', nome_banco: '', local_pgto: '', brasao: '', linhadigitavel: '', codigobarra: '' }],
    dividas: [{ id_divida: 0, exercicio: '', valor_original: '', valor_juros: '', valor_multa: '', valor_corr: '', desconto: '', valor_total: '' }]
  };
  const [lancmto, setLancmto] = useState(initLancmto);

  // const initBanco = { agencia: '', conta: '', convenio: '', cod_banco: '', nome_banco: '', local_pgto: '', brasao: '', linhadigitavel: '', codigobarra: '', };
  // const [banco, setBanco] = useState(initBanco);

  //useEffect(() => { },[]); 

   const maskInsc5 = (v:string) => {

    v = v.replace(/\D/g, "") 
       v = v.substring(0, 14);
          //00.000.0000.000.00  
      v = v.replace(/(\d{2})(\d)/, "$1.$2")
      v = v.replace(/(\d{3})(\d)/, "$1.$2")
      v = v.replace(/(\d{4})(\d)/, "$1.$2")
      v = v.replace(/(\d{3})(\d{2})$/, "$1.$2") 
      return v ;   
       
 }

  const loadLograd = () => {
    setloadDiag(true);
    const id_ent = provid.sessao?.id_ent;
    Api.get(`/logradouros/${id_ent}`).then((response) => {
      if (response) {
        setloadDiag(false);
        setLograd(response.data);
      }
    }).catch(() => { setLograd([]) });
  }
  const loadLote = () => {
    setloadDiag(true);
    const id_ent = provid.sessao?.id_ent;
    Api.get(`/loteamentos/${id_ent}`).then((response) => {
      if (response) {
        setloadDiag(false);
        setLote(response.data);
      }
    }).catch(() => { setLote([]) });
  }
  const loadDividas = () => {
    setloadDiag(true);
    Api.get(`/dividas/${state.id_imovel}`).then((response) => {
      if (response) {
        setloadDiag(false);
        setDividas(response.data);
        setTimeout(() => { somaTotal() }, 500);
      }
    }).catch(() => { setLograd([]) });
  }
  const [somaDv, setVltotal] = useState({ vltotal: 0 });
  function somaTotal() {
    var soma = 0 as number;
    //forma Principal
    var valor = document.getElementsByClassName("vlrec");
    for (let i = 0; i < valor.length; i++) {
      soma = soma + Number(valor[i].innerHTML.replace(".", "").replace(",", "."))
    }
    setTotal({ soma })
    somaDv.vltotal = soma;
  }
  const Novo = () => {
    setKey('1');//seta a aba principal
    setShow(true);
    setloading(false);
    setRowId(null);
    resetState(); setDividas([])
  }

  const Editar = (rowId: any) => {
    if (rowId) {
      setloadModal(true);
      setShow(true);
      Api.get(`/imovelId/${rowId}`).then((res) => {
        if (!res.data[0]) {
          toast.warn('Não Encontrado!');
          setShow(false);
          setloadModal(false);
          //handlePesq();
        } else {
          setState(res.data[0]);
          setloadModal(false)
        }
      }).catch(() => { });;
    } else { toast.warn('Selecione um registro!') }
  }

  const Alterar = () => {
    setRowId(null)
  }

  const Cancelar = (rowId: any) => {
    if (rowId) {
      setRowId(rowId);
      Editar(rowId);
    } else { CloseModal(); }
  }

  const { debounce } = useDebounce(500);

  const pesqLograd = (e: any) => {
    e.preventDefault();
    handleInput(e);
    loadLograd();
    debounce(() => {
      //setTimeout(setBuscaL(e.target.value), 3000); teste
      setBuscaL(e.target.value);
    });
  };
  const pesqLote = (e: any) => {
    e.preventDefault();
    handleInput(e);
    loadLote();
    debounce(() => {
      //setTimeout(setBuscaL(e.target.value), 3000); teste
      setBuscaLt(e.target.value);
    });
  };
  const [buscaLograd, setBuscaL] = useState('');
  const [pesqLog, setPesqL] = React.useState(2);
  var FiltroLograds = useMemo(() => {
    const numBusca = buscaLograd;
    const lowerBusca = buscaLograd;
    switch (pesqLog) {
      case 1: return logradouros.filter((item) => item.cod_log.toString().includes(numBusca)); break;
      case 2: return logradouros.filter((item) => item.nome_log.toLowerCase().includes(lowerBusca.toLowerCase())); break;
      case 3: return logradouros.filter((item) => item.bairro_log.toLowerCase().includes(lowerBusca.toLowerCase())); break;
    }
  }, [buscaLograd, pesqLog, logradouros]);

  const [buscaLote, setBuscaLt] = useState('');
  const [pesqLot, setPesqLt] = React.useState(2);
  const FiltroLote = useMemo(() => {
    const numBusca = buscaLote;
    const lowerBusca = buscaLote.toLowerCase();
    switch (pesqLot) {
      case 1: return loteamentos.filter((item) => item.cod_lote.toString().includes(numBusca)); break;
      case 2: return loteamentos.filter((item) => item.nome_lote.toLowerCase().includes(lowerBusca.toLowerCase())); break;
      case 3: return loteamentos.filter((item) => item.bairro_lote.toLowerCase().includes(lowerBusca.toLowerCase())); break;
    }
  }, [buscaLote, pesqLot, loteamentos]);


  //const listarP = () => { setloadDiag(true); loadPessoas(); setTimeout(() => { setPesqP(2); setBuscaP(' ') }, 500) };
  const listarL = () => { setloadDiag(true); loadLograd(); setTimeout(() => { setPesqL(2); setBuscaL(' ') }, 500) };
  const listarLt = () => { setloadDiag(true); loadLote(); setTimeout(() => { setPesqLt(2); setBuscaLt(' ') }, 500) };



  const [pesqPor, setPesq] = React.useState(3);

  // const imoveisFiltrados = useMemo(() => {
  //   let numBusca = busca;
  //   let lowerBusca = busca;
  //   switch (pesqPor) {
  //     case 0: return imoveis.filter((item) => item.id_imovel.toString().includes(numBusca)); break;
  //     case 1: return imoveis.filter((item) => item.cod_imovel.toString().includes(numBusca)); break;
  //     case 2: return imoveis.filter((item) => item.inscricao.toString().includes(numBusca)); break;
  //     case 3: return imoveis.filter((item) => item.nome_pessoa.toLowerCase().includes(lowerBusca.toLowerCase())); break;
  //     case 4: return imoveis.filter((item) => item.cpf_cnpj.toLowerCase().includes(lowerBusca.toLowerCase())); break;
  //     case 5: return imoveis.filter((item) => item.nome_log.toLowerCase().includes(lowerBusca.toLowerCase())); break;
  //     case 6: return imoveis.filter((item) => item.bairro_log.toLowerCase().includes(lowerBusca.toLowerCase())); break;
  //   }
  // }, [busca, pesqPor, imoveis]);

  const [Checked1, setChecked1] = useState(false); const [Checked6, setChecked6] = useState(false); const [Checked11, setChecked11] = useState(false);
  const [Checked2, setChecked2] = useState(false); const [Checked7, setChecked7] = useState(false); const [Checked12, setChecked12] = useState(false);
  const [Checked3, setChecked3] = useState(false); const [Checked8, setChecked8] = useState(false); const [Checked13, setChecked13] = useState(false);
  const [Checked4, setChecked4] = useState(false); const [Checked9, setChecked9] = useState(false); const [Checked14, setChecked14] = useState(false);
  const [Checked5, setChecked5] = useState(false); const [Checked10, setChecked10] = useState(false);

  const handChange1 = () => { setChecked1(!Checked1) }; const handChange6 = () => { setChecked6(!Checked6) }; const handChange11 = () => { setChecked11(!Checked11) };
  const handChange2 = () => { setChecked2(!Checked2) }; const handChange7 = () => { setChecked7(!Checked7) }; const handChange12 = () => { setChecked12(!Checked12) };
  const handChange3 = () => { setChecked3(!Checked3) }; const handChange8 = () => { setChecked8(!Checked8) }; const handChange13 = () => { setChecked13(!Checked13) };
  const handChange4 = () => { setChecked4(!Checked4) }; const handChange9 = () => { setChecked9(!Checked9) }; const handChange14 = () => { setChecked14(!Checked14) };
  const handChange5 = () => { setChecked5(!Checked5) }; const handChange10 = () => { setChecked10(!Checked10) };

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value.toLocaleUpperCase() });
    setDadosReceita({ ...dadosReceita, [name]: value });
  };

  const handleInputDv = (e: any) => {
    const { name, value } = e.target;
    setDivida({ ...divida, [name]: value });
  };

  divida.valor_total = Number(divida.valor_original) + Number(divida.valor_juros) + Number(divida.valor_multa) + Number(divida.valor_corr);

  const RowClicked = (event: any) => {
    const { id } = event.currentTarget; setRowId(id);
    if (rowId !== id) {//lidar se o usuário clicar novamente na mesma linha
      setRowId(id);
      //} else { setRowId(null); //definir a linha clicada como nula se a mesma linha for selecionada
    }
  };

  const RowClickedDv = (event: any) => {
    let { id } = event.currentTarget;
    setRowDva({ id_div: id.replace(/[^0-9]/g, ''), pago: id.replace(/[^A-Z]/g, '') })
  };

  const RowDbClicked = (event: any) => {
    const { id } = event.currentTarget; Editar(id)
    setRowId(id);
    if (rowId !== id) { //lidar se o usuário clicar novamente na mesma linha      
      setRowId(id);
      //  } else { setRowId(null); //definir a linha clicada como nula se a mesma linha for selecionada
    }
  };

  const delImovel = (rowId: any) => {
    setRowId(null);
    if (rowId) {
      let id_user = provid.sessao?.id_user;
      Api.delete(`/delImovel/${rowId}/${id_user}`).then((res) => {
        if (res) { setShow(false); }
      }).catch((err) => { err });
    } else {
      toast.warn('Selecione um registro!')
    }
  };

  const ConsultaLog = async () => {
    setModo('Logradouros'); setMGeral(true);
  }
  const ConsultaLot = async () => {
    setModo('Loteamentos'); setMGeral(true);
  }
  const ConsultaPess = async () => {
    setModo('Pessoas'); setMGeral(true);
  }
  const sel_log = (id_log: any, cod_log: any, nome_log: any, bairro_log: any, cidade_log: any, uf_log: any, cep_log: any, valor_m2: any) => {
    setMGeral(false); setLograd([]);
    setShow(true);
    state.id_log = id_log;
    state.cod_log = cod_log;
    state.nome_log = nome_log;
    state.bairro_log = bairro_log;
    state.cidade_log = cidade_log;
    state.uf_log = uf_log;
    state.cep_log = cep_log;
    state.valor_m2 = valor_m2;
  }
  const edit_log = (id_log: any, cod_log: any, nome_log: any, bairro_log: any, cidade_log: any, uf_log: any, cep_log: any, valor_m2: any) => {
    setModo('cadLogradouros');
    //setLograd([]);
    state.id_log = id_log;
    state.cod_log = cod_log;
    state.nome_log = nome_log;
    state.bairro_log = bairro_log;
    state.cidade_log = cidade_log;
    state.uf_log = uf_log;
    state.cep_log = cep_log;
    state.valor_m2 = valor_m2;
  }
  const edit_pessoa = (id_pessoa: any, nome_pessoa: any, cpf_cnpj: any, nome_log: any, cidade: any, bairro: any, numero: any, uf: any, cep: any, telefone: any, fixo: any, email: any) => {
    setModo('cadPessoas');
    state.id_pessoa = id_pessoa;
    state.nome_pessoa = nome_pessoa;
    state.cpf_cnpj = cpf_cnpj;
    state.rua = nome_log;
    state.numero = numero;
    state.bairro = bairro;
    state.cidade = cidade;
    state.uf = uf;
    state.cep = cep;
    state.telefone = telefone;
    state.fixo = fixo;
    state.email = email;
  }
  const delPessoa = (id: any) => {
    if (id) {
      let id_user = provid.sessao?.id_user;
      Api.delete(`/delPessoa/${id}/${id_user}`).then((res) => {
        if (res) { setModo('Pessoas'); setPessoas([]); }
      }).catch((err) => { err });
    } else { toast.warn('Selecione um registro!') }
  };

  const clear_log = () => {
    setModo('cadLogradouros');
    state.id_log = 0;
    state.cod_log = 0;
    state.nome_log = ' ';
    state.bairro_log = ' ';
    state.cidade_log = '';
    state.uf_log = '';
    state.cep_log = '';
    state.valor_m2 = '';
  }

  const clear_pessoa = () => {
    setModo('cadPessoas');
    state.id_pessoa = 0;
    state.cod_pessoa = 0;
    state.nome_pessoa = '';
    state.cpf_cnpj = '';
    state.rua = '';
    state.bairro = ' ';
    state.cidade = '';
    state.uf = '';
    state.cep = '';
    state.email = '';
    state.telefone = '';
    state.fixo = '';
  }

  const sel_lote = (id_lote: any, cod_lote: any, nome_lote: any) => {
    setMGeral(false); setLote([]);
    setShow(true);
    state.id_lote = id_lote;
    state.cod_lote = cod_lote;
    state.nome_lote = nome_lote;
  }
  // const loadPessoas = () => {
  //   const id_ent = provid.sessao?.id_ent;
  //   Api.get(`/pessoas/${id_ent}`).then((response) => {
  //     if (response) {
  //       setloadDiag(false);
  //       setPessoas(response.data);
  //     }
  //   }).catch(() => { setPessoas([]) });
  // }
  // const pesqPessoas = (e: any) => {
  //   e.preventDefault();
  //   handleInput(e);
  //   setloadDiag(true)
  //   debounce(() => {
  //     //setTimeout(setBusca(e.target.value), 3000);
  //     setBuscaP(e.target.value)
  //   });
  //   loadPessoas();
  // };

  // const [buscaPessoa, setBuscaP] = useState('');
  // const FiltroPessoas = useMemo(() => {
  //   if (pesqPessoa === 1) {
  //     const numBusca = buscaPessoa;
  //     return pessoas.filter((item) => item.cod_pessoa.toString().includes(numBusca));
  //   }
  //   if (pesqPessoa === 2) {
  //     const lowerBusca = buscaPessoa.toLowerCase();
  //     return pessoas.filter((item) => item.nome_pessoa.toLowerCase().includes(lowerBusca));
  //   }
  //   if (pesqPessoa === 3) {
  //     const lowerBusca = buscaPessoa.toLowerCase();
  //     return pessoas.filter((item) => item.cpf_cnpj.toLowerCase().includes(lowerBusca));
  //   }
  // }, [buscaPessoa, pessoas, pesqPessoa]);

  const pessoaProp = () => { ConsultaPess(); setModoP('P') }
  const pessoaResp = () => { ConsultaPess(); setModoP('R') }

  const sel_pessoa = (id_pessoa: any, nome_pessoa: any, cpf_cnpj: any, nome_log: any, cidade: any, bairro: any, numero: any, uf: any, cep: any, telefone: any, fixo: any, email: any) => {
    setMGeral(false);
    setShow(true); setPessoas([]);
    if (modoP === 'R') {
      state.id_pessoa_resp = id_pessoa;
      state.nome_resp = nome_pessoa;
      state.cpf_cnpj_resp = cpf_cnpj;
    } else {
      state.id_pessoa = id_pessoa;
      state.nome_pessoa = nome_pessoa;
      state.cpf_cnpj = cpf_cnpj;
      state.rua = nome_log;
      state.numero = numero;
      state.bairro = bairro;
      state.cidade = cidade;
      state.uf = uf;
      state.cep = cep;
      state.telefone = telefone;
      state.fixo = fixo;
      state.email = email;
    }
  }

  function validation() {
    let insc = document.getElementById("rsInscricao");
    let insc1 = document.getElementById("rsInsc1");
    let nome_log = document.getElementById("rsNome");
    let nome = document.getElementById("rsNome2");
    let cpfj = document.getElementById("rsCpfj");
    let insc2 = document.getElementById("rsInsc2");

    if (!state.inscricao) { if (insc !== null) insc.style.cssText = 'color: brown'; if (insc1 !== null) insc1.style.cssText = 'display: none' } else {
      if (insc !== null) insc.style.cssText = 'display: none'
      if (provid.entidade?.insc_seq === 'N') {
        if (state.inscricao.replace('.', '').length < 14) {
          if (insc1 !== null) insc1.style.cssText = 'color: brown'; if (insc2 !== null) { insc2.style.cssText = 'display:none'; }
        } else { if (insc1 !== null) insc1.style.cssText = 'display: none' }
      }
    }

    if (!state.nome_log) { if (nome_log !== null) nome_log.style.cssText = 'color: brown'; } else { if (nome_log !== null) nome_log.style.cssText = 'display: none' }
    if (!state.nome_pessoa) { if (nome !== null) nome.style.cssText = 'color: brown'; } else { if (nome !== null) nome.style.cssText = 'display: none' }
    if (!state.cpf_cnpj) { if (cpfj !== null) cpfj.style.cssText = 'color: brown'; } else { if (cpfj !== null) cpfj.style.cssText = 'display: none' }
    toast.warning('Vericar Campos Obrigatórios')
  }

  const Salvar = async (e: any) => {
    e.preventDefault()
    if (!state.inscricao || state.inscricao.replace('.', '').length < 14 || !state.id_pessoa || !state.id_log) {
      return validation()
    } else {
      let insc1 = document.getElementById("rsInsc1");
      if (insc1 !== null) insc1.style.cssText = 'display: none'
      setloadModal(true);
      //state.data_cad = state.data_cad.format('YYYY-MM-DD')
      state.id_user = provid.sessao?.id_user as number;
      state.id_ent = provid.sessao?.id_ent as number;
      state.usu_cad = provid.sessao?.username as string;
      state.data_cad = new Date().toLocaleDateString('pt-br');
      if (!state.tipo_imovel) { state.tipo_imovel = '2' };
      if (!state.especie) { state.especie = '971' };
      if (!state.uso_solo) { state.uso_solo = '971' };
      if (!state.patrimonio_constru) { state.patrimonio_constru = '1' };
      if (!state.patrimonio_terr) { state.patrimonio_terr = '1' };
      state.area_terreno = state.area_terreno.toLocaleString().replace(".", "").replace(",", ".");
      state.profund = state.profund.toLocaleString().replace(".", "").replace(",", ".");
      state.area_construida = state.area_construida.toLocaleString().replace(".", "").replace(",", ".");
      state.testada_r = state.testada_r.toLocaleString().replace(".", "").replace(",", ".");
      state.testada_f = state.testada_f.toLocaleString().replace(".", "").replace(",", ".");
      state.lateral_esq = state.lateral_esq.toLocaleString().replace(".", "").replace(",", ".");
      state.lateral_dir = state.lateral_dir.toLocaleString().replace(".", "").replace(",", ".");
      state.m_fundos = state.m_fundos.toLocaleString().replace(".", "").replace(",", ".");
      state.valor_m2 = state.valor_m2.toLocaleString().replace(".", "").replace(",", ".");
      state.valor_unitario = state.valor_unitario.toLocaleString().replace(".", "").replace(",", ".");
      state.valor_vlog = state.valor_vlog.toLocaleString().replace(".", "").replace(",", ".");
      state.valor_venal = state.valor_venal.toLocaleString().replace(".", "").replace(",", ".");
      state.venal_inf = state.venal_inf.toLocaleString().replace(".", "").replace(",", ".");
      state.aliquota = state.aliquota.toLocaleString().replace(".", "").replace(",", ".");
      state.valor_iptu = state.valor_iptu.toLocaleString().replace(".", "").replace(",", ".");
      state.tx1 = provid.entidade?.tx1 as string;
      state.tx2 = provid.entidade?.tx2 as string;
      state.tx3 = provid.entidade?.tx3 as string;
      state.desconto = state.desconto.toLocaleString().replace(".", "").replace(",", ".");
      state.valor_total = state.valor_total.toLocaleString().replace(".", "").replace(",", ".");
      state.exercicio = provid.entidade?.exercicio as string;
      state.pago = 'N';
      state.nossonum = new Date().getFullYear() + ("000000" + state.cod_pessoa).slice(-6) + ("000000" + state.cod_imovel).slice(-6);
      if (!state.id_imovel) {
        Api.post(`/imoveis`, state).then((res) => {
          if (res.status === 203) {
            let insc2 = document.getElementById("rsInsc2");
            if (insc2 !== null) { insc2.style.cssText = 'color: brown'; setloadModal(false); }
          } else {
            setloadModal(false);
            setTimeout(() => {
              Editar(res.data.result2.insertId);
            }, 200);
            let insc2 = document.getElementById("rsInsc2");
            if (insc2 !== null) { insc2.style.cssText = 'display:none'; setloadModal(false); }
          }

        }).catch(() => { setImoveis([]); });
      } else {
        state.data_alt = new Date().toLocaleString();
        //ClienteServices.update(state)
        Api.put(`/imoveisPut/`, state).then((res) => {
          //listar();
          Editar(res.data.id_imovel);
          setTimeout(() => {
            // Editar(res.data.id_imovel); 
            if (provid.entidade?.calc_imovel === 'S') { calcImovel() }
          }, 200);
        }).catch(() => { setImoveis([]); });
      }
    }
  }

  const calcImovel = () => {
    if (state.id_imovel) {
      calc.id_ent = provid.sessao?.id_ent as number;
      calc.id_user = provid.sessao?.id_user as number;
      calc.perc_ant = provid.entidade?.perc_ant as number;
      calc.id_imovel = state.id_imovel as number;
      calc.tipo_imovel = state.tipo_imovel;
      calc.padrao = state.padrao;
      calc.area_terreno = state.area_terreno;
      calc.area_construida = state.area_construida;
      calc.valor_m2 = state.valor_m2;
      calc.desconto = state.desconto as any;
      calc.desconto_antec = provid.entidade?.desconto_antec as any;
      calc.tx1 = state.tx1
      calc.tx2 = state.tx2;
      calc.tx3 = state.tx3;
      calc.usu_cad = provid.sessao?.username as string;
      calc.data_alt = new Date().toLocaleString() + '';
      Api.put(`/calcImovel`, calc).then((res) => {
        setloadModal(false);
        Cancelar(res.data.id_imovel);
      }).catch(() => { setImoveis([]); });

    } else { toast.warn('Sem dados') }
  }

  const [total, setTotal] = useState({ soma: 0 });

  const formater$ = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const formater = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 });

  const getIPTU = async (rowIdLanc: any, tipoGuia: any) => {
    if (!rowIdLanc) {
      toast.warning('Selecione um Registro!');
    } else {
      setloadDiag(true); 
      Api.get(`/iptuId/${rowIdLanc}`).then((resp) => {
        if (!resp.data.result[0]) { toast.warning('Vazio');
          setMGuias(true);
          setLancmto(resp.data.result[0]);
          //setBanco(resp.data.result[0].banco_ativo[0]);
          setloadDiag(false);
          switch (tipoGuia) {
            case 1: return setModo('A');; break;
            case 2: return setModo('U');; break;
            case 3: return setModo('C');; break;
          }
        }else{ toast.warning('tem dados');
           switch (tipoGuia) {
            case 1: return setModo('A');; break;
            case 2: return setModo('U');; break;
            case 3: return setModo('C');; break;
          }
        }
      }).catch(() => { });
    }
  }
  const getDivida = async (rowIdLanc: any, tipoGuia: any) => {
    if (!rowIdLanc) {
      toast.warning('Selecione um Registro!');
    } else {
      setloadDiag(true); setMGuias2(true);
      Api.get(`/dividasId/${rowIdLanc}`).then((resp) => {
        if (resp) {
          setLancmto(resp.data.result[0]);
          //setBanco(resp.data.result[0].banco_ativo[0]);
          setloadDiag(false);
          switch (tipoGuia) {
            case 1: return setModo('DvT');; break;
            case 2: return setModo('DvE');; break;
          }
        }
      }).catch(() => { });
    }
  }
  function printIPTU() {
    //    var title = document.title;  
    var css2 = `  
    * {box-sizing: border-box;
    -moz-box-sizing: border-box;}
#container{ padding: 5mm; margin-top: 3px; width: 220mm; zoom: 90%;  background: rgb(203, 202, 202);overflow: hidden; border: #808080 solid 1px; }
.ent_print{ text-align: center; width: 100%;  line-height: 3px; overflow: hidden; padding: 3px;}
.ent_print  h3{color: #020917; font-size: 12pt; opacity: 0.8; }
.ent_print .ent_brasao {margin-top: 2px;  position: absolute; float: left; margin-left: -340px;}
.ent_print p{font-size: 9pt;}
.tableDAM{float: right; }
.tableDAM tr th{font-size: 8pt; text-transform: uppercase; padding: 4px; border: 1px solid;background-color: #d5d5d5}
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
.page #cancelado{ color: #ad0a0a; font-size: 52pt; position: absolute;
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
  body
{
  color:#000000;
  background-color:#ffffff;
  margin-top:0;
  margin-right:0;
}

*{margin:0px;padding:0px}
.subpageDAM table{border:0;border-collapse:collapse;padding:0}
.subpageDAM table tr td {padding: 3px; text-transform: uppercase;}
.subpageDAM table td {padding: 3px;}

img{border:0}

.cp
{
  font: bold 10px arial;
  color: black
}
.ti
{
  font: 9px arial, helvetica, sans-serif
}
.ld
{
  font: bold 14px arial;
  color: #000000
}
.ct,.ct1
{
  font: 9px "arial narrow";
  color: #000033
}
.cn
{
  font: 9px arial;
  color: black
}
.bc
{
  font: bold 22px arial;
  color: #000000
}

.cut{width:665px;height:1px;border-top:dashed 1px #000}
.Ac{text-align:center}
.Ar{text-align:right}
.Al{text-align:left}
.At{vertical-align:top}
.Ab{vertical-align:bottom}
.ct td, .cp td{padding-left:6px;border-left:solid 1px #000;border-right:solid 1px #000}
.ct1 td, .cp td{padding-left:6px;}
.cpN{font:bold 10px arial;color:black}
.ctN{font:9px "arial narrow";color:#000033}
.pL0{padding-left:0px}
.pL6{padding-left:6px;}
.pL10{padding-left:10px}
.imgLogo{width:140px;height:32px;}
.barra{width:2px;height:15px; border-left:solid 1px #000;}
.rBb td{border-bottom:solid 1px #000;}
.BB{border-bottom:solid 1px #000}
.BL{border-left:solid 1px #000}
.BR{border-right:solid 1px #000}
.BT1{border-top:dashed 1px #000}
.BT2{border-top:solid 2px #000}
.h1{height:1px}
.h13{height:13px;}
.h12{height:12px}
.h31{height:31px}
.h13 td{vertical-align:top}
.h12 td{vertical-align:top;}
.w6{width:6px}
.w7{width:7px;}
.w34{width:34px}
.w45{width:45px}
.w53{width:53px}
.w62{width:62px}
.w65{width:65px}
.w72{width:72px}
.w83{width:83px}
.w88{width:88px}
.w104{width:104px}
.w105{width:105px}
.w106{width:106px}
.w113{width:113px}
.w112{width:112px}
.w123{width:123px}
.w126{width:126px}
.w128{width:128px}
.w132{width:132px}
.w134{width:134px}
.w150{width:150px}
.w154{width:154px; border: solid 1px; }
.w155{width:160px}
.w163{width:163px}
.w164{width:164px}
.w180{width:180px}
.w182{width:182px}
.w186{width:186px}
.w192{width:192px}
.w250{width:250px}
.w298{width:298px}
.w409{width:409px}
.w472{width:472px}
.w478{width:478px}
.w500{width:500px}
.w544{width:544px}
.w564{width:564px}
.w659{width:659px}
.w666{width:19cm}
.w667{width:667px}
.w666 .BHead {border:solid 1px #000}
.BTable {vertical-align:top;border-left:solid 1px #000 }
.BTable .ct1 td {line-height: 5px;}
.BTable .ct1 td span {font-weight: bolder;}
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
    }, 50000);
  }

  var label_1 = <div id="label_form"><Image alt='preview' width={30} height={25} src='/imoveis.png' /> <span>Imoveis</span></div>;
  var label_2 = <div id="label_form"><Image alt='preview' width={35} height={28} src='/pasta.png' /> <span>Informações</span></div>;
  var label_3 = <div id="label_form"><Image alt='preview' width={35} height={28} src='/pasta.png' /> <span>Atualizações</span></div>;
  var label_4 = <div id="label_form" style={!rowId ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}} onClick={loadDividas}><Image alt='preview' width={35} height={28} src='/pasta.png' /> <span>Divida Ativa</span></div>;

  const incluir_div = () => {
    if (state.id_imovel) {
      setModalDiv(true);
    } else {
      toast.warn('Selecione um registro!');
      logout();
    }
  }
  const adDivida = () => {
    let exercicio = '';
    if (provid.entidade?.exercicio !== null) exercicio = provid.entidade?.exercicio as string;
    if (divida.exercicio >= exercicio) {
      toast.error('Exercício Inválido!..');
    } else {
      if (!divida.exercicio || !divida.valor_original) {
        toast.warn('Preencher, campos Obrigatórios!');
        // let cpValor = document.getElementById("rsValor");
        // let cpValor1 = document.getElementById("rsValor1");
        // if (!valor) { if (cpValor !== null) cpValor.style.cssText = 'color: brown'; }
        // if (!cod_rec) { if (cpValor1 !== null) cpValor1.style.cssText = 'color: brown'; }
      } else {
        divida.id_ent = provid.sessao?.id_ent as number;
        divida.id_imovel = state.id_imovel,
          divida.cod_pessoa = state.cod_pessoa,
          divida.id_pessoa = state.id_pessoa,
          divida.inscricao = state.inscricao,
          //divida.pago = 'N',
          // divida.nossonum = new Date().getFullYear() + ("000000" + state.cod_pessoa).slice(-6) + ("000000" + state.cod_imovel).slice(-6) + '3';
          // divida.sobjudice = 'N', 202400127100005903
          //divida.parcelado = 'N',
          divida.id_user = provid.sessao?.id_user as number;
        divida.usu_cad = provid.sessao?.username as string;
        divida.valor_original = divida.valor_original;
        divida.valor_juros = divida.valor_juros;
        divida.valor_multa = divida.valor_multa.toLocaleString().replace(".", "").replace(",", ".");
        divida.valor_corr = divida.valor_corr.toLocaleString().replace(".", "").replace(",", ".");
        Api.post(`/dividas`, divida).then((res) => {
          Editar(res.data.id_imovel);
          loadDividas();
          setTimeout(() => { somaTotal() }, 500);
          setKey('4');//seta a aba dividas
        }).catch(() => { });
      }
    }
  };
  const adDividaAuto = () => {
    if (state.valor_total as unknown === 0) {
      toast.warn('Valor IPTU Zerado!')
    } else {
    divida.id_ent = provid.sessao?.id_ent as number;
    divida.id_imovel = state.id_imovel,
      divida.cod_pessoa = state.cod_pessoa,
      divida.inscricao = state.inscricao,
      //  divida.pago = 'N',
      //    divida.sobjudice = 'N',
      //  divida.parcelado = 'N',
      divida.id_user = provid.sessao?.id_user as number;
    divida.usu_cad = provid.sessao?.username as string;
    divida.valor_original = state.valor_total as any;
    Api.post(`/dividasAuto`, divida).then((res) => {
      if (res) {
        Editar(res.data.id_imovel);
        loadDividas();
        setKey('4');//seta a aba dividas
      }
    }).catch(() => { });}
  };

  const calcDivida = () => {
    if (!rowId) {
      toast.warn('Selecione um registro!')
    } else {
      Api.put(`/calcDivida/${rowId}`).then((res) => {
        if (res) {
          Editar(res.data.id_imovel);
          loadDividas();
          setKey('4');//seta a aba dividas
        }
      }).catch((err) => { err });
    }
  };
  const descontoDivida = () => {
    if (!rowId) {
      toast.warn('Selecione um registro!')
    } else {
      Api.put(`/descontoDivida/${rowId}/${divida.aliq_desconto}`).then((res) => {
        if (res) {
          Editar(res.data.id_imovel);
          loadDividas();
          setKey('4');//seta a aba dividas
        }
      }).catch((err) => { err });
    }
  };

  const delDivida = () => {
    if (rowDva.pago === 'S') {
      toast.warning('Impossível Excluir: Divida Paga!')
    } else {
      if (!rowDva.id_div) {
        toast.warn('Selecione um registro!')
      } else {
        let iduser = provid.sessao?.id_user;
        Api.delete(`/delDivida/${iduser}/${rowDva.id_div}/${state.id_imovel}`).then((res) => {
          if (res) {
            Editar(res.data.id_imovel); toast.info(res.data.msg)
            loadDividas();
            setKey('4');//seta a aba dividas
          }
        }).catch((err) => { err });
      }
    }
  };

  const baixarIptu = () => {
    if (!state.id_imovel) {
      toast.warn('Selecione um registro!')
    } else {
      if (state.valor_total as unknown === 0) {
        toast.warn('Valor Invalido!')
      } else {
        if (state.data_pgmto === undefined) {
          toast.warn('Data Invalida!')
        } else {
        let iduser = provid.sessao?.id_user;
        let opcao = 'C';
        Api.put(`/baixarIPTU/${iduser}/${state.id_imovel}/${opcao}/${state.data_pgmto}`).then((res) => {
          if (res) {
            Editar(res.data.id_imovel);
            loadDividas();
            setKey('4');//seta a aba dividas
          }
        }).catch((err) => { err })}
      }

    }
  };
  //const [valorSelecionado, setValorSelecionado] = useState('');

  const tipo_imovel = [["Terreno", '1'], ["Predio", '2'], ["Comercio", '3'], ["Industria", '4'], ['Outros', '5']];
  const patrimonio_terr = [["Proprio", '1'], ["Foreiro", '2'], ["Religioso", '3'], ["Federal", '4'], ["Estadual", '5'], ["Municipal", '6'], ["Ocupado", '7'],
  ["Posse", '8'], ["Rendeiro", '9'], ["Financiado", '10'], ["Filantropico", '11'], ["Outros", '12']];
  const situacaoCad = [['1', "ATIVO"], ['2', 'INATIVO'], ['3', 'BAIXADO'], ['4', 'CANCELADO']];
  const isencao = [['1', "TRIBUTADO"], ['2', 'ISENTO'], ['3', 'MUNICIPAL'], ['4', 'ESTADUAL'], ['5', 'CASA POPULAR'], ['6', 'SERVIDOR'], ['7', 'VIÚVA'], ['8', 'OUTROS']];
  const situacao = [['1', "FRENTE"], ['2', 'FUNDO'], ['3', 'CASA VILA'], ['4', 'GALERIA'], ['5', 'SUBSOLO'], ['6', 'MEIO DE QUADRA'], ['7', 'OUTROS'], ['9', 'ENCRAVADO'], ['10', 'ESQUINA']];
  const posicao = [["1-Geminada", '1'], ["2-Conjugada", '2'], ["3-Isolada", '3'], ["4-Semi Isolada", '4']];
  const patrimonio_constru = [["1-Paricular", '1'], ["2-Federal", '2'], ["3-Estadual", '3'], ["4-Municipal", '4'], ["5-Religioso", '5'], ["6-Financiado", '6'], ["7-Ocupação", '7'], ["Outros", '8']];
  const elevacao = [["1-Alvenaria", '1'], ["2-Concreto", '2'], ["3-Taipa/Madeira", '3'], ["4-Alv/Concreto", '4'], ["5-Outros", '5']];
  const coberta = [["Laje", '1'], ["Telha Ceramica", '2'], ["Amianto", '3'], ["Telha Barro", '4'], ["Outros", '5'], ["Alvenaria", '6']];
  const conservacao = [["Bom", '1'], ["Regular", '2'], ["Ruim", '3'], ["Reforma/Vazio", '4'], ["Otimo", '5']];
  const padrao = [["1-Alto", '1'], ["2-Normal", '2'], ["3-Baixo", '3'], ["4-Muito Baixo", '4']];
  const pedologia = [["1-NORMAL/ARGILOSO", '1'], ["2-ARENOSO", '2'], ["3-ALAGADO", '3'], ["4-ROCHOSO", '4'], ["5-COMBINAÇÃO", '5'], ["6-INUNDAVEL", '6'], ["7-PANTANOSO", '7']];
  const sanitaria = [["Sem Instalações", '1'], ["Interna", '2'], ["Externa", '3'], ["Mais. Uma Interna", '4'], ["Interna/EXterna", '5']];
  const alinhamento = [["1-Alinhada", '1'], ["2-Recuada", '2']];
  const especie = [['0', 'INDEFINIDO'], ['1', 'COMERCIO E SERVIÇOS'], ['2', 'END. COMERCIAL'], ['3', 'INDUSTRIA'], ['4', 'TEMPLO'], ['5', 'GARAGEM'], ['6', 'PREDIO PUBLICO'],
  ['7', 'CONSTRUÇÃO'], ['8', 'ASSOCIAÇÃO'], ['10', 'INST. FINANCEIRA'], ['11', 'CASA RESIDENCIAL'], ['12', 'SERVIÇOS'], ['411', 'FABRICA/HOSPITAL/SUPERMERCADO'], ['971', 'TERRENO VAZIO'], ['999', 'OUTROS']];
  const uso_solo = [[0, 'INDEFINIDO'], [1, 'COMÉCIO E SERVIÇOS'], [2, 'EDIFÍCIO COMERCIAL'], [3, 'INDÚSTRIA'], [4, 'TEMPLO'], [5, 'GARAGEM'], [6, 'PRÉDIO PÚBLICO'], [7, 'CONSTRUÇÃO'], [8, 'ASSOCIAÇÃO'], [10, 'BANCO'], [11, 'CASA RESIDENCIAL'], [12, 'SERVIÇOS']
    , ['411', 'HOSPITAIS/CLÍNICAS'], ['971', 'TERRENO'], ['999', 'OUTROS']]
  const caracteristica = [['1', 'TACO'], ['2', 'ASS MADEIRA'], ['3', 'MARMORE'], ['4', 'MARMORITE'], ['5', 'CIMENTADO'], ['6', 'CERÂMICA'], ['7', 'LAD. HIDRÁULICO'], ['8', 'TERRA BATIDA/BARRO'], ['9', 'PLÁSTICO'], ['10', 'OUTROS'], ['11', 'CERÂMICA/CIMENTADO'], ['12', 'TACO/MADEIRA']]
  const topografia = [['1', 'PLANO'], ['2', 'ABAIXO DO NÍVEL'], ['3', 'ACIMA DO NÍVEL'], ['4', 'ACLIVE'], ['5', 'DECLIVE'], ['6', 'COMBINAÇÃO']]

  const maskInsc2 = (v: string) => {
    let cp1 = '/(\d{2})(\d)/';
    let cp2 = 3;
    let cp3 = 4;
    let cp4 = 3;

    v = v.replace(/\D/g, "")
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{cp2})(\d)/, "$1.$2")
    v = v.replace(/(\d{cp3})(\d)/, "$1.$2")
    v = v.replace(/(\d{cp4})(\d{1,2})$/, "$1.$2")

    return v
    //.replace(/(\d{3})\d+?$/, "$1")  
  }
  const apiRef = useGridApiRef();
  const [chekRows, setChekRows] = useState(false);
  const setChek = () => {
    chekRows === false ? setChekRows(true) : setChekRows(false)
  }
  const RowClick = (params: any) => {
    return setRowId(params.row.id_imovel)
  };
  const RowDbClick = (params: any) => {
    return Editar(params.row.id_imovel)
  };

  const CollClick = (params: any) => {
    switch (params.field) {
      case 'cod_lote': return setPesq(1); break;
      case 'nome_lote': return setPesq(2); break;
      case 'bairro_lote': return setPesq(3); break;
    }
    //  return alert(JSON.stringify(params.row.id_lote, null, 4));
  };
  const columns: GridColDef[] = [
    { field: 'cod_imovel', headerName: 'Codigo', width: 80, align: 'center' },
    { field: 'inscricao', headerName: 'Inscrição', width: 120 },
    { field: 'nome_pessoa', headerName: 'Nome', width: 250 },
    { field: 'cpf_cnpj', headerName: 'Cpf/Cnpj', width: 130 },
    { field: 'nome_log', headerName: 'Logradouro / Nº', width: 200 },
    { field: 'bairro_log', headerName: 'Bairro', width: 120 },
    { field: 'lote', headerName: 'Lote', width: 50 },
    { field: 'quadra', headerName: 'Quadra', width: 50 },
    {
      field: 'tipo_imovel', headerName: 'Tipo', width: 70,
      renderCell: (params) => {
        return (
          <div> {(() => {
            switch (params.row.tipo_imovel) {
              case 1: return 'Terreno';
              case 2: return 'Predial';
              case 3: return 'Comércio';
              case 4: return 'Industria';
              case 5: return 'Outros';
              default: return null;
            }
          })()}
          </div>
        )
      }
    },
    { field: 'valor_venal', headerName: 'Venal', width: 70, align: 'right' },
    { field: 'valor_total', headerName: 'Valor IPTU', width: 80, align: 'right' },
    {
      field: 'pago', headerName: 'Pago', width: 70, headerAlign: 'center', align: 'center',
      renderCell: (params) => {
        return (<p>{params.row.pago === 'S' ? <span id="badgeSuces">Sim</span> : <span id="badgeAlert">Não</span>}</p>)
      }
    },
    { field: 'divida_total', headerName: 'Divida Ativa', width: 80, align: 'right' },
    { field: 'area_construida', headerName: 'A.Construida.', width: 70, align: 'right' },
    { field: 'area_terreno', headerName: 'A.Terreno', width: 70, align: 'right' }];

  const EditarLog = (rowId: any) => {
    if (rowId) {
      setloadModal(true);
      setModo('cadLogradouros');
      Api.get(`/logradId/${rowId}`).then((res) => {
        if (res) {
          setState(res.data.result[0]);
          setloadModal(false);
        }
      });
    } else { toast.warn('Selecione um registro!') }
  }

  const SalvarLog = async (e: any) => {
    e.preventDefault()
    if (!state.nome_log || !state.bairro_log) {
      return validation()
    } else {
      setloadDiag(true);
      //state.data_cad = state.data_cad.format('YYYY-MM-DD')
      state.id_user = provid.sessao?.id_user as number;
      state.id_ent = provid.sessao?.id_ent as number;
      state.valor_m2 = state.valor_m2.toLocaleString().replace(".", "").replace(",", ".");
      state.usu_cad = provid.sessao?.nome as string;
      state.data_cad = new Date().toLocaleDateString('pt-br');
      if (!state.id_log) {
        Api.post(`/logradouro`, state).then((res) => {
          listarL();

          setModo('Logradouros');
          setloadDiag(false);
        }).catch(() => {
          setLograd([]);

        });
      } else {
        state.data_alt = new Date().toLocaleString() + '';
        //ClienteServices.update(state)
        Api.put(`/logradouro/`, state).then((res) => {
          if (res) {
            // setLograd([]); 
            FiltroLograds = []
            setloadDiag(false);
            setModo('Logradouros'); setPesqL(1); setBuscaL(`${state.cod_log}`);
          }
        }).catch(() => { setLograd([]) });
      }
    }
  }
  const SalvarPessoa = async (e: any) => { //aqui2
    e.preventDefault()
    if (!state.nome_pessoa) {
      return validation()
    } else {
      setloadDiag(true);
      //state.data_cad = state.data_cad.format('YYYY-MM-DD')
      state.tipocad = 'C';
      state.id_user = provid.sessao?.id_user as number;
      state.id_ent = provid.sessao?.id_ent as number;
      state.usu_cad = provid.sessao?.nome as string;
      state.data_cad = new Date().toLocaleDateString('pt-br');
      if (!state.id_pessoa) {
        Api.post(`/pessoa`, state).then((res) => {
          setModo('Pessoas');
          setloadDiag(false);
        }).catch(() => {
          setPessoas([]);

        });
      } else {
        state.data_alt = new Date().toLocaleString();
        Api.put(`/pessoa/`, state).then((res) => {
          if (res) {
            // setLograd([]); 
            FiltroLograds = []
            setloadDiag(false);
          }
        }).catch(() => { setLograd([]) });
      }
    }
  }

  const delLog = (rowId: any) => {
    setRowId(null);
    if (rowId) {
      let id_user = provid.sessao?.id_user;
      Api.delete(`/delLograd/${rowId}/${id_user}`).then((res) => {
        if (!res) { Editar(rowId); setPesq(1) }
      }).catch((err) => { err });
    } else {
      toast.warn('Selecione um registro!')
    }
  };

  const [pesq4, setPesq4] = useState(initPesq);

  const handlePesq = (e: any) => {
    pesq4.id_ent = provid.sessao?.id_ent as number;
    const { name, value } = e.target;
    setPesq4({ ...pesq4, [name]: value });
    debounce(() => {
      setloading(true);
      // if (!pesq4.text1) { pesq4.text1 = '*' }
      // if (!pesq4.text2) { pesq4.text2 = '*' };
      Api.post(`/imoveisPesq`, pesq4).then((response) => {
        if (response) {
          setloading(false);
          setImoveis(response.data)
        } else { setloading(false) }
      }).catch((err) => { if (err) { setImoveis([]); setloading(false); console.log('err', err) } });
    });
  }

  const handlePesq2 = (e: any) => {
    pesq4.id_ent = provid.sessao?.id_ent as number;
    const { name, value } = e.target;
    setPesq4({ ...pesq4, [name]: value });
    debounce(() => {
      setloadDiag(true);
      if (!pesq4.text1) { pesq4.text1 = '*' }
      if (!pesq4.text2) { pesq4.text2 = '*' };
      Api.post(`/pessoasPesq/`, pesq4).then((response) => {
        if (response) {
          setloadDiag(false);
          setPessoas(response.data)
        }
      }).catch((err) => { if (err) { setPessoas([]); setloadDiag(false); console.log('err', err) } });
    });
  }

  return (
    <> {provid.auth &&
      <div id="container_body">
        <div id="iPnl">
          <div id="iPnl1">
            <div id="btns">
              <div id="titulo1">
                <h5><Image alt='preview' width={30} height={30} src='/imoveis.png' /> Imoveis</h5>
              </div>
            </div>
            <div id="btns" className="col-md-3" style={{ overflow: 'hidden' }}>
              <div className="col-md-12">
                <label className="form-group me-4">Pesquisar por: </label>
                <select className="form-group col-md-7" name="campo" value={pesq4.campo} onChange={handlePesq}>
                  <option value='cod_imovel'>CODIGO</option>
                  <option value='inscricao'>INSCRIÇÃO</option>
                  <option value='nome_pessoa'>NOME</option>
                  <option value='cpf_cnpj'>CPF/CNPJ</option>
                  <option value='data_cad'>DATA</option>
                </select> <br />
                <div className="form-group col-md-12 mt-1 float-start">
                  {pesq4.campo === 'data_cad' ? <div>
                    <input type="date" className="form-group col-md-6 me-1 float-start" alt="Pesquisar" onChange={handlePesq} name="text1" value={pesq4.text1} />
                    <input type="date" className="form-group col-md-5 float-start" alt="Pesquisar" onChange={handlePesq} name="text2" value={pesq4.text2} />
                  </div> :
                    <input className="form-group col-md-9 float-start" alt="Pesquisar" name="text1" onChange={handlePesq} value={pesq4.text1} />}
                  <button id="btPesq" type="button" className="btn-outline-primary btn-sm float-start" onClick={handlePesq}><Image alt='preview' src='/lup.png' width={15} height={15} /></button>
                </div>
              </div>
            </div>
            {/* <div id="menu1">
              <div id="titulo1">
                <h5><Image alt='preview' width={30} height={25} src='/imoveis.png' /> Imoveis</h5>
              </div>
              <div className="form-group ms-4">
                {pesqPor === 1 && <div><h6>Pesquisar por Codigo</h6><input className="form-control" id="input6" type="text" onChange={pesquisar} placeholder="Codigo" /></div>}
                {pesqPor === 2 && <div><h6>Pesquisar por Inscrição</h6><input className="form-control" id="input6" type="text" onChange={pesquisar} placeholder="Inscrição" /></div>}
                {pesqPor === 3 && <div><h6>Pesquisar por Nome</h6><input className="form-control" id="input6" type="text" onChange={pesquisar} placeholder="Nome Proprietario" /></div>}
                {pesqPor === 4 && <div><h6>Pesquisar por CPF/CNPJ</h6><input id="input6" className="form-control" type="text" name="cpf_cnpj" onChange={pesquisar} value={maskCPFJ(state['cpf_cnpj'])} placeholder="00.000.000/0000-00" /></div>}
                {pesqPor === 5 && <div><h6>Pesquisar por Logradouro</h6><input className="form-control" id="input6" type="text" onChange={pesquisar} placeholder="Logradouro" /></div>}
                {pesqPor === 6 && <div><h6>Pesquisar por Bairro</h6><input className="form-control" id="input6" type="text" onChange={pesquisar} placeholder="Bairro" /></div>}
              </div>
            </div> */}

            <div id="btns">
              <ul className="pnl">
                <li onClick={Novo}><Link className='menu' href='#'><Image alt='preview' width={30} height={25} src='/new.png' /><p>Novo</p></Link></li>
                <li onClick={() => Editar(rowId)}><Link className='menu' href='#'><Image alt='preview' width={30} height={25} src='/lup.png' /><p>Alterar</p></Link></li>
                <li onClick={() => delImovel(rowId)}><Link className='menu' href='#'><Image alt='preview' width={30} height={25} src='/exc.png' /><p>Excluir</p></Link></li>
                <li onClick={handlePesq}><Link className='menu' href='#'><Image alt='preview' width={30} height={25} src='/atuali3.png' /><p>Atualizar</p></Link></li>
                <li>
                  <Link className='menu' href='#'><Image alt='preview' width={30} height={25} src='/usercfg.png' /><p>Úteis</p></Link>
                  <ul>
                    <li ><Image alt='preview' width={18} height={18} src='/calc5.png' /> <span>Calculos IPTU</span></li>
                    <li ><Image alt='preview' width={15} height={15} src='/calc.png' /> <span>Calcular Divida Ativa</span></li>
                  </ul>
                </li>
                <li>
                  <Link className='menu' href='#'><Image alt='preview' width={30} height={25} src='/xml.png' /><p>Dados</p></Link>
                  <ul>
                    <li><Image alt='preview' width={30} height={25} src='/lanc2.png' /> Exportar</li>
                  </ul>
                </li>
                <li>
                  <Link className='menu' href='#'><Image alt='preview' width={30} height={25} src='/print.png' /><p>Relatórios</p></Link>
                  <ul>
                    <li onClick={() => getIPTU(rowId, 1)}><Image alt='preview' width={15} height={15} src='/print.png' /> <span>Guia Antecipada</span></li>
                    <li onClick={() => getIPTU(rowId, 2)}><Image alt='preview' width={15} height={15} src='/print.png' /> <span>Guia Cota Unica</span></li>
                    <li onClick={() => getIPTU(rowId, 3)}><Image alt='preview' width={15} height={15} src='/print.png' /> <span>Guia Completa</span></li>
                    <li onClick={() => getDivida(rowId, 1)}><Image alt='preview' width={15} height={15} src='/print.png' /> <span>Divida Ativa (Total)</span></li>
                    <li style={{ opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' }}><Image alt='preview' width={15} height={15} src='/print.png' /> <span>Divida Ativa (Exercicios)</span></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Modal className="modal" size="xl" show={show} onHide={CloseModal} animation={false}>
          <Modal.Header closeButton id="modalHeader">
            <Image alt='preview' width={30} height={25} src='/logoe.png' title={`#${state.id_ent} ${state.id_imovel}`} /><p>Cadastro de Imoveis </p> {state.cod_imovel ? <p> | Codigo: {state.cod_imovel}</p> : ''}
          </Modal.Header>

          <Modal.Body id='modalBody'>

            <div id="btns">
              <button onClick={Novo} disabled={!rowId ? true : false} style={!rowId ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' width={30} height={25} src='/new.png' /><p>Novo</p></button>
              <button onClick={() => Alterar()} disabled={!rowId ? true : false} style={!rowId ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' width={30} height={25} src='/lup.png' /><p>Alterar</p></button>
              <button onClick={() => delImovel(rowId)} disabled={!rowId ? true : false} style={!rowId ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' width={30} height={25} src='/exc.png' /><p>Excluir</p></button>
              <button onClick={() => Cancelar(state.id_imovel)} disabled={rowId ? true : false} style={rowId ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' width={30} height={25} src='/voltar.png' /><p>Cancelar</p></button>
              <button onClick={e => Salvar(e)} disabled={rowId ? true : false} style={rowId ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' width={30} height={25} src='/slv.png' /><p>Salvar</p></button>
              <button onClick={CloseModal}><Image alt='preview' width={30} height={25} src='/x.png' /><p>Fechar</p></button>
            </div>
            {loadModal && (<div><LinearProgress variant="indeterminate" /></div>)}
            <Form className="form">
              <Tabs defaultActiveKey="1" activeKey={key} onSelect={(k: any) => setKey(k)} className="mb-3" >
                <Tab eventKey="1" title={label_1} disabled={rowId === 0 ? true : false} style={rowId === 0 ? { pointerEvents: 'none' } : {}}>
                  <div id="titulo">
                    <p>*Inscrição Cadastral/Localização da Propriedade</p>
                  </div>
                  <Row className="flex-row-reverse col-md-2 mb-2 float-end">
                    <div className="form-group">
                      <label style={{ color: '#153a64' }}>Situação Cadastral</label>
                      <select className="form-control" name="situacao" onChange={handleInput} value={state.situacao || ""}>
                        {situacaoCad.map(([val, text]) => (
                          <option key={val} value={val}>{text}</option>
                        ))}
                      </select>
                    </div>
                  </Row>

                  <Row className="flex-row-reverse col-md-2 mb-2 me-2 float-end">
                    <div className="form-group">
                      <label>Tipo Localização</label>
                      <select className="form-control" name="tipo_localizacao" onChange={handleInput} value={state.tipo_localizacao || ""}>
                        <option key={'U'} value={'U'}>URBANO</option>
                        <option value={'R'}>RURAL</option>
                      </select>
                    </div>
                  </Row>

                  <Row className="m-2 mb-2">
                    <div className="form-group col-md-3">
                      <label>Inscrição:<span id="rsInscricao" style={{ display: "none" }}> é Obrigatório</span>
                        <span id="rsInsc2" style={{ display: "none" }}> Já Cadastrada!</span></label>
                      <input type="text" className="form-control" name="inscricao" onChange={handleInput} disabled={provid.entidade?.insc_seq === 'S' ? true : false} maxLength={18}
                        value={maskInsc5(state.inscricao)} id={provid.entidade?.insc_seq === 'S' ? 'id_disabled' : ''}
                        style={state.inscricao === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                      <label id="rsInsc1" style={{ display: "none" }}>Deve ter 14 Digitos!</label>
                    </div>

                    <div className="form-group col-md-3">
                      <label>Inscrição Anterior:</label>
                      <input type="text" id="rsInputNome" className="form-control" name="inscricao_ant" onChange={handleInput} value={state.inscricao_ant} maxLength={18} />
                    </div>
                  </Row>

                  <hr />
                  <div id="titulo">
                    <p>*Localização da Propriedade</p>
                  </div>
                  <Row className="m-2 mt-2">
                    <input type="hidden" id="id_log" name="id_log" onChange={handleInput} value={state.id_log || ""} />
                    <input type="hidden" id="cod_log" name="cod_log" onChange={handleInput} value={state.cod_log || ""} />
                    <div className="form-group col-md-1">
                      <label>Cod Log</label>
                      <input type="text" className="form-control text-center" id="id_disabled" disabled name="cod_log" onChange={handleInput} value={state.cod_log || ""} />
                    </div>
                    <div className="form-group col-md-5">
                      <label>Nome Logradouro<span id="rsNome" style={{ display: "none" }}> é Obrigatório</span></label>
                      <InputGroup>
                        <Form.Control placeholder="Nome Rua" aria-label="Recipient's username" aria-describedby="basic-addon2"
                          name="nome_log" onChange={handleInput} value={state.nome_log || ""} onClick={ConsultaLog}
                          style={state.nome_log === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                        <Button variant="outline-secondary btn-sm" id="button-addon2" onClick={ConsultaLog}>
                          <Image alt='preview' src='/lup.png' width={20} height={18} />
                        </Button>
                      </InputGroup>
                    </div>
                    <div className="form-group col-md-1">
                      <label >Nº</label>
                      <input type="text" className="form-control" name="num_imovel" onChange={handleInput} value={state.num_imovel || ""} />
                    </div>
                    <div className="form-group col-md-3">
                      <label >Bairro</label>
                      <input type="text" className="form-control" id="id_disabled" disabled name="bairro_log" onChange={handleInput} value={state.bairro_log || ""} />
                    </div>
                    <div className="form-group col-md-2">
                      <label >Cidade</label>
                      <input type="text" className="form-control" id="id_disabled" disabled name="cidade_log" onChange={handleInput} value={state.cidade_log || ""} />
                    </div>
                  </Row>

                  <Row className="m-2 mb-2 mt-3">
                    <div className="form-group col-md-3">
                      <label>Nome Loteamento<span id="rsNome" style={{ display: "none" }}> é Obrigatório</span></label>
                      <InputGroup>
                        <Form.Control placeholder="Nome Loteamento" aria-label="Recipient's username" aria-describedby="basic-addon2"
                          name="nome_lote" onChange={handleInput} value={state.nome_lote || ""} onClick={ConsultaLot} />
                        <Button variant="outline-secondary btn-sm" id="button-addon2" onClick={ConsultaLot}>
                          ... <Image alt='preview' src='/lup.png' width={20} height={18} />
                        </Button>
                      </InputGroup> </div>
                    <div className="form-group col-md-2">
                      <label >CEP</label>
                      <input type="text" className="form-control" id="id_disabled" disabled name="cep_log" onChange={handleInput} value={state.cep_log} />
                    </div>
                    <div className="form-group col-md-1">
                      <label>Lote</label>
                      <input type="text" className="form-control" name="lote" onChange={handleInput} value={state.lote} placeholder="Lote" />
                    </div>
                    <div className="form-group col-md-1">
                      <label>Quadra</label>
                      <input type="text" className="form-control" name="quadra" onChange={handleInput} value={state.quadra} placeholder="Quadra" />
                    </div>
                    <div className="form-group col-md-4">
                      <label >Complemento</label>
                      <input type="text" className="form-control" name="complemento" onChange={handleInput} value={state.complemento || ""} placeholder="Complemento" />
                    </div>
                    <div className="form-group col-md-1">
                      <label >Face</label>
                      <input type="text" className="form-control" name="face" onChange={handleInput} value={state.face || ""} placeholder="Face" />
                    </div>
                  </Row>
                  <div id="titulo" className="mt-4">
                    <p>*Identificação do Proprietário</p>
                  </div>
                  <Row className="m-2 mb-2">
                    <div className="form-group col-md-8">
                      <label>Nome Proprietário<span id="rsNome2" style={{ display: "none" }}> é Obrigatório</span></label>
                      <InputGroup>
                        <Form.Control placeholder="Nome Proprietário" aria-label="Recipient's username" aria-describedby="basic-addon2"
                          name="nome_pessoa" onChange={handleInput} onClick={pessoaProp} value={state.nome_pessoa || ""}
                          style={state.nome_pessoa === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                        <Button variant="outline-secondary btn-sm" id="button-addon2" onClick={pessoaProp}>
                          <Image alt='preview' src='/lup.png' width={20} height={18} />
                        </Button>
                      </InputGroup>
                    </div>
                    <div className="form-group col-md-3">
                      <label >CPF/CNPJ</label>
                      <input type="text" className="form-control" id="id_disabled" disabled name="cpf_cnpj" onChange={handleInput} value={state.cpf_cnpj || ""} />
                    </div>
                  </Row>
                  <hr />

                  <Row className="m-2 mt-2">
                    <input type="hidden" id="id_log" name="id_log" onChange={handleInput} value={state.id_log || ""} />
                    <input type="hidden" id="cod_log" name="cod_log" onChange={handleInput} value={state.cod_log || ""} />
                    <div className="form-group col-md-4">
                      <label>Rua</label>
                      <input type="text" className="form-control" id="id_disabled" disabled name="rua" onChange={handleInput} value={state.rua || ""} placeholder="Rua proriétario" />
                    </div>

                    <div className="form-group col-md-1">
                      <label>Nº</label>
                      <input type="text" className="form-control" id="id_disabled" disabled name="numero" onChange={handleInput} value={state.numero || ""} />
                    </div>
                    <div className="form-group col-md-3">
                      <label>Bairro</label>
                      <input type="text" className="form-control" id="id_disabled" disabled name="bairro" onChange={handleInput} value={state.bairro || ""} />
                    </div>
                  </Row>
                  <Row className="m-2 mb-2">
                    <div className="form-group col-md-3">
                      <label>Cidade</label>
                      <input type="text" className="form-control" id="id_disabled" disabled name="cidade" onChange={handleInput} value={state.cidade || ""} />
                    </div>

                    <div className="form-group col-md-1">
                      <label>UF</label>
                      <input type="text" className="form-control" id="id_disabled" disabled name="uf" onChange={handleInput} value={state.uf || ""} />
                    </div>
                    <div className="form-group col-md-2">
                      <label >CEP</label>
                      <input type="text" className="form-control" id="id_disabled" disabled name="cep" onChange={handleInput} value={state.cep} />
                    </div>
                  </Row>

                  <div id="titulo" className="mt-4">
                    <p>*Resposavel/Ocupante/Locatário</p>
                  </div>
                  <Row className="m-2 mb-2">
                    <div className="form-group col-md-8">
                      <label>Nome Resposavel</label>
                      <InputGroup>
                        <Form.Control placeholder="Nome Proprietário" aria-label="Recipient's username" aria-describedby="basic-addon2"
                          name="nome_resp" onChange={handleInput} onClick={pessoaResp} value={state.nome_resp || ""} />
                        <Button variant="outline-secondary btn-sm" id="button-addon2" onClick={pessoaResp}>
                          <Image alt='preview' src='/lup.png' width={20} height={18} />
                        </Button>
                      </InputGroup>
                    </div>
                    <div className="form-group col-md-3">
                      <label >CPF/CNPJ</label>
                      <input type="text" className="form-control" id="id_disabled" disabled name="cpf_cnpj_resp" onChange={handleInput} value={state.cpf_cnpj_resp || ""} />
                    </div>
                  </Row>
                  <hr />

                </Tab> {/*<<<< Fim de aba tab Imoveis >>>>*/}

                <Tab eventKey="2" title={label_2}
                /*disabled={!rowId ? true : false} style={!rowId ? { pointerEvents: 'none'} : {}} */
                >

                  <Row className="mb-2">
                    <div className="radiosTipo">
                      <label id="titleR">Tipo Imovel</label>
                      {tipo_imovel.map(([text, val]) => (
                        <label key={val} className="container">
                          <input type="radio" id='tipo_imovel' name="tipo_imovel"
                            key={val} value={val}
                            checked={val === state.tipo_imovel.toString()}
                            onChange={handleInput} />
                          {val}-{text}</label>
                      ))}
                    </div>
                    <div className="form-group situacao form-group col-md-6 mb-2">
                      <label id="titleR">Situação</label>
                      <select className="form-control" name="situacao" onChange={handleInput} value={state.situacao || ''}>
                        {situacao.map(([val, text]) => (
                          <option key={val} value={val}>{text}</option>
                        ))}
                      </select>

                      <label id="titleR" className="mt-3">Isenção</label>
                      <select className="form-control" name="isencao" onChange={handleInput} value={state.isencao || ""}>
                        {isencao.map(([val, text]) => (
                          <option key={val} value={val}>{text}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group mb-2 col-md-6 radiosPatri">
                      <label id="titleR">Patrimonio do Terreno</label>
                      <div>
                        {patrimonio_terr.map(([text, val]) => (
                          <label key={val} className="container">
                            <input
                              type="radio" name="patrimonio_terr"
                              key={val} value={val}
                              checked={val === state.patrimonio_terr.toString()}
                              onChange={handleInput} />
                            {val}-{text}</label>

                        ))}
                      </div>
                    </div>
                    <div className="form-group mb-2 col-md-2 radiosTipo2">
                      <label id="titleR">Posição</label>
                      <div>
                        {posicao.map(([text, val]) => (
                          <label key={text} className="container">
                            <input type="radio" name="posicao"
                              key={text} value={val} checked={state.posicao.toString() === val}
                              onChange={handleInput} />
                            {text}</label>
                        ))}
                      </div>
                    </div>
                  </Row>

                  <Row className="mb-2">
                    <div className="form-group col-md-4 mb-2">
                      <label id="titleR">Uso Solo</label>
                      <select className="form-control" name="uso_solo" onChange={handleInput} value={state.uso_solo || ""}>
                        <option></option>
                        {uso_solo.map(([val, text]) => (
                          <option key={val} value={val}>{text}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-md-2 mb-2">
                      <label id="titleR">Coleta</label>
                      <select className="form-control" name="coleta" onChange={handleInput} value={state.coleta || ""}>
                        <option></option>
                        <option value="1">SEM COLETA</option>
                        <option value="2">TAXA BASE</option>
                        <option value="3">COLETA REGULAR</option>
                      </select>
                    </div>

                    <div className="form-group col-md-2 mb-2">
                      <label id="titleR">Coletor</label>
                      <select className="form-control" name="coletor" onChange={handleInput} value={state.coletor || ""}>
                        <option></option>
                        <option value="1">SEM COLETA</option>
                        <option value="2">TAXA BASE</option>
                      </select>
                    </div>
                    <div className="form-group col-md-3">
                      <label id="titleR">Pedologia</label>
                      <select className="form-control" name="pedologia" onChange={handleInput} value={state.pedologia || ""}>
                        <option></option>
                        {pedologia.map(([text, val]) => (
                          <option key={val} value={val}>{text}</option>
                        ))}
                      </select>
                    </div>
                  </Row>
                  <hr />
                  <Row className="mb-4">
                    <div className="form-group servUrb mb-2 col-md-4">
                      <label id="titleR">Patrimonio da Construção</label>
                      <div className="box1">
                        {patrimonio_constru.map(([text, val]) => (
                          <label key={text} className="container">
                            <input type="radio" name="patrimonio_constru"
                              key={text} value={val} checked={state.patrimonio_constru.toString() === val ? true : false}
                              onChange={handleInput} />
                            {text}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group col-md-2 mb-2 radiosTipo2">
                      <label id="titleR">Elevação</label>
                      <div>
                        {elevacao.map(([text, val]) => (
                          <label key={text} className="container">
                            <input type="radio" name="elevacao"
                              key={text} value={val} checked={state.elevacao.toString() === val}
                              onChange={handleInput} />
                            {text}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group col-md-2 mb-2 radiosTipo2">
                      <label id="titleR">Coberta</label>
                      <div>
                        {coberta.map(([text, val]) => (
                          <label key={text} className="container">
                            <input type="radio" name="coberta"
                              key={text} value={val} checked={state.coberta.toString() === val}
                              onChange={handleInput} />
                            {text}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-group col-md-2 mb-2 radiosTipo2">
                      <label id="titleR">Conservação</label>
                      <div>
                        {conservacao.map(([text, val]) => (
                          <label key={text} className="container">
                            <input type="radio" name="conservacao"
                              key={text} value={val} checked={state.conservacao.toString() === val}
                              onChange={handleInput} />
                            {val}-{text}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-group col-md-2 radiosTipo2">
                      <label id="titleR">Padrão</label>
                      <div>
                        {padrao.map(([text, val]) => (
                          <label key={text} className="container">
                            <input type="radio" name="padrao"
                              key={text} value={val} checked={val === state.padrao.toString()}
                              onChange={handleInput} />
                            {text}
                          </label>
                        ))}
                      </div>
                    </div>

                  </Row>
                  <hr />
                  <Row className="mb-2">
                    <div className="form-group mb-2 col-md-6">
                      <label id="titleR">Espécie</label>
                      <select className="form-control" name="especie" onChange={handleInput} value={state.especie || ""}>
                        <option></option>
                        {especie.map(([val, text]) => (
                          <option key={val} value={val}>{text}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group mb-2 col-md-4">
                      <label id="titleR">Caracteristica da Construção/Piso</label>
                      <select className="form-control" name="construcao_piso" onChange={handleInput} value={state.construcao_piso || ""}>
                        <option></option>
                        {caracteristica.map(([val, text]) => (
                          <option key={val} value={val}>{text}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group mb-2 col-md-2">
                      <label id="titleR">Topografica</label>
                      <select className="form-control" name="topografia" onChange={handleInput} value={state.topografia || ""}>
                        <option></option>
                        {topografia.map(([val, text]) => (
                          <option key={val} value={val}>{text}</option>
                        ))}

                      </select>
                    </div>
                  </Row>
                  <Row>
                    <div className="form-group servUrb mb-2 col-md-4">
                      <label id="titleR">Serviços Urbanos</label>
                      <div className="box1">

                        <label className="container">Água
                          <input type="checkbox" name="serv_agua" checked={state.serv_agua === 1 ? Checked1 === false : Checked1 === true} value={Checked1 ? 0 : 1} onChange={handChange1} /></label>
                        <label className="container">Iluminação
                          <input type="checkbox" name="serv_ilumin" checked={state.serv_ilumin === 1 ? Checked2 === false : Checked2 === true} value={Checked2 ? 0 : 1} onChange={handChange2} /></label>
                        <label className="container">Pavimentação
                          <input type="checkbox" name="serv_pavimen" checked={state.serv_pavimen === 1 ? Checked3 === false : Checked3 === true} value={Checked3 ? '0' : '1'} onChange={handChange3} /></label>
                        <label className="container">Rede Energia
                          <input type="checkbox" name="serv_energ" checked={state.serv_energ === 1 ? Checked4 === false : Checked4 === true} value={Checked4 ? '1' : '0'} onChange={handChange4} /></label>
                        <label className="container">Esg.Sanitário
                          <input type="checkbox" name="serv_esgoto" checked={state.serv_esgoto === 1 ? Checked5 === false : Checked5 === true} value={Checked5 ? '1' : '0'} onChange={handChange5} /></label>
                        <label className="container">Gal. Pluvial
                          <input type="checkbox" name="serv_galeria" checked={state.serv_galeria === 1 ? Checked6 === false : Checked6 === true} value={Checked6 ? 1 : 0} onChange={handChange6} /></label>
                        <label className="container">Coleta Lixo
                          <input type="checkbox" name="serv_lixo" checked={state.serv_lixo === 1 ? Checked7 === false : Checked7 === true} value={Checked7 ? 1 : 0} onChange={handChange7} /></label>
                        <label className="container">Canal
                          <input type="checkbox" name="serv_canal" checked={state.serv_canal === 1 ? Checked8 === false : Checked8 === true} value={Checked8 ? 1 : 0} onChange={handChange8} /></label>
                      </div>
                    </div>

                    <div className="form-group radiosIlumin servUrb mb-2 col-md-4">
                      <label id="titleR">Iluminação Lote</label>
                      <div>
                        <div className="box1">
                          <label className="container">Alagado
                            <input type="checkbox" name="limit_alagado" value={Checked10 ? '0' : '1'} checked={state.limit_alagado === 1 ? Checked10 === false : Checked10 === true} onChange={handChange10} /></label>
                          <label className="container">Sem Calçamento
                            <input type="checkbox" name="limit_scalc" value={Checked11 ? '0' : '1'} checked={state.limit_scalc === 1 ? Checked11 === false : Checked11 === true} onChange={handChange11} /></label>
                          <label className="container">Acidentado
                            <input type="checkbox" name="limit_acident" value={Checked12 ? '0' : '1'} checked={state.limit_acident === 1 ? Checked12 === false : Checked12 === true} onChange={handChange12} /></label>
                          <label className="container">Encravado
                            <input type="checkbox" name="limit_encrav" value={Checked13 ? '0' : '1'} checked={state.limit_encrav === 1 ? Checked13 === false : Checked13 === true} onChange={handChange13} /></label>
                          <label className="container">Sem Muro
                            <input type="checkbox" name="limit_smuro" value={Checked14 ? '0' : '1'} checked={state.limit_smuro === 1 ? Checked14 === false : Checked14 === true} onChange={handChange14} /></label>
                        </div>
                      </div></div>

                    <div className="form-group radiosTipo2 mb-2 col-md-2">
                      <label id="titleR">!Instalação Sanitária</label>
                      <div>
                        {sanitaria.map(([text, val]) => (
                          <label key={val} className="container">
                            <input type="radio" name="sanitaria"
                              key={val} value={val}
                              checked={state.sanitaria.toString() === val}
                              onChange={handleInput} />
                            {text}</label>
                        ))}
                      </div>
                    </div>
                    <div className="radiosTipo2 form-group mt-2 col-md-2">
                      <label id="titleR">!Alinhamento</label>
                      <div>
                        {alinhamento.map(([text, val]) => (
                          <label key={val} className="container">
                            <input type="radio" name="alinhamento"
                              key={val} value={val}
                              checked={state.alinhamento.toString() === val}
                              onChange={handleInput} />
                            {text}</label>
                        ))}
                      </div>
                    </div>
                  </Row>
                </Tab>

                <Tab eventKey="3" title={label_3} >
                  <label id="titulo">Medições M2</label>
                  <Row className="m-2 mb-4" id='inputsValor'>

                    <div className="form-group col-md-2">
                      <label>Área do Terreno</label>
                      <div className="form-group ">
                        <input type="text" className="form-control" name="area_terreno" onChange={handleInput} value={currencyBRL(state['area_terreno'] || '')} placeholder="0" />
                      </div>
                    </div>
                    <div className="form-group col-md-2">
                      <label>Profundidade</label>
                      <div className="form-group ">
                        <input type="text" className="form-control" name="profund" onChange={handleInput} value={currencyBRL(state['profund'] || '')} placeholder="0" />
                      </div>
                    </div>
                    <div className="form-group col-md-2">
                      <label>Área Construída</label>
                      <div className="form-group ">
                        <input type="text" className="form-control" name="area_construida" onChange={handleInput} value={currencyBRL(state['area_construida'] || '')} placeholder="0" />
                      </div>
                    </div>
                    <div className="form-group col-md-1">
                      <label>Nº Frente</label>
                      <div className="form-group ">
                        <input type="number" className="form-control" name="num_frente" onChange={handleInput} value={currencyBRL(state['num_frente'] || '')} placeholder="0" />
                      </div>
                    </div>
                    <div className="form-group col-md-1">
                      <label>Nº.Unidade</label>
                      <div className="form-group ">
                        <input type="number" className="form-control" name="num_unid" onChange={handleInput} value={state.num_unid} placeholder="0" />
                      </div>
                    </div>
                    <div className="form-group col-md-1">
                      <label>Nº.Pavimen</label>
                      <div className="form-group ">
                        <input type="number" className="form-control" name="num_pav" onChange={handleInput} value={state.num_pav} placeholder="0" />
                      </div>
                    </div>

                  </Row>
                  <Row className="m-2 mb-4" id='inputsValor'>
                    <div className="form-group col-md-2">
                      <label>Testada Real</label>
                      <div className="form-group ">
                        <input type="text" className="form-control" name="testada_r" onChange={handleInput} value={currencyBRL(state['testada_r'] || '')} placeholder="0" />
                      </div>
                    </div>
                    <div className="form-group col-md-2">
                      <label>Testada Ficticia</label>
                      <div className="form-group ">
                        <input type="text" className="form-control" name="testada_f" onChange={handleInput} value={currencyBRL(state['testada_f'] || '')} placeholder="0" />
                      </div>
                    </div>
                    <div className="form-group col-md-2">
                      <label>Lateral esquerda</label>
                      <div className="form-group ">
                        <input type="text" className="form-control" name="lateral_esq" onChange={handleInput} value={currencyBRL(state['lateral_esq'] || '')} placeholder="0" />
                      </div>
                    </div>
                    <div className="form-group col-md-2">
                      <label>Lateral Direita</label>
                      <div className="form-group ">
                        <input type="text" className="form-control" name="lateral_dir" onChange={handleInput} value={currencyBRL(state['lateral_dir'] || '')} placeholder="0" />
                      </div>
                    </div>
                    <div className="form-group col-md-1">
                      <label>Fundos</label>
                      <div className="form-group ">
                        <input type="text" className="form-control" name="m_fundos" onChange={handleInput} value={currencyBRL(state['m_fundos'] || '')} placeholder="0" />
                      </div>
                    </div>
                  </Row>

                  {state.id_imovel > 0 &&
                    <div>
                      <label id="titulo">Valores IPTU / Taxas</label>
                      <Row className="m-2 mb-4" id='inputsValor'>
                        <div className="form-group col-md-2">
                          <label>Valor M2 (Rua)</label>
                          <div className="form-group ">
                            <input type="text" className="form-control" name="valor_m2" onChange={handleInput} value={currencyBRL(state['valor_m2'] || 0)} placeholder="0" />
                          </div>
                        </div>
                        <div className="form-group col-md-2">
                          <label>Valor Unitário (R$)</label>
                          <div className="form-group ">
                            <input type="text" className="form-control" id="id_disabled" disabled name="valor_unitario" onChange={handleInput} value={currencyBRL(state['valor_unitario'] || '')} placeholder="0" />
                          </div>
                        </div>
                        <div className="form-group col-md-1">
                          <label>V.log (R$)</label>
                          <div className="form-group ">
                            <input type="text" className="form-control" id="id_disabled" disabled name="valor_vlog" onChange={handleInput} value={currencyBRL(state['valor_vlog'] || '')} placeholder="0" />
                          </div>
                        </div>
                        <div className="form-group col-md-2">
                          <label>Valor Venal</label>
                          <div className="form-group ">
                            <input type="text" className="form-control" id="id_disabled" disabled name="valor_venal" onChange={handleInput} value={currencyBRL(state['valor_venal'] || '')} placeholder="0" />
                          </div>
                        </div>
                        <div className="form-group col-md-2">
                          <label>Venal Informado</label>
                          <div className="form-group ">
                            <input type="text" className="form-control" name="venal_inf" disabled={provid.entidade?.vvi === 'S' ? false : true} onChange={handleInput} value={currencyBRL(state['venal_inf'] || '')} placeholder="0" />
                          </div>
                        </div>
                        <div className="form-group col-md-1">
                          <label>Aliq (%)</label>
                          <input type="text" className="form-control" id="id_disabled" disabled name="aliquota" onChange={handleInput} value={currencyBRL(state['aliquota'] || '')} placeholder="0" />
                        </div>
                        <div className="form-group col-md-2">
                          <label>Valor IPTU (R$)</label>
                          <input type="text" className="form-control" id="id_disabled" disabled name="valor_iptu" onChange={handleInput} value={currencyBRL(state['valor_iptu'] || '')} placeholder="0" />
                        </div>

                      </Row>

                      <Row className="m-2 mb-0" id='inputsValor'>
                        <div className="form-group col-md-2">
                          <label>{provid.entidade?.campo4_nome} (R$)</label>
                          <input type="text" className="form-control" name="tx1" id="id_disabled" disabled onChange={handleInput} value={currencyBRL(state['tx1'] || '')} placeholder="0" />
                        </div>
                        <div className="form-group col-md-2">
                          <label>{provid.entidade?.campo5_nome} (R$)</label>
                          <input type="text" className="form-control" name="tx2" id="id_disabled" disabled onChange={handleInput} value={currencyBRL(state['tx2'] || '')} placeholder="0" />
                        </div>
                        <div className="form-group col-md-2">
                          <label>{provid.entidade?.campo6_nome} (R$)</label>
                          <input type="text" className="form-control" name="tx3" id="id_disabled" disabled onChange={handleInput} value={currencyBRL(state['tx3'] || '')} placeholder="0" />
                        </div>

                        <div className="form-group col-md-2">
                          <label>Desconto</label>
                          <div className="form-group ">
                            <input type="text" className="form-control" disabled={provid.entidade?.desconto_iptu === 'S' ? false : true} name="desconto" onChange={handleInput} value={currencyBRL(state['desconto'] || '')} placeholder="0" />
                          </div>
                        </div>

                        <div className="form-group col-md-2">
                          <label>Valor Total (R$)</label>
                          <input type="text" className="form-control" id="id_disabled" disabled name="valor_total" onChange={handleInput} value={currencyBRL(state['valor_total'] || '')} placeholder="0" />
                        </div>
                      </Row>
                    </div>}
                  <hr />

                  <label id="titulo">Observações</label>
                  <Row className="form-group m-2 mb-0">

                    <div className="form-group ">
                      <textarea className="form-control my_textarea" name="obs" onChange={handleInput} value={state.obs || ''} rows={5}></textarea>
                    </div>
                  </Row>
                </Tab> {/*<<<< Fim de aba tab Lancamentos>>>>*/}

                <Tab eventKey="4" title={label_4} disabled={rowId ? false : true}>
                  <div id="titulo">
                    <p>IPTU</p>
                  </div>
                  <Row className="ms-2 col-md-12" id='inputsValor' style={{ border: 'solid 1px #898888', borderRadius: '3px', margin: '2px', padding: '3px' }}>
                    <div className="form-group col-md-2 float-start" style={{ border: 'solid 1px #898888', borderRadius: '3px', margin: '2px', padding: '5px' }}>
                      <label id="titleR">Situação IPTU {provid.entidade?.exercicio}</label>
                      {state.pago === 'S' ?
                        <div className="form-group text-center"><Image alt='preview' src='/p8.png' width={25} height={25} />&nbsp;<label>Pago</label> </div>
                        : <div className="form-group text-center"><Image alt='preview' src='/p9.png' width={25} height={25} />&nbsp;<label>Não Pago</label></div>}
                    </div>
                    <div className="form-group col-md-2 float-start" style={{ border: 'solid 1px #898888', borderRadius: '3px', margin: '2px', padding: '5px' }}>
                      <label id="titleR">Opções Pagamento{state.tipo_pgmto}</label>
                      <div className="form-group ">
                        <select className="form-control" name="tipo_pgmto" onChange={handleInput} value={state.tipo_pgmto || ""}>
                          <option value='1'>Cota Unica</option>
                          <option value='2'>Antecipada</option>

                        </select>
                      </div>
                    </div>
                    <div className="form-group col-md-2" style={{ border: 'solid 1px #898888', borderRadius: '3px', margin: '2px', padding: '5px' }}>
                      <div className="form-group">
                        <label id="titleR">Total IPTU:</label>
                        <input type="text" id="id_disabled" disabled className="form-control" name="valor_total" onChange={handleInput}
                          value={state.tipo_pgmto === '1' ? currencyBRL(state['valor_total'] || '') : currencyBRL(state['valor_iptu'] || '')} placeholder="0,00" />
                      </div>
                    </div>
                    <div className="form-group col-md-2 float-start" style={{ border: 'solid 1px #898888', borderRadius: '3px', margin: '2px', padding: '5px' }}>
                      <label id="titleR">Data de Pagamento</label>
                      <div className="form-group ">
                        <input type="date" className="form-control" name="data_pgmto" onChange={handleInput} value={state.data_pgmto} placeholder="0" />
                      </div>
                    </div>

                    <div id="btns3" className="form-group" style={{ border: 'solid 1px #898888', borderRadius: '3px', margin: '2px', padding: '5px' }}>
                   {state.pago === 'N' ?
                        <div className="pnl2" title="Baixar IPTU" onClick={baixarIptu}>
                          <Image alt='preview' src='/p8.png' width={25} height={25} />
                          <p> Baixar IPTU</p>
                        </div> :
                        <div className="pnl2" title="Estornar IPTU" onClick={baixarIptu}>
                          <Image alt='preview' src='/remov1.png' width={25} height={25} />
                          <p> Estornar IPTU</p>
                        </div>
                      }
                    </div>

                    <div className="form-group col-md-2" style={{ border: 'solid 1px #898888', borderRadius: '3px', margin: '2px', padding: '5px' }}>
                      <div className="form-group">
                        <label id="titleR">Divida Ativa Total:</label>
                        <input type="text" id="id_disabled" disabled className="vltotal form-control" name="vltotal" onChange={handleInput}
                          value={formater$.format(somaDv.vltotal || 0)} placeholder="0,00" />
                      </div>
                    </div>
                  </Row>
                  <hr />
                  <div id="titulo">
                    <p>Divida Ativa</p>
                  </div>
                  <div className="tablepesq3">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th className="col_a" style={{ cursor: 'pointer', textAlign: 'center' }}>Exercicio</th>
                          <th className="col_d">Valor</th>
                          <th className="col_d">Juros</th>
                          <th className="col_d">Multa</th>
                          <th className="col_d">Correção</th>
                          <th className="col_d">desconto</th>
                          <th className="col_d">Valor Total</th>
                          <th className="col_a text-center">Judice</th>
                          <th className="col_a text-center">Parc</th>
                          <th className="col_a text-center">Pago</th>
                          <th className="col_a">Id</th>
                        </tr>
                      </thead>
                      <TableBody>
                        {loading && (
                          <tr>
                            <TableCell colSpan={6}>
                              <LinearProgress variant="indeterminate" />
                            </TableCell>
                          </tr>
                        )}
                      </TableBody>
                      <tbody>
                        {dividas?.map((item: any) => {
                          return (
                            <tr key={item.id_divida} id={`${[item.id_divida, item.pago]}`} onClick={RowClickedDv} className={rowDva.id_div == item.id_divida ? "bgactive" : ""}>
                              <td className="text-center">{item.exercicio}</td>
                              <td className="text-end">{currencyBRL(item.valor_original || 0)}</td>
                              <td className="text-end" style={{ color: 'brown' }}>{currencyBRL(item.valor_juros || 0)}</td>
                              <td className="text-end" style={{ color: 'brown' }}>{currencyBRL(item.valor_multa || 0)}</td>
                              <td className="text-end" style={{ color: 'brown' }}>{currencyBRL(item.valor_corr || 0)}</td>
                              <td className="text-end" style={{ color: '#0a457f' }}>{currencyBRL(item.desconto || 0)}</td>
                              <td className="vlrec text-end">{currencyBRL(item.valor_total || 0)}</td>
                              <td className="col_a text-center">{item.sobjudice}</td>
                              <td className="col_a text-center">{item.parcelado}</td>
                              <td className="text-center">{item.pago === 'S' ? <span id="badgeSuces">Sim</span> : <span id="badgeAlert">Não</span>}</td>
                              <td className="text-center">{item.id_divida}</td>
                            </tr>
                          )
                        })} </tbody>
                    </Table>

                  </div>
                  <hr />

                  <div className="form-group">
                    <div id="btns2">
                      <div className="pnl2" title="Incluir um novo DAM" onClick={incluir_div}>
                        <Image alt='preview' src='/add.png' width={31} height={32} />
                        <p> Incluir Divida</p>
                      </div>
                      <div className="pnl2" title="Incluir um novo DAM" onClick={delDivida}>
                        <Image alt='preview' src='/remov.png' width={31} height={32} />
                        <p> Excluir Divida</p>
                      </div>
                      <div className="pnl2 float-start" title="Caclcular Juros/Multa/Correção" onClick={calcDivida}>
                         <Image alt='preview' src='/calc.png' width={31} height={32} />
                        <p>Calc Encargos</p>
                      </div>
                      <div className="form-group col-md-1 float-start ms-2">
                        <input type="text" className="form-control text-end" name="aliq_desconto" onChange={handleInputDv} value={currencyBRL(divida['aliq_desconto'] || '')} placeholder="0" />
                      </div>
                      <div className="pnl2 float-start" title="Caclcular Desconto %" onClick={descontoDivida}>
                         <Image alt='preview' src='/calc.png' width={31} height={32} />
                        <p>Calc.Desconto</p>
                      </div>
                      <div className="pnl2 float-start" title="Gerar Ultimos 5 anos de Divida Ativa" onClick={adDividaAuto}>
                         <Image alt='preview' src='/calc4.png' width={31} height={32} />
                        <p>Div. Auto</p>
                      </div>
                     <Row className="d-flex flex-row-reverse mb-2">
                        <div className="form-group col-md-3">
                          <h6>Divida Total:</h6>
                          <input type="text" id="id_disabled" disabled className="vltotal form-control" name="vltotal" onChange={handleInput}
                            value={formater$.format(somaDv.vltotal || 0)} placeholder="0,00" />
                        </div>

                      </Row>
                    </div>
                  </div>

                </Tab>
              </Tabs>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal className="modal" size="lg" centered show={modalGeral} onHide={CloseMGeral}>
          <Modal.Header closeButton id="modalHeader">
            <Image alt='preview' src='/logoe.png' width={25} height={20} /><p>Elmar Tecnologia </p>
          </Modal.Header>

          <Modal.Body id="modalBody">
            {modo === 'cadLogradouros' &&
              <div>
                <div id="btns">
                  <button onClick={clear_log}><Image alt='preview' width={30} height={25} src='/new.png' /><p>Novo</p></button>
                  <button onClick={() => delLog(state.id_log)} disabled={!state.id_log ? true : false} style={!state.id_log ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' width={30} height={30} src='/exc.png' /><p>Excluir</p></button>
                  <button onClick={e => SalvarLog(e)}><Image alt='preview' width={30} height={30} src='/slv.png' /><p>Salvar</p></button>
                  <button onClick={() => setModo('Logradouros')}><Image alt='preview' width={30} height={30} src='/x.png' /><p>Fechar</p></button>
                </div>
                {loadingDiag && (<div><LinearProgress variant="indeterminate" /></div>)}
                <Form className="form">
                  <input type="hidden" id="id_log" name="id_log" onChange={handleInput} value={state.id_log || ""} />
                  <input type="hidden" id="cod_log" name="cod_log" onChange={handleInput} value={state.cod_log || ""} />
                  <input type="hidden" id="data_cad" name="data_cad" onChange={handleInput} value={state.data_cad || ""} />
                  <input type="hidden" id="data_alt" name="data_alt" onChange={handleInput} value={state.data_alt || ""} />
                  <hr />
                  <h5>Cadastro de Logradouros</h5>    <hr />
                  <div id="titulo">
                    <p>*Dados Logradouro</p>
                  </div>

                  <Row className="m-2 mt-4 mb-4">
                    <input type="hidden" id="id_log" name="id_log" onChange={handleInput} value={state.id_log || ""} />
                    {state.cod_log > 0 &&
                      <div className="form-group col-md-2">
                        <label>Codigo</label>
                        <input type="text" className="form-control" name="cod_log" onChange={handleInput} value={state.cod_log} disabled
                          style={state.cod_log === 0 ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px', textAlign: 'center' }} />
                      </div>}
                    <div className="form-group col-md-6">
                      <label>Logradouro<span id="rsNome" style={{ display: "none" }}> é Obrigatório</span></label>
                      <input type="text" className="form-control" name="nome_log" onChange={handleInput} value={state.nome_log.toLocaleUpperCase() || ""} placeholder="Nome Logradouro"
                        style={state.nome_log === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>

                    <div className={`form-group ${state.id_log ? 'col-md-4' : 'col-md-6'}`}>
                      <label >Bairro</label>
                      <input type="text" className="form-control" name="bairro_log" onChange={handleInput} value={state.bairro_log.toLocaleUpperCase() || ""} placeholder="Bairro"
                        style={state.bairro_log === '' ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>
                  </Row>
                  <Row className="m-2 mb-2">
                    <div className="form-group col-md-6">
                      <label >Cidade</label>
                      <input type="text" className="form-control" name="cidade_log" onChange={handleInput} value={state.cidade_log.toLocaleUpperCase() || ""} placeholder="Cidade" />
                    </div>

                    <div className="form-group col-md-2">
                      <div className="form-group col-md-6">
                        <label >UF</label>
                        <input type="text" className="form-control" name="uf_log" onChange={handleInput} value={state.uf_log || ""} maxLength={2} />
                      </div>
                    </div>

                    <div className="form-group col-md-4">
                      <label>Cep</label>
                      <input type="text" className="form-control" name="cep_log" onChange={handleInput} value={maskCEP(state['cep_log']) || ''} placeholder="CEP" />
                    </div>
                  </Row>
                  <hr />
                  <br />
                  <div id="titulo">
                    <p>*Valores/Taxas</p>
                  </div>
                  <Row className="m-3">
                    <div className="form-group col-md-3">
                      <label>Valor M2 (R$)</label>
                      <input type="text" className="form-control text-end" name="valor_m2" onChange={handleInput} value={currencyBRL(state['valor_m2'] || 0)} placeholder="0,0" />
                    </div>
                    <div className="form-group col-md-3">
                      <label>Aliq. Terreno (%)</label>
                      <input type="text" className="form-control text-end" name="aliq_terreno" id='inputlower' onChange={handleInput} value={state.aliq_terreno || ""} placeholder="0,0" />
                    </div>
                    <div className="form-group col-md-3">
                      <label>Aliq. Unidade (%)</label>
                      <input type="text" className="form-control text-end" name="aliq_construcao" onChange={handleInput} value={state.aliq_construcao || ""} placeholder="0,0" />
                    </div>
                    <div className="form-group col-md-3">
                      <label>FT Terreno (%)</label>
                      <input type="text" className="form-control text-end" name="ft_terreno" onChange={handleInput} value={state.ft_terreno || ""} placeholder="0" />
                    </div>
                    <div className="form-group col-md-3">
                      <label>FT Construção (%)</label>
                      <input type="text" className="form-control text-end" name="ft_construcao" onChange={handleInput} value={state.ft_construcao || ""} placeholder="0" />
                    </div>
                  </Row>
                  <hr />
                </Form>
              </div>
            }
            {modo === 'Logradouros' &&
              <div>
                <div id="btns">
                  <button onClick={clear_log}><Image alt='preview' width={30} height={25} src='/new.png' /><p>Novo</p></button>
                  <button onClick={listarL}><Image alt='preview' width={30} height={25} src='/atuali.png' /><p>Atualizar</p></button>
                  <button onClick={() => CloseMGeral()}><Image alt='preview' width={30} height={25} src='/x.png' /><p>Fechar</p></button>
                </div>          
                  <hr />                
                  <div className="float-start col-md-12">
                    <div className=" col-md-4">
                      <h5>Pesquisar Logradouros</h5>
                    </div>
                    <hr />
                    <div className=" col-md-12">
                    <div className="float-start">
                      <label className="ms-4 ">
                        <input type="radio" name="pesq" value='1' defaultChecked={false} onClick={() => setPesqL(1)} />
                        &nbsp;Codigo</label>
                      <label className="ms-4 ">
                        <input type="radio" name="pesq" value='2' defaultChecked={true} onClick={() => setPesqL(2)} />
                        &nbsp;Nome</label>
                      <label className="ms-4 ">
                        <input type="radio" name="pesq" value='3' defaultChecked={false} onClick={() => setPesqL(3)} />
                        &nbsp;Bairro</label>
                        </div>
                        <div className="float-start ms-4 col-md-4">
                      {pesqLog === 1 && <input className="form-control" id="input6" type="number" onChange={pesqLograd} placeholder="Codigo" />}
                      {pesqLog === 2 && <input className="form-control" id="input6" type="text" onChange={pesqLograd} placeholder="Nome" />}
                      {pesqLog === 3 && <input id="input6" className="form-control" type="text" onChange={pesqLograd} placeholder="Bairro" />}    
                    </div>
                    </div>     
                 
                   
                    <br />     
                    <hr />          
                    </div>
                
               
                <Form className="tablepesq2">
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th className='text-center' onClick={() => setPesqL(1)} title="Pesquisar por Codigo da Rua" style={{ cursor: 'pointer' }}>Codigo</th>
                          <th onClick={() => setPesqL(2)} title="Pesquisar por Nome Rua" style={{ cursor: 'pointer' }}>Nome*</th>
                          <th onClick={() => setPesqL(3)} title="Pesquisar por Bairro" style={{ cursor: 'pointer' }}>Bairro*</th>
                          <th className="col_f text-center">Opções</th>
                        </tr>
                      </thead>
                      <TableBody>
                        {loadingDiag && (
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
                            <tr key={item.id_log} style={{ cursor: 'pointer' }}>
                              <td className="text-center" width={10}>{item.cod_log}</td>
                              <td>{item.nome_log}</td>
                              <td>{item.bairro_log}</td>
                              <td className="text-center pe-2">
                                <span onClick={() => sel_log(item.id_log, item.cod_log, item.nome_log, item.bairro_log, item.cidade_log, item.uf_log, item.cep_log, item.valor_m2)} id="badgeinf1">Selec</span>
                                <span onClick={() => edit_log(item.id_log, item.cod_log, item.nome_log, item.bairro_log, item.cidade_log, item.uf_log, item.cep_log, item.valor_m2)} id="badgesuccs">Editar</span>
                              </td>
                            </tr>)
                        })}
                      </tbody>
                    </Table>
                  </Form.Group>
                </Form>
              </div>}
            {modo === 'Loteamentos' &&
              <div>
                <div id="btns">
                  <button style={{ opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' }}><Image alt='preview' width={30} height={25} src='/new.png' /><p>Novo</p></button>
                  <button onClick={listarLt}><Image alt='preview' width={30} height={25} src='/atuali.png' /><p>Atualizar</p></button>
                  <button onClick={() => CloseMGeral()}><Image alt='preview' width={30} height={25} src='/x.png' /><p>Fechar</p></button>
                </div>
                <div id="iPnl4">
                  {pesqLot === 1 && <div> <h6>Pesquisar Codigo</h6><input className="form-control" id="input6" type="number" onChange={pesqLote} placeholder="Codigo da Rua" /></div>}
                  {pesqLot === 2 && <div> <h6>Pesquisar Nome</h6><input className="form-control" id="input6" type="text" onChange={pesqLote} placeholder="Nome Rua" /></div>}
                  {pesqLot === 3 && <div> <h6>Pesquisar Bairro</h6><input id="input6" className="form-control" type="text" onChange={pesqLote} placeholder="Bairro" /></div>}
                </div>
                <Form id="tablepesq">
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th className="col_a" onClick={() => setPesqLt(1)} title="Pesquisar por Codigo da Rua" style={{ cursor: 'pointer', textAlign: 'center' }}>Codigo*</th>
                          <th className="col_b" onClick={() => setPesqLt(2)} title="Pesquisar por Nome Rua" style={{ cursor: 'pointer' }}>Nome*</th>
                          <th className="col_a" onClick={() => setPesqLt(3)} title="Pesquisar por Bairro" style={{ cursor: 'pointer' }}>Bairro*</th>
                        </tr>
                      </thead>
                      <TableBody>
                        {loadingDiag && (
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
                        {FiltroLote?.map((item: any) => {
                          return (
                            <tr key={item.id_lote} onClick={() => sel_lote(item.id_lote, item.cod_lote, item.nome_lote)} style={{ cursor: 'pointer' }}>
                              <td className="text-center" width={5}>{item.cod_lote}</td>
                              <td>{item.nome_lote}</td>
                              <td>{item.bairro_lote}</td>
                            </tr>)
                        })}
                      </tbody>
                    </Table>
                  </Form.Group>
                </Form>
              </div>}
            {modo === 'cadPessoas' &&
              <div>
                <div id="btns">
                  <button onClick={clear_pessoa}><Image alt='preview' width={30} height={25} src='/new.png' /><p>Novo</p></button>
                  <button onClick={() => delPessoa(state.id_pessoa)} disabled={!state.id_pessoa ? true : false} style={!state.id_pessoa ? { opacity: '0.5', pointerEvents: 'none', filter: 'grayscale(1)' } : {}}><Image alt='preview' width={30} height={30} src='/exc.png' /><p>Excluir</p></button>
                  <button onClick={e => SalvarPessoa(e)}><Image alt='preview' width={30} height={30} src='/slv.png' /><p>Salvar</p></button>
                  <button onClick={() => setModo('Pessoas')}><Image alt='preview' width={30} height={30} src='/x.png' /><p>Fechar</p></button>
                </div>
                {loadingDiag && (<div><LinearProgress variant="indeterminate" /></div>)}

                <Form className="form">
                  <input type="hidden" id="id_pessoa" name="id_pessoa" onChange={handleInput} value={state.id_pessoa || ""} />
                  <input type="hidden" id="cod_pessoa" name="cod_pessoa" onChange={handleInput} value={state.cod_pessoa || ""} />
                  <input type="hidden" id="data_cad" name="data_cad" onChange={handleInput} value={state.data_cad || ""} />
                  <input type="hidden" id="data_alt" name="data_alt" onChange={handleInput} value={state.data_alt || ""} />
                  <hr /><h5>Cadastro de Pessoas</h5> <hr />
                  <div id="titulo" className="mt-4"><p>Identificação do Proprietário</p></div>
                  <Row className="m-2 mb-2">
                    <div className="form-group col-md-8">
                      <label>Nome Proprietário<span id="rsNome2" style={{ display: "none" }}> é Obrigatório</span></label>
                      <input type="text" className="form-control" name="nome_pessoa" onChange={handleInput} value={state.nome_pessoa.toLocaleUpperCase() || ""}
                        style={!state.nome_pessoa ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                    </div>
                    <div className="form-group col-md-3">
                      <label >CPF/CNPJ</label>
                      <input type="text" className="form-control" name="cpf_cnpj" onChange={handleInput} value={state.cpf_cnpj || ""} />
                    </div>
                  </Row>
                  <hr />
                  <div id="titulo" className="mt-4"><p>Endereço do Proprietário</p></div>
                  <Row className="m-2 mt-2">
                    <input type="hidden" id="id_log" name="id_log" onChange={handleInput} value={state.id_log || ""} />
                    <input type="hidden" id="cod_log" name="cod_log" onChange={handleInput} value={state.cod_log || ""} />
                    <div className="form-group col-md-6">
                      <label>Rua</label>
                      <input type="text" className="form-control" name="rua" onChange={handleInput} value={state.rua || ""} placeholder="Rua" />
                    </div>
                    <div className="form-group col-md-2">
                      <label>Nº</label>
                      <input type="text" className="form-control" name="numero" onChange={handleInput} value={state.numero || ""} />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Bairro</label>
                      <input type="text" className="form-control" name="bairro" onChange={handleInput} value={state.bairro || ""} />
                    </div>
                  </Row>
                  <Row className="m-2 mb-2">
                    <div className="form-group col-md-4">
                      <label>Cidade</label>
                      <input type="text" className="form-control" name="cidade" onChange={handleInput} value={state.cidade || ""} />
                    </div>

                    <div className="form-group col-md-2">
                      <label>UF</label>
                      <input type="text" className="form-control" name="uf" onChange={handleInput} value={state.uf || ""} maxLength={2} />
                    </div>
                    <div className="form-group col-md-3">
                      <label >CEP</label>
                      <input type="text" className="form-control" name="cep" onChange={handleInput} value={state.cep} />
                    </div>
                  </Row>
                  <hr />
                  <div id="titulo">
                    <p>*Contato</p>
                  </div>
                  <Row className="m-2">
                    <div className="form-group col-md-4">
                      <label>Email</label>
                      <input type="text" className="form-control" name="email" onChange={handleInput} value={state.email.toLocaleLowerCase() || ""} id='input_lowercase' placeholder="email@dominio.com" />
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
                  <hr />
                </Form>
              </div>
            }
            {modo === 'Pessoas' &&
              <div>
                <div id="btns" className="col-md-12" style={{ overflow: 'hidden', padding: '10px', height: '70px' }}>
                  <div className="float-start">
                    <button onClick={clear_pessoa}><Image alt='preview' width={30} height={25} src='/new.png' /><p>Novo</p></button>
                    <button onClick={handlePesq2}><Image alt='pic' width={30} height={25} src='/atuali.png' /><p>Atualizar</p></button>
                    <button onClick={() => CloseMGeral()}><Image alt='preview' width={30} height={25} src='/x.png' /><p>Fechar</p></button>
                  </div>
                  <div className="col-md-6 ms-4 float-start">
                    <label className="form-group col-md-6">Pesquisar por:</label>
                    <select className="form-group col-md-6" id="campo" name="campo" value={pesq4.campo} onChange={handlePesq2}>
                      <option value='cod_imovel'>CODIGO</option>
                      <option value='inscricao'>INSCRICAO</option>
                      <option value='nome_pessoa'>NOME VENDEDOR</option>
                      <option value='cpf_cnpj'>CPF/CNPJ</option>
                    </select> <br />
                    <div className="form-group col-md-12 mt-1">
                      <input className="form-group col-md-9 float-start" alt="Pesquisar" name="text1" onChange={handlePesq2} value={pesq4.text1} placeholder="Pesquisar.." />
                      <button id="btPesq" type="button" className="btn-outline-primary btn-sm float-start" onClick={handlePesq2}><Image alt='preview' src='/lup.png' width={15} height={15} /></button>
                    </div>
                  </div>
                </div>
                {loadingDiag && (<LinearProgress variant="indeterminate" />
                )}
                <hr /><h5>Pesquisar Pessoas</h5><hr />
                <Form className="tablepesq">
                  <Form.Group className="mb-3">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th className="col_a" style={{ textAlign: 'center' }}>Codigo</th>
                          <th className="col_b" style={{ cursor: 'pointer' }}>Nome</th>
                          <th className="col_a" title="Pesquisar por CPF/CNPJ" style={{ cursor: 'pointer' }}>Cpf/Cnpj</th>
                          <th className="col_a text-center">Ooções</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pessoas?.map((item: any) => {
                          return (
                            <tr key={item.id_pessoa} >
                              <td className="text-center">{item.cod_pessoa}</td>
                              <td className="col_b">{item.nome_pessoa}</td>
                              <td>{item.cpf_cnpj}</td>
                              <td className="col_a text-center pe-2">
                                <span onClick={() => sel_pessoa(item.id_pessoa, item.nome_pessoa, item.cpf_cnpj, item.rua, item.cidade, item.bairro, item.numero, item.uf, item.cep, item.telefone, item.fixo, item.email)} id="badgeinf1">Selec</span>
                                <span onClick={() => edit_pessoa(item.id_pessoa, item.nome_pessoa, item.cpf_cnpj, item.rua, item.cidade, item.bairro, item.numero, item.uf, item.cep, item.telefone, item.fixo, item.email)} id="badgesuccs">Editar</span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </Form.Group>
                </Form>
              </div>}
          </Modal.Body>
        </Modal>

        <Modal className="modal" size="xl" centered show={mGuias} onHide={handleClose}>
          <Modal.Header closeButton id="modalHeader">
            <Image alt='preview' width={23} height={20} src='/lup.png' /><p>Guias IPTU</p>
          </Modal.Header>
          <Modal.Body id="modalBody">
            <div><Row className="flex-row-reverse col-md-8 mt-1 mb-1 float-end">
              <div className="bt form-group">
                <div id="btns2" className="align-center">
                  <div className="pnl2" onClick={printIPTU}>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
                      <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                      <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 
                          2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1" />
                    </svg></p>
                    <p>Imprimir</p>
                  </div>
                  <div className="pnl2" title="Cancelar DAM Selecionado" onClick={handleClose}>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg></p>
                    <p>Fechar</p>
                  </div>
                </div></div>
            </Row>
              <div className="book" id="container">
                {loadingDiag && (<div><LinearProgress variant="indeterminate" /></div>)}
                <div className="page">
                  <div className="subpageDAM">
                    <table className="w666" style={{ border: 'solid 1px' }}>
                      <tr><td>
                        <div className="" style={{ marginLeft: '590px', marginTop: '10px', position: 'absolute' }}>
                          <span >Exercicio: {lancmto.exercicio}</span>
                        </div>
                        <div className='ent_print'>
                          <picture className='ent_brasao'>
                            <img src={!provid.entidade?.caminho ? '/simg.png' : `${provid.entidade?.urlbras}/${provid.entidade?.caminho}`} alt="pic" width={60} height={60} />
                          </picture>

                          <h3> {provid.sessao?.entidade}</h3>
                          <p className='text-nowrap'>{provid.entidade?.secretaria}</p>
                          <p className="text-nowrap">{lancmto.dados_Ent[0].msg1}</p>
                        </div>
                      </td></tr>
                    </table >

                    <table className="w666 mt-1" style={{ border: 'solid 1px', lineHeight: '4px', fontSize: '9pt', fontStyle: 'italic' }}>
                      <tr>
                        <td>
                          <p className="text-center" style={{ color: 'red', marginTop: '5px' }}>{lancmto.dados_Ent[0].msg4 as string}</p>
                          <p className="text-center">{lancmto.dados_Ent[0].msg2}</p>
                        </td>
                      </tr>
                    </table>

                    <table className="w666">
                      <tr className="ct h13">
                        <td className="w472">Instrunções de Responsabilidade do Cedente</td>
                      </tr>
                      <tr className="cp rBb">
                        <td className="At">{lancmto.dados_Ent[0].msg3}</td>
                      </tr>
                    </table>
                    <table className="w564 float-start" style={{ lineHeight: '2px' }}>
                      <tr className="BTable" >
                        <tr className="ct1">
                          <td className="w472">Tipo Imovel: <span >{lancmto.desc_tipo_imovel}</span></td>
                          <td className="w472">Area Terreno: <span >{lancmto.area_terreno} m2</span></td>
                          <td className="w472">{provid.entidade?.campo4_nome}: <span >{provid.entidade?.tx1}</span> + {provid.entidade?.campo5_nome}: <span >{provid.entidade?.tx2}</span></td>
                        </tr>
                        <tr className="ct1">
                          <td className="w472">Uso Solo: <span >{lancmto.uso_solo}</span></td>
                          <td className="w472">Area Construida: <span >{lancmto.area_construida} m2</span></td>
                          <td className="w472">{provid.entidade?.campo6_nome}: <span >{provid.entidade?.tx3}</span></td>
                        </tr>
                        <tr className="ct1">
                          <td className="w472">Inscrição: <span >{lancmto.cpf_cnpj}</span></td>
                          <td className="w472">Valor Venal: <span >{lancmto.valor_venal}</span></td>
                          <td className="w472">IPTU: <span >{lancmto.valor_total}</span></td>
                        </tr>
                        <tr className="ct1">
                          <td className="w472">Codigo Imovel: <span >{lancmto.cod_imovel}</span></td>
                          <td></td>
                          <td className="w472" style={{ borderTop: 'solid 1px #000' }}>Valor TOTAL: <span >{lancmto.valor_total}</span></td>
                        </tr>

                        <td className="Ar" >
                        </td>

                      </tr>
                    </table>

                    <table className="w154 float-start" style={{ border: 'solid 1px #000' }}>
                      <tr className="ct" >
                        <td style={{ backgroundColor: '#d5d5d5' }}>Data Emissão</td>
                      </tr>
                      <tr className="cp">
                        <td className="Ar text-center">{new Date().toLocaleDateString('pt-br')}</td>
                      </tr>
                      <tr className="ct" >
                        <td style={{ backgroundColor: '#d5d5d5' }}>Valor do Documento</td>
                      </tr>
                      <tr className="cp">
                        <td className="Ar">R$ {formater.format(lancmto.valor_total as any)}</td>
                      </tr>
                    </table>

                    <table className="w666" style={{ border: 'solid 1px #000' }}>
                      <tr className="ct h13">
                        <td className="w472">Pagador: <span style={{ fontWeight: 'bolder' }}>{lancmto.nome_pessoa}</span><br />
                          endereço: <span style={{ fontWeight: 'bolder' }}>{lancmto.rua}, {lancmto.numero}</span><br /><span style={{ fontWeight: 'bolder' }}>{lancmto.bairro}, {lancmto.cidade} - {lancmto.uf} - {maskCEP(lancmto.cep || '')}</span></td>
                        <td className="w180">CPF/CNPJ:
                          <br /><br /><span style={{ fontWeight: 'bolder' }}>{lancmto.cpf_cnpj}</span></td>
                        <td className="w104">Lote / Quadra:
                          <br /><br /><span style={{ fontWeight: 'bolder' }}>{lancmto.lote} / {lancmto.quadra}</span></td>
                      </tr>
                    </table>
                    {modo === 'A' ?
                      <div>
                        <table className="w666 mt-2">
                          <tr className="BHead">
                            <td >
                              <Image alt='preview' className="imgLogo"
                                loader={() => !lancmto.banco_ativo[0].brasao ? '/simg.jpg' : provid.entidade?.urlbras + lancmto.banco_ativo[0].brasao}
                                src={!lancmto.banco_ativo[0].brasao ? '/simg.jpg' : provid.entidade?.urlbras + lancmto.banco_ativo[0].brasao} width={110} height={30} />
                            </td>
                            <td className="barra" />
                            <td className="w72 Ab bc Ac">{lancmto.banco_ativo[0].cod_banco}</td>
                            <td className="barra" />
                            <td className="w500 Ar Ab ld text-center">I.P.T.U - ANTECIPADA</td>
                          </tr>
                        </table>
                        <table className="w666">
                          <tr className="ct h13 At">
                            <td className="w298">Local Pagamento</td>
                            <td className="w45" >EXERCICIO</td>
                            <td className="w62" style={{ backgroundColor: '#d5d5d5' }}>Parcela</td>
                          </tr>
                          <tr className="cp h12 At rBb">
                            <td>{lancmto.banco_ativo[0].local_pgto}</td>
                            <td className="Ar text-center">{lancmto.exercicio}</td>
                            <td className="Ar text-center" style={{ fontSize: '10pt' }}>ANTECIPADA</td>
                          </tr>
                        </table>

                        <table className="w666">
                          <tr className="ct h13 At">
                            <td className="w186">Beneficiário</td>
                            <td className="w45" >CNPJ</td>
                            <td className="w53" style={{ backgroundColor: '#d5d5d5' }}>VENCIMENTO</td>
                          </tr>
                          <tr className="cp h12 At rBb">
                            <td>{provid.entidade?.entidade}</td>
                            <td className="Ar text-center">{provid.entidade?.cnpj}</td>
                            <td className="Ar text-center" style={{ fontSize: '10pt' }}>{provid.entidade?.venc_ant}</td>
                          </tr>
                        </table>
                        <table className="w666">
                          <tr className="ct h13 At">
                            <td className="w128">Data do Processamento</td>
                            <td className="w104">Nº TItulo</td>
                            <td className="w150">Inscricão</td>
                            <td className="w34">Espécie</td>
                            <td className="w45">Convenio</td>
                            <td className="w128" style={{ backgroundColor: '#d5d5d5' }}>Nosso Numero</td>
                          </tr>
                          <tr className="cp h12 At rBb">
                            <td>{lancmto.data_cad}</td>
                            <td className="text-center">{lancmto.cod_imovel}</td>
                            <td className="text-center">{lancmto.inscricao}</td>
                            <td>R$</td>
                            <td>{lancmto.banco_ativo[0].convenio}</td>
                            <td className="Ar text-center">{lancmto.nossonum}</td>
                          </tr>
                        </table>
                        <table className="w564 float-start">
                          <tr className="ctN h13">
                            <td className="pL6">
                              <div className="ctN pL10">Instruções (Texto de responsabilidade do beneficiário)</div>
                              <div className="cp pL10">Sr. Caixa, não receber após o vencimento.</div>
                            </td>

                          </tr>
                        </table>
                        <table className="w154 float-start" >
                          <tr className="ct" >
                            <td style={{ backgroundColor: '#d5d5d5' }}>Agência/Cod Cedente</td>
                          </tr>
                          <tr className="cp">
                            <td className="Ar">{lancmto.banco_ativo[0].agencia} / {lancmto.banco_ativo[0].convenio}</td>
                          </tr>
                          <tr className="ct" >
                            <td style={{ backgroundColor: '#d5d5d5' }}>Valor do Documento</td>
                          </tr>
                          <tr className="cp">
                            <td className="Ar" style={{ fontSize: '10pt' }}>R$ {formater.format(lancmto.valor_antec as any)}</td>
                          </tr>
                        </table>
                        <table className="w666" style={{ border: 'solid 1px #000' }}>
                          <tr className="ct h13">
                            <td className="w472">Pagador: <span style={{ fontWeight: 'bolder' }}>{lancmto.nome_pessoa}</span><br />
                              endereço: <span style={{ fontWeight: 'bolder' }}>{lancmto.rua},{lancmto.numero}</span><br /><span style={{ fontWeight: 'bolder' }}>{lancmto.bairro}, {lancmto.cidade} - {lancmto.uf} - {maskCEP(lancmto.cep || '')}</span></td>
                            <td className="w180">CPF/CNPJ:
                              <br /><br /><span style={{ fontWeight: 'bolder' }}>{maskCPFJ(lancmto.cpf_cnpj || '')}</span></td>
                          </tr>
                        </table><table className="w666">
                          <tr className="ctN h13">
                            <td className="pL6">Sacador / Avalista</td>
                            <td className="w180 Ar">Autenticação mecânica</td>
                          </tr>
                          <tr className="cpN h12">
                            <td className="pL6 barcode">
                              <span>{lancmto.banco_ativo[0].linhadigitavel}</span>
                              <picture>
                                <img src={'http://bwipjs-api.metafloor.com/?bcid=interleaved2of5&text=' + lancmto.banco_ativo[0].codigobarra + '&scale=1'} alt="previw" width={450} height={50} />
                              </picture>
                              {/* <img width="500" height="60" src={'http://bwipjs-api.metafloor.com/?bcid=interleaved2of5&text=' + lancmto.banco_ativo[0].codigobarra + '&scale=1'} /> */}
                            </td>
                            <td className="pL6 Ar"> </td>
                          </tr>
                        </table>

                        <table className="ctN w666">
                          <tr><td className="Ar">Corte aqui!</td></tr>
                          <tr><td className="cut" /></tr>
                          {/* <tr>
                            <td className="cpN Ar">Via Contribuinte</td>
                          </tr> */}
                        </table>
                      </div>
                      :
                      <div>
                        {modo === 'C' &&
                          <div>
                            <table className="w666 mt-2">
                              <tr className="BHead">
                                <td >
                                  <Image alt='preview' className="imgLogo"
                                    loader={() => !lancmto.banco_ativo[0].brasao ? '/simg.jpg' : provid.entidade?.urlbras + lancmto.banco_ativo[0].brasao}
                                    src={!lancmto.banco_ativo[0].brasao ? '/simg.jpg' : provid.entidade?.urlbras + lancmto.banco_ativo[0].brasao} width={110} height={30} />
                                </td>
                                <td className="barra" />
                                <td className="w72 Ab bc Ac">{lancmto.banco_ativo[0].cod_banco}</td>
                                <td className="barra" />
                                <td className="w500 Ar Ab ld text-center">I.P.T.U - ANTECIPADA</td>
                              </tr>
                            </table>
                            <table className="w666">
                              <tr className="ct h13 At">
                                <td className="w298">Local Pagamento</td>
                                <td className="w45" >EXERCICIO</td>
                                <td className="w62" style={{ backgroundColor: '#d5d5d5' }}>Parcela</td>
                              </tr>
                              <tr className="cp h12 At rBb">
                                <td>{lancmto.banco_ativo[0].local_pgto}</td>
                                <td className="Ar text-center">{lancmto.exercicio}</td>
                                <td className="Ar text-center" style={{ fontSize: '10pt' }}>ANTECIPADA</td>
                              </tr>
                            </table>

                            <table className="w666">
                              <tr className="ct h13 At">
                                <td className="w186">Beneficiário</td>
                                <td className="w45" >CNPJ</td>
                                <td className="w53" style={{ backgroundColor: '#d5d5d5' }}>VENCIMENTO</td>
                              </tr>
                              <tr className="cp h12 At rBb">
                                <td>{provid.entidade?.entidade}</td>
                                <td className="Ar text-center">{provid.entidade?.cnpj}</td>
                                <td className="Ar text-center" style={{ fontSize: '10pt' }}>{provid.entidade?.venc_ant}</td>
                              </tr>
                            </table>
                            <table className="w666">
                              <tr className="ct h13 At">
                                <td className="w128">Data do Processamento</td>
                                <td className="w104">Nº TItulo</td>
                                <td className="w150">Inscricão</td>
                                <td className="w34">Espécie</td>
                                <td className="w45">Convenio</td>
                                <td className="w128" style={{ backgroundColor: '#d5d5d5' }}>Nosso Numero</td>
                              </tr>
                              <tr className="cp h12 At rBb">
                                <td>{lancmto.data_cad}</td>
                                <td className="text-center">{lancmto.cod_imovel}</td>
                                <td className="text-center">{lancmto.inscricao}</td>
                                <td>R$</td>
                                <td>{lancmto.banco_ativo[0].convenio}</td>
                                <td className="Ar text-center">{lancmto.nossonum}</td>
                              </tr>
                            </table>
                            <table className="w564 float-start">
                              <tr className="ctN h13">
                                <td className="pL6">
                                  <div className="ctN pL10">Instruções (Texto de responsabilidade do beneficiário)</div>
                                  <div className="cp pL10">Sr. Caixa, não receber após o vencimento.</div>
                                </td>

                              </tr>
                            </table>
                            <table className="w154 float-start" >
                              <tr className="ct" >
                                <td style={{ backgroundColor: '#d5d5d5' }}>Agência/Cod Cedente</td>
                              </tr>
                              <tr className="cp">
                                <td className="Ar">{lancmto.banco_ativo[0].agencia} / {lancmto.banco_ativo[0].convenio}</td>
                              </tr>
                              <tr className="ct" >
                                <td style={{ backgroundColor: '#d5d5d5' }}>Valor do Documento</td>
                              </tr>
                              <tr className="cp">
                                <td className="Ar" style={{ fontSize: '10pt' }}>R$ {currencyBRL(lancmto.valor_antec || 0)}</td>
                              </tr>
                            </table>
                            <table className="w666" style={{ border: 'solid 1px #000' }}>
                              <tr className="ct h13">
                                <td className="w472">Pagador: <span style={{ fontWeight: 'bolder' }}>{lancmto.nome_pessoa}</span><br />
                                  endereço: <span style={{ fontWeight: 'bolder' }}>{lancmto.rua},{lancmto.numero}</span><br /><span style={{ fontWeight: 'bolder' }}>, {lancmto.bairro}, {lancmto.cidade} - {lancmto.uf} - {maskCEP(lancmto.cep || '')}</span></td>
                                <td className="w180">CPF/CNPJ:
                                  <br /><br /><span style={{ fontWeight: 'bolder' }}>{maskCPFJ(lancmto.cpf_cnpj || '')}</span></td>
                              </tr>
                            </table><table className="w666">
                              <tr className="ctN h13">
                                <td className="pL6">Sacador / Avalista</td>
                                <td className="w180 Ar">Autenticação mecânica</td>
                              </tr>
                              <tr className="cpN h12">
                                <td className="pL6 barcode">
                                  <span>{lancmto.banco_ativo[0].linhadigitavel}</span>
                                  <picture>
                                    <img src={'http://bwipjs-api.metafloor.com/?bcid=interleaved2of5&text=' + lancmto.banco_ativo[0].codigobarra + '&scale=1'} alt="previw" width={450} height={50} />
                                  </picture>
                                  {/* <img width="500" height="60" src={'http://bwipjs-api.metafloor.com/?bcid=interleaved2of5&text=' + lancmto.banco_ativo[0].codigobarra + '&scale=1'} /> */}
                                </td>
                                <td className="pL6 Ar"> </td>
                              </tr>
                            </table>

                            <table className="ctN w666">
                              <tr><td className="Ar">Corte aqui!</td></tr>
                              <tr><td className="cut" /></tr>
                              {/* <tr>
                            <td className="cpN Ar">Via Contribuinte</td>
                          </tr> */}
                            </table>
                          </div>}

                        <table className="w666 mt-2">
                          <tr className="BHead">
                            <td >
                              <Image alt='preview' className="imgLogo"
                                loader={() => !lancmto.banco_ativo[0].brasao ? '/simg.jpg' : provid.entidade?.urlbras + lancmto.banco_ativo[0].brasao}
                                src={!lancmto.banco_ativo[0].brasao ? '/simg.jpg' : provid.entidade?.urlbras + lancmto.banco_ativo[0].brasao} width={110} height={30} />
                            </td>
                            <td className="barra" />
                            <td className="w72 Ab bc Ac">{lancmto.banco_ativo[0].cod_banco}</td>
                            <td className="barra" />
                            <td className="w500 Ar Ab ld text-center">I.P.T.U - ÚNICA</td>
                          </tr>
                        </table>
                        <table className="w666">
                          <tr className="ct h13 At">
                            <td className="w298">Local Pagamento</td>
                            <td className="w45" >EXERCICIO</td>
                            <td className="w62" style={{ backgroundColor: '#d5d5d5' }}>Parcela</td>
                          </tr>
                          <tr className="cp h12 At rBb">
                            <td>{lancmto.banco_ativo[0].local_pgto}</td>
                            <td className="Ar text-center">{lancmto.exercicio}</td>
                            <td className="Ar text-center" style={{ fontSize: '10pt' }}>Cota ÚNICA</td>
                          </tr>
                        </table>

                        <table className="w666">
                          <tr className="ct h13 At">
                            <td className="w186">Beneficiário</td>
                            <td className="w45" >CNPJ</td>
                            <td className="w53" style={{ backgroundColor: '#d5d5d5' }}>VENCIMENTO</td>
                          </tr>
                          <tr className="cp h12 At rBb">
                            <td>{provid.entidade?.entidade}</td>
                            <td className="Ar text-center">{provid.entidade?.cnpj}</td>
                            <td className="Ar text-center" style={{ fontSize: '10pt' }}>{provid.entidade?.venc_unica}</td>
                          </tr>
                        </table>
                        <table className="w666">
                          <tr className="ct h13 At">
                            <td className="w128">Data do Processamento</td>
                            <td className="w104">Nº TItulo</td>
                            <td className="w150">Inscricão</td>
                            <td className="w34">Espécie</td>
                            <td className="w45">Convenio</td>
                            <td className="w128" style={{ backgroundColor: '#d5d5d5' }}>Nosso Numero</td>
                          </tr>
                          <tr className="cp h12 At rBb">
                            <td>{lancmto.data_cad}</td>
                            <td className="text-center">{lancmto.cod_imovel}</td>
                            <td className="text-center">{lancmto.inscricao}</td>
                            <td>R$</td>
                            <td>{lancmto.banco_ativo[0].convenio}</td>
                            <td className="Ar text-center">{lancmto.nossonum}</td>
                          </tr>
                        </table>
                        <table className="w564 float-start">
                          <tr className="ctN h13">
                            <td className="pL6">
                              <div className="ctN pL10">Instruções (Texto de responsabilidade do beneficiário)</div>
                              <div className="cp pL10">Sr. Caixa, não receber após o vencimento.</div>
                            </td>

                          </tr>
                        </table>
                        <table className="w154 float-start" >
                          <tr className="ct" >
                            <td style={{ backgroundColor: '#d5d5d5' }}>Agência/Cod Cedente</td>
                          </tr>
                          <tr className="cp">
                            <td className="Ar">{lancmto.banco_ativo[0].agencia} / {lancmto.banco_ativo[0].convenio}</td>
                          </tr>
                          <tr className="ct" >
                            <td style={{ backgroundColor: '#d5d5d5' }}>Valor do Documento</td>
                          </tr>
                          <tr className="cp">
                            <td className="Ar" style={{ fontSize: '10pt' }}>R$ {formater.format(lancmto.valor_total as any)}</td>
                          </tr>
                        </table>
                        <table className="w666" style={{ border: 'solid 1px #000' }}>
                          <tr className="ct h13">
                            <td className="w472">Pagador: <span style={{ fontWeight: 'bolder' }}>{lancmto.nome_pessoa}</span><br />
                              endereço: <span style={{ fontWeight: 'bolder' }}>{lancmto.rua},{lancmto.numero}</span><br /><span style={{ fontWeight: 'bolder' }}>, {lancmto.bairro}, {lancmto.cidade} - {lancmto.uf} - {maskCEP(lancmto.cep || '')}</span></td>
                            <td className="w180">CPF/CNPJ:
                              <br /><br /><span style={{ fontWeight: 'bolder' }}>{maskCPFJ(lancmto.cpf_cnpj || '')}</span></td>
                          </tr>
                        </table><table className="w666">
                          <tr className="ctN h13">
                            <td className="pL6">Sacador / Avalista</td>
                            <td className="w180 Ar">Autenticação mecânica</td>
                          </tr>
                          <tr className="cpN h12">
                            <td className="pL6 barcode">
                              <span>{lancmto.banco_ativo[0].linhadigitavel}</span>
                              <picture>
                                <img src={'http://bwipjs-api.metafloor.com/?bcid=interleaved2of5&text=' + lancmto.banco_ativo[0].codigobarra + '&scale=1'} alt="previw" width={450} height={50} />
                              </picture>
                              {/* <img width="500" height="60" src={'http://bwipjs-api.metafloor.com/?bcid=interleaved2of5&text=' + lancmto.banco_ativo[0].codigobarra + '&scale=1'} /> */}
                            </td>
                            <td className="pL6 Ar"> </td>
                          </tr>
                        </table>

                        <table className="ctN w666">
                          <tr><td className="Ar">Corte aqui!</td></tr>
                          <tr><td className="cut" /></tr>
                          {/* <tr>
                            <td className="cpN Ar">Via Contribuinte</td>
                          </tr> */}
                        </table>
                      </div>}
                  </div> </div> </div></div>
          </Modal.Body>
        </Modal>

        <Modal className="modal" size="xl" centered show={mGuias2} onHide={handleClose}>
          <Modal.Header closeButton id="modalHeader">
            <Image alt='preview' width={23} height={20} src='/lup.png' /><p>Guias Divida Ativa</p>
          </Modal.Header>
          <Modal.Body id="modalBody">
            <div><Row className="flex-row-reverse col-md-8 mt-1 mb-1 float-end">
              <div className="bt form-group">
                <div id="btns2" className="align-center">
                  <div className="pnl2" onClick={printIPTU}>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
                      <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                      <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 
                          2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1" />
                    </svg></p>
                    <p>Imprimir</p>
                  </div>
                  <div className="pnl2" title="Cancelar DAM Selecionado" onClick={handleClose}>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg></p>
                    <p>Fechar</p>
                  </div>
                </div></div>
            </Row>
              <div className="book" id="container">
                {loadingDiag && (<div><LinearProgress variant="indeterminate" /></div>)}
                <div className="page">
                  <div className="subpageDAM">
                    <table className="w666" style={{ border: 'solid 1px' }}>
                      <tr><td>
                        <div className="" style={{ marginLeft: '590px', marginTop: '10px', position: 'absolute' }}>
                          <span >Exercicio: {lancmto.exercicio}</span>
                        </div>
                        <div className='ent_print'>
                          <picture className='ent_brasao'>
                            <img src={!provid.entidade?.caminho ? '/simg.png' : `${provid.entidade?.urlbras}/${provid.entidade?.caminho}`} alt="pic" width={60} height={60} />
                          </picture>

                          <h3> {provid.sessao?.entidade}</h3>
                          <p className='text-nowrap'>{provid.entidade?.secretaria}</p>
                          <p className="text-nowrap">{lancmto.dados_Ent[0].msg1}</p>
                        </div>
                      </td></tr>
                    </table >

                    <table className="w666 mt-1" style={{ border: 'solid 1px', lineHeight: '4px', fontSize: '9pt', fontStyle: 'italic' }}>
                      <table className="tableDAMdv">
                        <tr >
                          <th className="col_a text-center">Exercicio</th>
                          <th className="col_d text-center">Valor</th>
                          <th className="col_d text-center">Juros</th>
                          <th className="col_d text-center">Multa</th>
                          <th className="col_d text-center">Correção</th>
                          <th className="col_d text-center">desconto</th>
                          <th className="col_d text-center">Valor Total</th>
                        </tr>

                        {lancmto.dividas?.map((item: any) => {
                          return (
                            <tr key={item.id_divida}>
                              <td className="text-center">{item.exercicio}</td>
                              <td className="text-center">{currencyBRL(item.valor_original)}</td>
                              <td className="text-center" style={{ color: 'brown' }}>{currencyBRL(item.valor_juros || '')}</td>
                              <td className="text-center" style={{ color: 'brown' }}>{currencyBRL(item.valor_multa || '')}</td>
                              <td className="text-center" style={{ color: 'brown' }}>{currencyBRL(item.valor_corr || '')}</td>
                              <td className="text-center" style={{ color: '#0a457f' }}>{currencyBRL(item.desconto || '')}</td>
                              <td className="vlrec text-center">{currencyBRL(item.valor_total)}</td>
                            </tr>
                          )
                        })}
                      </table>
                    </table>
                    <table className="w564 float-start" style={{ lineHeight: '2px' }}>
                      <tr className="BTable" >
                        <tr className="ct1">
                          <td className="w472">Tipo Imovel: <span >{lancmto.desc_tipo_imovel}</span></td>
                          <td className="w472">Area Terreno: <span >{lancmto.area_terreno} </span>m2</td>
                          <td className="w472">Juros: <span >{formater.format(lancmto.juros)}</span> + Correção: <span >{formater.format(lancmto.corr)}</span></td>
                        </tr>
                        <tr className="ct1">
                          <td className="w472">Uso Solo: <span >{lancmto.uso_solo}</span></td>
                          <td className="w472">Area Construida: <span >{lancmto.area_construida} </span>m2</td>
                          <td className="w472">Multa: <span >{formater.format(lancmto.multa)}</span></td>
                        </tr>
                        <tr className="ct1">
                          <td className="w472">Inscrição: <span >{lancmto.cpf_cnpj}</span></td>
                          <td className="w472">Valor Venal: <span >{lancmto.valor_venal}</span></td>
                          <td className="w472">Dividas: <span >{formater.format(lancmto.original)}</span></td>
                        </tr>
                        <tr className="ct1">
                          <td className="w472">Codigo Imovel: <span >{lancmto.cod_imovel}</span></td>
                          <td></td>
                          <td className="w472" style={{ borderTop: 'solid 1px #000' }}>Total Divida: <span >{formater.format(lancmto.divida_total)}</span></td>
                        </tr>

                        <td className="Ar" >
                        </td>

                      </tr>
                    </table>

                    <table className="w154 float-start" style={{ border: 'solid 1px #000' }}>
                      <tr className="ct" >
                        <td style={{ backgroundColor: '#d5d5d5' }}>Data Emissão</td>
                      </tr>
                      <tr className="cp">
                        <td className="Ar text-center">{new Date().toLocaleDateString('pt-br')}</td>
                      </tr>
                      <tr className="ct" >
                        <td style={{ backgroundColor: '#d5d5d5' }}>Valor do Documento</td>
                      </tr>
                      <tr className="cp">
                        <td className="Ar">R$ {formater.format(lancmto.divida_total)}</td>
                      </tr>
                    </table>

                    <table className="w666" style={{ border: 'solid 1px #000' }}>
                      <tr className="ct h13">
                        <td className="w472">Contribuinte: <span style={{ fontWeight: 'bolder' }}>{lancmto.nome_pessoa} </span><br />
                          endereço: <span style={{ fontWeight: 'bolder' }}>{lancmto.rua}, {lancmto.numero}</span><br /><span style={{ fontWeight: 'bolder' }}>{lancmto.bairro},{lancmto.cidade} - {lancmto.uf} Cep:{lancmto.cep}</span></td>
                        <td className="w180">CPF/CNPJ:
                          <br /><br /><span style={{ fontWeight: 'bolder' }}>{lancmto.cpf_cnpj}</span></td>
                        <td className="w104">Lote / Quadra:
                          <br /><br /><span style={{ fontWeight: 'bolder' }}>{lancmto.lote} / {lancmto.quadra} </span></td>
                      </tr>
                    </table>
                    {modo === 'DvT' &&
                      <div>
                        <table className="w666 mt-2">
                          <tr className="BHead">
                            <td >
                              <Image alt='preview' className="imgLogo"
                                loader={() => !lancmto.banco_ativo[0].brasao ? '/simg.jpg' : provid.entidade?.urlbras + lancmto.banco_ativo[0].brasao}
                                src={!lancmto.banco_ativo[0].brasao ? '/simg.jpg' : provid.entidade?.urlbras + lancmto.banco_ativo[0].brasao} width={110} height={30} />
                            </td>
                            <td className="barra" />
                            <td className="w72 Ab bc Ac">{lancmto.banco_ativo[0].cod_banco}</td>
                            <td className="barra" />
                            <td className="w500 Ar Ab ld text-center">Divida Ativa de IPTU - Total</td>
                          </tr>
                        </table>
                        <table className="w666">
                          <tr className="ct h13 At">
                            <td className="w298">Local Pagamento</td>
                            <td className="w45" >Competência</td>
                            <td className="w62" style={{ backgroundColor: '#d5d5d5' }}>Parcela</td>
                          </tr>
                          <tr className="cp h12 At rBb">
                            <td>{lancmto.banco_ativo[0].local_pgto}</td>
                            <td className="Ar text-center">{lancmto.dados_Ent[0].exercicio}</td>
                            <td className="Ar text-center" style={{ fontSize: '10pt' }}>Divida Ativa</td>
                          </tr>
                        </table>

                        <table className="w666">
                          <tr className="ct h13 At">
                            <td className="w186">Beneficiário</td>
                            <td className="w45" >CNPJ</td>
                            <td className="w53" style={{ backgroundColor: '#d5d5d5' }}>VENCIMENTO</td>
                          </tr>
                          <tr className="cp h12 At rBb">
                            <td>{provid.entidade?.entidade}</td>
                            <td className="Ar text-center">{provid.entidade?.cnpj}</td>
                            <td className="Ar text-center" style={{ fontSize: '10pt' }}>{lancmto.dados_Ent[0].venc_dvtotal}</td>
                          </tr>
                        </table>
                        <table className="w666">
                          <tr className="ct h13 At">
                            <td className="w128">Data do Processamento</td>
                            <td className="w104">Nº TItulo</td>
                            <td className="w150">Inscricão</td>
                            <td className="w34">Espécie</td>
                            <td className="w45">Convenio</td>
                            <td className="w128" style={{ backgroundColor: '#d5d5d5' }}>Nosso Numero</td>
                          </tr>
                          <tr className="cp h12 At rBb">
                            <td>{lancmto.data_cad}</td>
                            <td className="text-center">{lancmto.id_imovel}</td>
                            <td className="text-center">{lancmto.inscricao}</td>
                            <td>R$</td>
                            <td>{lancmto.banco_ativo[0].convenio}</td>
                            <td className="Ar text-center">{lancmto.nossonum}</td>
                          </tr>
                        </table>
                        <table className="w564 float-start">
                          <tr className="ctN h13">
                            <td className="pL6">
                              <div className="ctN pL10">Instruções (Texto de responsabilidade do beneficiário)</div>
                              <div className="cp pL10">Sr. Caixa, não receber após o vencimento.</div>
                            </td>

                          </tr>
                        </table>
                        <table className="w154 float-start" >
                          <tr className="ct" >
                            <td style={{ backgroundColor: '#d5d5d5' }}>Agência/Cod Cedente</td>
                          </tr>
                          <tr className="cp">
                            <td className="Ar">{lancmto.banco_ativo[0].agencia} / {lancmto.banco_ativo[0].convenio}</td>
                          </tr>
                          <tr className="ct" >
                            <td style={{ backgroundColor: '#d5d5d5' }}>Valor do Documento</td>
                          </tr>
                          <tr className="cp">
                            <td className="Ar" style={{ fontSize: '10pt' }}>R$ {formater.format(lancmto.divida_total)}</td>
                          </tr>
                        </table>
                        <table className="w666" style={{ border: 'solid 1px #000' }}>
                          <tr className="ct h13">
                            <td className="w472">Pagador: <span style={{ fontWeight: 'bolder' }}>{lancmto.nome_pessoa}</span><br />
                              endereço: <span style={{ fontWeight: 'bolder' }}>{lancmto.rua},{lancmto.numero}</span><br /><span style={{ fontWeight: 'bolder' }}>, {lancmto.bairro}, {lancmto.cidade} - {lancmto.uf} - {maskCEP(lancmto.cep || '')}</span></td>
                            <td className="w180">CPF/CNPJ:
                              <br /><br /><span style={{ fontWeight: 'bolder' }}>{maskCPFJ(lancmto.cpf_cnpj || '')}</span></td>
                          </tr>
                        </table><table className="w666">
                          <tr className="ctN h13">
                            <td className="pL6">Sacador / Avalista</td>
                            <td className="w180 Ar">Autenticação mecânica</td>
                          </tr>
                          <tr className="cpN h12">
                            <td className="pL6 barcode">
                              <span>{lancmto.banco_ativo[0].linhadigitavel}</span>
                              <picture>
                                <img src={'http://bwipjs-api.metafloor.com/?bcid=interleaved2of5&text=' + lancmto.banco_ativo[0].codigobarra + '&scale=1'} alt="previw" width={450} height={50} />
                              </picture>
                              {/* <img width="500" height="60" src={'http://bwipjs-api.metafloor.com/?bcid=interleaved2of5&text=' + lancmto.banco_ativo[0].codigobarra + '&scale=1'} /> */}
                            </td>
                            <td className="pL6 Ar"> </td>
                          </tr>
                        </table>

                        <table className="ctN w666">
                          <tr><td className="Ar">Corte aqui!</td></tr>
                          <tr><td className="cut" /></tr>
                          {/* <tr>
                            <td className="cpN Ar">Via Contribuinte</td>
                          </tr> */}
                        </table>
                      </div>
                    }
                  </div> </div> </div></div>
          </Modal.Body>
        </Modal>

        <Modal className="modal" centered show={modalDiv} onHide={CloseMDiv}>
          <Modal.Header closeButton id="modalHeader">
            <Image alt='preview' width={23} height={20} src='/logoe.png' /><p>Elmar Tecnologia</p>
          </Modal.Header>

          <Modal.Body id="modalDiag"><hr />
            <h3 className="ms-4">Adicionar Divida{provid.entidade?.exercicio}</h3><hr />
            <Row className="m-2 mb-4" id='inputsValor'>
              <div className="form-group col-md-4">
                <label>Exercicio</label>
                <div className="form-group ">
                  <input type="text" className="form-control" name="exercicio" onChange={handleInputDv} value={maskOnlyNumbers(divida.exercicio)} placeholder="0" maxLength={4}
                    style={!divida.exercicio ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                </div>
              </div>
              <div className="form-group col-md-4">
                <label>Valor Original</label>
                <div className="form-group ">
                  <input type="number" id='txt1' className="form-control" name="valor_original" onChange={handleInputDv} value={currencyBRL(divida.valor_original || '')} placeholder="0"
                    style={!divida.valor_original ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                </div>
              </div>
              <div className="form-group col-md-4">
                <label>Valor Total</label>
                <div className="form-group ">
                  <input type="number" className="form-control text-end" name="valor_total" onChange={handleInputDv}
                    value={divida.valor_total} placeholder="0" id="id_disabled" disabled
                    style={!divida.valor_total ? { borderLeftColor: 'brown', borderLeftWidth: '5px' } : { borderLeftColor: 'green', borderLeftWidth: '5px' }} />
                </div>
              </div>
            </Row>
            <hr />
            <Row className="m-2 mb-4" id='inputsValor'>
              <div className="form-group col-md-4">
                <label>Juros</label>
                <div className="form-group ">
                  <input type="number" id='txt2' className="form-control" name="valor_juros" onChange={handleInputDv} value={currencyBRL(divida['valor_juros'] || '')} placeholder="0" />
                </div>
              </div>
              <div className="form-group col-md-4">
                <label>Multa</label>
                <div className="form-group ">
                  <input type="number" className="form-control" name="valor_multa" onChange={handleInputDv} value={currencyBRL(divida['valor_multa'] || '')} placeholder="0" />
                </div>
              </div>
              <div className="form-group col-md-4">
                <label>Correção</label>
                <div className="form-group ">
                  <input type="number" className="form-control" name="valor_corr" onChange={handleInputDv} value={currencyBRL(divida['valor_corr'] || '')} placeholder="0" />
                </div>
              </div>
            </Row>  <hr />
            <Row className="m-2 mb-4" id='inputsValor'>
              <div className="d-flex align-items-end justify-content-end col-md-12">
                <div id="btns2">
                  <div className="pnl2" onClick={adDivida}>
                    <Image alt='preview' src='/add.png' width={35} height={36} />
                    <p>Adicionar</p>
                  </div></div>
              </div>
            </Row>
            <hr />
          </Modal.Body>           
        </Modal>


        <div id='table_body'>

          {/* <div style={{ height: '86vh', width: '100%' }}>
            <DataGrid getRowId={(row) => row.id_imovel} columnHeaderHeight={20} rowHeight={21}
              columns={columns}
              rows={imoveisFiltrados}
              hideFooterPagination
              onColumnHeaderDoubleClick={CollClick}
              onCellClick={RowClick}
              onCellDoubleClick={RowDbClick}
              //slots={{loadingOverlay: LinearProgress as GridSlots['loadingOverlay'], }}
              sx={{
                boxShadow: 0,
                border: 0,
                borderColor: 'primary.light'
              }}
              loading={loading}
              checkboxSelection={chekRows}
              //disableRowSelectionOnClick 
              //disableMultipleRowSelection
              apiRef={apiRef}
              localeText={{
                footerRowSelected: (count) => `Selecionados: ${count}`
              }}
            />
          </div> */}

          <Table striped hover>
            <thead>
              <tr>
                <th >Codigo</th>
                <th >Inscrição</th>
                <th >Nome</th>
                <th >Cpf/Cnpj</th>
                <th >Logradouro / Nº</th>
                <th>Bairro</th>
                {/* <th className="display_none">Lote</th>
                <th className="display_none">Quadra</th> */}
                <th className="display_none">Tipo</th>
                <th className="display_none" title="Area Terreno">Venal</th>
                <th className="display_none" title="Area Terreno">Valor IPTU</th>
                <th className="display_none" title="Area Terreno">Pg</th>
                <th className="display_none" title="Divida Ativa Total">Divida</th>
                <th className="display_none" title="Area Construida">A.Const.</th>
                <th className="display_none" title="Area Terreno">A.Terreno</th>
              </tr>
            </thead>
            <TableBody>
              {loading && (
                <tr>
                  <TableCell colSpan={15}>
                    <LinearProgress variant="indeterminate" />
                  </TableCell>
                </tr>
              )}
            </TableBody>
            <tbody>
              {imoveis?.map((item: any) => {
                return (
                  <tr key={item.id_imovel} id={item.id_imovel} onClick={RowClicked} onDoubleClick={RowDbClicked} className={rowId == item.id_imovel ? "bgactive" : ""}>
                    <td style={{ textAlign: 'center'}}>{item.cod_imovel}</td>
                    <td>{item.inscricao}</td>
                    <td>{item.nome_pessoa}</td>
                    <td >{item.cpf_cnpj || ''}</td>
                    <td >{item.nome_log} - {item.num_imovel}</td>
                    <td >{item.bairro_log}</td>
                    {/* <td className='col_a'>{item.lote}</td>
                    <td className='col_a'>{item.quadra}</td> */}
                    <td>
                      {(() => {
                        switch (item.tipo_imovel) {
                          case 1: return 'Terreno';
                          case 2: return 'Predial';
                          case 3: return 'Comércio';
                          case 4: return 'Industria';
                          case 5: return 'Outros';
                        }
                      })()} </td>
                    <td style={{ textAlign: 'right' }}>{currencyBRL(item.valor_venal)}</td>
                    <td style={{ textAlign: 'right' }}>{currencyBRL(item.valor_total)}</td>
                    <td style={{ textAlign: 'center' }}>
                      {item.pago === 'S' ? <span id="badgeSuces">Sim</span> : <span id="badgeAlert">No</span>}
                    </td>
                    <td >{currencyBRL(item.divida_total || '')}</td>
                    <td style={{ textAlign: 'center' }}>{currencyBRL(item.area_construida)}</td>
                    <td style={{ textAlign: 'center' }}>{currencyBRL(item.area_terreno)}</td>
                  </tr>
                )
              }
              )} </tbody>
          </Table>
        </div>
      </div>}
    </>
  );
}