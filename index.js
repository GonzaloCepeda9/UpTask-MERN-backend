import express from "express";
import dotenv from "dotenv";
import connectionDB from "./config/db.js";
import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";

const app = express();

app.use(express.json()); 

dotenv.config();

connectionDB();

// CONFIGUARCIÓN DEL CORS

const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function(origin, callback) {
    if (whiteList.includes(origin)) {
      callback(null, true) 
    } else {
      callback(new Error("Error de CORS"))
    }
  }
}

app.use(cors(corsOptions));

// ROUTING
  
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// SOCKET.IO

import { Server } from "socket.io"

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  }
})

io.on("connection", (socket) => {

  socket.on("Abrir proyecto", (proyecto) => {
    socket.join(proyecto)
  })

  socket.on("Nueva tarea", tarea => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("Tarea agregada", tarea)
  })

  socket.on("Eliminar tarea", tarea => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("Tarea eliminada", tarea)
  })

  socket.on("Editar tarea", tarea => {
    const proyecto = tarea.proyecto._id;
    socket.to(proyecto).emit("Tarea editada", tarea)
  })

  socket.on("Cambiar estado", tarea => {
    const proyecto = tarea.proyecto._id
    socket.to(proyecto).emit("Estado cambiado", tarea)
  })
})