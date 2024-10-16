/* metodos*/
import { htmlToText } from 'html-to-text'
import { pool } from "../db.js";
import { format } from 'date-fns'; // Importar la función format de date-fns
import fetch from 'node-fetch';

/*Mediante este select obtenemos los documentos existentes, en este ejemplo se busca los de CYDSA y tomaremos
el de Relevante Cydsa, al final la clave del documento lo tomaremos de la tabla que se creara para identificar
los documentos de cada usuario*/
export const getDocumentos = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT ID_DOCUMENTO,NOMBRE_DOCUMENTO,CAMPOS_FUENTE FROM EDITOR_DOCUMENTOS WHERE nombre_documento LIKE '% CYDSA%' AND FLG_ACTIVO=1 "
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: "something goes wrong",
    });
  }
};

//query Secciones
export const getsecciones = async (req, res) => {
  try {
    const [result] = await pool.query(`SELECT ID_DOCUMENTO ,ID_SECCION, NOMBRE_SECCION  FROM EDITOR_SECCIONES WHERE ID_DOCUMENTO=1000745  AND FLG_ACTIVO=1 AND FLG_ELIMINADO=0`);

    if (result.length > 0) {
      // Verificar si al menos un objeto cumple con la estructura esperada
      const expectedObject = {
        "ID_SECCION": 10981,
        "NOMBRE_SECCION": "CYDSA"
      };

      const hasExpectedObject = result.some(obj => (
        obj.ID_SECCION === expectedObject.ID_SECCION &&
        obj.NOMBRE_SECCION === expectedObject.NOMBRE_SECCION
      ));

      if (hasExpectedObject) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({
          mensaje: "Expected object not found in the result",
        });
      }
    } else {
      return res.status(404).json({
        mensaje: "No data found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      mensaje: "something goes wrong",
    });
  }
};


/*  Query para obtener las notas de cada sección (Usado en Indice(Index) y Secciones/Notas(TopicSections))*/
export const getnotes = async (req, res) => {


  try {
    const [rows] = await pool.query(`SELECT
    ES.NOMBRE_SECCION,
    S.ID_SINTESIS,
    S.TITULO,
    S.SINTESIS,
    S.ID_SECCION,
    S.CVECAPSULA,
    EF.FUENTE,
    EF.TITULO AS FUENTE_TITULO,
    EF.MEDIO,
    EF.URL,
    ER.CVECAPSULA,
    IC.CAPCLAVE,
    IC.CAPCOSTOCM,
    EA.CAACAPSULA,
    EA.CAAALCANCEREAL
FROM
    EDITOR_SECCIONES ES
LEFT JOIN
    EDITOR_SINTESIS S ON ES.ID_SECCION = S.ID_SECCION AND DATE(S.FECHA) = '2024-05-28'
LEFT JOIN
    EDITOR_REFERENCIAS ER ON S.ID_SINTESIS = ER.ID_SINTESIS
LEFT JOIN
    EDITOR_FUENTES EF ON ER.ID_REFERENCIA = EF.ID_REFERENCIA
LEFT JOIN
    INTELITE_ICAPSULA IC ON ER.CVECAPSULA = IC.CAPCLAVE
LEFT JOIN
    INTELITE_ICAPSULAALCANCE EA ON IC.CAPCLAVE = EA.CAACAPSULA
WHERE
    ES.ID_DOCUMENTO = 1000745
    AND ES.FLG_ACTIVO = 1 
    AND ES.FLG_ELIMINADO = 0`);

    const groupedBySection = rows.reduce((acc, row) => {
      const plainTextSintesis = htmlToText(row.SINTESIS, {
        wordwrap: 130
      });
      const textWithoutNewlines = plainTextSintesis.replace(/\n/g, " "); // Reemplaza cada \n con un espacio

      if (!acc[row.NOMBRE_SECCION]) {
        acc[row.NOMBRE_SECCION] = [];
      }

      //  entrada existente con el mismo título y contenido
      const existingEntry = acc[row.NOMBRE_SECCION].find(entry => entry.title === row.TITULO && entry.content === textWithoutNewlines);

      if (existingEntry) {
        // Si ya existe, agrega la URL, Medio y la FUENTE si aún no están incluidos
        if (!existingEntry.urls.includes(row.URL)) {
          existingEntry.urls.push(row.URL);
        }
        if (!existingEntry.medium.includes(row.MEDIO)) {
          existingEntry.medium.push(row.MEDIO);
        }
        if (!existingEntry.source.includes(row.FUENTE)) {
          existingEntry.source.push(row.FUENTE);
        }
      } else {
        // Si no existe, crea una nueva entrada con medios, fuentes y URLs como arrays
        acc[row.NOMBRE_SECCION].push({
          title: row.TITULO,
          content: textWithoutNewlines,
          urls: [row.URL], // Inicializa con la URL actual
          medium: [row.MEDIO], // Inicializa con el medio actual
          cost: row.CAPCOSTOCM,
          alcance: row.CAAALCANCEREAL,
          source: [row.FUENTE],// Inicializa con la Fuente actual
          sourceTitle: row.FUENTE_TITULO,
        });
      }

      return acc;
    }, {});

    return res.status(200).json(groupedBySection);
  } catch (error) {
    console.error('Error al buscar las notas:', error);
    return res.status(500).json({
      mensaje: "something goes wrong",
      error: error.message
    });
  }
};


