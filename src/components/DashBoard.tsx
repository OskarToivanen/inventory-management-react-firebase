import React, { useEffect, useState } from 'react'
import { db } from '../firebase/firebase'
import { collection, getDocs } from 'firebase/firestore'
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react'
import { Client, Rental } from '../types/types'

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [totalBoxes, setTotalBoxes] = useState<number>(0)
  const [totalAmountOwed, setTotalAmountOwed] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
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

      let totalBoxesRented = 0
      let totalAmount = 0

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

        totalBoxesRented += rental.boxes
        totalAmount += rental.amountOwed
      })

      setClients(clientsData)
      setRentals(rentalsData)
      setTotalBoxes(totalBoxesRented)
      setTotalAmountOwed(totalAmount)
    }

    fetchData()
  }, [])

  return (
    <Box p={4} bg={useColorModeValue('gray.100', 'gray.900')} minH='100vh'>
      <Heading as='h1' size='xl' mb={4}>
        Dashboard
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        <StatBox title='Total Clients' stat={clients.length} />
        <StatBox title='Total Rentals' stat={rentals.length} />
        <StatBox title='Total Boxes Rented' stat={totalBoxes} />
        <StatBox
          title='Total Amount Owed'
          stat={`${totalAmountOwed.toFixed(2)} €`}
        />
      </SimpleGrid>
    </Box>
  )
}

const StatBox: React.FC<{ title: string; stat: string | number }> = ({
  title,
  stat,
}) => {
  return (
    <Box
      p={4}
      bg={useColorModeValue('white', 'gray.700')}
      rounded='md'
      shadow='md'
    >
      <Stat>
        <StatLabel>{title}</StatLabel>
        <StatNumber>{stat}</StatNumber>
        <StatHelpText>Updated now</StatHelpText>
      </Stat>
    </Box>
  )
}

export default Dashboard
