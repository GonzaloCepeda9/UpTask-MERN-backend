import mongoose, { mongo } from "mongoose";

const TareaSchema = mongoose.Schema ({
  nombre: {
    type: String,
    trim: true,
    required: true
  },
  descripcion: {
    type: String,
    trim: true,
    required: true
  },
  estado: {
    type: Boolean,
    default: false,
  },
  fechaEntrega: {
    type: Date,
    default: Date.now(),
    required: true
  },
  prioridad: {
    type: String,
    enum: ["Baja", "Alta", "Media"],
    required: true
  },
  proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proyecto",
    required: true
  },
  completado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  },
}, {
  timestamps: true
})

const Tarea = mongoose.model("Tarea", TareaSchema);

export default Tarea;