//primeras planas, y miniaturas 
export const getFirtsplans = async (req, res) => {
  try {
    const [result] = await pool.query(`SELECT 
    IC.CAPTITULO AS captitulo,
    CONCAT('https://intelicast.net/miniatura/escritorio_new/min', CI.cimnombrearchivo, '.jpg') AS imagenURL,
    IFN.fnodescripcion,
    CONCAT('https://intelicast.net/w6231v4smt7j5PM74S7vS768W58W0K7e6m99bP0O/logos_medios/', CL.LCLLOGO) AS logo_url,
    CONCAT('https://intelicast.net/inteliteApp/escritorioOk/jsptestigos/testigo.jsp?cveNota=', IC.CAPCLAVE) AS PrimeraplanaURL,
    DATEDIFF(IC.CAPFCAPSULA, IC.CAPFMODIF) > 0 AS EDITADO,
    IC.CAPFCAPSULA,
    IC.CAPNOMBRE,
    DATE_FORMAT(IC.CAPFCAPTURA, '%Y-%m-%d %H:%i:%s') AS CAPFCAPTURA,
    DATE_FORMAT(IC.CAPFMODIF, '%Y-%m-%d %H:%i:%s') AS CAPFMODIF,
    IC.CAPNPAGINA AS PAGINA,
    IFM.FMEDESCRIPCION AS TIPO,
    IFC.FCLDESCRIPCION AS CLASIFICACION,
    IRE.FNODESCRIPCION AS MEDIO,
    IRE.FNOORDEN
FROM 
    INTELITE_ICAPSULA IC
LEFT JOIN 
    INTELITE_IFTENOMBRE IFN ON IFN.FNOCLAVE = IC.CAPNOMBRE
LEFT JOIN 
    CLIPPING_ICLIPPINGIMAGEN CI ON CI.CIMCLIPPING = IC.CAPCLAVE
LEFT JOIN 
    CLIPPING_ILOGOCLIPPING CL ON CL.LCLNOMBRE = IC.CAPNOMBRE
INNER JOIN 
    INTELITE_IFTEMEDIO IFM ON IFM.FMECLAVE = IC.CAPMEDIO
INNER JOIN 
    INTELITE_IFTECLASIFICACION IFC ON IFC.FCLCLAVE = IC.CAPCLASIFICACION
INNER JOIN 
    INTELITE_IFTENOMBRE IRE ON IRE.FNOCLAVE = IC.CAPNOMBRE
  WHERE IC.CAPFCAPTURA >= CURDATE() AND IC.CAPFCAPTURA <= CURDATE() + INTERVAL 1 DAY AND ((  capambito = 1  )and(  capmedio = 1  )and(  capclasificacion = 7893  )) ORDER BY IC.CAPFCAPTURA DESC `);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: "something goes wrong",
    });
  }
};





