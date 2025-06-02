-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mer. 21 mai 2025 à 16:48
-- Version du serveur : 10.11.11-MariaDB-0+deb12u1
-- Version de PHP : 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

# Privilèges pour `site_streamingSwann`@`localhost`

GRANT USAGE ON *.* TO `site_streamingSwann`@`localhost` IDENTIFIED BY PASSWORD '*2470C0C06DEE42FD1618BB99005ADCA2EC9D1E19';

GRANT ALL PRIVILEGES ON `site_streamingSwann`.* TO `site_streamingSwann`@`localhost`;

CREATE DATABASE site_streamingSwann;

USE site_streamingSwann;

--
-- Base de données : `site_streamingSwann`
--

-- --------------------------------------------------------

--
-- Structure de la table `artiste`
--

CREATE TABLE `artiste` (
  `id` int(11) NOT NULL,
  `nom` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `artiste`
--

INSERT INTO `artiste` (`id`, `nom`) VALUES
(1, 'Cartoon'),
(2, 'Diamond Eyes'),
(3, 'More Plastic'),
(4, 'Halvorsen'),
(5, 'Jonth'),
(6, 'James Mercy'),
(7, 'ANGELPLAYA'),
(8, 'T-Mass'),
(9, 'Rameses B'),
(10, 'Clarx'),
(11, 'Tollef'),
(12, 'Sam Day'),
(13, 'OSKI'),
(14, 'intouch'),
(15, 'BIMINI'),
(16, 'Avi Snow'),
(17, 'Rival '),
(18, 'Jim Yosef'),
(19, 'Ariadne'),
(20, 'Raul Ojamaa'),
(21, 'Clarx'),
(22, 'Shiah Maisel'),
(23, 'Wiguez'),
(24, '1$K1'),
(25, 'MANIA'),
(26, 'Alaina Cross'),
(27, 'PLVTO'),
(28, 'SadBois'),
(29, 'Manno'),
(30, 'Janji'),
(31, 'Johnning'),
(32, 'Mangoo'),
(33, 'B3nte'),
(34, 'DJVI');

-- --------------------------------------------------------

--
-- Structure de la table `musique`
--

CREATE TABLE `musique` (
  `id` int(11) NOT NULL,
  `artiste_nom` varchar(256) NOT NULL,
  `titre` varchar(256) NOT NULL,
  `duree` int(11) NOT NULL,
  `chemin` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `musique`
--

INSERT INTO `musique` (`id`, `artiste_nom`, `titre`, `duree`, `chemin`) VALUES
(1, 'Cartoon Jéja', 'On & On (feat. Daniel Levi)', 208000, 0x2f736f6e67732f4f6e2026204f6e2028666561742e2044616e69656c204c657669292e6d7033),
(2, 'Diamond Eyes', 'Lies', 236000, 0x2f736f6e67732f4c6965732e6d7033),
(4, 'Jonth', 'WHAT', 225000, 0x2f736f6e67732f574841542e6d7033),
(5, 'James Mercy', 'Vienna (feat. PhiloSofie)', 214000, 0x2f736f6e67732f5669656e6e612028666561742e205068696c6f536f666965292e6d7033),
(6, 'ANGELPLAYA & T-Mass', 'FAVHELLA (feat. Mc Guidanny)', 116000, 0x2f736f6e67732f46415648454c4c412028666561742e204d632047756964616e6e79292e6d7033),
(7, 'Rameses B', 'Morning Drift', 235000, 0x2f736f6e67732f4d6f726e696e672044726966742e6d7033),
(8, 'Shiah Maisel & Clarx', 'Done Better (feat. AViVA)', 125000, 0x2f736f6e67732f446f6e65204265747465722028666561742e204156695641292e6d7033),
(9, 'Tollef', 'Time With You (feat. RVLE)', 156000, 0x2f736f6e67732f54696d65205769746820596f752028666561742e2052564c45292e6d7033),
(10, 'Sam Day', 'EVERY TIME I SEE YOUR FACE', 217000, 0x2f736f6e67732f45564552592054494d4520492053454520594f555220464143452e6d7033),
(11, 'T & Sugah', 'For You (ft. Snnr)', 137000, 0x2f736f6e67732f466f7220596f75202866742e20536e6e72292e6d7033),
(12, 'intouch', 'Heart My Heart', 169000, 0x2f736f6e67732f4865617274204d792048656172742e6d7033),
(13, 'MANIA', 'Reason (feat. Remy Night)', 181000, 0x2f736f6e67732f526561736f6e2028666561742e2052656d79204e69676874292e6d7033),
(14, 'JNATHYN x Bryan Andrew Medina', 'Clockwork', 316000, 0x2f736f6e67732f436c6f636b776f726b2e6d7033),
(15, 'BIMINI & Avi Snow', 'No Way', 267000, 0x2f736f6e67732f4e6f205761792e6d7033),
(16, 'Rival x Jim Yosef', 'Gone For Good (w/ Alaina Cross)', 181000, 0x2f736f6e67732f476f6e6520466f7220476f6f642028772f20416c61696e612043726f7373292e6d7033),
(17, 'Ariadne', 'All I Need (feat. Karl Killing)', 151000, 0x2f736f6e67732f416c6c2049204e6565642028666561742e204b61726c204b696c6c696e67292e6d7033),
(18, 'Raul Ojamaa', 'Hold On Me (feat. Maris Pihlap)', 208000, 0x2f736f6e67732f486f6c64204f6e204d652028666561742e204d61726973205069686c6170292e6d7033),
(19, 'Clarx & Shiah Maisel', 'Give Up', 169000, 0x2f736f6e67732f476976652055702e6d7033),
(20, 'Wiguez', 'VBM (ft. P-One)', 150000, 0x2f736f6e67732f56424d202866742e20502d4f6e65292e6d7033),
(21, '1$K1', 'GODSLAYER', 92000, 0x2f736f6e67732f474f44534c415945522e6d7033),
(22, 'MANIA', 'Time Of Our Lives', 205000, 0x2f736f6e67732f54696d65204f66204f7572204c697665732e6d7033),
(23, 'intouch', 'Baby Sweet', 173000, 0x2f736f6e67732f426162792053776565742e6d7033),
(24, 'Alaina Cross', 'Karma', 188000, 0x2f736f6e67732f4b61726d612e6d7033),
(25, 'PLVTO', 'Are You With Me', 190000, 0x2f736f6e67732f41726520596f752057697468204d652e6d7033),
(26, 'SadBois & Manno', 'Romeo and Juliet', 192000, 0x2f736f6e67732f526f6d656f20616e64204a756c6965742e6d7033),
(27, 'Janji & Johnning', 'Nostalgia', 176000, 0x2f736f6e67732f4e6f7374616c6769612e6d7033),
(28, 'Mangoo & B3nte', 'Perfection (feat. Derek Cate)', 165000, 0x2f736f6e67732f50657266656374696f6e2028666561742e20446572656b2043617465292e6d7033),
(29, 'More Plastic', 'Obsession', 205000, 0x2f736f6e67732f4f6273657373696f6e2e6d7033),
(30, 'DJVI', 'Back on Dash', 186000, 0x2f736f6e67732f4261636b206f6e20446173682e6d7033);

-- --------------------------------------------------------

--
-- Structure de la table `playlist`
--

CREATE TABLE `playlist` (
  `id` int(11) NOT NULL,
  `nom` varchar(256) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `protected` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `playlist`
--

INSERT INTO `playlist` (`id`, `nom`, `id_utilisateur`, `protected`) VALUES
(1, 'Titres Likés', 1, 1),
(4, 'Titres Likés', 4, 1),
(21, 'Pas de copyright...', 1, 0);

--
-- Déclencheurs `playlist`
--
DELIMITER $$
CREATE TRIGGER `before_playlist_delete` BEFORE DELETE ON `playlist` FOR EACH ROW BEGIN
    IF OLD.protected = TRUE THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Suppression interdite : cette playlist ne peut pas être supprimée.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `playlist_musique`
--

CREATE TABLE `playlist_musique` (
  `id_playlist` int(11) NOT NULL,
  `id_musique` int(11) NOT NULL,
  `position` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `playlist_musique`
--

INSERT INTO `playlist_musique` (`id_playlist`, `id_musique`, `position`) VALUES
(1, 4, 2),
(1, 5, 1),
(1, 9, 3),
(1, 13, 5),
(1, 20, 0),
(1, 22, 4),
(21, 2, 7),
(21, 4, 1),
(21, 5, 2),
(21, 7, 6),
(21, 9, 3),
(21, 12, 14),
(21, 13, 5),
(21, 17, 12),
(21, 18, 9),
(21, 20, 0),
(21, 21, 10),
(21, 22, 4),
(21, 23, 13),
(21, 24, 8),
(21, 25, 11);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `search_bar`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `search_bar` (
`id_musique` int(11)
,`artiste_nom` varchar(256)
,`titre` varchar(256)
,`duree` int(11)
,`chemin` longblob
);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `nb_playlist` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `email`, `username`, `password`, `nb_playlist`) VALUES
(1, 'swannbrillant@gmail.com', 'swann', '$2b$10$LIsdYs/DBjJz3Cmwo4efA.BXGGn7/9uyAREzq6D/pi1DX2.dC1MHC', 1),
(4, 'test@mail.com', 'test', '$2b$10$UaO7s/bTcEiV3rj4GuU/NeJJ3K09RJdEXizUuVYDnUE8EXbwVb4Zq', 1);

--
-- Déclencheurs `utilisateurs`
--
DELIMITER $$
CREATE TRIGGER `after_user_insert` AFTER INSERT ON `utilisateurs` FOR EACH ROW BEGIN
    INSERT INTO playlist (nom, id_utilisateur, protected)
    VALUES ('Titres Likés', NEW.id, TRUE);
END
$$
DELIMITER ;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `artiste`
--
ALTER TABLE `artiste`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `musique`
--
ALTER TABLE `musique`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `playlist`
--
ALTER TABLE `playlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `playlist_musique`
--
ALTER TABLE `playlist_musique`
  ADD PRIMARY KEY (`id_playlist`,`id_musique`),
  ADD KEY `id_musique` (`id_musique`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `artiste`
--
ALTER TABLE `artiste`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT pour la table `musique`
--
ALTER TABLE `musique`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT pour la table `playlist`
--
ALTER TABLE `playlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

-- --------------------------------------------------------

--
-- Structure de la vue `search_bar`
--
DROP TABLE IF EXISTS `search_bar`;

CREATE ALGORITHM=UNDEFINED DEFINER=`site_streamingSwann`@`localhost` SQL SECURITY DEFINER VIEW `search_bar`  AS SELECT `m`.`id` AS `id_musique`, `m`.`artiste_nom` AS `artiste_nom`, `m`.`titre` AS `titre`, `m`.`duree` AS `duree`, `m`.`chemin` AS `chemin` FROM (`musique` `m` join `artiste` `a` on(`m`.`artiste_nom` = `a`.`nom`)) ;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `playlist`
--
ALTER TABLE `playlist`
  ADD CONSTRAINT `playlist_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `playlist_musique`
--
ALTER TABLE `playlist_musique`
  ADD CONSTRAINT `playlist_musique_ibfk_1` FOREIGN KEY (`id_playlist`) REFERENCES `playlist` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `playlist_musique_ibfk_2` FOREIGN KEY (`id_musique`) REFERENCES `musique` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
