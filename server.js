const express = require("express");
const axios = require("axios");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/log", async (req, res) => {
    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

    let geo = {};
    try {
        const r = await axios.get(`https://ipapi.co/${ip}/json/`);
        geo = r.data;
    } catch {}

    const log = `
=============================
Data: ${new Date().toLocaleString()}
IP: ${ip}
País: ${geo.country_name}
Estado: ${geo.region}
Cidade: ${geo.city}
ISP: ${geo.org}
ASN: ${geo.asn}
Lat: ${geo.latitude}
Lon: ${geo.longitude}

UA: ${req.body.ua}
Plataforma: ${req.body.platform}
Tela: ${req.body.res}
Idioma: ${req.body.lang}
=============================

`;

    fs.appendFileSync("logs.txt", log);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log("Servidor ONLINE na porta", PORT);
});
