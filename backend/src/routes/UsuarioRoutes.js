const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const authMiddleware = require('../middlewares/auth'); // Middleware de autenticación
const adminMiddleware = require('../middlewares/admin'); // Middleware de autorización para administradores


const router = express.Router();


/**
 * @swagger
 * /api/usuarios/obtenerTodos:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
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
 *                   nombre:
 *                     type: string
 *                     example: Juan
 *                   correo:
 *                     type: string
 *                     example: enekoloko7@hotmail.com
 *                   rol:
 *                     type: string
 *                     example: usuario
 *       500:
 *         description: Error al obtener los usuarios
 */
router.get('/obtenerTodos', authMiddleware, adminMiddleware, UsuarioController.listar); // Solo administradores

/**
 * @swagger
 * /api/usuarios/obtener/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: Juan
 *                 correo:
 *                   type: string
 *                   example: enekoloko7@hotmail.com
 *                 rol:
 *                   type: string
 *                   example: usuario
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener el usuario
 */
router.get('/obtener/:id', authMiddleware, UsuarioController.obtenerPorId); // Usuarios autenticados


/**
 * @swagger
 * /api/usuarios/registrar:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               correo:
 *                 type: string
 *                 example: enekoloko7@hotmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               rol:
 *                 type: string
 *                 example: usuario
 *               movil:
 *                 type: string
 *                 example: 123456789
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: Juan
 *                 correo:
 *                   type: string
 *                   example: enekoloko7@hotmail.com
 *                 rol:
 *                   type: string
 *                   example: usuario
 *                 movil:
 *                   type: string
 *                   example: 123456789
 *       500:
 *         description: Error al registrar el usuario
 */
router.post('/registrar', UsuarioController.registrar);

/**
 * @swagger
 * /api/usuarios/activar/{id}:
 *   patch:
 *     summary: Activar o desactivar un usuario
 *     tags: 
 *       - Usuarios
 *     security:
 *       - bearerAuth: [] # Indica que esta ruta requiere autenticación
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Usuario activado o desactivado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Usuario activado correctamente
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar el estado del usuario
 */
router.patch('/activar/:id', authMiddleware, adminMiddleware, UsuarioController.cambiarEstadoActivo);

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Autenticar un usuario (login)
 *     tags: 
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correoOMovil:
 *                 type: string
 *                 example: enekoloko7@hotmail.com
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                   example: 6
 *                 nombre:
 *                   type: string
 *                   example: eneko
 *                 correo:
 *                   type: string
 *                   example: enekoloko7@hotmail.com
 *                 rol:
 *                   type: string
 *                   example: usuario
 *                 movil:
 *                   type: string
 *                   example: 656656656
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       403:
 *         description: El usuario no está activo. Contacta al administrador.
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error al iniciar sesión
 */
router.post('/login', UsuarioController.login);


/**
 * @swagger
 * /api/usuarios/recuperar-password:
 *   post:
 *     summary: Enviar enlace de recuperación de contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correoOMovil:
 *                 type: string
 *                 example: juan@example.com
 *     responses:
 *       200:
 *         description: Enlace de recuperación enviado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Enlace de recuperación enviado correctamente
 *       400:
 *         description: Solicitud inválida
 *       500:
 *         description: Error al procesar la solicitud
 */
router.post('/recuperar-password', UsuarioController.recuperarPassword);

/**
 * @swagger
 * /api/usuarios/actualizar/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Eneko
 *               correo:
 *                 type: string
 *                 example: enekoloko7@hotmail.com
 *               rol:
 *                 type: string
 *                 example: admin
 *               movil:
 *                 type: string
 *                 example: 987654321
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: Eneko
 *                 correo:
 *                   type: string
 *                   example: enekoloko7@hotmail.com
 *                 rol:
 *                   type: string
 *                   example: admin
 *                 movil:
 *                   type: string
 *                   example: 987654321
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar el usuario
 */
router.put('/actualizar/:id', authMiddleware, UsuarioController.actualizar); // Usuarios autenticados

/**
 * @swagger
 * /api/usuarios/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       204:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar el usuario
 */
router.delete('/eliminar/:id', authMiddleware, adminMiddleware, UsuarioController.eliminar); // Solo administradores

/**
 * @swagger
 * /api/usuarios/obtenerSaldo/{id_usuario}:
 *   get:
 *     summary: Obtener el saldo de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Saldo del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 saldo:
 *                   type: number
 *                   format: float
 *                   example: 150.75
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al calcular el saldo
 */
router.get('/obtenerSaldo/:id_usuario', authMiddleware, UsuarioController.calcularSaldo);



module.exports = router;
