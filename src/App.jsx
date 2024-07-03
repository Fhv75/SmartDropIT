import { useEffect, useState } from 'react';
import NavBar from './NavBar/NavBar';
import { Box, Button, Center, Checkbox, Flex, Heading, Input, SimpleGrid, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';

const SERVER_URL = 'http://localhost:3000';

function App() {
  const [state, setState] = useState('');
  const [humedad, setHumedad] = useState(0);
  const [temperatura, setTemperatura] = useState(0);
  const [riegoActivo, setRiegoActivo] = useState(false);
  const [startTime, setStartTime] = useState("00:00");
  const [isHumidityEnabled, setIsHumidityEnabled] = useState(false);
  const [sliderValue, setSliderValue] = useState(60);
  const toast = useToast();

  useEffect(() => {
    const fetchCommandAndProgramacion = async () => {
      try {
        const commandResponse = await axios.get(SERVER_URL + '/getCommandIT');
        setState(commandResponse.data);
        
        const programacionResponse = await axios.get(SERVER_URL + '/getProgramacionRiegoIT');
        setIsHumidityEnabled(programacionResponse.data.humedad !== -1);
        setSliderValue(programacionResponse.data.humedad);
        setStartTime(programacionResponse.data.horaInicio);
      } catch (error) {
        console.error('Error fetching data: ', error);
        toast({
          title: 'Error al obtener datos.',
          description: 'No se pudieron obtener los datos del servidor.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCommandAndProgramacion();

    const interval = setInterval(() => {
      axios.get(SERVER_URL + '/getDatos')
        .then((response) => {
          setHumedad(response.data.humedad);
          setTemperatura(response.data.temperatura);
          setRiegoActivo(response.data.riegoActivo); // Actualizar el estado del riego
          setState(
            response.data.riegoActivo ? 'START' : 'STOP'
          ); // Actualizar el estado localmente
        })
        .catch((error) => {
          console.error('Error fetching humedad: ', error);
          toast({
            title: 'Error al obtener datos.',
            description: 'No se pudieron obtener los datos de humedad.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        });
    }, 2000);

    return () => clearInterval(interval);
  }, [toast]);

  const handleSetProgramacionRiego = () => {
    let data = {
      humedad: isHumidityEnabled ? sliderValue : -1,
      startTime: isHumidityEnabled ? startTime : -1,
    };

    axios.post(SERVER_URL + '/setProgramacionRiego', data)
      .then(response => {
        console.log('Success:', response.data);
        toast({
          title: 'Programación guardada.',
          description: 'La programación del riego ha sido guardada exitosamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        toast({
          title: 'Error al guardar programación.',
          description: 'No se pudo guardar la programación del riego.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleToggleCommand = () => {
    const newCommand = state === 'START' ? 'STOP' : 'START';
    axios.post(SERVER_URL + '/setCommand', { command: newCommand })
      .then((response) => {
        setState(newCommand); // Actualizar el estado localmente

        // Resetear la programación localmente
        setIsHumidityEnabled(false);
        setSliderValue(60);
        setStartTime("00:00");

        toast({
          title: `Riego ${newCommand === 'START' ? 'iniciado' : 'detenido'}.`,
          description: `El riego ha sido ${newCommand === 'START' ? 'iniciado' : 'detenido'} manualmente.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
        toast({
          title: 'Error al cambiar estado.',
          description: 'No se pudo cambiar el estado del riego.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <NavBar />
      <SimpleGrid columns={2} spacing={10} mt={20} mx={20}>
        <Box border={
          state === 'START' ? '2px solid green' : '2px solid orange'
        } p={10} borderRadius={10} boxShadow="lg">
          <Heading>Programa el Riego</Heading>
          <Box mt={8}>
            <Flex align="center" mt={4}>
              <Heading size="lg" color="cyan.500">Humedad:</Heading>
              <Checkbox colorScheme="cyan" isChecked={isHumidityEnabled} ml={2} onChange={(e) => setIsHumidityEnabled(e.target.checked)}></Checkbox>
            </Flex>
            <Box>
              <Slider min={0} max={100} step={1} isDisabled={!isHumidityEnabled} value={sliderValue} onChange={(val) => setSliderValue(val)}>
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
              <Heading size="lg" color="cyan.500">Duración:</Heading>
            </Flex>
            <Input 
              type="time" isDisabled={!isHumidityEnabled} 
              onChange={(e) => setStartTime(e.target.value)}
              step="1"
              value={startTime}
            />
            <Button mt={8} colorScheme="green" onClick={handleSetProgramacionRiego}>Guardar</Button>
          </Box>
        </Box>
        <Box border={
          state === 'START' ? '2px solid green' : '2px solid orange'
        } p={10} borderRadius={10} boxShadow="lg">
          <Center flexDir={"column"}>
            <Heading size="xl" color="cyan.500" mb={4}>Estado del Riego:</Heading>
            {riegoActivo ? <Heading size="lg" color="green.500" py={4}>ENCENDIDO</Heading> : <Heading size="lg" color="orange.500" my={4}>APAGADO</Heading>}
            <Button my={4} w={100} onClick={handleToggleCommand}
              colorScheme={
                riegoActivo ? 'orange' : 'green'
              }>
              {riegoActivo ? 'Apagar' : 'Encender'}
            </Button>
            <Center mt={8}>
              <Heading size="xl" color="cyan.500" mr={6}>Humedad:</Heading>
              <Heading size="xl" color="cyan.500">{humedad}%</Heading>
            </Center>
            <Center mt={10}>
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
