/*endpoints */
import { Router } from "express";
import {
  getDocumentos,
  getsecciones,
  getnotes,
  getFirtsplans,
  getCartons,
  getImages,
  getDocumentosActive,
  getDocumentosFilterDetails, getDocumentStyles
} from "../../controllers/documents.controller.js"
import authMiddleware from "../../controllers/Middlewares/authMiddleware.js";

const router = Router();

router.get("/documents",authMiddleware, getDocumentos);
/**
 * @swagger
 * /documents:
 *   get:
 *     summary: Documento activo.
 *     responses:
 *       200:
 *         description: Se obtiene el nombre del documento activo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ID_DOCUMENTO:
 *                   type: integer
 *                   example: 1000745
 *                 NOMBRE_DOCUMENTO:
 *                   type: string
 *                   example: "Selecta Cydsa"
 *                 CAMPOS_FUENTE:
 *                   type: string
 *                   example: "F.MEDIO"
 */



router.get("/section",authMiddleware, getsecciones);
/**
 * @swagger
 * /section:
 *   get:
 *     summary: Lista de secciones.
 *     responses:
 *       200:
 *         description: Se obtiene una lista de secciones del documento activo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ID_DOCUMENTO:
 *                   type: integer
 *                   example: 1000745
 *                 ID_SECCION:
 *                   type: integer
 *                   example: 10981
 *                 NOMBRE_SECCION:
 *                   type: string
 *                   example: "CYDSA"
 */


router.get("/notaseccion",authMiddleware, getnotes);
/**
 * @swagger
 * /notaseccion:
 *   get:
 *     summary: Obtiene notas de una cada una de las secciones del documento activo.
 *     responses:
 *       200:
 *         description: Una lista de notas por sección asi como todos sus datos relacionados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Pemex retrasa por un año actividades en pozo Zama"
 *                     content:
 *                       type: string
 *                       example: "Petróleos Mexicanos (Pemex) envió a la Comisión Nacional de Hidrocarburos (CNH)..."
 *                     cost:
 *                       type: string
 *                       example: "65270.00"
 *                     alcance:
 *                       type: string
 *                       example: "2173.3400"
 *                     source:
 *                       type: string
 *                       example: "Milenio Diario / Ciudad de México / Ciudad de México, 1, P.14, 2024/02/09"
 *                     url:
 *                       type: string
 *                       example: "https://intelicast.net/inteliteApp/escritorioOk/jsptestigos/testigo.jsp?cveNota=113904038"
 */


router.get("/PrimerasPlanas",authMiddleware,getFirtsplans);
/**
 * @swagger
 * /PrimerasPlanas:
 *   get:
 *     summary: Obtiene las primeras planas.
 *     responses:
 *       200:
 *         description: Una lista de las primeras planas del día.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   captitulo:
 *                     type: string
 *                     example: "El Pais"
 *                   imagenURL:
 *                     type: string
 *                     example: "https://intelicast.net/miniatura/escritorio_new/min09022024101513cd.jpg"
 *                   fnodescripcion:
 *                     type: string
 *                     example: "El País - España"
 *                   logo_url:
 *                     type: string
 *                     example: "https://intelicast.net/logos_medios/logo.png"
 *                   PrimeraplanaURL:
 *                     type: string
 *                     example: "https://intelicast.net/testigo.jsp?cveNota=1000745"
 *                   EDITADO:
 *                     type: boolean
 *                   CAPFCAPSULA:
 *                     type: string
 *                     example: "2024-06-09"
 *                   CAPNOMBRE:
 *                     type: string
 *                     example: "Artículo Principal"
 *                   CAPFCAPTURA:
 *                     type: string
 *                     example: "2024-06-09 10:15:00"
 *                   CAPFMODIF:
 *                     type: string
 *                     example: "2024-06-09 10:30:00"
 *                   PAGINA:
 *                     type: integer
 *                     example: 1
 *                   TIPO:
 *                     type: string
 *                     example: "Noticia"
 *                   CLASIFICACION:
 *                     type: string
 *                     example: "Importante"
 *                   MEDIO:
 *                     type: string
 *                     example: "El País"
 *                   FNOORDEN:
 *                     type: integer
 *                     example: 1
 */


