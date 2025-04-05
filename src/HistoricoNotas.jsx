import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon, DocumentMagnifyingGlassIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { Link, useNavigate } from "react-router-dom";

const HistoricoNotas = () => {
    const [notas, setNotas] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [comandas, setComandas] = useState([]);
    const [reprodutos, setReprodutos] = useState([]);
    const [recomandas, setRecomandas] = useState([]);
    const [querypod, setQuerypod] = useState('');
    const [querycoman, setQuerycoman] = useState('');
    const [produto, setProduto] = useState(null);
    const [comanda, setComanda] = useState(null);
    const [dtaab, setDataab] = useState(null);
    const [mp, setMp] = useState(null);
    const [notas1, setNotas1] = useState([]);
    const [notas2, setNotas2] = useState([]);
    const [notas3, setNotas3] = useState([]);
    const [vazio, setVazio] = useState(false);
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
            const response = await axios.get(`${API_URL}/comandasnota`);
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
        if (mp) dados.FormaPagamento = mp;

        const url = `${API_URL}/filternotas`;
        try {
            let notas;
            if (Object.keys(dados).length > 0) {
                const response = await axios.post(url, dados);
                notas = response.data;
            } else {
                const resposta = await axios.get(`${API_URL}/notasall`);
                notas = resposta.data;
            }
            
            setVazio(notas.length === 0);
            
            const coluna1 = notas.filter((_, index) => index % 3 === 0);
            const coluna2 = notas.filter((_, index) => index % 3 === 1);
            const coluna3 = notas.filter((_, index) => index % 3 === 2);
            
            setNotas1(coluna1);
            setNotas2(coluna2);
            setNotas3(coluna3);
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
            const filtro = produtos.filter(produto =>
                produto.nome_produto.toLowerCase().includes(querypod.toLowerCase())
            );
            setReprodutos(filtro);
        } else {
            setReprodutos(produtos);
            setProduto(null);
        }
    }, [querypod, produtos]);

    useEffect(() => {
        if (querycoman) {
            const filtro = comandas.filter(comanda =>
                comanda.toLowerCase().includes(querycoman.toLowerCase())
            );
            setRecomandas(filtro);
        } else {
            setRecomandas(comandas);
            setComanda(null);
        }
    }, [querycoman, comandas]);

    const nav = useNavigate();
    return (
        <div className="bg-gradient-to-br from-sky-50 to-indigo-50 h-screen flex flex-col">
            <h1 className="text-center text-4xl font-bold text-sky-900 mt-8 mb-6 drop-shadow-md">
                <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                    Histórico de Notas
                </span>
            </h1>
    
            {/* Seção de Filtros */}
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mx-8 bg-white rounded-2xl shadow-xl border border-sky-100 p-6 mb-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Filtro Produto */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-sky-700 mb-1">Produto</label>
                        <div className="relative">
                            <input
                                value={produto || querypod}
                                onChange={(e) => {
                                    setQuerypod(e.target.value);
                                    setProduto(null);
                                }}
                                onFocus={() => setShowProdResults(true)}
                                onBlur={() => setTimeout(() => setShowProdResults(false), 200)}
                                className="w-full px-4 py-2 rounded-xl border border-sky-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sky-700 placeholder-sky-400"
                                placeholder="Pesquisar produto..."
                            />
                            {showProdResults && reprodutos.length > 0 && (
                                <motion.ul
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-xl border border-sky-200 max-h-60 overflow-y-auto"
                                >
                                    {reprodutos.map((item) => (
                                        <li
                                            key={item.id_produto}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                setQuerypod(item.nome_produto);
                                                setProduto(item.nome_produto);
                                                setShowProdResults(false);
                                            }}
                                            className="px-4 py-2 hover:bg-sky-50 cursor-pointer text-sky-700 truncate transition-colors"
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
                        <label className="block text-sm font-medium text-sky-700 mb-1">Comanda</label>
                        <div className="relative">
                            <input
                                value={comanda || querycoman}
                                onChange={(e) => {
                                    setQuerycoman(e.target.value);
                                    setComanda(null);
                                }}
                                onFocus={() => setShowComanResults(true)}
                                onBlur={() => setTimeout(() => setShowComanResults(false), 200)}
                                className="w-full px-4 py-2 rounded-xl border border-sky-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sky-700 placeholder-sky-400"
                                placeholder="Número da comanda"
                            />
                            {showComanResults && recomandas.length > 0 && (
                                <motion.ul
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-xl border border-sky-200 max-h-60 overflow-y-auto"
                                >
                                    {recomandas.map((item) => (
                                        <li
                                            key={item}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                setQuerycoman(item);
                                                setComanda(item);
                                                setShowComanResults(false);
                                            }}
                                            className="px-4 py-2 hover:bg-sky-50 cursor-pointer text-sky-700 transition-colors"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </motion.ul>
                            )}
                        </div>
                    </div>
    
                    {/* Data */}
                    <div>
                        <label className="block text-sm font-medium text-sky-700 mb-1">Data Criação</label>
                        <input 
                            type="date" 
                            onChange={(e) => setDataab(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-sky-200 focus:ring-2 focus:ring-indigo-500 text-sky-700"
                        />
                    </div>
    
                    {/* Métodos de Pagamento */}
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setMp(mp === 'DINHEIRO' ? null : 'DINHEIRO')}
                            className={`px-3 py-1 rounded-xl border-2 ${
                                mp === 'DINHEIRO' 
                                    ? 'bg-amber-100 border-amber-400 text-amber-800' 
                                    : 'bg-sky-50 border-sky-200 hover:border-amber-300 text-sky-600'
                            } transition-all font-medium`}
                        >
                            Dinheiro
                        </button>
                        <button 
                            onClick={() => setMp(mp === 'DEBITO' ? null : 'DEBITO')}
                            className={`px-3 py-1 rounded-xl border-2 ${
                                mp === 'DEBITO' 
                                    ? 'bg-indigo-100 border-indigo-400 text-indigo-800' 
                                    : 'bg-sky-50 border-sky-200 hover:border-indigo-300 text-sky-600'
                            } transition-all font-medium`}
                        >
                            Débito
                        </button>
                        <button 
                            onClick={() => setMp(mp === 'CREDITO' ? null : 'CREDITO')}
                            className={`px-3 py-1 rounded-xl border-2 ${
                                mp === 'CREDITO' 
                                    ? 'bg-purple-100 border-purple-400 text-purple-800' 
                                    : 'bg-sky-50 border-sky-200 hover:border-purple-300 text-sky-600'
                            } transition-all font-medium`}
                        >
                            Crédito
                        </button>
                        <button 
                            onClick={() => setMp(mp === 'PIX' ? null : 'PIX')}
                            className={`px-3 py-1 rounded-xl border-2 ${
                                mp === 'PIX' 
                                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800' 
                                    : 'bg-sky-50 border-sky-200 hover:border-emerald-300 text-sky-600'
                            } transition-all font-medium`}
                        >
                            Pix
                        </button>
                    </div>
    
                    {/* Botão Filtrar */}
                    <div className="flex items-end">
                        <button 
                            onClick={filtrar}
                            className="w-full h-fit flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
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
                className="absolute top-4 left-4 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-sky-200 group"
            >
                <ArrowUturnLeftIcon className="w-5 h-5 text-sky-600 group-hover:text-indigo-600 transition-colors" />
                <span className="text-xl text-sky-700 group-hover:text-indigo-700 font-medium transition-colors">Voltar</span>
            </button>
    
            {/* Área de Resultados */}
            <div className="flex-1 min-h-0 overflow-y-auto px-8 pb-8 scrollbar">
                {vazio ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-full py-12"
                    >
                        <DocumentMagnifyingGlassIcon className="w-24 h-24 text-sky-300 mb-4 animate-pulse" />
                        <p className="text-3xl text-sky-400 font-medium bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                            Nenhuma Nota encontrada
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                        {[...notas1, ...notas2, ...notas3].map((item) => (
                            <motion.div 
                                key={item[0]}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl border-2 border-sky-100 shadow-xl hover:shadow-2xl transition-all duration-300"
                            >
                                {/* Cabeçalho */}
                                <div className="flex justify-between items-start p-6 pb-4 bg-gradient-to-br from-sky-50 to-white border-b-2 border-sky-100">
                                    <div>
                                        <h3 className="text-xl font-bold text-sky-900 mb-1 flex items-center gap-2">
                                            <span className="bg-sky-600 text-white px-3 py-1 rounded-full text-sm shadow-md">
                                                #{item[1]}
                                            </span>
                                            <span className="text-sky-500 text-sm font-medium">
                                                {format(parseISO(item[3]), "dd/MM/yyyy - HH:mm")}
                                            </span>
                                        </h3>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-lg font-bold text-emerald-600">
                                                Total: R$ {item[2].toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
    
                                {/* Conteúdo */}
                                <div className="p-6 space-y-6">
                                    {/* Produtos */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-sky-500 uppercase tracking-wide">
                                            Produtos
                                        </h4>
                                        {JSON.parse(item[4]).map((produto, idx) => (
                                            <div key={idx} className="flex items-center gap-3 group">
                                                <div className="w-2 h-2 bg-indigo-400 rounded-full flex-shrink-0 animate-pulse" />
                                                <span className="text-sky-800 font-medium truncate">
                                                    {produto}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
    
                                    {/* Pagamentos */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-sky-500 uppercase tracking-wide">
                                            Pagamentos
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {JSON.parse(item[5]).map((metodo, idx) => {
                                                const valor = JSON.parse(item[6])[idx];
                                                if(valor <= 0) return null;
                                                
                                                const colors = {
                                                    DINHEIRO: 'bg-amber-100 text-amber-800 border-2 border-amber-200',
                                                    DEBITO: 'bg-indigo-100 text-indigo-800 border-2 border-indigo-200',
                                                    PIX: 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200',
                                                    CREDITO: 'bg-purple-100 text-purple-800 border-2 border-purple-200'
                                                };
                                                
                                                return (
                                                    <div key={idx} className={`${colors[metodo]} px-3 py-2 rounded-xl flex justify-between items-center`}>
                                                        <span className="text-sm font-medium">{metodo}</span>
                                                        <span className="text-sm font-bold">R$ {valor.toFixed(2)}</span>
                                                    </div>
                                                )}
                                            )}
                                        </div>
                                    </div>
                                </div>
    
                                {/* Rodapé */}
                                <div className="px-6 py-3  border-t-2 border-sky-100 rounded-b-2xl">
                                    <span className="text-xs font-medium text-sky-400">
                                        ID: {item[0].split('-')[0]}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HistoricoNotas;