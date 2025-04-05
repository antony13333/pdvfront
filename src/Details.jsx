
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react"
import { motion } from "framer-motion";
import { FiX, FiCheckCircle } from 'react-icons/fi';
const Details =  ({comanda , produtos , setvisu , close, aberto})=>{
    const[prod , setProd] = useState([]);
    const[qtd , setQtd] = useState({ identificador: "", quantidade_prod: [] });
    const[fechar , setfechar] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const[visuA ,  setvisuA] = useState(false);
    const[alert , setalert] = useState(null);
    const[erro , seterro] = useState(null);
    const[visue , setvisue] = useState(false);

        useEffect(()=>{
            if(comanda){
            setQtd(comanda);
            console.log(comanda.quantidade_prod)
            setProd(produtos);
            const quantidadeProdSize = comanda.quantidade_prod?.length || 0;
            const produtosSize = produtos?.length || 0;
        if (quantidadeProdSize !== produtosSize) {
            setQtd((prev) => ({
                ...prev,
                quantidade_prod: prev.quantidade_prod && Array.isArray(prev.quantidade_prod) 
                ? [...prev.quantidade_prod, 1] 
                : [1], 
            }));
        }
            
        } 
        }, [comanda , produtos ] );
        
        useEffect(() => {
            const timeoutId = setTimeout(() => {
              setvisue(false);
            }, 2250);
          
            return () => clearTimeout(timeoutId);
          }, [visue]);
    
    const aumento = async(chave)=>{
        const updated = qtd.quantidade_prod.map((item, i) =>
            i === chave ? item + 1 : item
        );
        setQtd((prev) => ({
            ...prev,
            quantidade_prod: updated,
        }));
        const dados ={
            produtosIds: prod.map((item) => item.id_produto),
            Identificador: comanda?.identificador, 
            quantidade_prod: updated,
        };
        const url = `https://pdv-production.up.railway.app/comandas/${comanda.id_Comanda}`;
        try{const res = await axios.put(url, dados);
            console.log("Comanda atualizada com sucesso:", res.data);
        } catch (error) {
            console.error("Erro ao atualizar comanda:", error);
  }

    };
    const decremento = async(chave) =>{
        const updatedQuantidadeProd = qtd.quantidade_prod.map((item, i) =>
            i === chave ? Math.max(item - 1, 0) : item
        );
        setQtd((prev) => ({
            ...prev,
            quantidade_prod: updatedQuantidadeProd,
        }));
        const dados ={
            produtosIds: prod.map((item) => item.id_produto),
            Identificador: comanda?.identificador, 
            quantidade_prod: updatedQuantidadeProd,
        };
        const url = `https://pdv-production.up.railway.app/comandas/${comanda.id_Comanda}`;
        try{
        const res = await axios.put(url, dados);
        console.log("Comanda atualizada com sucesso:", res.data);
        } catch (error) {
        console.error("Erro ao atualizar comanda:", error);
        }
        

        
    }
    const idtchange = async(nome)=>{
      const url= `https://pdv-production.up.railway.app/comandas/${comanda.id_Comanda}`
        const dados= {
            produtosIds: prod.map(item => item.id_produto),
            Identificador: nome,
            quantidade_prod: qtd.quantidade_prod
        }
        try{
        const res = await axios.put(url , dados)
    }
    catch(error){
        console.log(error);
    }
    }
   const exclude = async (id) => {
    console.log(prod.length);
    if (prod.length === 1) {
        seterro("A comanda não pode ficar vazia.");
        setvisue(true);
        return;
      }
  try {
    
    const updatedProd = prod.filter((item) => item.id_produto !== id);
    setProd(updatedProd);

   
    let updatedQtd;
    if (qtd) { 
      updatedQtd = { ...qtd };
      updatedQtd.quantidade_prod = updatedQtd.quantidade_prod.filter(
        (_, i) => prod[i].id_produto !== id
      );
      setQtd(updatedQtd)
    }

    const url = `https://pdv-production.up.railway.app/comandas/${comanda.id_Comanda}`;
    const dados = {
      produtosIds: updatedProd.map((item) => item.id_produto),
      Identificador: comanda?.identificador, 
      quantidade_prod: updatedQtd?.quantidade_prod, 
    };

    const res = await axios.put(url, dados);
    console.log("Comanda atualizada com sucesso:", res.data);
  } catch (error) {
    console.error("Erro ao atualizar comanda:", error);
  }
};

    const update = async()=>{
        const url= `https://pdv-production.up.railway.app/comandas/${comanda.id_Comanda}`
        const dados= {
            produtosIds: prod.map(item => item.id_produto),
            Identificador: qtd.identificador,
            quantidade_prod: qtd.quantidade_prod
        }
        try{
        const res = await axios.put(url , dados)
            setvisu(false);    
            
    }
    catch(error){
        console.log(error);
    }
    const url2= `https://pdv-production.up.railway.app/postpedido`
    const filterprods= prod.filter(item => item.vai_para_cozinha);
    const indexf= prod.map((item, index)=> item.vai_para_cozinha? index: -1)
    .filter(index => index!== -1);
    const dados2={
      produtos: filterprods.map(pro=>pro.id_produto),
      comanda: comanda.id_Comanda,
      quantidades: indexf.map(index=>qtd.quantidade_prod[index])
    }
    try{
      const resposta = await axios.post(url2, dados2);
      console.log(resposta.data);

    }
    catch(error){
      console.log(error);
    }
    }
    const fecharAlert=()=>{
        setvisuA(false);
      }
    const fecharerro=()=>{
        setvisue(false);
      }
    
      const total = prod
  .map((prod, index) => prod.valor_produto * qtd.quantidade_prod?.[index])
  .reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
    

  return (
    <>
        {/* Modal de Erro */}
        {erro && visue && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
            >
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-red-500 text-white p-6 rounded-lg w-11/12 max-w-2xl">
                        <button
                            className="absolute right-2 top-2 text-xl hover:text-red-200"
                            onClick={()=>fecharerro()}
                        >
                            ×
                        </button>
                        <p className="text-xl text-center">{erro}</p>
                    </div>
                </div>
            </motion.div>
        )}

        {/* Modal de Alerta */}
        {alert && visuA && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
            >
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-yellow-400 text-white p-6 rounded-lg w-11/12 max-w-2xl">
                        <button
                            className="absolute right-2 top-2 text-xl hover:text-red-500"
                            onClick={()=>fecharAlert()}
                        >
                            ×
                        </button>
                        <p className="text-xl text-center mb-4">{alert}</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                                onClick={() => { update(); close(qtd, prod); }}
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}

        {/* Conteúdo Principal */}
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Cabeçalho */}
            <div className="px-4 pt-4 bg-white shadow-sm">
                <input
                    className="w-full ml-14 max-w-2xl mx-auto bg-gray-100 rounded-xl px-6 py-3 text-center text-xl border-0 focus:ring-2 focus:ring-green-500 focus:bg-white"
                    placeholder="Nome da Comanda"
                    value={qtd.identificador}
                    onChange={(e) => setQtd(prev => ({ ...prev, identificador: e.target.value }))}
                />
            </div>

            {/* Lista de Produtos com Scroll Controlado */}
            <div 
                className="flex-1 overflow-y-auto px-4 pb-24"
                style={{
                    height: 'calc(100vh - 180px)',
                    maxHeight: 'calc(100vh - 180px)'
                }}
            >
                <div className="max-w-2xl mx-auto space-y-3">
                    {prod?.map((item, index) => (
                      item.nome_produto?(<div key={item.id_produto} className="flex mt-3 items-center justify-between bg-white shadow-sm rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 flex-1">
                            <button
                                className="text-red-500 hover:text-red-600 text-2xl w-8 h-8 flex items-center justify-center"
                                onClick={() => exclude(item.id_produto, index)}
                            >
                                ×
                            </button>
                            <p className="text-lg font-medium truncate">{item.nome_produto}</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <p className="text-lg w-24 text-right">R${item.valor_produto}</p>
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                                <button
                                    className="px-2 hover:bg-gray-200 rounded text-lg"
                                    onClick={() => decremento(index)}
                                >
                                    -
                                </button>
                                <input
                                    className="w-12 text-center bg-transparent font-medium"
                                    value={qtd.quantidade_prod?.[index]}
                                    readOnly
                                />
                                <button
                                    className="px-2 hover:bg-gray-200 rounded text-lg"
                                    onClick={() => aumento(index)}
                                >
                                    +
                                </button>
                            </div>
                            <p className="text-lg w-28 text-right font-semibold text-green-600">
                                R${(item.valor_produto * qtd.quantidade_prod?.[index]).toFixed(2)}
                            </p>
                        </div>
                    </div>):null
                        
                    ))}
                </div>
            </div>

