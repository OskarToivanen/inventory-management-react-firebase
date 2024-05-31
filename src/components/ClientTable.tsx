import React, { useEffect, useState } from 'react'
import { db } from '../firebase/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { DataTable, DataTableStateEvent } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Client, Rental } from '../types/types'
import '../styles/ClientTable.css'

import { Spinner } from '@chakra-ui/react'

const ClientTable: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchClientsAndRentals = async () => {
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

        const freeDays = rental.offerApplied ? 20 : 0
        rental.amountOwed =
          daysHeld > freeDays ? (daysHeld - freeDays) * 0.2 * rental.boxes : 0
      })

      clientsData.forEach((client) => {
        const clientRentals = rentalsData.filter(
          (rental) => rental.clientId === client.id
        )
        client.boxesRented = clientRentals.reduce(
          (sum, rental) => sum + rental.boxes,
          0
        )
        client.amountOwed = clientRentals.reduce(
          (sum, rental) => sum + rental.amountOwed,
          0
        )
      })

      setClients(clientsData)
      setRentals(rentalsData)
      setLoading(false)
    }

    fetchClientsAndRentals()
  }, [])

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentClients = filteredClients.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div>
      <div className='p-mb-4 p-field p-fluid search-container'>
        <label htmlFor='search'>Search</label>
        <InputText
          id='search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%' }}
        />
        <small id='username-help'>
          Enter your username to reset your password.
        </small>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <DataTable
          value={currentClients}
          paginator
          rows={itemsPerPage}
          totalRecords={filteredClients.length}
          onPage={(e: DataTableStateEvent) =>
            paginate(e.first! / itemsPerPage + 1)
          }
        >
          <Column field='name' header='Name' />
          <Column field='email' header='Email' />
          <Column field='boxesRented' header='Boxes Rented' />
          <Column
            field='amountOwed'
            header='Amount Owed'
            body={(rowData: Client) => `${rowData.amountOwed.toFixed(2)} €`}
          />
        </DataTable>
      )}
    </div>
  )
}

export default ClientTable
