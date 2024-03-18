import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

const APIKey = "APIKEY";

app.use(express.urlencoded({ extended: true }));



app.get("/", (req, res) => {
    res.render("index.ejs", { wtemp:"", wdesc:"", wicon: "", whumid:"", wwind:"", error: 'initial'});
});

app.post("/", async (req, res) => {
    try {
        const cityName = req.body.cityname;
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}&units=metric`);
        if (result.data.cod === '404') {
            res.render("index.ejs", { cname:"", wtemp:"", wdesc:"", wicon: "", whumid:"", wwind:"", error: 'City not found' });
            return;
        }
        const data = {
            cname: req.body.cityname,
            wtemp: result.data.main.temp +` ℃`,
            wdesc: result.data.weather[0].description,
            wicon: result.data.weather[0].icon,
            whumid: result.data.main.humidity,
            wwind: result.data.wind.speed,
            error: result.data.cod === '404' ? 'City not found' : null,
        };
        res.render("index.ejs", data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.render("index.ejs", { wtemp:"", wdesc:"", wicon: "", whumid:"", wwind:"" , error: 'City not found'});
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