{/* Barra de Total Fixa */}
<div className="fixed bottom-0 left-0 right-0 border-t bg-gradient-to-r from-green-600 to-green-700 z-30">
    <div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
        <div className="text-white flex-1 min-w-[200px]">  {/* Controle de largura mínima */}
            <p className="text-sm font-medium opacity-90">Total da Comanda</p>
            <p className="text-2xl font-bold">R${total.toFixed(2)}</p>
        </div>
        
        <button
            className="h-12 px-8 bg-white hover:bg-gray-50 text-green-700 text-lg font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2 ml-auto" 
            onClick={() => setfechar(true)}
        >
            <span>Finalizar Comanda</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        </button>
    </div>
</div>
        </div>

        {/* Modal de Confirmação */}
        {fechar && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
                <div className="bg-white p-6 rounded-2xl w-11/12 max-w-md shadow-xl">
                    <button
                        className="float-right text-gray-500 hover:text-red-500 text-2xl -mt-2 -mr-2"
                        onClick={() => setfechar(false)}
                    >
                        ×
                    </button>
                    <div className="text-center mb-4">
                        <p className="text-xl font-semibold text-gray-800">Confirmar pagamento da comanda:</p>
                        <p className="text-2xl text-green-600 mt-2 font-medium">{qtd.identificador}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-4">R${total.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                            onClick={() => {
                                if (aberto) {
                                    update();
                                    close(qtd, prod);
                                } else {
                                    setalert("Atenção: A abertura ainda não foi realizada");
                                    setvisuA(true);
                                }
                                setfechar(false);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Confirmar
                        </button>
                        <button
                            className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                            onClick={async () => {await update();window.location.reload();}}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
);
    };
    
export default Details