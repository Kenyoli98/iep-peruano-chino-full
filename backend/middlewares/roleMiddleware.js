function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado.' });
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ error: 'Acceso denegado: no tienes permisos.' });
    }

    next();
  };
}

module.exports = permitirRoles;