import {ObjectInputProps, set, unset} from 'sanity'
import {Button, Card, Flex, Select, Spinner, Stack, Text} from '@sanity/ui'
import {SettingsView} from '@sanity/studio-secrets'
import {useCallback, useEffect, useState} from 'react'
import {EllipsisVerticalIcon} from '@sanity/icons'
import useSWR from 'swr'
import {secretsNamespace, useAmplitudeCredentials} from './StudioLayout'

export function ExperimentInput(props: ObjectInputProps) {
  const {onChange, value} = props
  const {secrets, loading} = useAmplitudeCredentials()

  useEffect(() => {
    // Reset input value when the API key is removed
    if (typeof secrets?.apiKey === 'string' && !secrets.apiKey && value?.key) {
      onChange(unset())
    }
  }, [secrets, onChange, value])

  if (loading) {
    return <Spinner />
  }

  if (!secrets?.apiKey) {
    return (
      <Flex>
        <AmplitudeCredentials text="Configure Amplitude Credentials" />
      </Flex>
    )
  }

  return secrets?.apiKey ? <ExperimentsSelector apiKey={secrets.apiKey} {...props} /> : null
}

function ExperimentsSelector(props: ObjectInputProps & {apiKey: string}) {
  const {elementProps, onChange} = props
  const {data, isLoading} = useFetchExperiments({
    apiKey: props.apiKey,
  })
  const activeExperiments = data?.experiments?.filter((exp: any) => exp.enabled)

  const handleChangeExperiment = useCallback(
    (event: React.FormEvent<HTMLSelectElement> | undefined) => {
      const value = event?.currentTarget.value
      const experiment = activeExperiments.find((exp: any) => exp.key === value)

      onChange(
        value && value !== 'null'
          ? set({
              key: experiment.key,
              id: experiment.id,
              variant: experiment.variants[0].key,
            })
          : unset(),
      )
    },
    [onChange, activeExperiments],
  )

  useEffect(() => {
    // Check if value experiment still exists in Amplitude and is enabled, reset value if not
    if (
      props.value?.key &&
      activeExperiments?.length > 0 &&
      !activeExperiments?.find((exp: any) => exp.id === props.value?.id)
    ) {
      onChange(unset())
    }
  }, [props.value, activeExperiments, onChange])

  if (!isLoading && (!data?.experiments || data?.experiments?.length === 0)) {
    return (
      <Flex justify="space-between" gap={2} align={'center'}>
        <Text size={1}>
          No experiment found, please create one{' '}
          <a target="_blank" href="https://app.amplitude.com/experiment/" rel="noreferrer">
            here
          </a>
          .
        </Text>
        <AmplitudeCredentials />
      </Flex>
    )
  }

  return (
    <>
      <Flex align="center" gap={2} justify="space-between">
        <Select
          readOnly={isLoading}
          {...elementProps}
          onChange={handleChangeExperiment}
          value={props.value?.key || 'null'}
        >
          {!isLoading && (
            <>
              <option value="null">None</option>
              {activeExperiments.map((experiment: any) => (
                <option key={experiment.id} value={experiment.key}>
                  {experiment.name}
                </option>
              ))}
            </>
          )}
        </Select>
        <AmplitudeCredentials />
      </Flex>
      <VariantSelector isLoading={isLoading} experiments={data?.experiments} {...props} />
    </>
  )
}

function VariantSelector(
  props: ObjectInputProps & {
    experiments: any
    isLoading: boolean
  },
) {
  const {onChange, isLoading} = props
  const selectedExperiment = props.experiments?.find(
    (experiment: any) => experiment.key === props.value?.key,
  )
  const variants = selectedExperiment?.variants || []

  const handleVariantChange = useCallback(
    (event: React.FormEvent<HTMLSelectElement> | undefined) => {
      const value = event?.currentTarget.value

      onChange(
        value
          ? set({
              key: selectedExperiment.key,
              id: selectedExperiment.id,
              variant: value,
            })
          : unset(),
      )
    },
    [onChange, selectedExperiment],
  )

  if (!isLoading && (!variants || variants.length === 0)) {
    return null
  }

  return (
    <Card>
      <Stack space={3}>
        <Text size={1}>Variant</Text>
        <Select readOnly={isLoading} value={props.value?.variant} onChange={handleVariantChange}>
          {!isLoading &&
            variants.map((variant: any) => (
              <option key={variant.key} value={variant.key}>
                {variant.key}
              </option>
            ))}
        </Select>
      </Stack>
    </Card>
  )
}

function AmplitudeCredentials(props: {text?: string}) {
  const [showSettings, setShowSettings] = useState(false)
  return (
    <>
      <Button
        onClick={() => setShowSettings(true)}
        mode="ghost"
        icon={!props.text ? EllipsisVerticalIcon : null}
      >
        {props.text}
      </Button>
      {showSettings && (
        <SettingsView
          title={'Amplitude Credentials'}
          namespace={secretsNamespace}
          keys={[
            {
              key: 'apiKey',
              title: 'Management API Key',
            },
          ]}
          onClose={() => {
            setShowSettings(false)
          }}
        />
      )}
    </>
  )
}

function useFetchExperiments(props: {apiKey: string}) {
  const endpoint = 'https://experiment.amplitude.com/api/1/experiments?limit=1000'
  const cacheKey = 'swr-amplitude-experiments'
  const expiration = 10000

  const fetcher = async (url: string) => {
    const cachedData = sessionStorage.getItem(cacheKey)

    if (cachedData) {
      const {value, timestamp} = JSON.parse(cachedData)

      if (Date.now() < timestamp) {
        return Promise.resolve({experiments: value, isCached: true})
      }
    }

    return fetch(url, {
      headers: {
        Authorization: `Bearer ${props.apiKey}`,
      },
    }).then((res) => res.json())
  }

  const {data, error, isLoading} = useSWR(endpoint, fetcher, {
    onSuccess(data) {
      if (!data.isCached) {
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({value: data.experiments, timestamp: Date.now() + expiration}),
        )
      }
    },
  })

  return {data, isLoading, error}
}
