import { ReactNode, createContext, useEffect, useState } from "react";
import { api } from "../lib/axios";

export interface Transaction {
    id: number
    description: string
    type: 'income' | 'outcome'
    price: number
    category: string
    createdAt: string
}


interface TransactionsContextType {
    transactions: Transaction[]
    fetchTransactions: (query?: string) => Promise<void>
}

interface TransactionsProviderProps {
    children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionsContextType)


export function TransactionsProvider({children}: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    async function fetchTransactions(query?: string) {
        const response = await api.get('/transactions')
        const data = response.data as []
        
        if (query) {
            const queryLower = query.toLowerCase(); // Para tornar a busca case-insensitive
            const filteredData = data.filter(item => {
            return Object.values(item).some(value => {
                // Convertendo tudo para string para garantir que possamos chamar .includes()
                // e também para garantir que a busca seja case-insensitive
                return String(value).toLowerCase().includes(queryLower);
            });
            });
            return setTransactions(filteredData)
        }

        setTransactions(data)
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    return (
        <TransactionsContext.Provider value={{ 
            transactions,
            fetchTransactions
        }}>
            {children}
        </TransactionsContext.Provider>
    )
}