const express = require('express');
const app = express();
const port = 4000; // Wähle einen Port für deinen Server
const cors = require("cors");
const bodyParser = require('body-parser');
const db = require("./db")


app.use(cors())
app.use(bodyParser.json())

//middleware für authnetification
const auth = (req, res, next) => {
    const { username, password } = req.body


    db.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, password], (err, rows) => {
        if (err) {
            console.log("Fehler beim Abfragen der Login Informationen:", err);
        } else {
            if (rows.rows.length > 0) {
                console.log("Benutzer gefunden:", rows.rows);
                next()
            } else {
                console.log("Benutzer nicht gefunden.");
                res.status(401).json({ message: "Ungültige Eingabe" })
            }
        }
    });

}

//middleware für neuen account
const newAccount = (req, res, next) => {
    const { username, password } = req.body

    db.query("SELECT * FROM users WHERE username = $1", [username], (err, rows) => {
        if (err) {
            console.log("Fehler beim Abfragen der Daten")
        }
        if (rows.rows.length > 0) {
            console.log("User existiert bereits")
            res.status(401).json({ message: "User existiert bereits" })
        }
        else {
            console.log("User existiert nicht")
            next()
        }
    })
}

app.get('/', (req, res) => {

    res.send("WELCOME")
})




app.post("/login", auth, (req, res) => {

    console.log(req.body)
    res.status(200).json({ message: "Login successful" })
})

app.post("/signup", newAccount, (req, res) => {
    console.log(req.body)
    db.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id", [req.body.username, req.body.password], (err, result) => {
        if (err) {
            console.log("Fehler beim erstellen des Benutzers")
            res.status(500).json({ message: "Fehler beim erstellen des Nutezrs" })
        }

        const userID = result.rows[0].id;
        console.log("Neuer Benutzer erstellt mit ID:", userID)
        db.query("INSERT INTO profile (id,username) VALUES ($1, $2)", [userID, req.body.username], (err) => {
            if (err) {
                console.log("Fehler beim erstellen des Profiles")
                res.status(500).json({ message: "Fehler beim erstellen des Profils" })
            }
        })

        res.status(200).json({ message: "User erstellt" })
    })
})

app.post("/getChat", (req, res) => {

    const username = req.body.user
    console.log(username)

    db.query("SELECT * FROM chats WHERE creator LIKE $1 OR partner LIKE $2;", [`%${username}%`, `%${username}%`], (err, rows) => {
        if (err) {
            console.log("Fehler beim Abfragen", err)
        }
        if (rows.length == 0) {
            console.log("Keine Chats gefunden")
            res.status(200).json({ message: "Keine Chats" })
        }
        if (rows) {
            console.log(rows.rows)
            res.status(200).json(rows.rows)
        }
    })



})

app.post("/loadChat", (req, res) => {

    const chatID = req.body.chatID
    console.log("CHAT OPENED", chatID)



    db.query("SELECT * FROM messages WHERE chatid = $1;", [chatID], (err, rows) => {
        if (err) {
            console.log("Fehler beim Datenbankabfragen", err)
            res.status(500).json({ message: "Fehler bei der Abfrage" })
        }

        if (rows.length == 0) {
            //console.log("Keine Nachrichten gefunden")
            res.status(200).json({ message: "Keine Nachrichten gefunden" })
        }

        else {
            //console.log(rows.rows)
            res.json(rows.rows)
        }
    })
})

app.post("/newMessage", (req, res) => {
    // console.log(req.body.newMessage)
    const { chatid, sender, receiver, message, timestamp, status } = req.body.newMessage
    console.log(chatid, sender, receiver, message, timestamp, status)
    //daten sind angekommen und müssen nun in die datenbank eingetragen werden
    //res.json({message: "Angekommen"})
    db.query("INSERT INTO messages (chatid, sender, receiver, message, timestamp,status) VALUES ($1,$2,$3,$4,$5,$6);", [chatid, sender, receiver, message, timestamp, status], (err) => {
        if (err) {
            console.log("Fehler beim Senden der Nachricht")
            res.status(500).json({ message: "Fehler beim senden der Nachricht", err })
        }
        res.status(200).json({ message: "Nachricht gesendet" })
    })
})

app.post("/discover", (req, res) => {

    const { user } = req.body
    console.log("ANGEMELDETER USER", user)
    const alreadyChatting = []

    db.query("SELECT * FROM chats WHERE creator = $1 OR partner = $1", [user], (err,rows) => {
        if(err){
            console.log("Fehler beim Datenbankabfrage")
        }
        const length_of_partner = rows.rows.length
        for(let i = 0; i<length_of_partner;i++) {
            if(rows.rows[i].creator == user) {
                alreadyChatting.push(rows.rows[i].partner)
            }
            else {
                alreadyChatting.push(rows.rows[i].creator)
            }
            
        }
        db.query("SELECT * FROM profile WHERE username != $1", [user], (err, rows) => {
            if (err) {
                console.log("Fehler bei der Datenbankabfrage")
                res.status(500).json({ message: "Internal Server Error" })
            }
    
            if (rows.length == 0) {
                console.log("Keine User gefunden")
                res.status(200).json({ message: "Kein User gefunden" })
            }
    
    
            else {
    
            res.status(200).json({ message: rows.rows, alreadyChatting: alreadyChatting })
    
    
       
    
                
            }
        })
    })

    

    // alle profile werden geladen
   


}
)






app.post("/getProfile", (req, res) => {
    const { username } = req.body

    db.query("SELECT * FROM profile WHERE username = $1;", [username], (err, rows) => {
        if (err) {
            console.log("Fehler beim Abfragen")
            res.status(500).json({ message: "Internal Server Error" })
        }
        res.status(200).json({ message: rows.rows })
    })
})


app.post("/editProfile", (req, res) => {
    console.log(req.body)
    const { username, first_name, last_name, age, profile_img } = req.body

    db.query("UPDATE profile SET first_name = $1, last_name = $2, age = $3, profile_img = $4 WHERE username = $5",
        [first_name, last_name, age, profile_img, username], (err) => {
            if (err) {
                console.log("Fehler aufgetreten", err)
                res.status(500).json({ message: "Internal Server Error" })
            }
            res.status(200).json({ message: "Profile erfoglreich aktualisiert" })
        })

})

app.post("/startChat", (req, res) => {
    console.log("START NEW CHAT: ",req.body)
    const {creator, partner} = req.body

    db.query("SELECT * FROM chats WHERE (creator = $1 AND partner = $2) OR (creator = $2 AND partner = $1)",
     [creator, partner], (err,rows) => {
        if(err) {
            console.log(err)
            res.status(500).json({message: "Internal Server Error"})

        }

        else if(rows.rows.length == 0) {
            // Kein Chat vorhanden
            db.query("INSERT INTO chats (creator, partner) VALUES ($1, $2)", [creator, partner], (err)=> {
                if(err) {
                    console.log("Fehler beim ertsllen des Chats")
                    res.status(500).json({message: "Fehler beim erstellen"})
                }
                res.status(200).json({message: "Chat erstellt"})
            })
        }
        else {
        res.status(200).json({message: "Chat existert bereits"})}
     })

})

// Starte den Server
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});


