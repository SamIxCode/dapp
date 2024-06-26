'use client'

import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Heading,
  Link,
} from '@chakra-ui/react'

import { SunIcon, MoonIcon } from '@chakra-ui/icons'


interface Props {
  children: React.ReactNode
}

const NavLink = (props: Props) => {
  const { children } = props

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
      {children}
    </Box>
  )
}

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
 
     

        <Flex h={16} alignItems={'center'} justifyContent={'center'}>
        <Box w={'full'}>
            <Center>
            <Box  w={"20%"}></Box>
             <Heading mx={2} as={Link} href='/' >CrowdFund.</Heading>
             <Box w={"20%"}>
              <Button onClick={toggleColorMode}>
               {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
      </Button>
              </Box>
             
       
            </Center>
          </Box>
        
          <Box ml={'auto'}>
          
          </Box>
        </Flex>
      </Box>
    </>
  )
}