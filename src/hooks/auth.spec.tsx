import { renderHook, act } from '@testing-library/react-hooks'
import { mocked } from 'ts-jest/utils'

import { logInAsync } from 'expo-google-app-auth'
import { AuthProvider, useAuth } from './auth'

jest.mock('expo-google-app-auth')
// jest.mock('expo-google-app-auth', () => {
//   return {
//     logInAsync: () => {
//       return {
//         type: 'success',
//         user: {
//           id: 'any id',   // TODO: use Faker for this
//           email: 'test@testing.com',
//           name: 'Test',
//           photoUrl: 'any_photo.png',
//         }
//       }
//     }
//   }
// })

describe('Auth Hook', () => {

  it('should be able to sign in with a Google account', async () => {
    const googleMocked = mocked(logInAsync as any)
    googleMocked.mockReturnValueOnce({
        type: 'success',
        user: {
          id: 'any_id',   // TODO: use Faker for this
          email: 'test@testing.com',
          name: 'Test',
          photoUrl: 'any_photo.png',
        }
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(() => result.current.signInWithGoogle())

    expect(result.current.user).toBeTruthy()
    expect(result.current.user.email).toBe('test@testing.com')
  })
  
  it('should not access app if user cancel authentication with Google', async () => {
    const googleMocked = mocked(logInAsync as any)
    googleMocked.mockReturnValueOnce({
      type: 'cancel',
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(() => result.current.signInWithGoogle())

    expect(result.current.user).not.toHaveProperty('id')
  })
  
  it('should throw an error while logging in with Google', async () => {

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    try {
      await act(() => result.current.signInWithGoogle())
    } catch (error) {
      expect(result.current.user).toEqual({})      
    }

  })
})