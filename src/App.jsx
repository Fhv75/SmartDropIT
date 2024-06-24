import { useEffect, useState } from 'react';
import NavBar from './NavBar/NavBar';
import { Box, Button, Center, Checkbox, Flex, Heading, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, SimpleGrid, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from '@chakra-ui/react';
import axios from 'axios';

const SERVER_URL = 'http://18.229.124.1:3000';

function App() {
  const [state, setState] = useState('');
  const [humedad, setHumedad] = useState(0);
  const [temperatura, setTemperatura] = useState(0);

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
    axios.get(SERVER_URL + '/getProgramacionRiego')
      .then((response) => {
        setIsHumidityEnabled(response.data.humedad !== -1);
        setSliderValue(response.data.humedad);
        setIsTimeEnabled(response.data.horaInicio !== -1);
        setStartTime(response.data.horaInicio);
        setEndTime(response.data.horaFin);
        setIsTempEnabled(response.data.temperatura !== -1);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, [state]);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(SERVER_URL + '/getDatos')
        .then((response) => {
          setHumedad(response.data.humedad);
          setTemperatura(response.data.temperatura);
        })
        .catch((error) => {
          console.error('Error fetching humedad: ', error);
        });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  const [isTempEnabled, setIsTempEnabled] = useState(false);
  const [isTimeEnabled, setIsTimeEnabled] = useState(false);
  const [isHumidityEnabled, setIsHumidityEnabled] = useState(false);

  const [sliderValue, setSliderValue] = useState(60);

  const handleSetProgramacionRiego = () => {
    // Si algun campo esta deshabilitado, no se envia

    let data = {
      humedad: isHumidityEnabled ? sliderValue : -1,
      startTime: isTimeEnabled ? startTime : -1,
      endTime: isTimeEnabled ? endTime : -1,
      temperatura: isTempEnabled ? temperatura : -1
    };

    console.log(data);

    axios.post(SERVER_URL + '/setProgramacionRiego', data)
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }; 

  return (
    <>
      <NavBar></NavBar>
      <SimpleGrid columns={2} spacing={10} mt={20} mx={20}>
        <Box border={
          state === 'START' ? '2px solid green' : '2px solid orange'
        } p={10} borderRadius={10} boxShadow="lg"
        >
          <Heading >Programa el Riego</Heading>
          <Box mt={8}>
            <Flex align="center" mt={4}>
              <Heading size="lg" color="cyan.500">Humedad:</Heading>
              <Checkbox colorScheme="cyan" defaultIsChecked={isHumidityEnabled} ml={2} onChange={(e) => setIsHumidityEnabled(e.target.checked)}></Checkbox>
            </Flex>
            <Box>
              <Slider min={0} max={100} step={1} isDisabled={!isHumidityEnabled} defaultValue={60} onChange={(val) => setSliderValue(val)}>
                <SliderTrack bg={
                  sliderValue < 55 ? 'green.100' : sliderValue < 75 ? 'yellow.100' : 'red.100'
                }>
                  <SliderFilledTrack
                    bg={sliderValue < 55 ? 'green.500' : sliderValue < 75 ? 'yellow.500' : 'red.500'}
                  />
                </SliderTrack>
                <SliderThumb boxSize={6} />
              </Slider>
              <Text>Valor actual: {sliderValue}%</Text>
            </Box>

            <Flex align="center" mt={4}>
              <Heading size="lg" color="cyan.500">Hora de Inicio:</Heading>
              <Checkbox
                colorScheme="cyan"
                isChecked={isTimeEnabled} ml={2} onChange={(e) => setIsTimeEnabled(e.target.checked)}></Checkbox>
            </Flex>
            <Input 
              type="time" isDisabled={!isTimeEnabled} 
              onChange={(e) => setStartTime(e.target.value)}
            />

            <Flex align="center" mt={4}>
              <Heading size="lg" color="cyan.500">Hora de Fin:</Heading>
              <Checkbox colorScheme="cyan" isChecked={isTimeEnabled} ml={2} onChange={(e) => setIsTimeEnabled(e.target.checked)}></Checkbox>
            </Flex>
            <Input 
              type="time" isDisabled={!isTimeEnabled} 
              onChange={(e) => setEndTime(e.target.value)}
            />

            <Flex align="center">
              <Heading size="lg" color="cyan.500">Temperatura:</Heading>
              <Checkbox colorScheme="cyan" isChecked={isTempEnabled} ml={2} onChange={(e) => setIsTempEnabled(e.target.checked)}></Checkbox>
            </Flex>
            <NumberInput
              defaultValue={24} min={0}
              isDisabled={!isTempEnabled} mt={4}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <Button mt={8} colorScheme="green" onClick={handleSetProgramacionRiego}>Guardar</Button>

          </Box>
        </Box>
        <Box border={
          state === 'START' ? '2px solid green' : '2px solid orange'
        } p={10} borderRadius={10} boxShadow="lg">
          <Center flexDir={"column"}>
            <Heading size="xl" color="cyan.500" mb={4}>Estado del Riego:</Heading>
            {
              state === 'START' ? <Heading size="lg" color="green.500" py={4}>ENCENDIDO</Heading> : <Heading size="lg" color="orange.500" my={4}>APAGADO</Heading>
            }
            <Button my={4} w={100} onClick={() => {
              axios.post(SERVER_URL + '/setCommand', {
                command: state === 'START' ? 'STOP' : 'START'
              })
                .then((response) => {
                  setState(response.data);
                })
                .catch((error) => {
                  console.error('Error fetching data: ', error);
                });
            }}
              colorScheme={
                state === 'START' ? 'orange' : 'green'
              }
            >
              {
                state === 'START' ? 'Apagar' : 'Encender'
              }
            </Button>
            <Center mt={8}>
              <Heading size="xl" color="cyan.500" mr={6}>Humedad:</Heading>
              <Heading size="xl" color="cyan.500">{humedad}%</Heading>
            </Center>
            <Center mt={20}>
              <Heading size="xl" color="cyan.500" mr={6}>Temperatura:</Heading>
              <Heading size="xl" color="cyan.500">{temperatura} °C</Heading>
            </Center>
          </Center>
        </Box>
      </SimpleGrid>
    </>
  );
}

export default App;
