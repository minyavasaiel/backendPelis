import config from './config'
import * as mongo from './libs/mongo'
import express from 'express';
import cors from 'cors';
import { ObjectId } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const port = 3000;

mongo.Connect(config.mongo).then(
    () => {
        app.listen(port, () => {
            console.log("Rest levantado en http://127.0.0.1:3000/")
        })
    });

app.get("/getMoviesByTitle", async (request: { query: { title: string | undefined } }, response) => {
    //response.send("Peliculas por titulo");
    let consulta: any = request.query;
    let respuesta = {};
    if (request.query.title) {
        respuesta = await obtenerPeliculasPorTitulo(request.query.title);
    } else {
        respuesta = "Error";
    }
    console.log(respuesta);
    response.send(respuesta);
});

async function obtenerPeliculasPorTitulo(title: String): Promise<{ directors: string[], title: string }> {
    let query = {
        "title": {
            $regex: title,
            $options: "$i"
        }
    };
    try {
        await mongo.Connect(config.mongo)
    } catch (error) {
        console.log(`Error conectando a base de datos: `, error);
    }

    let projection = {
        "title": 1,
        "_id": 1
    }
    let respuesta: any = await mongo.Find("movies", query, projection);
    return respuesta;

}



app.get("/details", async (request: { query: { movieId: string } }, response) => {
    //response.send("Peliculas por titulo");
    let respuesta = {};
    respuesta = await obtenerDetalle(request.query.movieId);
    console.log(respuesta);
    response.send(respuesta);
});

async function obtenerDetalle(movieId: string): Promise<{ title: string, year: number, directors: string[], plot: string }> {
    try {
        await mongo.Connect(config.mongo)
    } catch (error) {
        console.log(`Error conectando a base de datos: `, error);
    }
    let query = { "_id": new ObjectId(movieId) };

    let projection = {
        "title": 1,
        "year": 1,
        "directors": 1,
        "plot": 1
    }
    let respuesta: any = await mongo.Find("movies", query, projection);
    //console.log("Obtener detalle: ", respuesta);
    return respuesta[0];

}

app.get("/comments", async (request: { query: { movieId: string } }, response) => {
    let respuesta = {};
    respuesta = await obtenerComentarios(request.query.movieId);
    console.log("Los comentarios son (server)", respuesta);
    response.send(respuesta);
});

async function obtenerComentarios(movieId: string): Promise<{ name: string, email: string, text: string; date: Date }> {
    try {
        await mongo.Connect(config.mongo);
    } catch (error) {
        console.log(`Error conectandose a la base de datos: `, error);
    }
    let query = { "movie_id": new ObjectId(movieId) };
    console.log("La sentencia es: ", query);

    let projection = {
        "name": 1,
        "email": 1,
        "text": 1,
        "date": 1
    }
    let respuesta: any = await mongo.Find("comments", query, projection);
    return respuesta;
}

app.post("/addComment", async (request: { body: { name: string, email: string, movieId: string, text: string } }, response) => {
    let respuesta = await insertarComentarios(request.body.name, request.body.email, request.body.movieId, request.body.text);
    response.send(respuesta);
});

async function insertarComentarios(nameLlega: string, emailLlega: string, movieId: string, textLlega: string) {
    console.log("Entra por insertarComentarios");
    try {
        await mongo.Connect(config.mongo);
    } catch (error) {
        console.log(`Error de conexión a la base de datos: `, error);
    }
    let comentario = {
        _id: new ObjectId(),
        name: nameLlega,
        email: emailLlega,
        movie_id: new ObjectId(movieId),
        text: textLlega,
        date: (new Date())
    }
    let respuesta = mongo.InsertOne('comments', comentario);
    return respuesta;
}