router.get("/Cartones",authMiddleware,getCartons);
/**
 * @swagger
 * /Cartones:
 *   get:
 *     summary: Obtiene las caricaturas.
 *     responses:
 *       200:
 *         description: Una lista de caricaturas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   captitulo:
 *                     type: string
 *                     example: "El Pais"
 *                   imagenURL:
 *                     type: string
 *                     example: "https://intelicast.net/miniatura/escritorio_new/min09022024101513cd.jpg"
 *                   fnodescripcion:
 *                     type: string
 *                     example: "El País - España"
 *                   EDITADO:
 *                     type: boolean
 */


router.get("/Images",authMiddleware,getImages)
/**
 * @swagger
 * /Images:
 *   get:
 *     summary: Obtiene los logos.
 *     responses:
 *       200:
 *         description: Logos de cada capítulo con descripción.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   CAPCLAVE:
 *                     type: integer
 *                     example: 1000745
 *                   EDITADO:
 *                     type: boolean
 *                   CAPFCAPSULA:
 *                     type: string
 *                     example: "2024-06-09"
 *                   NotacompletaURL:
 *                     type: string
 *                     example: "https://intelicast.net/testigo.jsp?cveNota=1000745"
 *                   captitulo:
 *                     type: string
 *                     example: "El Pais"
 *                   CAPFCAPTURA:
 *                     type: string
 *                     example: "2024-06-09 10:15:00"
 *                   CAPFMODIF:
 *                     type: string
 *                     example: "2024-06-09 10:30:00"
 *                   PAGINA:
 *                     type: integer
 *                     example: 1
 *                   TIPO:
 *                     type: string
 *                     example: "Noticia"
 *                   CLASIFICACION:
 *                     type: string
 *                     example: "Importante"
 *                   MEDIO:
 *                     type: string
 *                     example: "El País"
 *                   FNOORDEN:
 *                     type: integer
 *                     example: 1
 */


router.get("/FilterDoc",authMiddleware,getDocumentosActive)
/**
 * @swagger
 * /FilterDoc:
 *   get:
 *     summary: Documentos activos.
 *     responses:
 *       200:
 *         description: Documentos activos de Selecta.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_DOCUMENTO:
 *                     type: integer
 *                   NOMBRE_DOCUMENTO:
 *                     type: string
 *             example:
 *               - ID_DOCUMENTO: 1000282
 *                 NOMBRE_DOCUMENTO: "Cydsa Legislativos"
 *               - ID_DOCUMENTO: 1000745
 *                 NOMBRE_DOCUMENTO: "Selecta Cydsa"
 */

router.get("/FilterDocDetails/:id",authMiddleware,getDocumentosFilterDetails)
/**
 * @swagger
 * /FilterDocDetails/{id}:
 *   get:
 *     summary: Obtiene detalles de un documento filtrado por ID y fecha.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del documento
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha en formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Detalles del documento filtrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 details:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                         content:
 *                           type: string
 *                         urls:
 *                           type: array
 *                           items:
 *                             type: string
 *                         medium:
 *                           type: array
 *                           items:
 *                             type: string
 *                         cost:
 *                           type: number
 *                         alcance:
 *                           type: number
 *                         source:
 *                           type: array
 *                           items:
 *                             type: string
 *                         sourceTitle:
 *                           type: string
 *             example:
 *               id: 1000745
 *               details:
 *                 "Sección 1":
 *                   - title: "Título de Nota"
 *                     content: "Contenido de la nota"
 *                     urls: ["https://ejemplo.com"]
 *                     medium: ["Medio"]
 *                     cost: 100
 *                     alcance: 5000
 *                     source: ["Fuente"]
 *                     sourceTitle: "Título de Fuente"
 */

router.post('/document/styles',authMiddleware, getDocumentStyles);

export default router;
