import nodemailer from "nodemailer";

async function emailRegistro (datos) {
  const { email, nombre, token} = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // INFORMACIÓN DE EMAIL (CONFIRMAR CUENTA)

  const info = await transport.sendMail({
    from: '"upTask - Administrador de Proyectos" cuentas@uptask.com>',
    to: email,
    subject: "upTask - Confirma tu cuenta",
    text: "Compueba tu cuenta en upTask",
    html:`<p>Hola ${nombre}! Comprueba tu cuenta en upTask.</p>
          <p>Tu cuenta ya casi está lista, para confirmarla, haz click en el siguiente enlace:</p>
          <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar cuenta</a>    
          <p>Si tu no la creaste, puedes ignorar el mensaje.</p>`
  })
}

async function emailRecuperacionPassword (datos) {
  const { email, nombre, token} = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // INFORMACIÓN DE EMAIL (REESTABLECER PASSWORD)

  const info = await transport.sendMail({
    from: '"upTask - Administrador de Proyectos" cuentas@uptask.com>',
    to: email,
    subject: "upTask - Reestablecer password",
    text: "Recupera tu password en upTask",
    html:`<p>Hola ${nombre}! Has solicitado la recuperación de tu password en upTask.</p>
          <p>Para reestablecerla, haz click en el siguiente enlace:</p>
          <a href="${process.env.FRONTEND_URL}/recuperar-password/${token}">Reestablecer password</a>    
          <p>Si tu no solicistaste este email, puedes ignorar el mensaje.</p>`
  })
}

export {
  emailRegistro,
  emailRecuperacionPassword
}
  