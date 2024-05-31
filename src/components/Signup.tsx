import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase'
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

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const navigate = useNavigate()
  const toast = useToast()

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match.',
        description: 'Please ensure your passwords match.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      // Set user profile in Firestore (remove role and approved fields)
      await setDoc(doc(db, 'users', user.uid), {
        email,
      })

      toast({
        title: 'Account created.',
        description: 'Your account has been created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      navigate('/login')
    } catch (error) {
      console.error('Error signing up: ', error)
      toast({
        title: 'Error.',
        description: 'There was an error creating your account.',
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
            Sign Up
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
          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          <Button colorScheme='blue' onClick={handleSignup}>
            Sign Up
          </Button>
        </VStack>
      </Box>
    </Box>
  )
}

export default SignupPage
