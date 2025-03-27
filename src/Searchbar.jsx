import axios from "axios"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar= ({selectedproduto})=> {
    const[produtos , setProdutos] = useState([]);
    const[query , setQuery] = useState('');
    const[results , setResults] = useState([]);
const prodfetch = async()=>{
    try{
        const status = await axios.get('http://localhost:8080/produtosrestaurante')
            setProdutos(status.data);
            setResults(status.data);
    }
    catch(error){
        console.log(error)
    }
}
useEffect(()=>{
    prodfetch();
},[]);
useEffect(()=>{
    if(produtos.length>0){
        const filtro = produtos.filter((produto)=>
        produto.nome_produto.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtro)
    }
}, [query , produtos]);
return (
    <div className="relative mx-10 mt-9">
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
        >
            <div className="flex items-center bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <FiSearch className="ml-4 text-gray-400 text-xl" />
                <input
                    autoComplete="off"
                    className="w-full py-3 px-4 bg-transparent focus:outline-none text-lg placeholder-gray-400 caret-blue-500 uppercase tracking-wide"
                    type="text"
                    id="t1"
                    placeholder="Digite o Nome do Produto"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="mr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX className="text-xl" />
                    </button>
                )}
            </div>
        </motion.div>

        <AnimatePresence>
  {query && (
    <motion.ul
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute w-full mt-2 bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
    >
      <div className="max-h-96 overflow-y-auto scrollbar-hide"> 
        {results.map((item) => (
          <motion.li
            key={item.id_produto}
            onClick={() => {
              selectedproduto({ ...item });
              setQuery("");
            }}
            className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
            whileHover={{ x: 5 }}
          >
            <span className="text-gray-800 font-medium tracking-wide">
              {item.nome_produto.toUpperCase()}
            </span>
            <span className="text-blue-600 font-semibold">
              {`R$ ${item.valor_produto.toFixed(2)}`}
            </span>
          </motion.li>
        ))}
        
        {results.length === 0 && (
          <div className="px-6 py-4 text-gray-400 text-center">
            Nenhum produto encontrado
          </div>
        )}
      </div>
    </motion.ul>
  )}
</AnimatePresence>
    </div>
);

}
export default SearchBar