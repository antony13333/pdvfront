import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon, DocumentMagnifyingGlassIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';


import { format, parseISO } from 'date-fns';
import { Link, useNavigate } from "react-router-dom";

const PedidosFinalizados = () => {
    const [produtos, setProdutos] = useState([]);
    const [comandas, setComandas] = useState([]);
    const [reprodutos, setReprodutos] = useState([]);
    const [recomandas, setRecomandas] = useState([]);
    const [querypod, setQuerypod] = useState('');
    const [querycoman, setQuerycoman] = useState('');
    const[produto, setProduto]= useState(null);
    const[comanda, setComanda]= useState(null);
    const[dtaab, setDataab]= useState(null);
    const[dtafe, setDatafecha] = useState(null);
    const [pedidos1, setPedidos1] = useState([]);
    const[pedidos2, setPedidos2]= useState([]);
    const[pedidos3, setPedidos3]= useState([]);
    const[vazio, setVazio]= useState(false);

    const [showProdResults, setShowProdResults] = useState(false);
    const [showComanResults, setShowComanResults] = useState(false);

    const prodfetch = async () => {
        try {
            const status = await axios.get(`${API_URL}/produtosrestaurante`);
            setProdutos(status.data);
            setReprodutos(status.data);
        } catch (error) {
            console.log(error);
        }
    };

    const comanfetch = async () => {
        try {
            const response = await axios.get(`${API_URL}/comandaspedido`);
            const comandas = response.data;
            const listaUnica = comandas.filter((item, index) => comandas.indexOf(item) === index);
            setComandas(listaUnica);
            setRecomandas(listaUnica);
        } catch (error) {
            console.log(error);
        }
    };

    const filtrar = async () => {
        
        const dados = {};
        if (produto) dados.Nome_produto = produto;
        if (comanda) dados.Identificador = comanda;
        if (dtaab) dados.Data_Criacao = dtaab;
        if (dtafe) dados.Data_Finalizado = dtafe;
    
        const url = `${API_URL}/pedidosFinalizados`;
        try {
           
            if (Object.keys(dados).length > 0) {
                console.log("Enviando filtros:", dados);
                const response = await axios.post(url, dados);
                var pedidos = response.data;
            } else {
                console.log("Sem filtros - buscando todos");
                const resposta = await axios.get(`${API_URL}/pedidosFin`);
                var pedidos = resposta.data;
            }
            if(pedidos.length===0){
                setVazio(true);
            }
            else{
                setVazio(false);
            }
            const coluna1 = pedidos.filter((item, index) => index % 3 === 0);
            const coluna2 = pedidos.filter((item, index) => index % 3 === 1);
            const coluna3 = pedidos.filter((item, index) => index % 3 === 2);
            setPedidos1(coluna1);
            setPedidos2(coluna2); 
            setPedidos3(coluna3);
        } catch (error) {
            console.log("Erro:", error);
        }
    };

    useEffect(() => {
        prodfetch();
        comanfetch();
    }, []);

    useEffect(() => {
        if (querypod) {
            const filtro = produtos.filter((produto) =>
                produto.nome_produto.toLowerCase().includes(querypod.toLowerCase())
            );
            setReprodutos(filtro);
        } else {
            setReprodutos(produtos);
        }
    }, [querypod, produtos]);

    useEffect(() => {
        if (querycoman) {
            const filtro = comandas.filter((comanda) =>
                comanda.includes(querycoman.toLowerCase())
            );
            setRecomandas(filtro);
        } else {
            setRecomandas(comandas);
        }
    }, [querycoman, comandas]);
    useEffect(()=>{
        console.log(dtafe);
    },[dtafe])
    useEffect(()=>{
        console.log(dtaab);
    },[dtaab])
    
    useEffect(() => {
        if (!querypod) {
            setProduto(null);
        }
    }, [querypod]);
    useEffect(() => {
        if (!querycoman) {
            setComanda(null);
        }
    }, [querycoman]);
    const nav = useNavigate();

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-screen flex flex-col">
            <h1 className="text-center text-4xl font-bold text-gray-800 mt-8 mb-6">Histórico de Pedidos</h1>
            
            {/* Seção de Filtros */}
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mx-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Filtro Produto */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                        <div className="relative">
                            <input
                                value={querypod}
                                onChange={(e) => setQuerypod(e.target.value)}
                                onFocus={() => setShowProdResults(true)}
                                onBlur={() => setTimeout(() => setShowProdResults(false), 100)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Pesquisar produto..."
                            />
                            {showProdResults && querypod && (
                                <motion.ul
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto"
                                >
                                    {reprodutos.map((item) => (
                                        <li
                                            key={item.id_produto}
                                            onClick={() => {
                                                setQuerypod(item.nome_produto);
                                                setProduto(item.nome_produto);
                                            }}
                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 truncate"
                                        >
                                            {item.nome_produto}
                                        </li>
                                    ))}
                                </motion.ul>
                            )}
                        </div>
                    </div>
    
                    {/* Filtro Comanda */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comanda</label>
                        <div className="relative">
                            <input
                                value={querycoman}
                                onChange={(e) => setQuerycoman(e.target.value)}
                                onFocus={() => setShowComanResults(true)}
                                onBlur={() => setTimeout(() => setShowComanResults(false), 100)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Número da comanda"
                            />
                            {showComanResults && querycoman && (
                                <motion.ul
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto"
                                >
                                    {recomandas.map((item) => (
                                        <li
                                            key={item}
                                            onClick={() => {
                                                setQuerycoman(item);
                                                setComanda(item);
                                            }}
                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </motion.ul>
                            )}
                        </div>
                    </div>
    
                    {/* Datas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data Criação</label>
                            <input 
                                type="date" 
                                onChange={(e) => setDataab(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data Finalizado</label>
                            <input 
                                type="date" 
                                onChange={(e) => setDatafecha(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
    
                    {/* Botão Filtrar */}
                    <div className="flex items-end">
                        <button 
                            onClick={() => filtrar()}
                            className="w-full h-fit flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all"
                        >
                            <FunnelIcon className="w-5 h-5" />
                            <span className="text-lg font-medium">Filtrar</span>
                        </button>
                    </div>
                </div>
            </motion.div>
    
            {/* Botão Voltar */}
            <button 
                onClick={() => nav("/")}
                className="absolute top-4 left-4 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
                <ArrowUturnLeftIcon className="w-5 h-5 text-gray-600" />
                <span className="text-xl text-gray-700">Voltar</span>
            </button>
    
            {/* Área de Resultados com Scroll Corrigido */}
            <div className="flex-1 min-h-0 overflow-y-auto px-8 pb-8">
                {vazio ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-full py-12"
                    >
                        <DocumentMagnifyingGlassIcon className="w-24 h-24 text-gray-400 mb-4" />
                        <p className="text-3xl text-gray-500 font-medium">Nenhum pedido encontrado</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                        {[...pedidos1, ...pedidos2, ...pedidos3].map((item) => (
                            <motion.div 
                                key={item[0]}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                                    <h3 className="text-lg font-semibold text-gray-800 truncate">{item[2]}</h3>
                                    <span className="text-sm text-gray-500">
                                        {item[5] ? format(parseISO(item[5]), "dd/MM/yy HH:mm") : '-'}
                                    </span>
                                </div>
                                
                                <div className="p-4 space-y-3">
                                    {JSON.parse(item[3]).map((produto, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <span className="text-gray-700 truncate">{produto}</span>
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                                                x{JSON.parse(item[4])[idx]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PedidosFinalizados;
