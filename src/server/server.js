import express from "express";
import ViteExpress from "vite-express";
import {accessSecret, db} from "./database/config.js";
import os from "os";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import http from "http"
import {Server} from "socket.io";
import jwt from "jsonwebtoken";
import cors from "cors";
import path from "path";
import {fileURLToPath} from 'url';
import cookieParser from 'cookie-parser';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    },
    transports: ['websocket', 'polling']
});


app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const userSockets = new Map();



function authenticateToken(req, res, next) {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({success: false, message: 'Token manquant'});
    }
    try {
        req.user = jwt.verify(token, accessSecret);
        next();
    } catch (error) {
        return res.status(403).json({success: false, message: 'Token invalide'});
    }
}


app.post('/api/register', async (req, res) => {
    const {email, username, password} = req.body;
    if (!email || !username || !password) {
        return res.status(400).json({message: "Tous les champs sont requis"});
    }
    const emailQuery = 'SELECT id FROM utilisateurs WHERE email = ?';
    const emailParams = [email];
    const [emailRows] = await db.execute(emailQuery, emailParams);

    if (emailRows.length > 0) {
        return res.status(400).json({message: "Email déjà utilisé"});
    }

    const usernameQuery = 'SELECT id FROM utilisateurs WHERE username = ?';
    const usernameParams = [username];
    const [usernameRows] = await db.execute(usernameQuery, usernameParams);

    if (usernameRows.length > 0) {
        return res.status(400).json({message: "Nom d'utilisateur déjà utilisé"});
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = 'INSERT INTO utilisateurs (email, username, password, nb_playlist) VALUES (?, ?, ?, 0)';
        const insertParams = [email, username, hashedPassword];
        await db.execute(insertQuery, insertParams);

        const [rows] = await db.execute('SELECT id FROM utilisateurs WHERE username = ?', [username]);
        if (rows.length > 0) {
            const user = rows[0];
            console.log('Utilisateur inscrit avec l\'ID : ' + user.id);
            res.status(201).json({message: 'Inscription réussie', userId: user.id});
        } else {
            res.status(500).json({message: 'Erreur lors de la récupération de l\'ID de l\'utilisateur'});
        }
    } catch (error) {
        console.log('Erreur lors de l\'inscription :' + error);
        res.status(500).json({message: 'Erreur lors de l\'inscription'});
    }
});

app.post('/api/auth/login', async (req, res) => {
    const {username, password} = req.body;
    try {
        const loginQuery = 'SELECT * FROM utilisateurs WHERE username = ?';
        const loginParams = [username];
        const [rows] = await db.execute(loginQuery, loginParams);

        if (rows.length === 0) {
            return res.status(404).json({success: false, message: 'Nom d\'utilisateur non trouvé'});
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log('Mot de passe incorrect pour l\'utilisateur :' + user.id);
            return res.status(401).json({success: false, message: 'Mot de passe incorrect'});
        }

        const accessToken = jwt.sign({username}, accessSecret, {expiresIn: '1h'});


        res.cookie('authToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        console.log('Connexion réussie pour l\'utilisateur :' + user.id);
        return res.status(200).json({success: true, user, token: accessToken});
    } catch (error) {
        console.log('Erreur lors de la connexion :' + error);
        return res.status(500).json({success: false, message: 'Erreur lors de la connexion'});
    }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({message: "Utilisateur authentifié", user: req.user});
});

app.get('/api/auth/token', authenticateToken, (req, res) => {
    const token = req.cookies.authToken;
    res.json({token});
});


app.post('/api/auth/logout', authenticateToken, (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    });
    res.status(200).json({success: true, message: 'Déconnexion réussie'});
});


app.get('/api/auth/:username', authenticateToken, async (req, res) => {
    const username = req.params.username;
    if (!username) {
        return res.status(400).send({success: false, message: 'Paramètre manquant'});
    }
    try {

        const profilQuery = 'SELECT id, email, username, nb_playlist FROM utilisateurs WHERE username=?';
        const [rows] = await db.execute(profilQuery, [username]);

        const user = rows[0];
        if (!user) {
            return res.status(404).send({success: false, message: 'Utilisateur non trouvé'});
        }
        return res.status(200).send({success: true, user});

    } catch (error) {
        return res.status(500).send({success: false, message: 'Erreur interne au serveur'});
    }
});

