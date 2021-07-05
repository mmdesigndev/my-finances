import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
// import { GOOGLE_IOS_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID } from 'react-native-dotenv'
import Config from "react-native-config";


import * as Google from 'expo-google-app-auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKeys } from '../utils/storage';

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  userStorageLoading: boolean;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext({} as IAuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User)
  const [userStorageLoading, setUserStorageLoading] = useState(true)

  async function signInWithGoogle() {
    try {
      const config: Google.GoogleLogInConfig = {
        iosClientId: Config.GOOGLE_IOS_CLIENT_ID ?? '',
        androidClientId: Config.GOOGLE_ANDROID_CLIENT_ID ?? '',
        scopes: ['profile', 'email'],
      }
      const result = await Google.logInAsync(config)

      if (result.type === 'success') {
        const userLogged = {
          id: String(result.user.id),
          email: result.user.email!,
          name: result.user.name!,
          photo: result.user.photoUrl!,
        }

        setUser(userLogged)
        await AsyncStorage.setItem(storageKeys.userKey, JSON.stringify(userLogged))

        console.log('userLogged', userLogged)
      }
    } catch (error) {
      console.log('google login error', error)
      throw new Error(error)
    }
  }

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const name = credential.fullName!.givenName!
        const photo = `https://ui-avatars.com/api/?name=${name}&length=1`
  
        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name,
          photo,
        }
        
        setUser(userLogged)
        await AsyncStorage.setItem(storageKeys.userKey, JSON.stringify(userLogged))
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async function signOut() {
    setUser({} as User)
    await AsyncStorage.removeItem(storageKeys.userKey)
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userStored = await AsyncStorage.getItem(storageKeys.userKey)

      if(userStored) {
        const userLogged = JSON.parse(userStored) as User
        setUser(userLogged)
      }

      setUserStorageLoading(false)
    }

    loadUserStorageData()
  }, [])


  return (
    <AuthContext.Provider value={{
      user,
      userStorageLoading,
      signInWithGoogle,
      signInWithApple,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  return context
}

export {
  AuthProvider,
  useAuth,
}