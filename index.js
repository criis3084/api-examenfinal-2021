const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());
var cors = require('cors')

app.use(cors()) // Use this after the variable declaration

// conexion a base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'umg'
});

// Route
app.get('/', (req, res) => {
  res.send('Bienvenido a la API UMG');
});

//inserta un nuevo estudiane
app.post('/apiumg/public/estudiante/', (req, res) => {
  //consulta para insertar
  const sql = `INSERT INTO estudiante SET ?`;
  
  const estudianteObj = {
    nombre: req.body.nombre,
    direccion: req.body.direccion,
    telefono: req.body.telefono,
    idcarrera: req.body.idcarrera,
    idsede: req.body.idsede
  };

  connection.query(sql, estudianteObj, error => {
    if (error) throw error;
    res.send('Estudiante creado!');
  });
});

//actualiza informacion de un estudiante en base al id
app.put('/apiumg/public/estudiante/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, telefono, idcarrera, idsede } = req.body;
  const sql = `UPDATE estudiante SET nombre = '${nombre}', direccion='${direccion}', telefono='${telefono}', idcarrera='${idcarrera}', idsede='${idsede}' WHERE idestudiante =${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Estudiante actualizado!');
  });
});


//elimina un estudiante en base a su id 
//http://localhost:3050/apiumg/public/estudiante/7/
app.delete('/apiumg/public/estudiante/:id/', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM estudiante WHERE idestudiante= ${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Estudiante eliminado');
  });
});


//SELECT estudiante.idestudiante, estudiante.nombre, estudiante.direccion, 
// estudiante.telefono, carrera.nombre as Carrera, sede.nombre as Sede 
//FROM estudiante INNER JOIN carrera ON (estudiante.idcarrera = carrera.idcarrera)
// INNER JOIN sede ON (estudiante.idsede = sede.idsede);
// Recupar informacion de un estudiante 
app.get('/apiumg/public/estudiante/:id', (req, res) => {
  const { id } = req.params
  const sql = `SELECT estudiante.idestudiante, estudiante.nombre, estudiante.direccion, estudiante.telefono, carrera.nombre as Carrera, sede.nombre as Sede FROM estudiante INNER JOIN carrera ON (estudiante.idcarrera = carrera.idcarrera) INNER JOIN sede ON (estudiante.idsede = sede.idsede) WHERE idestudiante = ${id}`;

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Sin resultados');
    }
  });
});

app.get('/apiumg/public/estudiante/', (req, res) => {
  const { id } = req.params
  const sql = `SELECT estudiante.idestudiante, estudiante.nombre, estudiante.direccion, estudiante.telefono, carrera.nombre as Carrera, sede.nombre as Sede FROM estudiante INNER JOIN carrera ON (estudiante.idcarrera = carrera.idcarrera) INNER JOIN sede ON (estudiante.idsede = sede.idsede)`;

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Sin resultados');
    }
  });
});



// Revisar si la conexion funciona
connection.connect(error => {
  if (error) throw error;
  console.log('Servidor listo');
});

app.listen(PORT, () => console.log(`Servidor ejecutandose en el puerto: ${PORT}  PID:`+process.pid));