import {LayoutProps} from 'sanity'
import {createContext, useContext} from 'react'
import {useSecrets} from '@sanity/studio-secrets'

const AmplitudeCredentialsContext = createContext<{
  loading: boolean
  secrets: any
}>({
  loading: false,
  secrets: {},
})

export const secretsNamespace = 'amplitudeSecrets' as const

export function useAmplitudeCredentials() {
  return useContext(AmplitudeCredentialsContext)
}

export function CustomStudioLayout(props: LayoutProps) {
  const {secrets, loading}: any = useSecrets(secretsNamespace)

  return (
    <AmplitudeCredentialsContext.Provider value={{loading, secrets}}>
      {props.renderDefault(props)}
    </AmplitudeCredentialsContext.Provider>
  )
}
