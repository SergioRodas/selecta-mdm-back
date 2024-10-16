import express from 'express';
import { login, createUser, updateUser, removeUserById, getAllUsers } from '../../controllers/user.controllers.js';
import authMiddleware from '../../controllers/Middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Autentica a un usuario utilizando su correo electrónico y contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: jd403436@gmail.com
 *               password:
 *                 type: string
 *                 example: contraseña
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: Jasson_David
 *                     email:
 *                       type: string
 *                       example: jd403436@gmail.com
 *       400:
 *         description: Falta email o contraseña en la solicitud.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Se requiere email y contraseña
 *       404:
 *         description: Usuario no encontrado o credenciales incorrectas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado o credenciales incorrectas
 */
router.post('/login', login);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Crea un nuevo usuario en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: nuevo_usuario
 *               email:
 *                 type: string
 *                 example: email@ejemplo.com
 *               password:
 *                 type: string
 *                 example: contraseña_segura
 *     responses:
 *       201:
 *         description: Usuario creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 username:
 *                   type: string
 *                   example: nuevo_usuario
 *                 email:
 *                   type: string
 *                   example: email@ejemplo.com
 */
router.post('/create', authMiddleware, createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     description: Actualiza los detalles de un usuario por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: nuevo_nombre
 *               email:
 *                 type: string
 *                 example: nuevo_email@ejemplo.com
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: nuevo_nombre
 *                 email:
 *                   type: string
 *                   example: nuevo_email@ejemplo.com
 */
router.put('/update/:id', authMiddleware, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario eliminado correctamente
 */
router.delete('/remove/:id', authMiddleware, removeUserById);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Retorna una lista de todos los usuarios registrados.
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: Jasson_David
 *                   email:
 *                     type: string
 *                     example: jd403436@gmail.com
 */
router.get('/users', authMiddleware, getAllUsers);


export default router;
