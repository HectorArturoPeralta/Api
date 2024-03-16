const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');

const app = express();
admin.initializeApp({
    credential: admin.credential.cert('./permissions.json'),
    databaseURL: 'https://comprayventasautomovil.firebaseio.com'
});

const db = admin.firestore()

app.get('/hello-world', (req, res) => {
    return res.status(200).json({message: 'Hello World'})
});

//Añadir un nuevo Articulo
app.post('/api/Vehiculos', async (req, res) => {
    try{
        await db.collection("Vehiculos").doc("/" + req.body.id + "/").create({nombre: req.body.nombre, color: req.body.color, año: req.body.año, precio: req.body.precio, descripcion: req.body.descripcion, combustible: req.body.combustible});
    return res.status(204).json();
    }catch(error){
        console.log(error);
        return res.status(500).send(error);
    }
});

//Buscar Articulo por medio de id
app.get("/api/Vehiculos/:id", (req, res) => {
    (async () => {
        try {
            const doc = db.collection("Vehiculos").doc(req.params.id);
            const item = await doc.get();
            const response = item.data();
            return res.status(200).json(response);
        } catch(error){
            return res.status(500).send(error);
        }
    })();
});

//Consultar todos los Vehiculos en la Base de datos
app.get("/api/Vehiculos", async (req, res) => {
    try {
    const query = db.collection("Vehiculos");
    const querySnapshot = await query.get();
    const docs = querySnapshot.docs;

    const response = docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre,
        color: doc.data().color,
        año: doc.data().año,
        precio: doc.data().precio,
        descripcion: doc.data().descripcion,
        combustible: doc.data().combustible,
    }));
        return res.status(200).json(response);
    }   catch(error){
        return res.status(500).send(error);
    }
    });

    //Borrar Articulos por medio de id
app.delete("/api/Vehiculos/:id", async (req, res) => {
    try {
        const doc = db.collection("Vehiculos").doc(req.params.id);
        await doc.delete();
        return res.status(204).json();
    } catch(error){
        return res.status(500).send(error);
    }
});

//Actualizar los datos del vehiculos por medio del id
app.put("/api/vehiculos/:id", async (req, res) => {
    try {
        const doc = db.collection("Vehiculos").doc(req.params.id);
        await doc.update(req.body);
        return res.status(204).json();
    }catch (error) {
        return res.status(500).send(error);
    }
});

exports.app = functions.https.onRequest(app);