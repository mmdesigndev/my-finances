const appPrefix = '@myfinances'

const dataKey = (userId: string) => `${appPrefix}:transactions_user:${userId}`
const userKey =  `${appPrefix}:user`

export const storageKeys = {
  dataKey,
  userKey,
}