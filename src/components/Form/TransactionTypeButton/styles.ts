import styled, { css } from 'styled-components/native';
import { Feather } from '@expo/vector-icons'
import { RFValue } from 'react-native-responsive-fontsize';
import { RectButton } from 'react-native-gesture-handler';

interface IconsProps {
  type: 'up' | 'down';
}

interface ContainerProps extends IconsProps {
  isActive: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 48%;

  /* border: 1.5px solid ${({ theme }) => theme.colors.text}; */
  border-width: ${({ isActive }) => isActive ? 0 : 1.5}px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.text};
  border-radius: 5px;

  ${({ isActive, type }) => isActive && type === 'up' && css`
    background-color: ${({ theme }) => theme.colors.success_light};
  `}
  
  ${({ isActive, type }) => isActive && type === 'down' && css`
    background-color: ${({ theme }) => theme.colors.attention_light};
  `}
`;

export const Button = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  justify-content: center;

  padding: 18px 36px; /* up and down, then sides */
`

export const Icon = styled(Feather)<IconsProps>`
  font-size: ${RFValue(24)}px;
  
  margin-right: 12px;

  color: ${({ theme, type }) => type === 'up' ? theme.colors.success : theme.colors.attention};
`

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
`