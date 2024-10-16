// Middleware para manejar errores de CORS
const errorHandler = (err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
    res.status(401).json({ mensaje: "Acceso no autorizado" });
    } else {
    res.status(500).json({ mensaje: "Error interno del servidor" });
    }
   };
   export default errorHandler;