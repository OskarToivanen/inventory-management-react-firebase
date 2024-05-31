import React, { useEffect, useState } from 'react'
import { db } from '../firebase/firebase'
import { updateDoc, doc } from 'firebase/firestore'
import { DataTable, DataTableStateEvent } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Client, Rental } from '../types/types'
import { Spinner } from '@chakra-ui/react'
import { fetchClientsAndRentals } from '../utils/firebaseUtils'

const RentalTable: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [editingEndDate, setEditingEndDate] = useState<string | null>(null)
  const [newEndDate, setNewEndDate] = useState<Date | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 10

  const totalBoxesAvailable = 1000 // Example total boxes available

  useEffect(() => {
    const fetchData = async () => {
      const { clients: fetchedClients, rentals: fetchedRentals } =
        await fetchClientsAndRentals()
      setClients(fetchedClients)
      setRentals(fetchedRentals)
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleEndDateUpdate = async (rentalId: string) => {
    if (newEndDate === null) {
      console.error('New end date is null.')
      return
    }
    try {
      const rentalDoc = doc(db, 'rentals', rentalId)
      await updateDoc(rentalDoc, {
        endDate: newEndDate.toISOString().split('T')[0],
      })
      setEditingEndDate(null)
    } catch (error) {
      console.error('Error updating end date: ', error)
    }
  }

  const boxesRented = rentals.reduce((sum, rental) => sum + rental.boxes, 0)
  const boxesLeftToRent = totalBoxesAvailable - boxesRented

  const filteredRentals = rentals.filter(
    (rental) =>
      rental.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentRentals = filteredRentals.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div>
      <div className='p-mb-4'>
        <span>Boxes Left to Rent: {boxesLeftToRent}</span>
      </div>
      <div className='p-mb-4'>
        <div className='p-field p-fluid' style={{ maxWidth: '300px' }}>
          <label htmlFor='search'>Search</label>
          <InputText
            id='search'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <small id='username-help'>
            Enter your username to reset your password.
          </small>
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <DataTable
          value={currentRentals}
          paginator
          rows={itemsPerPage}
          totalRecords={filteredRentals.length}
          onPage={(e: DataTableStateEvent) =>
            paginate(e.first! / itemsPerPage + 1)
          }
        >
          <Column field='client' header='Client' />
          <Column field='clientEmail' header='Email' />
          <Column field='startDate' header='Start Date' />
          <Column
            field='endDate'
            header='End Date'
            body={(rowData: Rental) =>
              editingEndDate === rowData.id ? (
                <Calendar
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.value || null)}
                  dateFormat='yy-mm-dd'
                />
              ) : (
                rowData.endDate
              )
            }
          />
          <Column field='daysHeld' header='Days Held' />
          <Column field='boxes' header='Boxes' />
          <Column
            field='offerApplied'
            header='Offer Applied'
            body={(rowData: Rental) => (rowData.offerApplied ? 'Yes' : 'No')}
          />
          <Column
            field='amountOwed'
            header='Amount Owed'
            body={(rowData: Rental) => `${rowData.amountOwed.toFixed(2)} €`}
          />
          <Column field='status' header='Status' />
          <Column
            header='Actions'
            body={(rowData: Rental) =>
              editingEndDate === rowData.id ? (
                <Button onClick={() => handleEndDateUpdate(rowData.id)}>
                  Save
                </Button>
              ) : (
                <Button onClick={() => setEditingEndDate(rowData.id)}>
                  Edit End Date
                </Button>
              )
            }
          />
        </DataTable>
      )}
    </div>
  )
}

export default RentalTable
