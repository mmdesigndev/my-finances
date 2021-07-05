import React, { useCallback, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage'

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
} from './styles';
import { storageKeys } from '../../utils/storage';
import { Loading } from '../../components/Loading';
import { useAuth } from '../../hooks/auth';


export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string
  lastTransaction: string
}
interface HighlightData {
  income: HighlightProps
  outcome: HighlightProps
  total: HighlightProps
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<DataListProps[]>([])
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)

  const { signOut, user } = useAuth()

  function handleSignOut() {
    signOut()
  }

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) {

    const collectionFiltered = collection.filter((transaction) => transaction.type === type)
                                          .map((transaction) => new Date(transaction.date).getTime())
    
    if(collectionFiltered.length === 0) {
      return 0;
    }
    
    const lastTransaction = Math.max.apply(Math, collectionFiltered)

    return Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
    }).format(new Date(lastTransaction))

    // if (Date.parse(String(lastTransaction))) {
    //   return Intl.DateTimeFormat('pt-BR', {
    //     day: '2-digit',
    //     month: 'long',
    //   }).format(new Date(lastTransaction))
    // }
    
  }

  async function loadTransaction() {
    const response = await AsyncStorage.getItem(storageKeys.dataKey(user.id))
    const transactions = response ? JSON.parse(response) : []

    let incomeTotal = 0
    let outcomeTotal = 0

    const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
      if(item.type === 'positive') {
        incomeTotal += Number(item.amount)
      }

      if(item.type === 'negative') {
        outcomeTotal += Number(item.amount)
      }

      const amount = Number(item.amount)
                        .toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
      
      const date = new Date(item.date)
      const dateFormatted = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).format(date)
      
      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date: dateFormatted,
      }
    })

    setData(transactionsFormatted)

    const lastTransactionIncome = getLastTransactionDate(transactions, 'positive')
    const lastTransactionOutcome = getLastTransactionDate(transactions, 'negative')
    const lastTotalInterval = lastTransactionOutcome ? `01 à ${lastTransactionOutcome}` : ''
    
    const total = incomeTotal - outcomeTotal
    setHighlightData({
      income: { 
        amount: incomeTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastTransactionIncome ? `Última entrada dia ${lastTransactionIncome}` : 'Não há transações'
      },
      outcome: { 
        amount: outcomeTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastTransactionOutcome ? `Última saída dia ${lastTransactionOutcome}` : 'Não há transações'
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastTotalInterval,
      }
    })
    setIsLoading(false)
  }
  
  // useEffect(() => {
  //   loadTransaction()
  //   // AsyncStorage.removeItem(storageKeys.dataKey)
  // }, [])

  useFocusEffect(useCallback(() => {
    loadTransaction()
  }, []))

  return (
    <Container>
      {
        isLoading ? (
          <Loading />
        ) : (
          <>

            <Header >

              <UserWrapper>
                <UserInfo>
                  <Photo 
                    source={{ uri: user.photo ?? '' }}
                    // source={{ uri: 'https://github.com/psatler.png' }}
                  />
                  <User>
                    <UserGreeting>Olá,</UserGreeting>
                    <UserName>{user.name}</UserName>
                  </User>
                </UserInfo>

                <LogoutButton onPress={handleSignOut}>
                  <Icon name="power" />
                </LogoutButton>
              </UserWrapper>

            </Header>

            <HighlightCards>
              <HighlightCard 
                type="up"
                title="Entradas"
                amount={highlightData.income.amount}
                lastTransaction={highlightData.income.lastTransaction}
                receiveRightMargin
              />
              <HighlightCard 
                type="down"
                title="Saídas"
                amount={highlightData.outcome.amount}
                lastTransaction={highlightData.outcome.lastTransaction}
                receiveRightMargin
              />
              <HighlightCard
                type="total"
                title="Total"
                amount={highlightData.total.amount}
                lastTransaction={highlightData.total.lastTransaction}
              />
            </HighlightCards>


            <Transactions>
              <Title>Listagem</Title>

              <TransactionList 
                data={data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TransactionCard 
                    data={item}
                  />
                )}
              />
              
            </Transactions>

          </>
        )
      }

    </Container>
  )
}

