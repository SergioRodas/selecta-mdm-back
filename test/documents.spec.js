//"test de integración
import express from "express"; //  express para crear una instancia del enrutador
import request from "supertest";
import documentsRouter from "../src/v1/routes/documents.routes.js"; //  nombre del enrutador
import { closeDbConnection } from "../src/db.js"; //close data base

const app = express(); //  instancia del enrutador

// enrutador en la aplicación
app.use("/", documentsRouter);

//tes query Documents
describe("Get /Documents", () => {
  test("should response with a 200 status code", async () => {
    const response = await request(app).get("/documents").send();
    expect(response.status).toBe(200);
  });

  describe("Get /Section", () => {
    test("should respond with a 200 status code and expected objects", async () => {
      const response = await request(app).get("/section").send();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Object)); // Check if the response has at least one object
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ID_SECCION: expect.any(Number),
            NOMBRE_SECCION: expect.any(String),
          }),
        ])
      );
    });
  });

  describe("Get /notaseccion", () => {
    test("should respond with a 200 status code and expected objects", async () => {
      const response = await request(app).get("/notaseccion").send();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Object)); // Check if the response has at least one object
      expect(response.body).toEqual(
        expect.objectContaining({
          // Add properties according to your response
          "CYDSA": expect.any(Array), // Assuming there's a property named "CYDSA"
        })
      );
    });
  });
  describe("GET /PrimerasPlanas", () => {
    test("should respond with a 200 status code and expected objects", async () => {
      const response = await request(app).get("/PrimerasPlanas");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array)); 
      expect(response.body.length).toBeGreaterThan(0); 
      expect(response.body[0]).toHaveProperty("captitulo");
      expect(response.body[0]).toHaveProperty("imagenURL");
      expect(response.body[0]).toHaveProperty("fnodescripcion");
      // Verificar más propiedades según sea necesario
    });
  });
  
  describe("GET /Cartones", () => {
    test("should respond with a 200 status code and expected objects", async () => {
      const response = await request(app).get("/Cartones");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array)); 
      expect(response.body.length).toBeGreaterThan(0); 
      expect(response.body[0]).toHaveProperty("captitulo");
      expect(response.body[0]).toHaveProperty("imagenURL");
      expect(response.body[0]).toHaveProperty("fnodescripcion");
      // Verificar más propiedades según sea necesario
    });
  });
  /*
  describe('GET /FilterDoc', () => {
    test('Debería devolver una lista de documentos activos', async () => {
      const response = await request(app).get('FilterDoc');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toBeGreaterThan(0);
      
    });
  });*/
  
  describe('GET /FilterDocDetails/:id', () => {
    test('Debería devolver los detalles del documento con ID especificado', async () => {
      const idDocumento = 1000745; // ID de ejemplo
      const fecha = '2024-06-10'; // Fecha de ejemplo
      const response = await request(app).get(`/FilterDocDetails/${idDocumento}?date=${fecha}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Object));
      expect(parseInt(response.body.id)).toBe(idDocumento); // Convertir la cadena a número
      expect(response.body.details).toEqual(expect.any(Object));
      
    });
  
    test('Debería devolver los detalles del documento con ID especificado sin proporcionar una fecha', async () => {
      const idDocumento = 1000282; // ID de ejemplo
      const response = await request(app).get(`/FilterDocDetails/${idDocumento}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Object));
      expect(parseInt(response.body.id)).toBe(idDocumento); // Convertir la cadena a número
      expect(response.body.details).toEqual(expect.any(Object));
      
    });
  });
  

    //close conecction
    afterAll(() => {
      closeDbConnection();
    });
  });

