import React, { useState } from 'react';
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native'

import { 
  Container,
  Form,
  Fields,
  TransactionTypes,
} from './styles';

import { CategorySelect } from '../CategorySelect';
import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { storageKeys } from '../../utils/storage';
import { Header } from '../../components/Header';
import { useAuth } from '../../hooks/auth';

type TypeProps = 'positive' | 'negative' | '';

interface FormData {
  name: string;
  amount: string
}

const schema = yup.object().shape({
  name: yup.string().required('O nome é obrigatório'),
  amount: yup.number()
            .typeError('Informe um valor numérico')
            .positive('O valor não pode ser negativo')
            .required('O valor é obrigatório') 
})


export function Register() {
  const { user } = useAuth()
  const [transactionType, setTransactionType] = useState<TypeProps>('')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  })

  const navigation = useNavigation()
  const { control, handleSubmit, reset, formState:{ errors } } = useForm({
    resolver: yupResolver(schema),
  })

  function handleSelectTransactionType(type: 'positive' | 'negative') {
    setTransactionType(type)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true)
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false)
  }

  async function handleRegistration(form: FormData) {
    if(!transactionType) {
      return Alert.alert('Selecione o tipo de transação')
    }

    if(category.key === 'category') {
      return Alert.alert('Selecione a categoria')
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    }
    
    console.log(newTransaction)

    try {
      const data = await AsyncStorage.getItem(storageKeys.dataKey(user.id))
      const currentData = data ? JSON.parse(data) : []

      const dataFormatted = [
        ...currentData,
        newTransaction,
      ]

      await AsyncStorage.setItem(storageKeys.dataKey(user.id), JSON.stringify(dataFormatted))

      // resetting states
      reset() // hook form reset
      setTransactionType('')
      setCategory({
        key: 'category',
        name: 'Categoria',
      })

      navigation.navigate('Listagem')
    } catch (error) {
      console.log(error)
      Alert.alert('Não foi possível cadastrar o registro')
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
      <Container>
        <Header title="Cadastro" />

        <Form>
          <Fields>
            <InputForm 
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name?.message}
            />
            <InputForm 
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount?.message}
            />

            <TransactionTypes>
              <TransactionTypeButton 
                title='Income'
                type='up'
                onPress={() => handleSelectTransactionType('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton 
                title='Outcome'
                type='down'
                onPress={() => handleSelectTransactionType('negative')}
                isActive={transactionType === 'negative'}
              />
            </TransactionTypes>

            <CategorySelectButton
              testID="button-category"
              activeOpacity={0.7} 
              title={category.name}
              onPress={handleOpenSelectCategoryModal}  
            />
          </Fields>

          <Button 
            title="Enviar"
            onPress={handleSubmit(handleRegistration)}
          />
        </Form>

        {/* React Native Modal */}
        <Modal
          testID="modal-category"
          visible={categoryModalOpen}
        >
          <CategorySelect 
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>

      </Container>
    </TouchableWithoutFeedback>
  )
}
