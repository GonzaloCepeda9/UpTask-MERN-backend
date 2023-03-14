import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailRecuperacionPassword } from "../helpers/email.js";


async function mostrarUsuarios () {
  res.json("Mostrando usuarios");
}

async function crearUsuario(req, res) {
  const { email } = req.body;

  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    const error = new Error("Ya existe un usuario registrado con este email.");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    await usuario.save();

    // ENVÍO DE EMAIL DE CONFIRMACIÓN

    emailRegistro({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token
    })

    res.json({msg: "Usuario creado correctamente. Revisa tu email para confirmar tu cuenta."});
  } catch (error) {
    console.log(error);
  }
}

async function autenticarUsuario(req, res) {
  const { email, password } = req.body;

  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe.");
    return res.status(404).json({ msg: error.message });
  }

  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada.");
    return res.status(403).json({ msg: error.message });
  }

  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    return res.status(403).json({ msg: "El password es incorrecto." });
  }
}

async function confirmarUsuario(req, res) {
  const { token } = req.params; 
  const usuarioAconfirmar = await Usuario.findOne({ token }); 

  if (!usuarioAconfirmar) {
    const error = new Error("Token inválido.");
    return res.status(403).json({ msg: error.message });
  }
  
  try {
    usuarioAconfirmar.confirmado = true; 
    usuarioAconfirmar.token = "";
    await usuarioAconfirmar.save(); 
    res.status(200).json({ msg: "Usuario confirmado correctamente." });
  } catch (error) {
    console.log(error);
  }
}

async function recuperarPassword(req, res) {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();

    // ENVIAR EMAIL CON LAS INSTRUCCIONES

    emailRecuperacionPassword({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token
    })


    res.json({ msg: "Hemos enviado un email con las instrucciones." })
  } catch (error) {
    console.log(error);
  }
}

async function comprobarToken(req, res) {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token });

  if (!tokenValido) {
    const error = new Error("Token inválido.");
    return res.status(404).json({ msg: error.message });
  }

  try {
    if (tokenValido) {
      res.json({msg: "Mostrando formulario para cambio de contraseña."});
    }
  } catch (error) {
    console.log(error);
  }
}

async function nuevoPassword (req, res) {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });

  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    await usuario.save();
    res.json({msg: "Su contraseña ha sido reestablecida con éxito."});
  } else {
    const error = new Error("Token inválido.");
    return res.status(404).json({ msg: error.message });
  }

}

async function perfil (req, res, next) {
  const { usuario } = req;
  res.json(usuario);
}


export {
  mostrarUsuarios,
  crearUsuario,
  autenticarUsuario,
  confirmarUsuario,
  recuperarPassword,
  comprobarToken,
  nuevoPassword,
  perfil
};
