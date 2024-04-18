import {SanityDocument} from 'sanity'
import {FaMedal} from 'react-icons/fa6'
import {useFormValue} from 'sanity'

export default function VariantMedia({id}: {id?: string}) {
  const doc = useFormValue([]) as SanityDocument

  const isWinningVariant =
    id && [...doc.variants].sort((a, b) => b.successRate - a.successRate)[0].id === id

  if (isWinningVariant) {
    return <FaMedal />
  }

  if (id) {
    return id[0].toUpperCase()
  }

  return null
}

export function renderVariantMedia(id: string) {
  return <VariantMedia id={id} />
}
