import { useEffect, useState } from 'react';
import NavBar from './NavBar/NavBar';
import { Box, Button, Center, Heading, SimpleGrid } from '@chakra-ui/react';
import axios from 'axios';

const SERVER_URL = 'http://18.229.124.1:3000';

function App() {
  const [state, setState] = useState('');
  const [humedad, setHumedad] = useState(0);

  useEffect(() => {
    axios.get(SERVER_URL + '/getCommandIT')
      .then((response) => {
        setState(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, [state]);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(SERVER_URL + '/getHumedad')
        .then((response) => {
          setHumedad(response.data.humedad);
        })
        .catch((error) => {
          console.error('Error fetching humedad: ', error);
        });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NavBar></NavBar>
      <Center>  
        <SimpleGrid columns={2} spacing={10} mt={20}>
          <Box>
            <Center flexDir={"column"}>
              <Heading size="xl" color="blue.500" mb={4}>ESTADO DEL RIEGO:</Heading>
              {
                state === 'START' ? <Heading size="lg" color="green.500" py={4}>ENCENDIDO</Heading> : <Heading size="lg" color="red.500" my={4}>APAGADO</Heading>
              }
              <Button my={4} onClick={() => {
                axios.post(SERVER_URL + '/setCommand', {
                  command: state === 'START' ? 'STOP' : 'START'
                })
                  .then((response) => {
                    setState(response.data);
                  })
                  .catch((error) => {
                    console.error('Error fetching data: ', error);
                  });
              }}>
                {
                  state === 'START' ? 'Apagar' : 'Encender'
                }
              </Button>
            </Center>
          </Box>
          <Box>
            <Center>
              <Heading size="xl" color="blue.500" mr={6}>HUMEDAD:</Heading>
              <Heading size="xl" color="blue.500">{humedad}%</Heading>
            </Center>
          </Box>
        </SimpleGrid>
      </Center>
    </>
  );
}

export default App;
