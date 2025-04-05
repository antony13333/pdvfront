import axios from "axios";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { XMarkIcon, CheckIcon ,CurrencyDollarIcon,
  CreditCardIcon,
  QrCodeIcon,
  CheckCircleIcon  } from '@heroicons/react/24/outline';


const Operation = ({ toShow, fechar, aberto, abrir }) => {
  const [Toshow, setToshow] = useState("");
  const [abertura, setAbertura] = useState([]);
  const [suprimento, setSuprimento] = useState([]);
  const [sangria, setSangria] = useState([]);
  const [dinheiro, setDinheiro] = useState(0);
  const [debito, setDebito] = useState(0);
  const [pix, setPix] = useState(0);
  const [credito, setCredito] = useState(0);
  const [err, seterro] = useState(null);
  const [visue, setvisue] = useState(false);
  const [confim, setConfirm] = useState(null);
  const [visuC, setvisuC] = useState(false);
  const [visuCerteza, setVisuCE] = useState(false);
  const [fechamento, setFechamneto] = useState(null);

  useEffect(() => {
    
    setToshow(toShow);
  }, [toShow]);
 
  useEffect(() => {
    setTimeout(() => {
      setvisuC(false);
    }, 2500);
  }, [confim])
  
  useEffect(() => {
    setTimeout(() => {
      setvisue(false);
    }, 2500);
  }, [err])

  const fecharerro = () => {
    setvisue(false);
  }
  const Pabt = (event) => {
    const newabt = parseFloat(event.target.value) || 0
    setAbertura(newabt);
  }
  const SaveAbertura = async () => {
    if (abertura < 0) {
      seterro("valor de abertura inválido")
      setvisue(true);
    }
    if (aberto) {
      seterro("Já existe uma abertura")
      setvisue(true);
    }
    else {
      const body = {
        Dinheiro_abertura: abertura
      }
      const url = `${API_URL}/aberturaCaixa`
      try {
        const status = await axios.post(url, body);
        console.log(status.data);
        setConfirm("Abertura no valor de /R$" + abertura + "/ bem sucedida")
        setvisuC(true);
        setToshow(false);
        abrir();
      }
      catch (erro) {
        seterro("Feche a Abertura Anterior");
        setvisue(true);
      }
    }
  }
  const Pdebt = (event) => {
    const debt = parseFloat(event.target.value) || 0
    console.log(debt);
    setDebito(debt);
  }

  const Pdin = (event) => {
    const din = parseFloat(event.target.value) || 0
    console.log(din);
    setDinheiro(din);
  }

  const Ppix = (event) => {
    const Npix = parseFloat(event.target.value) || 0
    console.log(Npix);
    setPix(Npix);
  }

  const Pcrt = (event) => {
    const crt = parseFloat(event.target.value) || 0
    console.log(crt);
    setCredito(crt);
  }

  const SaveFechamento = async () => {
    if (dinheiro < 0 || debito < 0 || pix < 0 || credito < 0) {
      seterro("valor(es) inválido(s)");
      setvisue(true);
    }
    else {
      console.log(dinheiro);
      console.log(debito);
      console.log(pix);
      console.log(credito);
      
      const url = `${API_URL}/fechamento`
      const body = {
        Credito: credito,
        Debito: debito,
        Dinheiro: dinheiro,
        Pix: pix
      }
      console.log(body);
      try {
        const status = await axios.post(url, body);
        console.log(status.data);
        setFechamneto(status.data);
        setVisuCE(false);
        abrir();
      }
      catch (erro) {
        seterro("Não existe abertura registrada hoje");
        setvisue(true);
      }
    }
  }

  const Psup = (event) => {
    const Nsuprimento = parseFloat(event.target.value) || 0
    setSuprimento(Nsuprimento);

  }

  const SaveSupri = async () => {
    if (suprimento <= 0) {
      seterro("valor inválido");
      setvisue(true);
    }
    
    else if(aberto===false){
      seterro("Necessário Abertura");
      setvisue(true);
    }
    else {
      console.log("test suprimento");
      const value = {
        valor: suprimento
      }
      const url = `${API_URL}/suprimento`
      try {
        const resp = await axios.post(url, value);
        console.log(resp.data);
        setConfirm("Suprimento bem sucedido");
        setvisuC(true);
        setToshow(null);
      }
      catch (error) {
        seterro(error);
        setvisue(true);
      }
    }
  }
  const Psan = (event) => {
    const Nsangria = parseFloat(event.target.value) || 0
    setSangria(Nsangria);
  }
  const SaveSangramento = async () => {
    if (sangria <= 0) {
      seterro("valor invalido");
      setvisue(true);
    }
    else if(aberto===false){
      seterro("Necessário Abertura");
      setvisue(true);
    }
    else {
      console.log("test sangria");
      const value = {
        valor: sangria
      }
      const url = `${API_URL}/sangria`
      try {
        const resp = await axios.post(url, value);
        console.log(resp.data);
        setConfirm("Sangria bem sucedida");
        setvisuC(true);
        setToshow(null);
      }
      catch (error) {
        seterro(error);
        setvisue(true);
      }
    }
  }




  return (
    <>
      {/* Toast de Sucesso */}
      {confim && visuC && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 right-8 z-50 p-4 bg-green-100 border-2 border-green-300 text-green-800 rounded-lg shadow-xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">✅</span>
            <p className="font-medium">{confim}</p>
          </div>
        </motion.div>
      )}
  
      {/* Toast de Erro */}
      {err && visue && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-8 right-8 z-50 p-4 bg-red-100 border-2 border-red-300 text-red-800 rounded-lg shadow-xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">❌</span>
            <p className="font-medium">{err}</p>
            <button 
              onClick={()=>fecharerro()}
              className="ml-4 p-1 hover:bg-red-200 rounded-full"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
  
      {/* Modal de Confirmação */}
      {visuCerteza && !err&&(
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-center mb-6">
              Tem certeza dos valores inseridos?
            </h3>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setVisuCE(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Não
              </button>
              <button
                onClick={()=>SaveFechamento()}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg 
                         transition-all duration-200 flex items-center gap-2"
              >
                <CheckIcon className="w-5 h-5" />
                Sim
              </button>
            </div>
          </div>
        </motion.div>
      )}
  
      {/* Modal Principal */}
      {toShow!="Pedidos" && toShow!="PedidosFinalizados" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 flex items-center justify-center"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={()=>fechar()}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
  
            {toShow === "abertura" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-emerald-600">Abertura</h2>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 font-medium">Valor em dinheiro</label>
                  <div className="relative">
                    <input
                      type="number"
                      onChange={Pabt}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  </div>
                </div>
                <button
                  onClick={()=>SaveAbertura()}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  Confirmar
                </button>
              </div>
            )}
  
            {toShow === "suprimento" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-blue-600">Suprimento</h2>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 font-medium">Valor do suprimento</label>
                  <div className="relative">
                    <input
                      type="number"
                      onChange={Psup}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  </div>
                </div>
                <button
                  onClick={()=>SaveSupri()}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  Confirmar
                </button>
              </div>
            )}
  
            {toShow === "sangria" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-red-600">Sangria</h2>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 font-medium">Valor da sangria</label>
                  <div className="relative">
                    <input
                      type="number"
                      onChange={Psan}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  </div>
                </div>
                <button
                  onClick={()=>SaveSangramento()}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  Confirmar
                </button>
              </div>
            )}
  
            {toShow === "fechamento" && (
               <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center"
             >
               <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative">
                 <button
                   onClick={()=>fechar()}
                   className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                 >
                   <XMarkIcon className="w-6 h-6 text-gray-600" />
                 </button>
           
                 <div className="space-y-6">
                   <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                     Fechamento do Caixa
                   </h2>
                   
                   <div className="space-y-5">
                     {/* Dinheiro */}
                     <div className="flex flex-col gap-1.5">
                       <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                         <CurrencyDollarIcon className="w-5 h-5 text-green-500" />
                         Dinheiro
                       </label>
                       <div className="relative">
                         <input
                           type="number"
                           onChange={Pdin}
                           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                           placeholder="0,00"
                         />
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                       </div>
                     </div>
           
                     {/* Débito */}
                     <div className="flex flex-col gap-1.5">
                       <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                         <CreditCardIcon className="w-5 h-5 text-blue-500" />
                         Cartão de Débito
                       </label>
                       <div className="relative">
                         <input
                           type="number"
                           onChange={Pdebt}
                           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                           placeholder="0,00"
                         />
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                       </div>
                     </div>
           
                     {/* Pix */}
                     <div className="flex flex-col gap-1.5">
                       <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                         <QrCodeIcon className="w-5 h-5 text-teal-500" />
                         Pix
                       </label>
                       <div className="relative">
                         <input
                           type="number"
                           onChange={Ppix}
                           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                           placeholder="0,00"
                         />
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                       </div>
                     </div>
           
                     {/* Crédito */}
                     <div className="flex flex-col gap-1.5">
                       <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                         <CreditCardIcon className="w-5 h-5 text-purple-500" />
                         Cartão de Crédito
                       </label>
                       <div className="relative">
                         <input
                           type="number"
                           onChange={Pcrt}
                           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                           placeholder="0,00"
                         />
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                       </div>
                     </div>
                   </div>
           
                   <button
                     onClick={() => setVisuCE(true)}
                     className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                   >
                     <CheckCircleIcon className="w-6 h-6" />
                     Confirmar Valores
                   </button>
                 </div>
               </div>
             </motion.div>
            )}
          </div>
        </motion.div>
      )}
  
      {/* Relatório de Fechamento */}
      {fechamento && !visuCerteza && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Fechamento</h2>
              <button
                onClick={()=>fechar()}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-left">Método</th>
                    <th className="px-6 py-4 font-semibold text-left">Valor</th>
                    <th className="px-6 py-4 font-semibold text-left">Quebra</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">💳 Crédito</td>
                    <td className="px-6 py-4">R$ {fechamento.credito}</td>
                    <td className={`px-6 py-4 font-semibold ${fechamento.quebraCredito < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {fechamento.quebraCredito}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">Dinheiro</td>
                    <td className="px-6 py-4">R$ {fechamento.dinheiro}</td>
                    <td className={`px-6 py-4 font-semibold ${fechamento.quebraDinheiro < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {fechamento.quebraDinheiro}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">Débito</td>
                    <td className="px-6 py-4">R$ {fechamento.debito}</td>
                    <td className={`px-6 py-4 font-semibold ${fechamento.quebraDebito < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {fechamento.quebraDebito}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">Pix</td>
                    <td className="px-6 py-4">R$ {fechamento.pix}</td>
                    <td className={`px-6 py-4 font-semibold ${fechamento.quebraPix < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {fechamento.quebraPix}
                    </td>
                  </tr>
                  
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
export default Operation