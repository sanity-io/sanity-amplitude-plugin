export function ConcludeExperimentAction(props) {
  return {
    label: 'Conclude',
    onHandle: () => {
      // Here you can perform your actions
      window.alert('Experiment concluded ✅')
    },
  }
}
