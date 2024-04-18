export type PagePayload = {
  _id: string
  _type: string
  pathname: {
    current: string
    _type: 'slug'
  }
  title?: string
  experiment?: {
    key: string
    id: string
    variant: string
  }
}
