import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { VictoryPie } from "victory-native";

import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { useTheme } from 'styled-components'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { Header } from '../../components/Header';
import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';
import { storageKeys } from '../../utils/storage';

import { 
  Container,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
} from './styles';
import { Loading } from '../../components/Loading';
import { useFocusEffect } from '@react-navigation/core';
import { useAuth } from '../../hooks/auth';


interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string
}

interface CategorySumData {
  key: string;
  name: string;
  color: string;
  total: number;
  totalFormatted: string;
  percent: number;
  percentFormatted: string;
}

export function Summary() {
  const theme = useTheme()
  const tabBarHeight = useBottomTabBarHeight();
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalByCategories, setTotalByCategories] = useState<CategorySumData[]>([])

  function handleDateChange(action: 'prev' | 'next') {
    if (action === 'next') {
      const newDate = addMonths(selectedDate, 1)
      setSelectedDate(newDate)
    } else {
      const newDate = subMonths(selectedDate, 1)
      setSelectedDate(newDate)
    }
  }

  async function loadData() {
    setIsLoading(true)
    const response = await AsyncStorage.getItem(storageKeys.dataKey(user.id))
    const responseFormatted = response ? JSON.parse(response) : []

    // filtering by expenses and date
    const expenses: TransactionData[] = responseFormatted.filter(
        (expense: TransactionData) => expense.type === 'negative' 
                                        && new Date(expense.date).getMonth() === selectedDate.getMonth()
                                        && new Date(expense.date).getFullYear() === selectedDate.getFullYear())

    const expensesTotal = expenses.reduce((acc: number, expenses: TransactionData) => {
      return acc + Number(expenses.amount)
    }, 0)

    const totalByCategory: CategorySumData[] = []

    categories.forEach(category => {
      let categorySum = 0

      expenses.forEach(expense => {
        if(expense.category === category.key) {
          categorySum += Number(expense.amount)
        }
      })

      if(categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })

        const percent = (categorySum / expensesTotal * 100)
        const percentFormatted = `${percent.toFixed(0)}%`

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent,
          percentFormatted,
        })
      }
    })

    setTotalByCategories(totalByCategory)
    setIsLoading(false)
  }

  useFocusEffect(useCallback(() => {
    loadData()
  }, [selectedDate]))

  return (
    <Container>
      <Header title="Resumo por categoria" />

      {
        isLoading ? (
          <Loading />
        ) : (

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                // flex: 1,
                paddingHorizontal: 24,
                paddingBottom: tabBarHeight,
              }}
            >

            
              <MonthSelect>
                <MonthSelectButton onPress={() => handleDateChange('prev')}>
                  <MonthSelectIcon name="chevron-left" />
                </MonthSelectButton>

                <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

                <MonthSelectButton onPress={() => handleDateChange('next')}>
                  <MonthSelectIcon name="chevron-right" />
                </MonthSelectButton>
              </MonthSelect>

              <ChartContainer>
                <VictoryPie
                  data={totalByCategories}
                  x="percentFormatted"
                  y="total"
                  colorScale={totalByCategories.map(category => category.color)}
                  style={{
                    labels: {
                      fontSize: RFValue(18),
                      fontWeight: 'bold',
                      fill: theme.colors.shape,
                    }
                  }}
                  labelRadius={50} // 50 units from the center of the Pie Chart
                />
              </ChartContainer>

              {
                totalByCategories.map(item => (
                  <HistoryCard 
                    key={item.key}
                    title={item.name}
                    amount={item.totalFormatted}
                    color={item.color}
                  />
                ))
              }

            </ScrollView>
         
        )
      }

    </Container>
  )
}
