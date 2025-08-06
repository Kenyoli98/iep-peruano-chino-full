function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado.' });
    }

    // Normalizar roles a minúsculas para comparación consistente
    const rolUsuario = usuario.rol ? usuario.rol.toLowerCase() : '';
    const rolesNormalizados = rolesPermitidos.map(rol => rol.toLowerCase());

    // Role middleware working correctly

    if (!rolesNormalizados.includes(rolUsuario)) {
      return res
        .status(403)
        .json({ error: 'Acceso denegado: no tienes permisos.' });
    }

    next();
  };
}

module.exports = permitirRoles;
