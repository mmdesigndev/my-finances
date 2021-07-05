import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import { 
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from './styles';

import AppleSvg from '../../assets/apple.svg'
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'
import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { useTheme } from 'styled-components';

export function SignIn() {
  const theme = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithGoogle, signInWithApple } = useAuth()

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true)
      await signInWithGoogle()  
    } catch (error) {
      console.log(error)
      Alert.alert('Não foi possível conectar com a conta Google')
    } finally {
      setIsLoading(false)
    }
  }
  
  async function handleSignInWithApple() {
    try {
      setIsLoading(true)
      await signInWithApple()  
    } catch (error) {
      console.log(error)
      Alert.alert('Não foi possível conectar com a conta Apple')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg 
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>
          Controle suas {'\n'}
          finanças de forma {'\n'}
          muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          {
            Platform.OS === 'ios' && (
              <SignInSocialButton
                title="Entrar com Apple"
                svg={AppleSvg}
                onPress={handleSignInWithApple}
              />
            )
          }
        </FooterWrapper>

        {isLoading && <ActivityIndicator color={theme.colors.shape} size="small" style={{ marginTop: 18 }} />}
      </Footer>
    </Container>
  )
}