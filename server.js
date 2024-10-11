import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// allowing request from specific url by cors middleware
const allowedOrigin = process.env.ALLOWED_ORIGIN;

const corsOptions = {
    origin: (origin, callback) => {
        if(origin === allowedOrigin || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], //can list all allowed methods here
};

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

const db = new pg.Client({
    user: process.env.CLOUD_USER,
    host: process.env.CLOUD_HOST,
    database: process.env.CLOUD_DBNAME,
    password: process.env.CLOUD_PASSWORD,
    port: process.env.CLOUD_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect().then(console.log(`connected successfully.`));

function genRan(songs) {
    let ran = Math.floor(Math.random() * songs.length);
    return ran;
}

app.get('/api/songs/all', async (req, res) => {
    const result = await db.query("SELECT * FROM content_library ORDER BY id ASC");
    let songs = [];
    result.rows.forEach(row => {
        songs.push(row);
    });
    res.json(songs);
    // db.end();
});



app.get('/api/songs/any', async (req, res) => {
    let songs = [];
    const result = await db.query("SELECT * FROM content_library");
    result.rows.forEach(row => {
        songs.push(row);
    })
    const key = genRan(songs);
    const song = songs[key];
    console.log(song);
    res.json(song);
    // db.end();
});

app.get('/api/songs/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.query("SELECT * FROM content_library WHERE id = $1", [id])
        res.status(201).json(result);
    } catch (error) {
        console.error("error fetching the specific row by id");
    }
});

app.post('/api/songs/add', async (req, res) => {

    //getting the data from the body
    const { title, artist, image, stream } = req.body;

    const values = [title, artist, image, stream];
    console.log(values);

    //for adding the song to songs list
    await db.query(`INSERT INTO content_library (title, artist, image, stream)
         VALUES($1, $2, $3, $4)`, values);
    res.status(201).json({ message: "Song added successfully!" });
});

// didn't use patch :(
app.put('/api/songs/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { title, artist, image, stream } = req.body;
        await db.query(`UPDATE content_library
        SET title = $1, artist = $2, image = $3, stream = $4
        WHERE id = $5
        `, [title, artist, image, stream, id]);
        
        console.log("successfully updated!", id);
        res.status(201).json({ message: `Updated the content with id ${id} successfully!` });
    } catch (error) {
        console.error("Failed to update the item details!");
    }
});

// to delete all of the items in a table
app.delete('/api/songs/delete/all', async (req, res) => {
    try {
        await db.query('DELETE FROM content_library');
        res.status(201).json({ message: 'Deleted all of the rows in the table content_library successfully!' });
    } catch (error) {
        console.error("Failed to delete all of the rows in the table content_library!");
    }
});

// to delete a specific item in a table
app.delete('/api/songs/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await db.query('DELETE FROM content_library WHERE id = $1', [id]);
        res.status(201).json({ message: `Deleted the row with id ${id} successfully` });
    } catch (error) {
        console.error("Failed to delete the row from the database!");
    }
});

app.listen(port, () => {
    console.log(`server is running on port ${port}.`)
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received. Closing database connection...');
    db.end(() => {
        console.log('Database connection closed.');
        process.exit(0);  // Exit the process after closing the connection
    });
});  // this will work when i press CTRL + C to terminate it

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing database connection...');
    db.end(() => {
        console.log('Database connection closed.');
        process.exit(0);
    });
}); //this will work when i kill it via terminal
