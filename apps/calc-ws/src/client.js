'use strict';

const soap = require('soap');

const url = 'http://localhost:8000/calculatorWS?wsdl';

soap.createClient(url, function (err, client) {
    if (err) return (err);
    client.add({ x: 13, y: 3 }, function (err, res) {
        console.log(res);
    });
    client.sub({ x: 13, y: 3 }, function (err, res) {
        console.log(res);
    });
});