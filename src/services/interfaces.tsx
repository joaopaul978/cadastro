export interface initialState  {id_pessoa:string, id_ent:number, cod_pessoa:string,nome:string,cpf_cnpj:string, email:string, telefone:string,   rua:string, numero:string, bairro:string,cidade:string, uf:string,cep:string, data_cad:string, data_alt:string, caminho:string,usu_cad:number};      

//Pessoas
export interface IlistaPessoas {number:number,
  id_pessoa:number, id_ent: number, cod_pessoa: number,nome_pessoa:string, cpf_cnpj:string,email:string, telefone:string, fixo:string, 
  rua:string,numero:string,bairro:string,cidade:string,uf:string, cep:string,
  data_cad:string, data_alt:string, usu_cad:string,socios:{nome:string, qual:string}};
  
  export  type TPessoas = { data: IlistaPessoas[];}  
  export  type TPessoa = { data: IlistaPessoas}  

  //Imoveis
export interface IlistaImoveis {
  id_ent: number, id_imovel:number,inscricao:string,inscricao_ant:string, cod_imovel:number, id_pessoa:number,cod_pessoa: number, nome_pessoa:string,cpf_cnpj:string,id_log:number, cod_log:number, nome_log:string, bairro_log:string, lote:string, quadra:string, tipo_imovel:number, situacao_imovel: number, isencao:number,patrimonio:number,
  uso_solo:number, coleta:number, elevacao:number, coberta:number, conservacao:number, padrao:number, pedologia:number, especie:number,construcao_piso:number, topografia:number,
  serv_agua:number, serv_ilumin:number, serv_pavimen:number, serv_energ:number,serv_esgoto:number, serv_galeria:number,limit_alagado:number, limit_scalc:number,limit_smuro:number,
  limit_encrav:number,limit_acident:number, posicao:number,
  data_cad:string, data_alt:string, usu_cad:string};
//ITBI
export interface IlistaItbi{id_ent:0, id_lanc:0,cod_itbi:0, id_user:0, inscricao:'', id_vendedor:0,id_comprador:0, cpf_cnpj_comprador:'', cpf_cnpj_vendedor:'', exercicio:0, indicador_pago:'', negocio_juridico:'', nome_comprador:'', nome_vendedor:'', num_processo:'', obs_itbi:'',
  oficio:'', tipo_imovel:'', tipo_lanc:'', transferido:'', usu_cad:'', aliq_avaliacao:'', valor_avaliado:'', valor_itbi:'', valor_nj:'', valor_pago:'', valor_total:'',data_cad:'', data_emissao:'', data_pgmto:'', data_venc:'',data_alt:'', id_assin1:'', id_assin2:''}
//Logradouros
export interface IlistaLograd {
  id_ent: number, id_log:number, cod_log:number, nome_log:string, cidade_log:string, uf_log:string, valor_m2:number, 
  aliq_terreno:number, aliq_construcao:number, ft_terreno:number, ft_construcao:number, cep_log:string, bairro_log:string, data_cad:string, data_alt:string, usu_cad: string};

//Divida
export interface IlistaDividas {
  id_ent: number, id_divida: number, cod_divida: number, exercicio: number, valor_original: number, valor_juros: number,valor_multa: number,valor_corr: number,desconto: number, valor_total: number, 
  sobjudice: string, parcelado:string, data_cad: string, data_alt: string, usu_cad: string}; 


//Loteamentos
export interface IlistaLote {
  id_user: number, id_ent: number, id_lote:number, cod_lote: number, nome_lote:string, bairro_lote: string, cidade_lote:string, data_cad: string, data_alt: string, usu_cad:string }; 
 

//Entidade // SESSAO
export interface ISessao { 
  id_ent: number, cod_ent:number, entidade:string, cnpj:string,email:string,telefone:string,rua:string,numero:string,bairro:string,cidade:string,uf:string,id_user: number; nome:string;username:string,role:number; prv:string,arquivo:string,urlperf:string,imgbras:string,imgperf:string,ver:string
};

  export interface IEntidade {
    ativo: string;
    id_user: number, id_pessoa: string, cod_ent: number, id_ent: number, cod_pessoa: string, cnpj: string, email: string,msg1:string,msg2:string, msg3:string, usu_cad:string, entidade: string, telefone: string, fixo: string, tx1: string, tx2: string, tx3: string,
    rua: string, numero: string, bairro: string, cidade: string, uf: string, cep: string, data_cad: string, secretaria: string,lei:string,decreto:string, data_alt: string, venc_unica: string,venc_ant: string, perc_ant:number, arquivo: string, caminho: string, exercicio:string,tributos:string,desconto_antec:string,
    campo1_nome: string, campo2_nome: string, campo3_nome: string, campo1_tam: number, campo2_tam: number, campo3_tam: number,campo4_nome: string,campo4_tam: number,campo5_nome: string,campo5_tam: number, campo6_nome: string,maskinsc:string,maskgrupo:string, urlperf: string, urlbras: string,ver:string, calc_imovel:string,desconto_iptu:string,vvi:string,insc_seq:string,
    aliq_itbi:string, bloq_aliq:string,venc_itbi:string; valor_taxa:string,limit_rows:number };
  
  export type TEntidades = { data: IEntidade[] } 

