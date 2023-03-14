import express from "express";
import { crearUsuario, mostrarUsuarios, autenticarUsuario, confirmarUsuario, recuperarPassword, comprobarToken, nuevoPassword, perfil } from "../controllers/usuarioControllers.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.route("/")
  .get(mostrarUsuarios)
  .post(crearUsuario);
  
router.post("/login", autenticarUsuario);
router.get("/confirmar/:token", confirmarUsuario);

router.post("/recuperar-password", recuperarPassword);
router.route("/recuperar-password/:token")
  .get(comprobarToken)
  .post(nuevoPassword);

router.get("/perfil", checkAuth, perfil);

export default router;