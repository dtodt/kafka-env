'use strict';

/**
 * Imports.
 */
const soap = require('soap'),
    express = require('express'),
    fs = require('fs'),
    services = require('./services');

/**
 * Soap app settings.
 */
const ip = process.env.IP || 'localhost',
    port = process.env.PORT || 8000,
    protocol = process.env.PROTOCOL || 'http',
    endpoint = '/calculatorWS',
    location = protocol + '://' + ip + ':' + port + endpoint;

/**
 * Soap app setup.
 */
const wsdl = fs.readFileSync(__dirname + '/wsdl/calculator.wsdl', 'utf8').replace('DUMMY', location);
const app = new express();
app.listen(port, function () {
    soap.listen(app, endpoint, services, wsdl);
    console.log('Webservice started at: ' + location);
});