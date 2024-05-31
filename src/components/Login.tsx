import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
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
import { auth } from '../firebase/firebase'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: 'Logged in.',
        description: 'You have successfully logged in.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      navigate('/')
    } catch (error) {
      console.error('Error logging in: ', error)
      toast({
        title: 'Error.',
        description: 'There was an error logging in.',
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
      minH='100vh'
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
            Login
          </Heading>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button colorScheme='blue' onClick={handleLogin}>
            Login
          </Button>
        </VStack>
      </Box>
    </Box>
  )
}

export default LoginPage