//Cartones (usado en Sections/Cartond)
export const getCartons = async (req, res) => {
  try {
    const [result] = await pool.query(`SELECT 
    IC.CAPTITULO AS captitulo,
    CONCAT('https://intelicast.net/miniatura/escritorio_new/min', CI.CIMNOMBREARCHIVO, '.jpg') AS imagenURL,
    IFN.FNODESCRIPCION AS fnodescripcion,
     DATEDIFF(IC.CAPFCAPSULA, IC.CAPFMODIF) > 0 AS EDITADO
FROM 
    INTELITE_ICAPSULA IC
LEFT JOIN 
    INTELITE_IFTENOMBRE IFN ON IFN.FNOCLAVE = IC.CAPNOMBRE
LEFT JOIN 
    CLIPPING_ICLIPPINGIMAGEN CI ON CI.CIMCLIPPING = IC.CAPCLAVE
WHERE 
    DATE(IC.CAPFCAPSULA) >= CURRENT_DATE() and IC.CAPFCAPSULA <= CURDATE() + INTERVAL 1 DAY
    AND IC.CAPCLASIFICACION IN(9)
`);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: "something goes wrong",
    });
  }
};


//end-poin para la notaCompleta (usado en FrontPages(ViewsPP))

export const getImages = async(req,res)=>{

  try {
    const [result] = await pool.query(`SELECT
    IC.CAPCLAVE,
    DATEDIFF(IC.CAPFCAPSULA, IC.CAPFMODIF) > 0 AS EDITADO,
    IC.CAPFCAPSULA,
    CONCAT('https://intelicast.net/inteliteApp/escritorioOk/jsptestigos/testigo.jsp?cveNota=', IC.CAPCLAVE) AS NotacompletaURL,
    IC.CAPTITULO AS captitulo,
    DATE_FORMAT(IC.CAPFCAPTURA, '%Y-%m-%d %H:%i:%s') CAPFCAPTURA,
    DATE_FORMAT(IC.CAPFMODIF, '%Y-%m-%d %H:%i:%s') CAPFMODIF,
    IC.CAPNPAGINA PAGINA,
    IFM.FMEDESCRIPCION TIPO,
    IFC.FCLDESCRIPCION CLASIFICACION,
    IRE.FNODESCRIPCION MEDIO,
    IRE.FNOORDEN
    FROM INTELITE_ICAPSULA IC
    INNER JOIN INTELITE_IFTEMEDIO IFM ON IFM.FMECLAVE = IC.CAPMEDIO
    INNER JOIN INTELITE_IFTECLASIFICACION IFC ON IFC.FCLCLAVE = IC.CAPCLASIFICACION
    INNER JOIN INTELITE_IFTENOMBRE IRE ON IRE.FNOCLAVE = IC.CAPNOMBRE
    WHERE IC.CAPFCAPTURA >= CURDATE() AND IC.CAPFCAPTURA <= CURDATE() + INTERVAL 1 DAY AND ((  capclasificacion = 6305  )and(  capestado = 9  )) ORDER BY IC.CAPFCAPTURA DESC

`);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: "something goes wrong",
    });
  }
}

/** REMPLAZAR POR DOCUEMNTOS ESPECIFICADOS 
 * ESTE ENDPOINT TRAE TODOS LOS DOCUMENTOS
 //-----listado de todos los documentos activos------------
export const getDocumentosActive = async (req, res) => {
  //const specificDocumentIds = [1000745, 1000282];  // IDs de "Selecta Cydsa" y "Selecta Legislativos"
    try {
    const [documentos] = await pool.query(`
      SELECT ID_DOCUMENTO, NOMBRE_DOCUMENTO 
      FROM EDITOR_DOCUMENTOS 
      WHERE FLG_ACTIVO=1 
    `, );
// Verificar los docuemntos activos:
// se elimina el FLG_ACTIVO=1 AND ID_DOCUMENTO IN (?, ?)

    return res.status(200).json(documentos);
  } catch (error) {
    console.error('Error al listar documentos:', error);
    return res.status(500).json({
      mensaje: "something goes wrong",
      error: error.message
    });
  }
};
 */




