export interface Client {
  id: string
  name: string
  email: string
  boxesRented: number
  amountOwed: number
}

export interface Rental {
  id: string
  client: string
  clientId: string
  clientEmail: string
  boxes: number
  startDate: string
  endDate: string
  offerApplied: boolean
  amountOwed: number
  daysHeld: number
  status: string
}

export interface User {
  id: string
  email: string
}
