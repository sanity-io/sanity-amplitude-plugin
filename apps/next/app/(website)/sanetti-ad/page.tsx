import { SanettiAd } from '@/components/SanettiAd'

export default function Page() {
  return (
    <div className="grid gap-10 container py-20">
      <SanettiAd variant="billboard" />
      <SanettiAd variant="large-rectangle" />
      <SanettiAd variant="half-page" />
    </div>
  )
}
