import React from 'react'
import { render } from '@testing-library/react-native'

import { Profile } from '../../screens/Profile'


describe('[Profile screen]', () => {

  it('checks if button placeholder is shown correctly', () => {
    const { getByPlaceholderText } = render(<Profile />)

    const inputName = getByPlaceholderText('Nome')

    expect(inputName.props.placeholder).toBeTruthy()
    expect(inputName).toBeTruthy() // another way of checking the above
  })

  it('checks if user data has been loaded', () => {
    const { getByTestId } = render(<Profile />)

    const inputName = getByTestId('input-name')
    const inputSurname = getByTestId('input-surname')

    expect(inputName.props.value).toEqual('Pablo')
    expect(inputSurname.props.value).toEqual('Satler')
  })

  it('checks if title renders correctly', () => {
    const { getByTestId } = render(<Profile />)

    const textTitle = getByTestId('text-title')

    expect(textTitle.props.children).toContain('Perfil')
  })
})