import express from "express";
import {
  crearTarea,
  obtenerTarea,
  editarTarea,
  eliminarTarea,
  cambiarEstado
} from "../controllers/tareaControllers.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.post("/", checkAuth, crearTarea);

router.route("/:id")
  .get(checkAuth, obtenerTarea)
  .put(checkAuth, editarTarea)
  .delete(checkAuth, eliminarTarea);

router.post("/estado/:id", checkAuth, cambiarEstado);

export default router;