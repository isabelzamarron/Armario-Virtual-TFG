-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-05-2025 a las 11:31:56
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_inteligente`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `armario`
--

CREATE TABLE `armario` (
  `usuario_id` int(11) NOT NULL,
  `prenda_id` int(11) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `armario_outfits`
--

CREATE TABLE `armario_outfits` (
  `usuario_id` int(11) NOT NULL,
  `outfit_id` int(11) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `zona` enum('Superior','Inferior','Completo','Accesorios','Calzado') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `zona`) VALUES
(1, 'Partes superiores', 'Superior'),
(2, 'Pantalones', 'Inferior'),
(3, 'Prendas exteriores', 'Superior'),
(4, 'Calzado', 'Calzado'),
(5, 'Sombreros', 'Accesorios'),
(6, 'Vestidos', 'Completo'),
(7, 'Faldas', 'Inferior'),
(8, 'Bolsos', 'Accesorios'),
(9, 'Otros accesorios', 'Completo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colores`
--

CREATE TABLE `colores` (
  `id` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `hex` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `colores`
--

INSERT INTO `colores` (`id`, `nombre`, `hex`) VALUES
(1, 'Rojo', '#FF0000'),
(2, 'Verde', '#00FF00'),
(3, 'Azul', '#0000FF'),
(4, 'Amarillo', '#FFFF00'),
(5, 'Naranja', '#FFA500'),
(6, 'Morado', '#800080'),
(7, 'Rosa', '#FFC0CB'),
(8, 'Marrón', '#A52A2A'),
(9, 'Negro', '#000000'),
(10, 'Blanco', '#FFFFFF'),
(11, 'Gris', '#808080'),
(12, 'Cian', '#00FFFF'),
(13, 'Magenta', '#FF00FF'),
(14, 'Verde Claro', '#90EE90'),
(15, 'Azul Claro', '#ADD8E6'),
(16, 'Turquesa', '#40E0D0'),
(17, 'Violeta', '#EE82EE'),
(18, 'Beige', '#F5F5DC'),
(19, 'Oliva', '#808000'),
(20, 'Lima', '#00FF00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `composicion_outfit`
--

CREATE TABLE `composicion_outfit` (
  `outfit_id` int(11) NOT NULL,
  `prenda_id` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estaciones`
--

CREATE TABLE `estaciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `minTemp` int(11) NOT NULL,
  `maxTemp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `estaciones`
--

INSERT INTO `estaciones` (`id`, `nombre`, `minTemp`, `maxTemp`) VALUES
(1, 'Primavera', 10, 20),
(2, 'Verano', 20, 40),
(3, 'Otoño', 5, 15),
(4, 'Invierno', -25, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estilos`
--

CREATE TABLE `estilos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `estilos`
--

INSERT INTO `estilos` (`id`, `nombre`) VALUES
(1, 'Casual'),
(2, 'Deportivo'),
(3, 'Formal'),
(4, 'Elegante'),
(5, 'Vintage'),
(6, 'Streetwear'),
(7, 'Comfy'),
(8, 'Boho');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`id`, `nombre`) VALUES
(1, 'Diario'),
(2, 'Fiesta'),
(3, 'Trabajo'),
(4, 'Formal'),
(5, 'Concierto'),
(6, 'Playa'),
(7, 'Encuentro Familiar'),
(8, 'Gala'),
(9, 'Viaje'),
(10, 'Deporte');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `followers`
--

CREATE TABLE `followers` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `follower_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `following`
--

CREATE TABLE `following` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `following_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `outfits`
--

CREATE TABLE `outfits` (
  `id_outfit` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) NOT NULL,
  `foto` blob NOT NULL,
  `publico` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `outfit_estacion`
--

CREATE TABLE `outfit_estacion` (
  `outfit_id` int(11) NOT NULL,
  `estacion_id` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `outfit_evento`
--

CREATE TABLE `outfit_evento` (
  `id_outfit` int(11) NOT NULL,
  `id_evento` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `outfit_tag`
--

CREATE TABLE `outfit_tag` (
  `outfit_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preferencias_usuario`
--

CREATE TABLE `preferencias_usuario` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `formalidad` int(11) NOT NULL,
  `simplicidad` int(11) NOT NULL,
  `estilo_temporal` int(11) NOT NULL,
  `sofisticacion` int(11) NOT NULL,
  `rango_edad` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prendas`
--

CREATE TABLE `prendas` (
  `id_prenda` int(11) NOT NULL,
  `foto` blob NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `tipo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prenda_color`
--

CREATE TABLE `prenda_color` (
  `prenda_id` int(11) NOT NULL,
  `color_id` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prenda_estacion`
--

CREATE TABLE `prenda_estacion` (
  `prenda_id` int(11) NOT NULL,
  `estacion_id` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prenda_estilo`
--

CREATE TABLE `prenda_estilo` (
  `prenda_id` int(11) NOT NULL,
  `estilo_id` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `tipo` enum('estilo','colores','material','tendencia','ajuste','otro') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tags`
--

INSERT INTO `tags` (`id`, `nombre`, `tipo`) VALUES
(1, 'Colores neutros', 'colores'),
(2, 'Colores pasteles', 'colores'),
(3, 'Monocromático', 'colores'),
(4, 'Con lentejuelas', 'otro'),
(12, 'Clásico', 'estilo'),
(13, 'Moderno', 'estilo'),
(14, 'Minimalista', 'estilo'),
(15, 'Bohemio', 'estilo'),
(16, 'Urbano', 'estilo'),
(17, 'Business Casual', 'estilo'),
(18, 'Retro', 'estilo'),
(19, 'Grunge', 'estilo'),
(20, 'Algodón', 'material'),
(21, 'Lana', 'material'),
(22, 'Seda', 'material'),
(23, 'Poliéster', 'material'),
(24, 'Cuero', 'material'),
(25, 'Denim', 'material'),
(26, 'Lino', 'material'),
(27, 'Nailon', 'material'),
(28, 'Entallado', 'ajuste'),
(29, 'Holgado', 'ajuste'),
(30, 'Recto', 'ajuste'),
(31, 'Slim fit', 'ajuste'),
(32, 'Oversized', 'ajuste'),
(33, 'Ajustado', 'ajuste'),
(34, 'Estampado', ''),
(35, 'Liso', ''),
(36, 'Rayas', ''),
(37, 'Cuadros', ''),
(38, 'Unicolor', ''),
(39, 'Con lentejuelas', ''),
(40, 'Transparente', ''),
(41, 'Brillante', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos`
--

CREATE TABLE `tipos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `categoria_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipos`
--

INSERT INTO `tipos` (`id`, `nombre`, `categoria_id`) VALUES
(1, 'Camisetas manga corta', 1),
(2, 'Blusas', 1),
(3, 'Pantalón', 2),
(4, 'Jeans', 2),
(5, 'Mini', 7),
(6, 'Short', 2),
(7, 'Botas', 4),
(8, 'Sandalias', 4),
(9, 'Abrigos', 3),
(10, 'Chaquetas', 3),
(11, 'Jerseys', 1),
(12, 'Sudaderas', 1),
(13, 'Top tirantes', 1),
(14, 'Gorra', 5),
(15, 'Gorro', 5),
(16, 'Camisetas manga larga', 1),
(17, 'Crop tops', 1),
(18, 'Polos', 1),
(19, 'Camisas', 1),
(21, 'Body', 1),
(22, 'Leggings', 2),
(23, 'Vestir', 2),
(24, 'Joggers', 2),
(25, 'Midi', 7),
(26, 'Maxi', 7),
(27, 'Blazers', 3),
(28, 'Bombers', 3),
(29, 'Bikers', 3),
(30, 'Zapatillas', 4),
(31, 'Zapatos tacón', 4),
(32, 'Mocasines', 4),
(33, 'Boinas', 5),
(34, 'Sombreros', 5),
(35, 'Diademas', 5),
(36, 'Vestidos mini', 6),
(37, 'Vestidos fiesta', 6),
(38, 'Vestidos punto', 6),
(39, 'Vestidos midi/largos', 6),
(40, 'Monos', 6),
(41, 'Bandoleras', 8),
(42, 'Bolsos de hombro', 8),
(43, 'Riñoneras', 8),
(44, 'Totte', 8),
(45, 'Top palabra de honor', 1),
(46, 'Gafas de sol', 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `nombre_usuario` varchar(255) NOT NULL,
  `nombre` text NOT NULL,
  `apellidos` text NOT NULL,
  `foto` blob NOT NULL,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `armario`
--
ALTER TABLE `armario`
  ADD KEY `armario_ibfk_1` (`usuario_id`),
  ADD KEY `armario_ibfk_2` (`prenda_id`);

--
-- Indices de la tabla `armario_outfits`
--
ALTER TABLE `armario_outfits`
  ADD KEY `armario_outfits_ibfk_1` (`usuario_id`),
  ADD KEY `armario_outfits_ibfk_2` (`outfit_id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `colores`
--
ALTER TABLE `colores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `composicion_outfit`
--
ALTER TABLE `composicion_outfit`
  ADD PRIMARY KEY (`outfit_id`,`prenda_id`),
  ADD KEY `composicion_outfit_ibfk_1` (`outfit_id`),
  ADD KEY `composicion_outfit_ibfk_2` (`prenda_id`);

--
-- Indices de la tabla `estaciones`
--
ALTER TABLE `estaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estilos`
--
ALTER TABLE `estilos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `followers`
--
ALTER TABLE `followers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`,`follower_id`),
  ADD KEY `seguidor_id` (`follower_id`);

--
-- Indices de la tabla `following`
--
ALTER TABLE `following`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_following` (`usuario_id`,`following_id`),
  ADD KEY `following_id` (`following_id`);

--
-- Indices de la tabla `outfits`
--
ALTER TABLE `outfits`
  ADD PRIMARY KEY (`id_outfit`);

--
-- Indices de la tabla `outfit_estacion`
--
ALTER TABLE `outfit_estacion`
  ADD PRIMARY KEY (`outfit_id`,`estacion_id`),
  ADD KEY `idx_estacion_outfit` (`estacion_id`);

--
-- Indices de la tabla `outfit_evento`
--
ALTER TABLE `outfit_evento`
  ADD PRIMARY KEY (`id_outfit`,`id_evento`),
  ADD KEY `id_evento` (`id_evento`);

--
-- Indices de la tabla `outfit_tag`
--
ALTER TABLE `outfit_tag`
  ADD PRIMARY KEY (`outfit_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indices de la tabla `preferencias_usuario`
--
ALTER TABLE `preferencias_usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `prendas`
--
ALTER TABLE `prendas`
  ADD PRIMARY KEY (`id_prenda`),
  ADD KEY `fk_tipo` (`tipo_id`),
  ADD KEY `fk_categoria` (`categoria_id`);

--
-- Indices de la tabla `prenda_color`
--
ALTER TABLE `prenda_color`
  ADD PRIMARY KEY (`prenda_id`,`color_id`),
  ADD KEY `prenda_color_ibfk_2` (`color_id`);

--
-- Indices de la tabla `prenda_estacion`
--
ALTER TABLE `prenda_estacion`
  ADD PRIMARY KEY (`prenda_id`,`estacion_id`),
  ADD KEY `idx_estacion_prenda` (`estacion_id`);

--
-- Indices de la tabla `prenda_estilo`
--
ALTER TABLE `prenda_estilo`
  ADD PRIMARY KEY (`prenda_id`,`estilo_id`),
  ADD KEY `fk_estilo` (`estilo_id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipos`
--
ALTER TABLE `tipos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_unico` (`email`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `colores`
--
ALTER TABLE `colores`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `estaciones`
--
ALTER TABLE `estaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `estilos`
--
ALTER TABLE `estilos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `followers`
--
ALTER TABLE `followers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `following`
--
ALTER TABLE `following`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `outfits`
--
ALTER TABLE `outfits`
  MODIFY `id_outfit` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `preferencias_usuario`
--
ALTER TABLE `preferencias_usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `prendas`
--
ALTER TABLE `prendas`
  MODIFY `id_prenda` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `tipos`
--
ALTER TABLE `tipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `armario`
--
ALTER TABLE `armario`
  ADD CONSTRAINT `armario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `armario_ibfk_2` FOREIGN KEY (`prenda_id`) REFERENCES `prendas` (`id_prenda`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `armario_outfits`
--
ALTER TABLE `armario_outfits`
  ADD CONSTRAINT `armario_outfits_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `armario_outfits_ibfk_2` FOREIGN KEY (`outfit_id`) REFERENCES `outfits` (`id_outfit`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `composicion_outfit`
--
ALTER TABLE `composicion_outfit`
  ADD CONSTRAINT `composicion_outfit_ibfk_1` FOREIGN KEY (`outfit_id`) REFERENCES `outfits` (`id_outfit`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `composicion_outfit_ibfk_2` FOREIGN KEY (`prenda_id`) REFERENCES `prendas` (`id_prenda`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`follower_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `following`
--
ALTER TABLE `following`
  ADD CONSTRAINT `following_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `following_ibfk_2` FOREIGN KEY (`following_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `outfit_estacion`
--
ALTER TABLE `outfit_estacion`
  ADD CONSTRAINT `fk_estacion_outfit` FOREIGN KEY (`outfit_id`) REFERENCES `outfits` (`id_outfit`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_outfit_estacion` FOREIGN KEY (`estacion_id`) REFERENCES `estaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `outfit_evento`
--
ALTER TABLE `outfit_evento`
  ADD CONSTRAINT `outfit_evento_ibfk_1` FOREIGN KEY (`id_outfit`) REFERENCES `outfits` (`id_outfit`) ON DELETE CASCADE,
  ADD CONSTRAINT `outfit_evento_ibfk_2` FOREIGN KEY (`id_evento`) REFERENCES `eventos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `outfit_tag`
--
ALTER TABLE `outfit_tag`
  ADD CONSTRAINT `outfit_tag_ibfk_1` FOREIGN KEY (`outfit_id`) REFERENCES `outfits` (`id_outfit`) ON DELETE CASCADE,
  ADD CONSTRAINT `outfit_tag_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `preferencias_usuario`
--
ALTER TABLE `preferencias_usuario`
  ADD CONSTRAINT `preferencias_usuario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `prendas`
--
ALTER TABLE `prendas`
  ADD CONSTRAINT `fk_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  ADD CONSTRAINT `fk_tipo` FOREIGN KEY (`tipo_id`) REFERENCES `tipos` (`id`);

--
-- Filtros para la tabla `prenda_color`
--
ALTER TABLE `prenda_color`
  ADD CONSTRAINT `prenda_color_ibfk_1` FOREIGN KEY (`prenda_id`) REFERENCES `prendas` (`id_prenda`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prenda_color_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `colores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `prenda_estacion`
--
ALTER TABLE `prenda_estacion`
  ADD CONSTRAINT `fk_estacion_prenda_estacion` FOREIGN KEY (`estacion_id`) REFERENCES `estaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_prenda_prenda_estacion` FOREIGN KEY (`prenda_id`) REFERENCES `prendas` (`id_prenda`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `prenda_estilo`
--
ALTER TABLE `prenda_estilo`
  ADD CONSTRAINT `fk_estilo` FOREIGN KEY (`estilo_id`) REFERENCES `estilos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_prenda` FOREIGN KEY (`prenda_id`) REFERENCES `prendas` (`id_prenda`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tipos`
--
ALTER TABLE `tipos`
  ADD CONSTRAINT `tipos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
