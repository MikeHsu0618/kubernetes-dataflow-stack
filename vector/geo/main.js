// Asynchronous database opening
const Reader = require('@maxmind/geoip2-node').Reader;

Reader.open('./GeoLite2-City.mmdb').then(reader => {
    const response = reader.city('128.101.101.101');

    console.log(response);
});

const test = {
    "geoip": {
        "city_name": "Richfield",
        "continent_code": "NA",
        "country_code": "US",
        "country_name": "United States",
        "latitude": 44.8769,
        "longitude": -93.2535,
        "metro_code": 613,
        "postal_code": "55423",
        "region_code": "MN",
        "region_name": "Minnesota",
        "timezone": "America/Chicago"
    }
}
// // Synchronous database opening
// const fs = require('fs');
// const Reader = require('@maxmind/geoip2-node').Reader;
//
// const dbBuffer = fs.readFileSync('/path/to/maxmind-database.mmdb');
//
// // This reader object should be reused across lookups as creation of it is
// // expensive.
// const reader = Reader.openBuffer(dbBuffer);
//
// response = reader.city('128.101.101.101');
//
// console.log(response.country.isoCode);