import Tarea from "../models/Tarea.js";
import Proyecto from "../models/Proyecto.js";

// CREAR TAREA

async function crearTarea (req, res) {
  const { proyecto } = req.body;

  const existeProyecto = await Proyecto.findById(proyecto)

  if (!existeProyecto) {
    const error = new Error("El proyecto no existe.")
    return res.status(404).json({msg: error.message})
  }

  if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permisos.")
    return res.status(403).json({msg: error.message})
  }

  try {
    const tareaAlmacenada =  await Tarea.create(req.body)

    existeProyecto.tareas.push(tareaAlmacenada._id)
    await existeProyecto.save();

    res.json(tareaAlmacenada)
  } catch (error) {
    console.log(error)
  }

}

// OBTENER TAREA

async function obtenerTarea (req, res) {
  const { id } = req.params

  const tarea = await Tarea.findById(id).populate("proyecto")

  if (!tarea) {
    const error = new Error("Tarea no encontrada.")
    return res.status(404).json({msg: error.message})
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permisos para actualizar esta tarea.")
    return res.status(403).json({msg: error.message})
  }

  try {
    res.json(tarea)
  } catch (error) {
    console.log(error)
  }
}

// EDITAR TAREA

async function editarTarea (req, res) {
  const { id } = req.params

  const tarea = await Tarea.findById(id).populate("proyecto")

  if (!tarea) {
    const error = new Error("Tarea no encontrada.")
    return res.status(404).json({msg: error.message})
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permisos para actualizar esta tarea.")
    return res.status(403).json({msg: error.message})
  }

  tarea.nombre = req.body.nombre || tarea.nombre
  tarea.descripcion = req.body.descripcion || tarea.descripcion
  tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega
  tarea.prioridad = req.body.prioridad || tarea.prioridad
  
  try {
    const tareaActualizada = await tarea.save()
    res.json(tareaActualizada) 

  } catch (error) {
    console.log(error)
  }

}

// ELIMINAR TAREA

async function eliminarTarea (req, res) {
  const { id } = req.params

  const tarea = await Tarea.findById(id).populate("proyecto")

  if (!tarea) {
    const error = new Error("Tarea no encontrada.")
    return res.status(404).json({msg: error.message})
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permisos para actualizar esta tarea.")
    return res.status(403).json({msg: error.message})
  }

  try {
    const proyecto = await Proyecto.findById(tarea.proyecto)
    proyecto.tareas.pull(tarea._id)
    
    await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])
    
    res.json({msg: "Tarea eliminada correctamente."})
  } catch (error) {
    console.log(error)
  }

}

// CAMBIAR ESTADO DE TAREAS

async function cambiarEstado (req, res) {
  const { id } = req.params

  const tarea = await Tarea.findById(id).populate("proyecto")

  if (!tarea) {
    const error = new Error("Tarea no encontrada.")
    return res.status(404).json({msg: error.message})
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
    const error = new Error("No tienes permisos.")
    return res.status(401).json({msg: error.message})
  }

  tarea.estado = !tarea.estado;
  tarea.completado = req.usuario._id;
  await tarea.save();

  const tareaAlmacenada = await Tarea.findById(id)
    .populate("proyecto")
    .populate("completado")

  res.json(tareaAlmacenada)
}

export {
  crearTarea,
  obtenerTarea,
  editarTarea,
  eliminarTarea,
  cambiarEstado
}