//listado de los documentos activos Cydsa
export const getDocumentosActive = async (req, res) => {
  const specificDocumentIds = [1000745, 1000282];  // IDs de "Selecta Cydsa" y "Selecta Legislativos"
    try {
    const [documentos] = await pool.query(`
      SELECT ID_DOCUMENTO, NOMBRE_DOCUMENTO 
      FROM EDITOR_DOCUMENTOS 
      WHERE ID_DOCUMENTO IN (?, ?)
    `,specificDocumentIds );
// Verificar los docuemntos activos:
// se elimina el FLG_ACTIVO=1 AND ID_DOCUMENTO IN (?, ?)

    return res.status(200).json(documentos);
  } catch (error) {
    console.error('Error al listar documentos:', error);
    return res.status(500).json({
      mensaje: "something goes wrong",
      error: error.message
    });
  }
};

// Función para cargar en memoria las secciones (loadSectionCache)
// Cache de secciones
let sectionCache = {};
// Función para cargar el cache de secciones
async function loadSectionCache() {
  const specificDocumentIds = [1000745, 1000282];  // IDs de "Selecta Cydsa" y "Selecta Legislativos"
  const [sections] = await pool.query(`
    SELECT ID_DOCUMENTO, NOMBRE_SECCION, ID_SECCION 
    FROM EDITOR_SECCIONES 
    WHERE ID_DOCUMENTO IN (?, ?)
    AND FLG_ACTIVO = 1 
    AND FLG_ELIMINADO = 0
  `, specificDocumentIds);

  sections.forEach(section => {
    if (!sectionCache[section.ID_DOCUMENTO]) {
      sectionCache[section.ID_DOCUMENTO] = [];
    }
    sectionCache[section.ID_DOCUMENTO].push({
      id: section.ID_SECCION,
      name: section.NOMBRE_SECCION
    });
  });
}

// Llamar a la función para cargar el cache al iniciar la aplicación
loadSectionCache().catch(console.error);

// Extraer la lógica de recuperación y procesamiento de notas en una función reutilizable
async function getNotesForDocument(documentId, date) {
  const [rows] = await pool.query(`
    SELECT
      ES.ID_SECCION,
      ES.NOMBRE_SECCION,
      S.ID_SINTESIS,
      S.TITULO,
      S.SINTESIS,
      S.ID_SECCION,
      S.CVECAPSULA,
      EF.FUENTE,
      EF.TITULO AS FUENTE_TITULO,
      EF.MEDIO,
      EF.URL,
      IC.CAPCLAVE,
      IC.CAPCOSTOCM,
      EA.CAACAPSULA,
      EA.CAAALCANCEREAL
    FROM
      EDITOR_SECCIONES ES
    LEFT JOIN
      EDITOR_SINTESIS S ON ES.ID_SECCION = S.ID_SECCION AND DATE(S.FECHA) = ?
    LEFT JOIN
      EDITOR_REFERENCIAS ER ON S.ID_SINTESIS = ER.ID_SINTESIS
    LEFT JOIN
      EDITOR_FUENTES EF ON ER.ID_REFERENCIA = EF.ID_REFERENCIA
    LEFT JOIN
      INTELITE_ICAPSULA IC ON ER.CVECAPSULA = IC.CAPCLAVE
    LEFT JOIN
      INTELITE_ICAPSULAALCANCE EA ON IC.CAPCLAVE = EA.CAACAPSULA
    WHERE
      ES.ID_DOCUMENTO = ?
      AND ES.FLG_ACTIVO = 1 
      AND ES.FLG_ELIMINADO = 0
  `, [date, documentId]);

  return processNotes(rows);
}

