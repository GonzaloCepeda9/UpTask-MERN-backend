import express from "express";
import {
  obtenerProyectos,
  crearProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  buscarColaborador
} from "../controllers/proyectoControllers.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.route("/")
  .get(checkAuth, obtenerProyectos)
  .post(checkAuth, crearProyecto);

router.route("/:id")
  .get(checkAuth, obtenerProyecto)
  .put(checkAuth, editarProyecto)
  .delete(checkAuth, eliminarProyecto);

  
router.post("/colaboradores", checkAuth, buscarColaborador);
router.post("/colaboradores/:id", checkAuth, agregarColaborador);
router.post("/eliminar-colaborador/:id", checkAuth, eliminarColaborador);

export default router;