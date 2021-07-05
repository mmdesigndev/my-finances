
### Running application locally

- First, you need to create google OAuth keys for Android and iOS, and create a `.env` file as indicated in the `.env.example` with the mentioned keys

```
expo start
```

### Dependencies added to the project

- Styled components

```
yarn add styled-components
yarn add -D @types/styled-components-react-native
```

- Adding the [Poppins font](https://docs.expo.io/guides/using-custom-fonts/#using-a-google-font)

```
expo install expo-font @expo-google-fonts/poppins

# in order to hold the splash screen while we wait for the fonts to be loaded
expo install expo-app-loading
```

- [Responsive Font Size](https://www.npmjs.com/package/react-native-responsive-fontsize)

```
yarn add react-native-responsive-fontsize
```

- Using expo icons
  - a list of icons available can be found at [https://icons.expo.fyi/](https://icons.expo.fyi/)
  - usage example: `import { Feather } from '@expo/vector-icons'`


- [Iphone X Helper](https://www.npmjs.com/package/react-native-iphone-x-helper)

- Using [react-hook-form](https://react-hook-form.com/)
  - `yarn add react-hook-form`
  - [React Native](https://react-hook-form.com/get-started#ReactNative) documentation
  - [Schema validation](https://react-hook-form.com/get-started/#SchemaValidation)
   - `yarn add @hookform/resolvers yup`

- [React Navigation](https://reactnavigation.org/docs/getting-started/)

- [Async Storage](https://docs.expo.io/versions/latest/sdk/async-storage/)

- [React Native UUID](https://www.npmjs.com/package/react-native-uuid)

- [Intl]: used to format date in this app and needed to install this for _Android_. In _iOS_ it's already available.
  - `yarn add intl`
  - in the entry point file (`App.tsx`), we import this library
    ```js
    import 'intl'
    import 'intl/locale-data/jsonp/pt-BR' 
    ``` 

- Pie Charts with [Victory Pie](https://formidable.com/open-source/victory/docs/native) library
  - `yarn add victory-native react-native-svg`

- [Date-fns](https://date-fns.org/) for manipulating dates

- [React Native SVG Transformer](https://github.com/kristerkari/react-native-svg-transformer)

- [OAuth with Google](https://docs.expo.io/guides/authentication/#google)
  - `expo install expo-google-app-auth`
  - [expo docs for google](https://docs.expo.io/versions/latest/sdk/google/)
  - [Apple](https://docs.expo.io/versions/latest/sdk/apple-authentication/)
  - `expo install expo-apple-authentication`

<!-- - [React Native DotEnv](https://medium.com/swlh/how-to-properly-use-environment-variables-in-an-expo-react-native-app-7ab852590b30)
  - `yarn add -D @types/react-native-dotenv`
  - [npm docs](https://www.npmjs.com/package/react-native-dotenv) -->

- [React Native Testing Library](https://github.com/callstack/react-native-testing-library)
  - `yarn add --dev @testing-library/react-native`
  - `yarn add --dev @testing-library/jest-native`
  - [Testing with Jest](https://docs.expo.io/guides/testing-with-jest/)
  - [Jest and Styled Components](https://github.com/styled-components/jest-styled-components) and [this to install globally at the project](https://github.com/styled-components/jest-styled-components#global-installation)
    - `yarn add -D jest-styled-components`

- [React Hooks Testing Library](https://github.com/testing-library/react-hooks-testing-library)
  - `yarn add -D @testing-library/react-hooks`

- [TS Jest](https://github.com/kulshekhar/ts-jest) to add more resources to the tests

- [React Native Config](https://github.com/luggit/react-native-config)