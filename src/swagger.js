
import swaggerJsdoc from 'swagger-jsdoc';



const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'BACK-END SELECTA EL MEDIO DE MEDIOS',
        version: '1.0.0',
        description: 'Recursos de la API Selecta Media de Medios',
      },
    },
    apis: ["src/v1/routes/documents.routes.js",
      "src/v1/routes/user.routes.js"
    ], // Ruta a los  endpoints
  };
  
  const specs = swaggerJsdoc(options);
  
  
 export default specs;