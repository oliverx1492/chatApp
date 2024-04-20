const {Pool} = require("pg")
 
const pool = new Pool({
    user: "postgres.bcalkygiutqlhzqogfrj",
    host: "aws-0-us-west-1.pooler.supabase.com",
    database: "postgres",
    password: "oo3UfrK9wX32",
    port: 5432
})




pool.connect((err, client, release) => {
    if (err) {
        console.error('Fehler beim Herstellen der Verbindung zur Datenbank:', err);
    } else {
        console.log('Verbindung zur Datenbank hergestellt');
        release(); // Verbindung freigeben
    }
});


module.exports = pool