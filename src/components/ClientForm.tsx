import React, { useState } from 'react'
import { db } from '../firebase/firebase'
import { collection, addDoc } from 'firebase/firestore'
import {
  Box,
  Input,
  Button,
  FormLabel,
  FormControl,
  VStack,
  Heading,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react'

const ClientForm: React.FC = () => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const toast = useToast()

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'clients'), { name, email })
      setName('')
      setEmail('')
      toast({
        title: 'Client added.',
        description: 'Client has been successfully added.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error adding client: ', error)
      toast({
        title: 'Error.',
        description: 'There was an error adding the client.',
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
            Add Client
          </Heading>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <Button colorScheme='blue' onClick={handleSubmit}>
            Add Client
          </Button>
        </VStack>
      </Box>
    </Box>
  )
}

export default ClientForm
