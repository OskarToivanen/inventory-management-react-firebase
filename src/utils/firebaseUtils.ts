import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

import { Client, Rental } from '../types/types'

export const fetchClientsAndRentals = async () => {
  const clientSnapshot = await getDocs(collection(db, 'clients'))
  const clientsData: Client[] = clientSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Client[]

  const rentalSnapshot = await getDocs(collection(db, 'rentals'))
  const rentalsData: Rental[] = rentalSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Rental[]

  rentalsData.forEach((rental) => {
    const start = new Date(rental.startDate)
    const end = rental.endDate ? new Date(rental.endDate) : new Date()
    const daysHeld = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )
    rental.daysHeld = daysHeld
    rental.amountOwed = daysHeld > 20 ? (daysHeld - 20) * 0.2 * rental.boxes : 0
    rental.clientEmail =
      clientsData.find((client) => client.id === rental.clientId)?.email || ''
    rental.status = rental.endDate ? 'Completed' : 'Ongoing'
  })

  return { clients: clientsData, rentals: rentalsData }
}

export const updateRentalEndDate = async (
  rentalId: string,
  newEndDate: Date
) => {
  const rentalDoc = doc(db, 'rentals', rentalId)
  await updateDoc(rentalDoc, {
    endDate: newEndDate.toISOString().split('T')[0],
  })
}

export const seedDatabase = async (
  clients: Client[],
  rentals: Rental[]
): Promise<void> => {
  try {
    const clientsCollection = collection(db, 'clients')
    const rentalsCollection = collection(db, 'rentals')

    await Promise.all(
      clients.map((client) => addDoc(clientsCollection, client))
    )
    await Promise.all(
      rentals.map((rental) => addDoc(rentalsCollection, rental))
    )

    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database: ', error)
  }
}
