import { useEffect, useState } from "react";
import Fetch from "./Buttons";
import Details from "./Details";
import SearchBar from "./Searchbar";
import axios from "axios";
import Notas from "./Notas";
import { motion } from "framer-motion";
import More from "./More";
import Operation from "./Operations";
import Pedidos from "./Pedidos";
import PedidosFinalizados from "./PedidosFinalizados";
import { FiSettings } from 'react-icons/fi';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';



const App = () => {
  document.body.style.overflow = 'hidden';
  const [aberto, setAberto] = useState(false);
  const [comanda, setComanda] = useState(null);
  const [uptcomanda, setC] = useState([]);
  const [produto, setProd] = useState(null);
  const [produtosComanda, setProdutos] = useState([]);
  const [visu, setvisu] = useState(false);
  const [visuE, setvisuE] = useState(false);
  const [erro, seterr] = useState(null);
  const [visuA, setvisuA] = useState(false);
  const [alert, setalert] = useState(null);
  const [toshow, setToshow] = useState(null);
  const [erroCount, setErroCount] = useState(0);
  const [atualizar, setAtualizar] = useState(0);
  const [more, setMore] = useState(false);
  const [close, setClose] = useState({
    comanda: null,
    produtos: []
  });
  useEffect(() => {
    AberturaHoje();
  }, [atualizar])
  const AberturaHoje = async () => {
    try {
      const status = await axios.get(`https://pdv-production.up.railway.app/abre`)
      setAberto(status.data);
      console.log(status.data);

    }
    catch (erro) {
      setAberto(false);
    }
  }
  const HandleDetails = async () => {
    const id = comanda.id_Comanda;
    if (produto) {
      const body = {
        produtosIds: produto.id_produto
      }
      const url = `https://pdv-production.up.railway.app/addprod/${id}`
      try {
        const resposta = await axios.put(url, body);
        console.log(resposta.data);
        setProdutos(resposta.data);
      }
      catch (erro) {
        if (erro.response) {
          setError(erro.response.data)
        }
        else {
          console.log(erro);
        }
      }
    }

    try {
      const Response = await axios.get(`https://pdv-production.up.railway.app/${id}`)
      console.log(Response.data);
      setProdutos(Response.data);
    } catch (error) {
      setError(error);
    }
  }
  const newC = async () => {
    try {
      const status = await axios.get(`https://pdv-production.up.railway.app/${comanda.id_Comanda}`)
      setC(status.data);
      console.log(status.data)
    }
    catch (error) {
      setError(error);
    }
  }
  const postcomanda = async () => {
    if (aberto == false) {
      setalert("Atenção: A abertura ainda não foi realizada");
      setvisuA(true);
    }
    console.log(produto.id_produto)
    const id = produto.id_produto;
    const url = `https://pdv-production.up.railway.app/comandas`;
    const body = {
      produtosIds: [id],
      Identificador: "comanda00",
      quantidade_prod: [1]
    };
    try {
      const res = await axios.post(url, body);
      setComanda(res.data);
      setvisu(true);
      setProd(null);
    }
    catch (error) {
      setError(error);
    }
  }
  useEffect(() => {
    setTimeout(() => {
      setvisuE(false);
    }, 2250);
  }, [erroCount])
  useEffect(() => {
    setTimeout(() => {
      setvisuA(false);
    }, 3000);
  }, [alert])
  useEffect(() => {
    AberturaHoje();
  }, [])
  useEffect(() => {
    if (comanda) {
      HandleDetails();
      newC();
    }
    else if (!comanda && produto) {
      postcomanda();
    }
  }, [comanda, produto]);
  useEffect(() => {
    console.log(produtosComanda);
  }, [produtosComanda])
  useEffect(() => {
    if (erro) {
      setvisuE(true);
      console.log("visksjs");
    }
  }, [erroCount])
  const fecharerro = () => {
    setvisuE(false);
  }
  const fecharAlert = () => {
    setvisuA(false);
  }
  const setError = (error) => {
    seterr(error);
    setErroCount((prev) => prev + 1);
  };
  if (close.comanda) {
    console.log("xmmxmx")
  }

  return (
    <>
      <div className="w-screen h-screen flex ">
        
        
        {more && (
          <div className=" absolute right-0 w-1/5   ">
            <More MF={(booll) => setMore(booll)} show={(value) => { setToshow(value), setMore(false) }} />
          </div>
        )}



        {close.comanda ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <Notas comandap={close.comanda} produtosp={close.produtos} voltar={() => { setClose({ comanda: null, produtos: [] }), setvisu(true) }} />
          </motion.div>
        ) : (
          <>

            <div className="relative w-2/5 overflow-auto h-screen bg-black bg-opacity-80 text-white">
              <div className="w-full h-full overflow-y-auto">

                <Fetch
                  selectedcomanda={(comanda) => {
                    if (visu) {
                      setError("feche a comanda antes de abrir outra");
                    } else {
                      setvisu(true);
                      setComanda(comanda);
                    }
                  }}
                />
              </div>
            </div>
            <motion.div className="relative w-3/5 h-screen overflow-auto bg-white text-black"
              initial={{ width: "100%" }}
              animate={{ width: more ? "40%" : "60%" }}
              transition={{ duration: 0.5 }}
            >
              {toshow && (
                <Operation abrir={() => setAtualizar((prev) => prev + 1)} toShow={toshow} aberto={aberto} fechar={() => setToshow(null)} />
              )}
              {!more && (
                <div className=" absolute top-2  flex items-center  w-8 right-0 bg-white">
                 <motion.button 
  onClick={() => { setMore(true) }}
  className="
    p-3
    bg-gray-400 
    text-white 
    rounded-full
    shadow-lg
    hover:bg-blue-700
    absolute 
    top-0 
    right-3
    z-20
    flex 
    items-center 
    justify-center
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:ring-offset-2
    hide-scrollbar
  "
  whileHover={{ 
    rotate: 360,
    transition: { 
      type: 'tween',
      duration: 0.8,
      repeat: 0 // Garante que só gira uma vez
    }
  }}
  whileTap={{ 
    scale: 0.9
  }}
  title="Configurações"
  style={{ overflow: 'hidden' }} // Adiciona overflow hidden
>
  <FiSettings className="text-2xl" />
</motion.button>
                </div>
              )}



              <SearchBar selectedproduto={(produto) => setProd(produto)} />
              <div className="absolute top-24 left-10 right-10 h-4/5">
                {erro && visuE && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{ duration: 0.1 }}
                  >
                    <div className=" z-30 text-white absolute md:top-36 md:right-36 w-full max-w-lg h-32 bg-red-700 bg-opacity-90 border-2 border-black   shadow-lg p-4 flex items-center justify-center">
                      <button
                        className="absolute right-1 top-0 text-xl font-bold focus:outline-none hover:text-red-200 transition-colors"
                        onClick={()=>fecharerro()}
                        aria-label="Fechar mensagem de erro"
                      >
                        X
                      </button>
                      <p className="text-2xl truncate">{"❌" + erro}</p>
                    </div>
                  </motion.div>
                )}
                {alert && visuA && (
                  <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.16, 1, 0.3, 1],
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                >
                  <div className="z-30 fixed top-6 right-6 max-w-md w-full bg-amber-100/95 backdrop-blur-sm rounded-xl shadow-xl p-4 pr-8 border-l-4 border-amber-400 ring-1 ring-black/5">
                    <button
                      className="absolute right-3 top-3 p-1 hover:bg-amber-200/30 rounded-full transition-colors"
                      onClick={fecharAlert}
                      aria-label="Fechar alerta"
                    >
                      <XMarkIcon className="w-5 h-5 text-amber-700" />
                    </button>
                    
                    <div className="flex items-start gap-3">
                      <ExclamationTriangleIcon className="w-6 h-6 mt-0.5 text-amber-600 flex-shrink-0" />
                      <p className="text-amber-900 font-medium leading-snug break-words">
                        {alert}
                      </p>
                    </div>
                  </div>
                </motion.div>
                )}
                {comanda && produtosComanda.length > 0 && visu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Details
                      key={produto}
                      produtos={produtosComanda}
                      comanda={uptcomanda}
                      setvisu={(bool) => { setvisu(bool) }}
                      aberto={aberto}
                      close={(Fcomanda, Fprodutos) => {
                        setClose({ comanda: Fcomanda, produtos: Fprodutos }),
                          setMore(false)
                      }
                      }
                    />
                  </motion.div>
                )}


              </div>
            </motion.div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
