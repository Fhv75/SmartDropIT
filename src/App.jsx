import { useEffect, useState } from 'react';
import NavBar from './NavBar/NavBar';
import { Box, Button, Center, Heading, SimpleGrid, Input, Select, Flex } from '@chakra-ui/react';
import axios from 'axios';

const SERVER_URL = 'http://18.229.124.1:3000';

function App() {
  const [state, setState] = useState('');
  const [humedad, setHumedad] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [schedule, setSchedule] = useState({
    hour: '',
    condition: 'temperature',
    threshold: 0
  });

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

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(SERVER_URL + '/getTemperature')
        .then((response) => {
          setTemperature(response.data.temperature);
        })
        .catch((error) => {
          console.error('Error fetching temperature: ', error);
        });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleState = () => {
    axios.post(SERVER_URL + '/setCommand', {
      command: state === 'START' ? 'STOP' : 'START'
    })
      .then((response) => {
        setState(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  };

  return (
    <>
      <NavBar />
      <Center style={styles.background}>
        <Flex direction="column" align="center" justify="center" style={styles.container}>
          <SimpleGrid columns={[1, null, 2]} spacing={10} style={styles.grid}>
            <Box style={styles.box}>
              <Center flexDir="column">
                <Heading size="lg" color="blue.500" mb={4}>Estado del Riego</Heading>
                {state === 'START' 
                  ? <Heading size="md" color="green.500" mb={4}>Encendido</Heading> 
                  : <Heading size="md" color="red.500" mb={4}>Apagado</Heading>
                }
                <Button colorScheme={state === 'START' ? 'red' : 'green'} onClick={toggleState}>
                  {state === 'START' ? 'Apagar' : 'Encender'}
                </Button>
              </Center>
            </Box>
            <Box style={styles.box}>
              <Center flexDir="column">
                <Heading size="lg" color="blue.500" mb={4}>Mediciones</Heading>
                <Heading size="md" color="blue.500" mb={2}>Humedad: {humedad}%</Heading>
                <Heading size="md" color="blue.500" mb={2}>Temperatura: {temperature}°C</Heading>
              </Center>
            </Box>
            <Box style={styles.box}>
              <Heading size="lg" color="blue.500" mb={4}>Programar Riego</Heading>
              <form>
                <label style={styles.label}>
                  Hora:
                  <Input
                    type="time"
                    value={schedule.hour}
                    onChange={(e) => setSchedule({ ...schedule, hour: e.target.value })}
                    style={styles.input}
                  />
                </label>
                <label style={styles.label}>
                  Condición:
                  <Select
                    value={schedule.condition}
                    onChange={(e) => setSchedule({ ...schedule, condition: e.target.value })}
                    style={styles.input}
                  >
                    <option value="temperature">Temperatura</option>
                    <option value="humidity">Humedad</option>
                  </Select>
                </label>
                <label style={styles.label}>
                  Umbral:
                  <Input
                    type="number"
                    value={schedule.threshold}
                    onChange={(e) => setSchedule({ ...schedule, threshold: e.target.value })}
                    style={styles.input}
                  />
                </label>
                <Button type="button" colorScheme="blue" style={styles.button} onClick={() => alert("Horario Configurado")}>
                  Configurar Horario
                </Button>
              </form>
            </Box>
          </SimpleGrid>
        </Flex>
      </Center>
    </>
  );
}

const styles = {
  background: {
    minHeight: '100vh',
    backgroundImage: 'url("/src/img/nature.jpg")', // Ruta a la imagen en la carpeta public/img
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '20px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '10px',
    marginTop: '0px', // Incrementa el margen superior para evitar que se junte con el NavBar
  },
  grid: {
    width: '100%',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
  },
};

export default App;
