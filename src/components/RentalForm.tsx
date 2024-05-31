import React, { useState } from 'react'
import { db } from '../firebase/firebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import {
  Box,
  Input,
  Button,
  FormLabel,
  FormControl,
  Checkbox,
  VStack,
  Heading,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react'
import { Client } from '../types/types'

const RentalForm: React.FC = () => {
  const [clientEmail, setClientEmail] = useState<string>('')
  const [client, setClient] = useState<Client | null>(null)
  const [boxes, setBoxes] = useState<number>(0)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [offerApplied, setOfferApplied] = useState<boolean>(false)
  const toast = useToast()

  const fetchClientByEmail = async (email: string) => {
    const q = query(collection(db, 'clients'), where('email', '==', email))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const clientDoc = querySnapshot.docs[0]
      const clientData = clientDoc.data() as Client
      setClient({ ...clientData, id: clientDoc.id })
      toast({
        title: 'Client found.',
        description: `Client ${clientData.name} found.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Client not found.',
        description: 'No client found with this email.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleSubmit = async () => {
    if (!client) {
      toast({
        title: 'No client selected.',
        description: 'Please fetch a client using their email.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }
    try {
      await addDoc(collection(db, 'rentals'), {
        client: client.name,
        clientId: client.id,
        clientEmail: client.email,
        boxes,
        startDate,
        endDate,
        offerApplied,
      })
      // Reset form
      setClient(null)
      setClientEmail('')
      setBoxes(0)
      setStartDate('')
      setEndDate('')
      setOfferApplied(false)
      toast({
        title: 'Rental added.',
        description: 'Rental has been successfully added.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error adding rental: ', error)
      toast({
        title: 'Error.',
        description: 'There was an error adding the rental.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      p={4}
      bg={useColorModeValue('gray.100', 'gray.900')}
    >
      <Box
        bg={useColorModeValue('white', 'gray.700')}
        p={6}
        rounded='md'
        shadow='md'
        width='100%'
        maxW='md'
      >
        <VStack spacing={4}>
          <Heading as='h3' size='lg'>
            Add Rental
          </Heading>
          <FormControl>
            <FormLabel>Client Email</FormLabel>
            <Input
              type='email'
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
            <Button
              mt={2}
              colorScheme='blue'
              onClick={() => fetchClientByEmail(clientEmail)}
            >
              Fetch Client
            </Button>
          </FormControl>
          {client && (
            <>
              <FormControl>
                <FormLabel>Client Name</FormLabel>
                <Input type='text' value={client.name} isReadOnly />
              </FormControl>
              <FormControl>
                <FormLabel>Number of Boxes</FormLabel>
                <Input
                  type='number'
                  value={boxes}
                  onChange={(e) => setBoxes(Number(e.target.value))}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>End Date</FormLabel>
                <Input
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Checkbox
                  isChecked={offerApplied}
                  onChange={(e) => setOfferApplied(e.target.checked)}
                >
                  20 Days Free Offer
                </Checkbox>
              </FormControl>
              <Button colorScheme='blue' onClick={handleSubmit}>
                Add Rental
              </Button>
            </>
          )}
        </VStack>
      </Box>
    </Box>
  )
}

export default RentalForm
