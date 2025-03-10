import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Welcome@123",
  port: "5432"
})

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//Part: 1
/*app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(result.rows);
  res.render("index.ejs", { countries: countries, total: countries.length });
  db.end();
}); */

async function checkVisited() {
  const result = await db.query("Select country_code FROM visted_countries");

  let countries = [];

  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

//Get home page
app.get("/", async (req, res) => {
    const result = await checkVisited();
    res.render("index.ejs", {countries: countries, total: countries.length});
})

//insert new country 
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  const result = await db.query(
    "SELECT country_code FROM countries WHERE country_name=$1",
    [input]
  );

  if(result.rows.length!==0) {
    const data = result.rows[0];
    const country_code = data.country_code;

    await db.query("INSERT INTO visited_countries (country_code) VALUE ($1)", [country_code,]);
    res.redirect("/");
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
