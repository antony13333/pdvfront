import axios from "axios";
import { useEffect } from "react";
import { useState } from "react"
import Details from "./Details";
import { FaUtensils, FaRegClock, FaCheckCircle } from 'react-icons/fa';
import {DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Fetch = ({selectedcomanda }) =>{
    const[dado , setDado] = useState([]);
    
    
    const handleFetch = async()=>
    {
        try{
            const resposta = await axios.get(`https://pdv-production.up.railway.app/ComandasAbertas`)
            .then((resposta)=>{
                setDado(resposta.data)
               
            })
        }
        catch(error){
            console.log(error)
        }
    }
    useEffect(() => {
        handleFetch();
       
    }, []);
 
    
      return (
        <>
            { dado.length===0 ? (
                <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-1 h-96 mt-28 flex items-center justify-center p-8"
                >
                    <div className="max-w-md text-center space-y-6">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <DocumentMagnifyingGlassIcon 
                                className="w-28 h-28 text-gray-300/80 mx-auto" 
                                aria-hidden="true"
                            />
                        </motion.div>
                        
                        <div className="space-y-3">
                            <h3 className="text-3xl font-semibold text-white">
                                Não Há Comandas
                            </h3>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3 w-full">
                    {dado?.map((item, index) => (
                        <motion.div
                            key={item.id_Comanda}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                                delay: index * 0.03,
                                type: "spring", 
                                stiffness: 150 
                            }}
                            className="aspect-square"
                        >
                            <motion.button
                                onClick={() => selectedcomanda(item)}
                                className={`
                                    w-full h-full
                                    flex flex-col items-center justify-center
                                    bg-white/95 backdrop-blur-sm
                                    border-2
                                    rounded-xl
                                    p-2
                                    shadow-sm
                                    relative
                                    overflow-hidden
                                    hover:shadow-md
                                    transition-shadow
                                    ${item.ativa 
                                        ? 'border-green-400/80 bg-green-50/95' 
                                        : 'border-gray-200/80'}
                                `}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Status indicator */}
                                <div className="absolute top-2 right-2">
                                    <motion.div
                                        className={`${
                                            item.ativa 
                                            ? 'text-green-500' 
                                            : 'text-gray-400'
                                        }`}
                                        animate={{
                                            scale: item.ativa ? [1, 1.1, 1] : 1
                                        }}
                                        transition={{
                                            duration: 1.8,
                                            repeat: Infinity
                                        }}
                                    >
                                        <FaCheckCircle className="text-lg" />
                                    </motion.div>
                                </div>
    
                                {/* Content */}
                                <div className="flex flex-col items-center gap-2 p-2 w-full">
                                    <motion.div
                                        className={`${
                                            item.ativa 
                                            ? 'text-green-500'
                                            : 'text-gray-600'
                                        }`}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <FaUtensils className="text-2xl" />
                                    </motion.div>
    
                                    <motion.span
                                        className={`
                                            font-medium text-gray-800
                                            text-center
                                            line-clamp-2
                                            text-sm
                                            leading-snug
                                            px-1
                                        `}
                                    >
                                        {item.identificador}
                                    </motion.span>
                                </div>
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Fetch