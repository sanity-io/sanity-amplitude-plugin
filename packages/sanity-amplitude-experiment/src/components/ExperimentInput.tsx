import {ObjectInputProps, set, unset} from 'sanity'
import {Box, Button, Card, Flex, Select, Spinner, Stack, Text, Tooltip} from '@sanity/ui'
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

  return secrets?.apiKey ? <ExperimentsSelector {...props} /> : null
}

function ExperimentsSelector(props: ObjectInputProps) {
  const {elementProps, onChange} = props
  const {data, isLoading} = useFetchExperiments()
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

  const selectedExperiment = data?.experiments?.find(
    (experiment: any) => experiment.id === props.value?.id,
  )

  return (
    <>
      <Stack space={3}>
        <Flex align="center" gap={2} justify="space-between">
          <DeploymentsListTooltip selectedExperiment={selectedExperiment}>
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
          </DeploymentsListTooltip>
          <AmplitudeCredentials />
        </Flex>
      </Stack>
      <VariantSelector isLoading={isLoading} selectedExperiment={selectedExperiment} {...props} />
    </>
  )
}

function VariantSelector(
  props: ObjectInputProps & {
    selectedExperiment: any
    isLoading: boolean
  },
) {
  const {onChange, isLoading, selectedExperiment} = props
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

function DeploymentsListTooltip(props: {selectedExperiment: any; children: any}) {
  const {selectedExperiment} = props
  const {data} = useFetchExperimentDeployments({experiment: selectedExperiment})

  if (!data || data?.deployments?.length === 0) {
    return props.children
  }

  const deploymentList = data?.deployments
    ?.map((deployment: any) => {
      return deployment.label
    })
    .join(', ')

  return (
    <Tooltip
      content={
        <Box padding={1}>
          <Text size={1}>
            Deployed to:{' '}
            <Text size={1} weight="semibold">
              {deploymentList}
            </Text>
          </Text>
        </Box>
      }
      fallbackPlacements={['right', 'left']}
      placement="top"
      portal
    >
      {props.children}
    </Tooltip>
  )
}

function useFetchExperiments() {
  const {secrets} = useAmplitudeCredentials()
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
        Authorization: `Bearer ${secrets.apiKey}`,
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

function useFetchExperimentDeployments(props: {experiment?: any}) {
  const experimentId = props.experiment?.id
  const {secrets} = useAmplitudeCredentials()
  const endpoint = `https://experiment.amplitude.com/api/1/experiments/${experimentId}/deployments`
  const cacheKey = `swr-amplitude-deployments-${experimentId}`
  const expiration = 10000

  const fetcher = async (url: string) => {
    if (!props.experiment) {
      return null
    }

    const cachedData = sessionStorage.getItem(cacheKey)

    if (cachedData) {
      const {value, timestamp} = JSON.parse(cachedData)

      if (Date.now() < timestamp) {
        return Promise.resolve({deployments: value, isCached: true})
      }
    }

    return fetch(url, {
      headers: {
        Authorization: `Bearer ${secrets.apiKey}`,
      },
    }).then(async (res) => res.json())
  }

  const {data, error, isLoading} = useSWR(endpoint, fetcher, {
    onSuccess(data) {
      if (!data?.isCached && data) {
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({value: data, timestamp: Date.now() + expiration}),
        )
      }
    },
  })

  return {
    data: {
      deployments: data?.isCached ? data?.deployments : data,
    },
    isLoading,
    error,
  }
}
