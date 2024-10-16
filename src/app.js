import express from "express";
import cors from "cors";
import compression from "compression";
import documentsRoutes from "./v1/routes/documents.routes.js";
import  userRoutes  from "./v1/routes/user.routes.js";
import errorHandler from "./controllers/Middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../src/swagger.js";
const app = express();

app.use(cors({
  //Configuración de CORS especifica
  origin: "https://selecta-mdm-front.vercel.app", 
  
  methods: "GET,PUT,PATCH,POST,DELETE",
 
}));

app.use(errorHandler) 

app.use(compression()); 
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use("/api/v1", documentsRoutes);

app.use('/api/v1/users', userRoutes);
// Manejo de endpoints no encontrados
app.use((req, res, next) => {
  res.status(404).json({
    mensaje: "endpoint not found",
  });
});
export default app;
