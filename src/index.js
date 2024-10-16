/* Config basic server start*/
import app from "./app.js";
import { PORT } from "./config.js";


// Puerto de escucha
app.listen(PORT);

console.log("server runing on port", PORT);
console.log(`Accede a la documentación la API SELECTA DE MEDIOS en: http://localhost:${PORT}/api-docs`);

