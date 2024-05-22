import { useEffect, useState } from 'react'
import NavBar from './NavBar/NavBar'
import { Button, Center, Heading } from '@chakra-ui/react'
import axios from 'axios'

const SERVER_URL = 'http://18.229.124.1:3000'

function App() {

  const [state, setState] = useState('');

  useEffect(() => {
    axios.get(SERVER_URL + '/getCommandIT')
      .then((response) => {
        setState(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data: ', error)
      })
  }, [state])

  return (
    <>
      <NavBar></NavBar>
      <Center flexDir={"column"}>  
        <Heading size="xl" ml={4} color="blue.500" mt={20} mb={4}>ESTADO DEL RIEGO:</Heading>
        {
          state === 'START' ? <Heading size="lg" color="green.500" py={4}>ENCENDIDO</Heading> : <Heading size="lg" color="red.500" my={4}>APAGADO</Heading>
        }
        <Button my={4} onClick={() => {
          axios.post(SERVER_URL + '/setCommand', {
            command: state === 'START' ? 'STOP' : 'START'
            })
            .then((response) => { 
              setState(response.data)
            })
            .catch((error) => {
              console.error('Error fetching data: ', error)
            })
        }
        }>
          {
            state === 'START' ? 'Apagar' : 'Encender'
          }
        </Button>
      </Center>
    </>
  )
}

export default App