//Cemitery
export interface ICemitery {  
  id_ent:number, id_cemi:number,cod_cemi:number, nome_cemi:string, email:string,telefone:string,cidade:string, endereco:string,cnpj:string,data_cad:string, data_alt:string,usu_cad:string
tx1:number,tx2:number,tx3:number,vl:number};

  export type TCemitery = { data: ICemitery[] } 

//Tumulos
export interface IlistaTumulos {  
  id_ent: number,id_tum: number,cod_tum:number,id_cemi:number,cod_cemi:number, nome:string, cpf_cnpj:string,email:string,telefone:string, fixo:string, rua:string,numero:string,bairro:string,cidade:string,uf:string,nome_cemi:string, dst:number,st:number,qd:number,lt:number,
  cor:string,tipo:number,conserv:number,padrao:number,inscricao:string, id_pessoa:number,descricao:number,obs:string,usu_cad:string,data_cad:string,
  data_alt:string,area_terreno:number,area_construida:number,testada:number,profundidade:number,vl_total:number,tx_extra:number,desconto:number,situacao:string
};    
//Lancmentos
export interface IlistaLancmto {  
  id_ent: number, id_lanc: number,cod_lancdet: number,id_lancdet: number,id_pessoa:number, cod_rec:string, des_rec: string, usu_cad:string,valor_real:string,valor_rec:string,data_cad:string,
  data_alt:string, pago:string, lancmtosDt:{valor_real:string,valor_rec:string}
};  

export interface IlistaSepmto {  
  id_ent: number,id_sep: number,cod_sep: number, cod_tum:number,id_tum:number,septdo:string,cpf_cnpj_septdo:string,id_cemi:number, nome:string, cpf_cnpj:string, 
  id_pessoa:number, cod_pessoa:number,familia:string,tipo:number, dst:number,st:number,qd:number,lt:number,obs:string,usu_cad:string,data_cad:string,situacao_pgmto:number,
  data_alt:string }; 

export type TSepmto = {data: IlistaSepmto[] } 

//Natureza
export interface INatureza {  
  cod_natureza:string, natureza:string}; 

export interface IAtivcnae {  
   cod_cnae:string, descricao_cnae:string, cod_grupo:string, valor_tf:number, code:string, text:string, nome:string, qual:string};
    
export interface IAtivcnaeGrp {  
   cod_cnae_grupo:string, descricao_cnae_grupo:string};

   //Alvara
export interface IAlvara {id_ent:number,id_alvara:number,id_pessoa:number,id_user:number,cod_alvara:number, data_emissao:string,num_processo:string,tipo_alvara:string,data_validade:string,exercicio:string,num_dam:string,obs_alvara:string, recolhimento:string,placa:string,anofabricacao:string,chassis:string,cor_veiculo:string,modelo_veiculo:string,obs_veiculo:string,emissao:''}; 
  
//assinaturas
  export interface IAssinaturas { id_assin: string,nome: string, cargo: string, matricula: ''};        

//Receitas
export interface IReceitas {  
  id_user: 0, id_ent: 0, id_rec:0, cod_rec: 0, des_rec: '',grupo:0, valor:'', cod_trib:0, cod_orc:'', cod_fonte:0, obs:'', data_cad: '', data_alt: '', usu_cad: ''   
};

  export type TReceitas = { data: IReceitas[] } 

  //Bancos
export interface IBancos {  id_ent: string, id_banco: number, agencia: string, conta: string, num_convenio: number,cod_banco: string,nome_banco: string, local_pgto: string,brasao:string,ativo:string, data_cad: string, data_alt: ''};   


//Usuários
export interface IUser {
  id_ent:number; id_user:number; username: string;
  password?: string; nome: string; Token_acesso: string; email:string,telefone:string, role: number; imgperf:string, prv:string, ativo: string; };   

export interface ITipo { id_ent:number; id_tipo_imovel:number; cod_tipo_imovel:number; desc_tipo_imovel: string; aliq: string; }; 

export interface IPadrao { id_ent:number; id_padrao:number; cod_padrao:number;desc_padrao: string; valor_unitario: string; } 

export type TUsers ={data: IUser[] }
//Operador
export interface IOperador { id_ent:number;id_cemi:number; id_oper:number; nome_operador: string; funcao_operador: string; data_cad:string; data_alt:string}

export interface TOperador { 
  data: IOperador[];
}