app.get('/api/auth/:username/liked', authenticateToken, async (req, res) => {
    const username = req.params.username;
    if (!username) {
        return res.status(400).send({success: false, message: 'Paramètre manquant'});
    }
    try {
        const playlistQuery = 'SELECT id FROM playlist WHERE nom = ? AND id_utilisateur = (SELECT id FROM utilisateurs WHERE username = ?)';
        const [playlistRows] = await db.execute(playlistQuery, ['Titres Likés', username]);

        const pid = playlistRows[0]?.id;

        const songsQuery = 'SELECT m.id as mid, m.titre, m.artiste_nom, m.duree, CONVERT(m.chemin USING utf8mb4) as chemin, pm.position FROM musique m INNER JOIN playlist_musique pm ON m.id = pm.id_musique WHERE pm.id_playlist = ? ORDER BY pm.position';

        const [rows] = await db.execute(songsQuery, [pid]);

        const liked = {
            nom: "Titre Likés",
            pid: pid,
            songs: rows.map(row => ({
                mid: row.mid,
                titre: row.titre,
                artiste_nom: row.artiste_nom,
                duree: row.duree,
                data: row.data,
                chemin: row.chemin,
                position: row.position,
            }))
        };

        return res.status(200).send({success: true, liked});
    } catch (error) {
        return res.status(500).send({success: false, message: 'Erreur interne au serveur'});
    }
});

app.post('/api/auth/user/create-playlist', authenticateToken, async (req, res) => {
    const {username, name, playlist} = req.body;
    if (!username || !name || !playlist) {
        return res.status(400).send({success: false, message: 'Paramètre manquant'});
    }
    try {
        const [userRows] = await db.execute('SELECT id FROM utilisateurs WHERE username = ?', [username]);
        if (userRows.length === 0) {
            return res.status(404).send({success: false, message: 'Utilisateur non trouvé'});
        }

        const user = userRows[0];

        const playlistQuery = 'INSERT INTO playlist (nom, id_utilisateur) VALUES (?, ?)';
        const [result] = await db.execute(playlistQuery, [name, user.id]);
        const newPlaylistId = result.insertId;
        let i = 0;
        for (const song of playlist) {
            try {
                const songQuery = 'INSERT INTO playlist_musique (id_musique, id_playlist, position) VALUES (?, ?, ?)';
                await db.execute(songQuery, [song.id_musique, newPlaylistId, i++]);
            } catch (error) {
                return res.status(500).send({
                    success: false,
                    message: 'Erreur lors de l\'ajout de la musique à la playlist'
                });
            }
        }

        return res.status(201).send({success: true, message: 'Playlist créée avec succès', playlistId: newPlaylistId});

    } catch (error) {
        console.error('Erreur lors de la création de la playlist:', error);
        return res.status(500).send({success: false, message: 'Erreur interne au serveur'});
    }
})

app.patch('/api/auth/user/update-playlist', authenticateToken, async (req, res) => {
    const {username, titreId, isAdded, playlistId} = req.body;
    if (!username || !titreId || typeof isAdded !== 'boolean') {
        return res.status(400).send({success: false, message: 'Paramètre manquant ou invalide'});
    }
    try {
        const [playlistRows] = await db.execute(
            'SELECT playlist.nom FROM playlist INNER JOIN utilisateurs ON playlist.id_utilisateur = utilisateurs.id WHERE utilisateurs.username = ? AND playlist.id = ?',
            [username, playlistId]
        );
        if (playlistRows.length === 0) {
            return res.status(404).send({success: false, message: 'Playlist non trouvée'});
        }

        if (isAdded === true) {
            const [existsRows] = await db.execute(
                'SELECT 1 FROM playlist_musique WHERE id_musique = ? AND id_playlist = ?',
                [titreId, playlistId]
            );

            if (existsRows.length > 0) {
                return res.status(200).send({success: true, message: 'Titre déjà dans la playlist'});
            }
            const [maxPositionRow] = await db.execute(
                'SELECT MAX(position) as maxPosition FROM playlist_musique WHERE id_playlist = ?',
                [playlistId]
            );

            const position = (maxPositionRow[0].maxPosition ?? -1) + 1;

            await db.execute(
                'INSERT INTO playlist_musique (id_musique, id_playlist, position) VALUES (?, ?, ?)',
                [titreId, playlistId, position]
            );

            return res.status(201).send({success: true, message: 'Titre ajouté à la playlist'});

        } else {
            const [deleteRows] = await db.execute(
                'DELETE FROM playlist_musique WHERE id_musique = ? AND id_playlist = ?',
                [titreId, playlistId]
            );

            if (deleteRows.affectedRows === 0) {
                return res.status(404).send({success: false, message: 'Titre non trouvé dans la playlist'});
            }

            return res.status(200).send({success: true, message: 'Titre retiré de la playlist'});
        }

    } catch (error) {
        console.error('Erreur update liked:', error);
        return res.status(500).send({success: false, message: 'Erreur interne au serveur'});
    }
});

app.get('/api/auth/:username/playlists', authenticateToken, async (req, res) => {
    const username = req.params.username;
    if (!username) {
        return res.status(400).send({success: false, message: 'Non trouvé'});
    }
    try {
        const playlistsQuery = 'SELECT playlist.id as pid, nom FROM playlist INNER JOIN utilisateurs ON playlist.id_utilisateur = utilisateurs.id WHERE utilisateurs.username = ?';
        const [rows] = await db.execute(playlistsQuery, [username]);

        const playlists = rows.map(row => ({
            pid: row.pid,
            nom: row.nom,
        }));

        return res.status(200).send({success: true, playlists});
    } catch (error) {
        return res.status(500).send({success: false, message: 'Erreur interne au serveur'});
    }
})

