require('./config/config');
require('./db/mongoose');

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios')
const _ = require('lodash');

let {Application} = require('./models/application');

const app = express();

app.use(bodyParser.json());

// register an app of list of apps
app.post('/apps', async (req, res) => {
    let applications = req.body
    // 1 app  = list of 1 elm app
    if (!Array.isArray(applications)) {
        applications = [applications]  
    }
    try {
        
        let uuidGen = config["uuidGen"]
        uuidGen.params.n = applications.length
        let gaussGen = config["gaussGen"]
        gaussGen.params.n = applications.length
    
        var uuids = await axios.post(config["randomURL"], uuidGen)
        uuids = uuids.data.result.random.data

        var gaussNums = await axios.post(config["randomURL"], gaussGen)
        gaussNums = gaussNums.data.result.random.data
    }
    catch (err) {
        // internal server error as not successful with random.org        
        console.log(err)
        res.status(500).send()
    }
    
    try{
        let rows = []
        for (let i = 0; i < applications.length; i++) {
            let totalLength = 0
            if (applications[i].fullName) {
                totalLength += applications[i].fullName.length
            }
            if (applications[i].dob) {
                totalLength += applications[i].dob.length
            }
            if (applications[i].profession) {
                totalLength += applications[i].profession.length
            }

            rows.push(new Application({
                "appId": uuids[i],
                ...applications[i],
                "riskScore": totalLength * gaussNums[i]
            }))
        }
        try {
            await Application.insertMany(rows)
            res.status(200).send()
        } catch (err) {
            // failed insert to db return internal server error
            console.log(err)
            res.status(500).send()
        }
    } catch (err){
        // bad incoming request        
        console.log(err)
        res.status(400).send()
    }
})

// app with no birthday or no profession is considered not valid
app.get('/validity', (req, res) => {
    Application.find({}, function (err, apps) {
        if (err) {
            res.status(404).send()
        } else {
            let valids = []
            let invalids = []

            apps.forEach((elm) => {
                if (elm.dob  && elm.profession) {
                    valids.push(_.pick(elm, ["appId", "fullName", "dob", "profession"]))
                } else {
                    invalids.push(_.pick(elm, ["appId", "fullName", "dob", "profession"]))
                }
            })
            res.status(200).send({
                "validApp": valids,
                "invalidApp": invalids
            })
        }
    });
});

// app with risk score < risk threshold is considered failed
app.get('/failedApps', (req, res) => {
    Application.find({}, function (err, apps) {
        if (err) {
            res.status(404).send() 
        } else {
            let failures = []
            apps.forEach((elm) => {
                if (elm.riskScore < config["riskThreshold"]) {
                    failures.push(_.pick(elm, ["appId", "fullName", "dob", "profession", "riskScore"]))
                }
            })
            res.status(200).send({
                "failedApps": failures
            })
        }
    });
});

// agg risk score
app.get('/accRisk', (req, res) => {
    Application.find({}, function (err, apps) {
        if (err) {
            res.status(404).send()
        } else {
            let accRiskScore = 0
            apps.forEach((elm) => accRiskScore += elm.riskScore)
            res.status(200).send({
                "accRisk": accRiskScore
            })
        }
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is up at ip port  ${port}`);
});

module.exports = {app}