import express from "express";

const app = express()
const port = process.env.PORT || 3000

function genRan() {
    let ran = Math.floor(Math.random()*songs.length);
    return ran;
}

app.get('/api/songs/any', (req, res) => {
    const key = genRan();
    const song = songs[key]
    res.json(song);
})

app.listen(port, ()=> {0
    console.log(`server is running on port ${port}.`)
})

const songs = [
    {
        name: "Fall",
        artist: ["Eminem"],
        released: [
            {
                day: 31,
                month: "Aug",
                monthNum: 8,
                year: 2018
            }
        ],
        image: "https://media.pitchfork.com/photos/64f0da7d7905eccfe3dba569/master/pass/Eminem-Kamikaze.jpg",
        yt: "https://www.youtube.com/watch?v=jsur8561_1A"
    },

    {
        name: "Sober",
        artist: [
            "G-Eazy", "Charlie Puth"    
        ],
        released: [
            {
                day: 14,
                month: "Mar",
                monthNum: 3,
                year: 2018
            }
        ],
        image: "https://www.billboard.com/wp-content/uploads/media/g-eazy-sober-vid-2018-billboard-1548.jpg",
        yt: "https://www.youtube.com/watch?v=8OARiNiJ_w8&rco=1"
    },

    {
        name: "What Lovers Do",
        artist: ["Maroon 5", "SZA"],
        released: [
            {
                day: 28,
                month: "Sep",
                monthNum: 9,
                year: 2017
            }
        ],
        image: "https://i.scdn.co/image/ab67616d0000b2733c5e0b163d55ef4e27f60689",
        yt: "https://www.youtube.com/watch?v=5Wiio4KoGe8"
    },

    {
        name: "Locked Away",
        artist: ["R. City", "Adam Levine"],
        released: [
            {
                day: 14,
                month: "Aug",
                monthNum: 8,
                year: 2015
            }
        ],
        image: "https://i.scdn.co/image/ab67616d0000b2739519b1a9e2b552407e65b01a",
        yt: "https://www.youtube.com/watch?v=6GUm5g8SG4o"
    },

    {
        name: "Closer",
        artist: ["The Chainsmokers", "Halsey"],
        released: [
            {
                day: 29,
                month: "Jul",
                monthNum: 5,
                year: 2016
            }
        ],
        image: "https://i.scdn.co/image/ab67616d0000b273495ce6da9aeb159e94eaa453",
        yt: "https://www.youtube.com/watch?v=PT2_F-1esPk"
    }
]