app.get('/api/auth/:username/playlist/:id', authenticateToken, async (req, res) => {
    const username = req.params.username;
    const playlistId = req.params.id;

    if (!username || !playlistId) {
        return res.status(400).send({success: false, message: 'Paramètre manquant'});
    }
    try {
        const playlistQuery = 'SELECT m.id as mid, m.titre, m.artiste_nom, m.duree, CONVERT(m.chemin USING utf8mb4) as chemin, p.nom, p.id as pid , pm.position FROM musique m INNER JOIN playlist_musique pm ON m.id = pm.id_musique INNER JOIN playlist p ON pm.id_playlist = p.id WHERE p.id = ? AND p.id_utilisateur = (SELECT id FROM utilisateurs WHERE username = ?) ORDER BY pm.position';
        const [rows] = await db.execute(playlistQuery, [playlistId, username]);

        const playlist = {
            nom: rows[0]?.nom,
            pid: rows[0]?.pid,
            songs: rows.map(row => ({
                mid: row.mid,
                titre: row.titre,
                artiste_nom: row.artiste_nom,
                duree: row.duree,
                data: row.data,
                chemin: row.chemin,
                position: row.position,
            }))
        };

        return res.status(200).send({success: true, playlist});
    } catch (error) {
        return res.status(500).send({success: false, message: 'Erreur interne au serveur'});
    }
});


app.get('/api/lookup', authenticateToken, async (req, res) => {
    const search = req.query.search;
    if (!search || search.trim() === "") {
        return res.status(400).json({message: 'Requête de recherche vide'});
    }
    try {
        let songQuery;
        let [rows] = [];
        if (search === "all") {
            songQuery = `SELECT * FROM search_bar ORDER BY titre`;
            [rows] = await db.execute(songQuery);
        } else {

            songQuery = `SELECT *
                         FROM search_bar
                         WHERE titre LIKE ?
                            OR artiste_nom LIKE ?
                         ORDER BY titre`;
            const likeQuery = `%${search}%`;
            [rows] = await db.execute(songQuery, [likeQuery, likeQuery]);
        }

        const songs = rows.map(row => ({
            id_musique: row.id_musique,
            titre: row.titre,
            duree: row.duree,
            artiste_nom: row.artiste_nom,
            chemin: row.chemin,
        }));

        res.status(200).json({success: true, songs});

    } catch (error) {
        console.error('Erreur lors de la recherche :' + error);
        res.status(500).json({success: false, message: 'Erreur interne au serveur'});
    }
});

app.get('/api/artist/songs', authenticateToken, async (req, res) => {
    if (!req.query.search || req.query.search.trim() === "") {
        return res.status(400).json({message: 'Requête de recherche vide'});
    }
    const search = req.query.search;
    const artistQuery = 'SELECT titre FROM musique INNER JOIN artiste on musique.artiste_nom = artiste.nom WHERE artiste.nom LIKE ?';
    const searchParam = `%${search}%`;
    try {
        const [rows] = await db.execute(artistQuery, [searchParam]);

        const artists = rows.map(row => ({
            titre: row.titre,
        }));

        res.status(200).json({success: true, artists});
    } catch (error) {
        res.status(500).json({success: false, message: 'Erreur interne au serveur'});
    }
});


io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Token manquant'));
    }
    jwt.verify(token, accessSecret, (err, decoded) => {
        if (err) {
            return next(new Error('Token invalide'));
        }
        socket.username = decoded.username;
        next();
    });
});

io.on('connection', (socket) => {
    console.log('Nouvelle connexion : ' + socket.id);

    if (!userSockets.has(socket.username)) userSockets.set(socket.username, new Set());
    userSockets.get(socket.username).add(socket);

    socket.on('sendMessage', (messageData) => {
        io.emit('newMessage', messageData);
    });

    socket.on('disconnect', (reason) => {
        console.log(`Déconnexion de ${socket.id} pour ${socket.username}, raison: ${reason}`);
        userSockets.get(socket.username).delete(socket);
        if (userSockets.get(socket.username).size === 0) {
            userSockets.delete(socket.username);
        }
    });

    socket.on('reconnect', (attemptNumber) => {
        console.log(`Reconnexion réussie pour ${socket.id} après ${attemptNumber} tentatives`);
    });

    socket.on('reconnect_attempt', () => {
        console.log(`Tentative de reconnexion pour ${socket.id}`);
    });
});

server.listen('3000', 'localhost', () => {
    console.log(`localhost: http://localhost:3000`);
});

ViteExpress.bind(app, server).then(r => {
});
