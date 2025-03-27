import { useState } from "react";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import { 
  XMarkIcon,
  FolderIcon,
  SunIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  MoonIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ReceiptPercentIcon 
} from '@heroicons/react/24/outline';


const More = ({MF , show})=>{
  const navigate = useNavigate();
    const [aberto, setAberto] = useState(true);
    const[mostrar , setMostrar] = useState(false);
    const[cozinha , setCozinha]= useState(false);
console.log("mechamaram");
const handleNavigation = (path) => {
  MF(false); 
  navigate(path); 
};

  
return (
  <>
    <AnimatePresence>
      {aberto && ( 
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}   
          exit={{ opacity: 0, x: 100 }}    
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative z-10 bg-gray-800 bg-opacity-95 backdrop-blur-lg h-screen w-80 shadow-2xl"
        >
          <div className="flex flex-col h-full">
            {/* Cabeçalho */}
            <div className="p-4 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Controle</h2>
              <button
                onClick={() => { MF(false); setAberto(false) }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Seção Operações */}
              <div className="space-y-2">
                <button 
                  onClick={() => setMostrar(!mostrar)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <FolderIcon className="w-5 h-5 text-gray-300" />
                  <span className="text-white">Operações</span>
                  {mostrar ? (
                    <ChevronUpIcon className="w-4 h-4 text-gray-400 ml-auto" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-400 ml-auto" />
                  )}
                </button>

                {/* Suboperações */}
                {mostrar && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-8 space-y-2"
                  >
                    <button
                      onClick={() => show("abertura")}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded-md"
                    >
                      <SunIcon className="w-5 h-5 text-amber-400" />
                      <span className="text-white">Abertura</span>
                    </button>
                    
                    <button
                      onClick={() => show("suprimento")}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded-md"
                    >
                      <PlusCircleIcon className="w-5 h-5 text-green-400" />
                      <span className="text-white">Suprimento</span>
                    </button>
                    
                    <button
                      onClick={() => show("sangria")}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded-md"
                    >
                      <MinusCircleIcon className="w-5 h-5 text-red-400" />
                      <span className="text-white">Sangria</span>
                    </button>
                    
                    <button
                      onClick={() => show("fechamento")}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded-md"
                    >
                      <MoonIcon className="w-5 h-5 text-blue-400" />
                      <span className="text-white">Fechamento</span>
                    </button>
                    <button
                      onClick={() => handleNavigation("/Notas")}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded-md"
                    >
                      <ReceiptPercentIcon className="w-5 h-5 text-gray-300" />
                      <span className="text-white">Notas</span>
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Seção Cozinha */}
              <div className="pt-4 border-t border-gray-600">
                <button
                  onClick={() => setCozinha(!cozinha)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <UserIcon className="w-5 h-5 text-gray-300" />
                  <span className="text-white">Cozinha</span>
                  {cozinha ? (
                    <ChevronUpIcon className="w-4 h-4 text-gray-400 ml-auto" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-400 ml-auto" />
                  )}
                </button>

                {cozinha && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-8 space-y-2 mt-2"
                  >
                    <button
                      onClick={() => handleNavigation("/Pedidos")}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-amber-600 hover:bg-amber-500 rounded-md"
                    >
                      <ClockIcon className="w-5 h-5 text-amber-100" />
                      <span className="text-white">Pedidos Ativos</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigation("/PedidosFinalizados")}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 rounded-md"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-green-100" />
                      <span className="text-white">Histórico</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
);
}
export default More