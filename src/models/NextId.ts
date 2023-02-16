export interface ProofResponse {
  pagination: Pagination
  ids: ID[]
}

export interface ID {
  persona: string
  avatar: string
  last_arweave_id: string
  activated_at: string
  proofs: Proof[]
}

export interface Proof {
  platform: string
  identity: string
  alt_id: string
  created_at: string
  last_checked_at: string
  is_valid: boolean
  invalid_reason: string
}

export interface Pagination {
  total: number
  per: number
  current: number
  next: number
}