// Procesa y agrupa las notas por sección
function processNotes(rows) {
  const sectionsMap = {};

  rows.forEach(row => {
    const plainTextSintesis = htmlToText(row.SINTESIS, { wordwrap: 130 });
    const textWithoutNewlines = plainTextSintesis.replace(/\n/g, " ");

    if (!sectionsMap[row.NOMBRE_SECCION]) {
      sectionsMap[row.NOMBRE_SECCION] = {
        id: row.ID_SECCION,
        name: row.NOMBRE_SECCION,
        notes: []
      };
    }

    const section = sectionsMap[row.NOMBRE_SECCION];
    const existingEntry = section.notes.find(entry => entry.title === row.TITULO && entry.content === textWithoutNewlines);

    if (existingEntry) {
      if (!existingEntry.urls.includes(row.URL)) existingEntry.urls.push(row.URL);
      if (!existingEntry.medium.includes(row.MEDIO)) existingEntry.medium.push(row.MEDIO);
      if (!existingEntry.source.includes(row.FUENTE)) existingEntry.source.push(row.FUENTE);
    } else {
      section.notes.push({
        title: row.TITULO,
        content: textWithoutNewlines,
        urls: [row.URL],
        medium: [row.MEDIO],
        cost: row.CAPCOSTOCM,
        alcance: row.CAAALCANCEREAL,
        source: [row.FUENTE],
        sourceTitle: row.FUENTE_TITULO,
      });
    }
  });

  return Object.values(sectionsMap);
}

// Endpoint que recupera documentos y detalles de notas para documentos específicos
export const getDocumentosFilterDetails = async (req, res) => {
  const documentId = req.params.id; // ID del documento pasado como parámetro de la ruta
  const date = req.query.date; // Fecha pasada como parámetro de consulta
  try {
    // Obtener la fecha actual en formato 'YYYY-MM-DD'
    const selectedDate =date ? date: format(new Date(), 'yyyy-MM-dd');
    
    // Pasar la fecha actual a la función getNotesForDocument
    const notesDetails = await getNotesForDocument(documentId,selectedDate);
    
    return res.status(200).json({
      id: documentId,
      details: notesDetails
    });
  } catch (error) {
    console.error('Error al obtener detalles del documento:', error);
    return res.status(500).json({
      mensaje: "something goes wrong",
      error: error.message
    });
  }
};




/* Endpoint que recupera documentos y detalles de notas detodos los documentos activos
export const getDocumentosFilter = async (req, res) => {
  
  try {
    const [documentos] = await pool.query("SELECT ID_DOCUMENTO, NOMBRE_DOCUMENTO FROM EDITOR_DOCUMENTOS WHERE FLG_ACTIVO=1");
    const results = await Promise.all(documentos.map(doc => getNotesForDocument(doc.ID_DOCUMENTO, '2024-05-03')));

    const documentosConDetalles = documentos.map((doc, index) => ({
      id: doc.ID_DOCUMENTO,
      Documento: doc.NOMBRE_DOCUMENTO,
      seccionesDocumento: results[index]
    }));

    return res.status(200).json(documentosConDetalles);
  } catch (error) {
    console.error('Error al obtener documentos y notas:', error);
    return res.status(500).json({
      mensaje: "something goes wrong",
      error: error.message
    });
  }
};*/

export const getDocumentStyles = async (req, res) => {
  try {
    const { documentId, date } = req.body;
    const token = process.env.TOKEN;
    const apiUrl = `${process.env.API_BASE_URL}/api/document/styles`;

    const documentStylesResponse = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify({
        documentId,
        date
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!documentStylesResponse.ok) {
      const errorText = await documentStylesResponse.text();
      return res.status(documentStylesResponse.status).json({ error: errorText });
    }

    const documentStylesData = await documentStylesResponse.json();
    res.status(200).json(documentStylesData);
  } catch (error) {
    console.error('Error al obtener los estilos del documento:', error);
    res.status(500).json({ error: error.message });
  }
};


