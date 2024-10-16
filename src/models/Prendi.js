
import axios from "axios";


//srcipt cache prueba el tiempo de respuesta
async function benchmark() {
  const start = Date.now();
  try {
    const response = await axios.get('http://localhost:4001/api/v1/FilterDocDetails/1000745?date=2024-05-14');
    const end = Date.now();
    console.log(`Request took ${end - start} ms`);
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error making request:', error.response ? error.response.data : error.message);
  }
}

benchmark();


