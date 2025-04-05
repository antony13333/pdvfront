import axios from "axios";
import { tr } from "framer-motion/client";
import { useEffect, useState } from "react"
import { CheckCircleIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom";


const Pedidos = ({toshow})=>{
    const nav = useNavigate();
const [pedidosEspera, setPedidosEspera] = useState([]);
const [espera1, setEspera1] = useState([]);
  const [espera2, setEspera2] = useState([]);
  const [preparo1, setPreparo1] = useState([]);
  const [preparo2, setPreparo2] = useState([]);
const [pedidosPreparo , setPedidosPreparo] = useState([]);
const [pedidopreparar , setPedidoPreparar] = useState(null);
const[aviso, setAviso] = useState(false);

useEffect(()=>{
    const interval = setInterval(()=>{
        buscarEMEspera();
        buscarEmPreparo();
    },5000);
    buscarEMEspera();
    return()=>clearInterval(interval);
}, []);

useEffect(() => {
    setTimeout(() => {
      setAviso(false);
    }, 2500);
  }, [aviso])

useEffect(()=>{
buscarEmPreparo();
}, [pedidosPreparo])

const buscarEMEspera = async()=>{
    try{
        const response = await axios.get(`https://pdv-production.up.railway.app/pedidosEspera`)
        const pedidos = response.data.map((pedido) => {
            const { tempoDecorrido, maisDe10Minutos } = formatarHorario(pedido[6]); 
            return {
                ...pedido,
                h: tempoDecorrido,
                a: maisDe10Minutos, 
            };
          });

            setPedidosEspera(pedidos);
            console.log(pedidos);
            var espera1 = pedidos.filter((_, index)=> index % 2 ===0);
            setEspera1(espera1);
            var espera2 = pedidos.filter((_,index)=> index % 2 !==0);
            setEspera2(espera2);
        }
        
    catch(erro){
        console.log(erro);
    }
}
const buscarEmPreparo = async()=>{
    try{
        const response = await axios.get(`https://pdv-production.up.railway.app/pedidosPreparo`)
        const pedidos = response.data.map((pedido) => {
            const { tempoDecorrido, maisDe10Minutos } = formatarHorario(pedido[6]); 
            console.log(response.data);
            return {
                ...pedido,
                h: tempoDecorrido,
                a: maisDe10Minutos, 
            };
          });
          setPedidoPreparar(pedidos);
            var preparo1 = pedidos.filter((_, index)=> index % 2 ===0);
            setPreparo1(preparo1);
            var preparo2 = pedidos.filter((_,index)=> index % 2 !==0);
            setPreparo2(preparo2);
    } 
    catch(error){
        console.log(error);
    }
}
const Preparar = async(key)=>{
    const dados = {
        Idpedido: JSON.parse(key),
        Newstatus: "Preparo"
    }
    const url = `https://pdv-production.up.railway.app/atualizarPedido`
    try{
        const response = await axios.put(url, dados);
        setPedidosPreparo(response.data);
        buscarEMEspera();
        buscarEmPreparo();
    }
    catch(error){
        console.log(error);
    }
}
const Entregar = async(array)=>{
    const dados = {
        Idpedido: JSON.parse(array),
        Newstatus: "Finalizado"
    }
    const url = `https://pdv-production.up.railway.app/atualizarPedido`
    try{
        const response = await axios.put(url, dados);
       setAviso(true);
        buscarEMEspera();
        buscarEmPreparo();
    }
    catch(error){
        console.log(error);
    }
}

const formatarHorario = (horario) => {
    const data = new Date(horario);
    const agora = new Date();
    const diferencaMs = agora - data; 
  
    const segundos = Math.floor(diferencaMs / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
  
    let tempoDecorrido = '';
    let maisDe10Minutos = false;
  
    if (dias > 0) {
        tempoDecorrido = `${dias} dia${dias > 1 ? 's' : ''}`;
    } else if (horas > 0) {
        tempoDecorrido = `${horas} hora${horas > 1 ? 's' : ''}`;
    } else if (minutos > 0) {
        tempoDecorrido = `${minutos} minuto${minutos > 1 ? 's' : ''}`;
    } else {
        tempoDecorrido = `${segundos} segundo${segundos > 1 ? 's' : ''}`;
    }

    if (minutos > 20) {
        maisDe10Minutos = true;
    }

    return { tempoDecorrido, maisDe10Minutos }; 
};
return (
    <>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex p-6 pt-24 gap-6 w-screen min-h-screen">
            <AnimatePresence>
                {aviso && (
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed z-50 bottom-6 right-6"
                    >
                        <div className="flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-xl">
                            <CheckCircleIcon className="w-8 h-8" />
                            <p className="text-lg font-semibold">Pedido Enviado Com Sucesso!</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                onClick={()=>nav("/")}
                className="absolute top-4 left-4 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
                <ArrowUturnLeftIcon className="w-5 h-5 text-gray-600" />
                <span className="text-xl text-gray-700">Voltar</span>
            </button>

            <h1 className="absolute top-4 left-1/2 -translate-x-1/2 text-5xl font-bold text-gray-800">Pedidos</h1>

            {/* Coluna Em Espera */}
            <div className="flex-1 rounded-xl bg-white border border-gray-200 p-6 shadow-lg">
                <div className="mb-6 pb-4 border-b border-gray-200">
                    <h2 className="text-4xl font-bold text-amber-500">Em Espera</h2>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5 auto-rows-min overflow-auto">
                    {[...espera1, ...espera2].map((pedido) => (
                        <motion.div 
                            key={pedido[1]}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col group"
                        >
                            <div className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                                <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <p className="font-semibold text-xl text-gray-700 truncate">{pedido[2]}</p>
                                    <span className={`text-lg font-medium ${pedido.a ? 'text-red-500' : 'text-green-500'}`}>
                                        {pedido.h}
                                    </span>
                                </div>
                                <div className="flex-1 p-3 space-y-2">
                                    {JSON.parse(pedido[3]).map((produto, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-lg text-gray-600 px-2">
                                            <span className="truncate">{produto}</span>
                                            <span className="text-gray-500 font-medium">x{JSON.parse(pedido[4])[idx]}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => Preparar(pedido[1])}
                                    className="mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 transition-colors rounded-b-lg"
                                >
                                    Iniciar Preparo
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Coluna Em Preparo */}
            <div className="flex-1 rounded-xl bg-white border border-gray-200 p-6 shadow-lg">
                <div className="mb-6 pb-4 border-b border-gray-200">
                    <h2 className="text-4xl font-bold text-sky-500">Em Preparo</h2>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5 auto-rows-min overflow-auto">
                    {[...preparo1, ...preparo2].map((pedido) => (
                        <motion.div 
                            key={pedido[1]}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col group"
                        >
                            <div className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                                <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <p className="font-semibold text-xl text-gray-700 truncate">{pedido[2]}</p>
                                    <span className={`text-lg font-medium ${pedido.a ? 'text-red-500' : 'text-green-500'}`}>
                                        {pedido.h}
                                    </span>
                                </div>
                                <div className="flex-1 p-3 space-y-2">
                                    {JSON.parse(pedido[3]).map((produto, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-lg text-gray-600 px-2">
                                            <span className="truncate">{produto}</span>
                                            <span className="text-gray-500 font-medium">x{JSON.parse(pedido[4])[idx]}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => Entregar(pedido[1])}
                                    className="mt-2 bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 transition-colors rounded-b-lg"
                                >
                                    Finalizar Entrega
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </>
);
}
export default Pedidos