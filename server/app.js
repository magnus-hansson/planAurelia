var express = require('express');
var sql = require('mssql');
var cors = require('cors');
var app = express();

app.use(cors());
app.get('/api/v1/trips', function (req, res) {
    var config = {
        driver: 'msnodesqlv8',
        connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost};Database={TemaPlan};Trusted_Connection={yes}',
    };

    sql.connect(config).then( _ => {
        // Query 
        let value = 'asd';
        new sql.Request()
            .input('input_parameter', sql.Int, value)
            .query("select top 10 p.Id id, GuideId [group], TripId tripId, CONVERT(char(10), OutboundDate,126) start,t.TripName tripName, CONVERT(char(10), HomeboundDate,126) [end] from Plans p left outer join Guide g on g.Id = p.GuideId inner join Trip t on t.Id = p.TripId where OutboundDate > GETDATE() + 30 and SeasonCode = 'E'")
            .then((recordset) => {
                res.send(recordset);
            }).catch(function (err) {
                console.log(err);
            });
        
    }).catch(err => {
        console.log(err);
    });
});

app.get('/api/v1/guides', function (req, res) {
    var config = {
        driver: 'msnodesqlv8',
        connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost};Database={TemaPlan};Trusted_Connection={yes}',
    };

    sql.connect(config).then( _ => {
        // Query 
        let value = 'asd';
        new sql.Request()
            .input('input_parameter', sql.Int, value)
            .query("select guidename content, id from Guide")
            .then((recordset) => {
                res.send(recordset);
            }).catch(function (err) {
                console.log(err);
            });
        
    }).catch(err => {
        console.log(err);
    });

});

app.listen(3010, function () {
    console.log('Example app listening on port 3010!');
});