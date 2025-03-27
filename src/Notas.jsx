import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { easeInOut, motion } from "framer-motion";
import { 
    FaMoneyBillAlt,
    FaCreditCard,
    FaCheckCircle,
    FaTrash,
    FaPlus,
    FaMinus,
    FaShoppingCart,
    FaArrowLeft,
    FaRegTimesCircle
  } from 'react-icons/fa';
  import { MdPointOfSale } from 'react-icons/md';
  import { SiPix } from 'react-icons/si';
  
  

const Notas = ({comandap , produtosp , voltar })=>{
    const[dinheiro , setDinheiro] = useState(0);
    const[debito , setDebito] = useState(0);
    const[pix , setPix] = useState(0);
    const[credito , setCredito] = useState(0);
    const[comanda , setComanda] = useState([]);
    const[produtos , setProdutos] = useState([]);
    const[erro , setErro] = useState(null);
    const[visue , setVisuE] = useState(false);
    const[nota , setNota] = useState(null);
    

    useEffect(()=>{
        setComanda(comandap);
        setProdutos(produtosp);
    },[comandap , produtosp]);
    
useEffect(() => {
    setTimeout(() => {
      setVisuE(false);
    }, 2250);
  }, [erro])

    const aumento= async(index) =>{
        const updated = comanda.quantidade_prod.map((item, i) =>
            i === index ? item + 1 : item
        );
        setComanda((prev) => ({
            ...prev,
            quantidade_prod: updated,
        }));
        const dados ={
            produtosIds: produtos.map((item) => item.id_produto),
            Identificador: comanda?.identificador, 
            quantidade_prod: updated,
        };
        const url = `http://localhost:8080/comandas/${comanda.id_Comanda}`;
        try{const res = await axios.put(url, dados);
            console.log("Comanda atualizada com sucesso:", res.data);
        } catch (error) {
            console.error("Erro ao atualizar comanda:", error);
  }
    }   
    const decremento = async(index)=>{
        const updatedQuantidadeProd = comanda.quantidade_prod.map((item, i) =>
            i === index ? Math.max(item - 1, 0) : item
        );
        setComanda((prev) => ({
            ...prev,
            quantidade_prod: updatedQuantidadeProd,
        }));
        const dados ={
            produtosIds: produtos.map((item) => item.id_produto),
            Identificador: comanda?.identificador, 
            quantidade_prod: updatedQuantidadeProd,
        };
        const url = `http://localhost:8080/comandas/${comanda.id_Comanda}`;
        try{
        const res = await axios.put(url, dados);
        console.log("Comanda atualizada com sucesso:", res.data);
        } catch (error) {
        console.error("Erro ao atualizar comanda:", error);
        }
    }
    const excluir = async(id)=>{
        if(produtos.length===1){
            setErro("comanda vazia");
            setVisuE(true);
            return;
        }
        const updatedProd = produtos.filter((item) => item.id_produto !== id);
        setProdutos(updatedProd);
        let updatedQtd;
        if (comanda) { 
          updatedQtd = { ...comanda };
          updatedQtd.quantidade_prod = updatedQtd.quantidade_prod.filter(
            (_, i) => produtos[i].id_produto !== id
          );
          setComanda(updatedQtd)
        }
       try{
        const url = `http://localhost:8080/comandas/${comanda.id_Comanda}`;
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
    }
    const Mdinheiro= (event) => {
        const newDinheiro = parseFloat(event.target.value) || 0
        setDinheiro(newDinheiro);
    };
    const Mdebito = (event) =>{
        const newDebito = parseFloat(event.target.value)||0
        setDebito(newDebito);
    };
    const Mpix = (event) =>{
        const newpix = parseFloat(event.target.value)||0
        setPix(newpix);
    };
    const Mcredito = (event) =>{
        const newcredito = parseFloat(event.target.value) ||0
        setCredito(newcredito);
    };
    const fecharerro = ()=>{
        setVisuE(false);
    }
    const CriarNota = async()=>{
        console.log("ll")
        if(totalp!=total){
            setErro("o valores não correspondem");
            setVisuE(true);
            return;
        }
       
        else{
            const horaLocal = new Date();
            horaLocal.setHours(horaLocal.getHours() - horaLocal.getTimezoneOffset() / 60);
            const horaFormatada = horaLocal.toISOString().replace('Z', '');
            const dados= {
                valores: [
                    dinheiro,
                    debito,
                    pix,
                    credito
                ],
                FormaDePagamento: [
                    "DINHEIRO",
                    "DEBITO",
                    "PIX",
                    "CREDITO"
                ],
                dataTime: horaFormatada

            }
            const url= `http://localhost:8080/comandas/fecharcomanda/${comanda.id_Comanda}`
            try{
            const resp = await axios.post(url,dados);
            console.log(resp.data);
            if(resp.data){
                setNota(resp.data);
                
            }
        }
        catch(error){
            console.log(error);
            setErro(error);
            setVisuE(true);
        }
        }
    }  
    const total = produtos
    .map((prod, index) => prod.valor_produto * comanda.quantidade_prod?.[index])
    .reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
    const totalp = dinheiro + debito + pix + credito;
    const totalpago = total-(dinheiro + debito + pix + credito);
    
    return (
        <>
          {/* Modal de Nota Fiscal */}
          {nota && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Nota Fiscal</h2>
                  <button
                    onClick={() => setNota(null)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <FaRegTimesCircle className="text-2xl" />
                  </button>
                </div>
                
                <pre className="whitespace-pre-wrap p-6 text-lg font-mono bg-gray-50 flex-1 overflow-auto max-h-[70vh]">
                  {nota}
                </pre>
                
                <div className="p-6 bg-gray-100 border-t border-gray-200">
                  <button
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                    onClick={() => window.location.reload()}
                  >
                    <FaCheckCircle className="text-xl" />
                    Confirmar Operação
                  </button>
                </div>
              </motion.div>
            </div>
          )}
    
          {/* Layout Principal */}
          <div className="h-screen w-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Painel Esquerdo - Pagamentos */}
            <div className={`w-[400px] min-w-[400px] bg-white border-r border-gray-200 flex flex-col transition-all ${nota ? "blur-sm" : ""}`}>
              <div className="p-6 border-b border-gray-200 bg-white">
                <button 
                  onClick={()=>voltar}
                  className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <FaArrowLeft className="text-lg" />
                  Voltar para Seleção
                </button>
              </div>
    
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  {/* Seção Dinheiro */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
                      <FaMoneyBillAlt className="text-green-500" />
                      Dinheiro
                    </label>
                    <div className="relative">
                      <input
                        value={dinheiro}
                        onChange={Mdinheiro}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                    </div>
                  </div>
    
                  {/* Seção Débito */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
                      <FaCreditCard className="text-blue-500" />
                      Débito
                    </label>
                    <div className="relative">
                      <input
                        value={debito}
                        onChange={Mdebito}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                    </div>
                  </div>
    
                  {/* Seção Pix */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
                      <SiPix className="text-purple-500" />
                      Pix
                    </label>
                    <div className="relative">
                      <input
                        value={pix}
                        onChange={Mpix}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                    </div>
                  </div>
    
                  {/* Seção Crédito */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
                      <FaCreditCard className="text-amber-500" />
                      Crédito
                    </label>
                    <div className="relative">
                      <input
                        value={credito}
                        onChange={Mcredito}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                    </div>
                  </div>
                </div>
    
                {/* Total Pendente */}
                <div className={`p-4 rounded-xl ${totalpago > 0 ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
                  <div className="flex items-center justify-center gap-2">
                    <MdPointOfSale className={`text-xl ${totalpago > 0 ? "text-red-500" : "text-green-500"}`} />
                    <span className={`text-lg font-semibold ${totalpago > 0 ? "text-red-600" : "text-green-600"}`}>
                      Valor Pendente: R$ {totalpago.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
    
            {/* Painel Direito - Produtos */}
            <div className={`flex-1 flex flex-col ${nota ? "blur-sm" : ""}`}>
              <div className="p-6 border-b border-gray-200 bg-white">
                <h1 className="text-2xl font-bold text-gray-800 truncate flex items-center gap-2">
                  <MdPointOfSale className="text-green-600" />
                  {comanda.identificador || "Comanda Sem Identificação"}
                </h1>
              </div>
    
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-3">
                  {produtos?.map((item, index) => (
                    <motion.div
                      key={item.id_produto}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <button
                            onClick={() => excluir(item.id_produto)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <FaTrash className="text-xl" />
                          </button>
                          <p className="text-lg font-medium text-gray-700 truncate">
                            {item.nome_produto}
                          </p>
                        </div>
    
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Unitário</p>
                            <p className="font-medium">R$ {item.valor_produto.toFixed(2)}</p>
                          </div>
    
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                            <button
                              onClick={() => decremento(index)}
                              className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <FaMinus className="text-sm" />
                            </button>
                            <input
                              value={comanda.quantidade_prod?.[index]}
                              className="w-12 text-center bg-transparent font-medium"
                              readOnly
                            />
                            <button
                              onClick={() => aumento(index)}
                              className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <FaPlus className="text-sm" />
                            </button>
                          </div>
    
                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Total</p>
                            <p className="font-semibold text-green-600">
                              R$ {(item.valor_produto * comanda.quantidade_prod?.[index]).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
    
              {/* Rodapé Fixo */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg">
                <div className="max-w-4xl mx-auto p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MdPointOfSale className="text-green-600 text-2xl" />
                      <p className="text-2xl font-bold text-gray-800">
                        Total: R$ {total.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={()=>CriarNota()}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold flex items-center gap-2 transition-all"
                    >
                      <FaShoppingCart className="text-xl" />
                      Finalizar Comanda
                    </button>
                  </div>
                </div>
              </div>
            </div>
    
            {/* Modal de Erro */}
            {erro && visue && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
              >
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-red-600">
                      <FaRegTimesCircle className="text-2xl" />
                      <h3 className="text-xl font-bold">Erro na Operação</h3>
                    </div>
                    <button
                      onClick={()=>fecharerro}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <FaRegTimesCircle className="text-2xl" />
                    </button>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{erro}</p>
                </div>
              </motion.div>
            )}
          </div>
        </>
      );
}
export default Notas