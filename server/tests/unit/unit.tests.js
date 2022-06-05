const assert = require('assert');
const { containsLocation }  = require('../../src/utils/geofence.utils');
const { isLocationOnPath } = require('../../src/utils/georoute.utils');
const { isIsoDate, isClosed, isValidGeofence, isValidLocation, isValidMail} = require('../../src/utils/validation.utils');


describe('-- UNIT-TESTS --\n',  () => {
    
    describe('1. Validation utility functions unit tests',  () => {

        describe('1.1 If a date string is in ISO and UTC format', () => {

            it('should return true if valid date string',  () => {
                let date = '2011-10-05T14:48:00.000Z';
                assert.equal(isIsoDate(date), true);
            });

            it('should return false if invalid date string', () => {
                let date = '201110-05T14:48:00.000';
                assert.equal(isIsoDate(date), false);
            });

        });

        describe('1.2 If it\'s a proper email', () => {
            it('should return true if valid email',  () => {
                let email = 'dummymail@gmail.com';
                assert.equal(isValidMail(email), true);
            });

            it('should return false if invalid email', () => {
                let email = 'dummymailgmail.com';
                assert.equal(isValidMail(email), false);
            });
        });


        describe('1.3 If a location coordinates is valid ', () => {
            it('should return true if coordinates are valid',  () => {
                let coordinates = [27.78, 75.56];
                assert.equal(isValidLocation(coordinates), true);
            });

            it('should return false if longitude is out of range -180 to 180', () => {
                let coordinates = [227.78, 75.56];
                assert.equal(isValidLocation(coordinates), false);
            });

            it('should return false if latitude is out of range -90 to 90', () => {
                let coordinates = [27.78, 175.56];
                assert.equal(isValidLocation(coordinates), false);
            });

            it('should return false if it is not a numerical value', () => {
                let coordinates = [[227.78, "abc"]];
                assert.equal(isValidLocation(coordinates), false);
            });

            it('should return false if it is not valid array', () => {
                let coordinates = [[227.78, 75.56]];
                assert.equal(isValidLocation(coordinates), false);
            });
        });

        describe('1.4 If a set of coordinates is closed', () => {
            it('should return true if close',  () => {
                let poly = [
                    [27.78, 75.56],
                    [28.39, 75.46],
                    [28.43, 76.16],
                    [27.85, 76.19],
                    [27.78, 75.56] 
                ]
                assert.equal(isClosed(poly), true);
            });

            it('should return false if not closed', () => {
                let poly = [
                    [27.78, 75.56],
                    [28.39, 75.46],
                    [28.43, 76.16],
                    [27.85, 76.19]
                ]
                assert.equal(isClosed(poly), false);
            });
        });

        
        describe('1.4 If a given geofence is valid', () => {
            it('should return true if valid geofence',  () => {
                let geofence = [
                    [27.78, 75.56],
                    [28.39, 75.46],
                    [28.43, 76.16],
                    [27.85, 76.19],
                    [27.78, 75.56]
                ]
                assert.equal(isClosed(geofence) && isValidGeofence(geofence), true);
            });

            it('should return false if geofence is not closed', () => {
                let geofence = [
                    [27.78, 75.56],
                    [28.39, 75.46],
                    [28.43, 76.16],
                    [27.85, 76.19]
                ]
                assert.equal(isClosed(geofence) && isValidGeofence(geofence), false);
            });
            it('should return false if geofence if locations are invalid', () => {
                let geofence = [
                    [227.78, 175.56],
                    [28.39, "abc"],
                    [28.43, 76.16],
                    [27.85, 76.19]
                ]
                assert.equal(isClosed(geofence) && isValidGeofence(geofence), false);
            });
            it('should return false if geofence array has not proper format', () => {
                let geofence = [[
                    [27.78, 75.56],
                    [28.39, 75.46],
                    [28.43, 76.16],
                    [27.85, 76.19]
                ]]
                assert.equal(isClosed(geofence) && isValidGeofence(geofence), false);
            });
            
        });


        describe('1.5 If a given georoute is valid', () => {
            it('should return true if valid georoute',  () => {
                let georoute =  [
                    [77.19461788443903 ,28.64469444841356],
                    [77.1859407902146 ,28.643557860380213],
                    [77.174932536347  ,28.64185295523916],
                    [77.17700467825279, 28.64014802238988],
                    [77.18244405075143, 28.636965406939993],
                    [77.18891949420293, 28.634237374004286]
                    
                ]
                assert.equal(!isClosed(georoute) && isValidGeofence(georoute), true);
            });

            it('should return false if georoute is closed', () => {
                let georoute =  [
                    [77.19461788443903 ,28.64469444841356],
                    [77.1859407902146 ,28.643557860380213],
                    [77.174932536347  ,28.64185295523916],
                    [77.17700467825279, 28.64014802238988],
                    [77.18244405075143, 28.636965406939993],
                    [77.18891949420293, 28.634237374004286],
                    [77.19461788443903 ,28.64469444841356]     
                ]
                assert.equal(!isClosed(georoute) && isValidGeofence(georoute), false);
            });

            it('should return false if georoute if locations are invalid', () => {
                let georoute =  [
                    [377.19461788443903 ,128.64469444841356],
                    [77.1859407902146 ,28.643557860380213],
                    [77.174932536347  ,28.64185295523916],
                    [77.17700467825279, "abc"],
                    [77.18244405075143, 28.636965406939993],
                    [77.18891949420293, 28.634237374004286],
                    [77.19461788443903 ,28.64469444841356]     
                ]
                assert.equal(!isClosed(georoute) && isValidGeofence(georoute), false);
            });

            it('should return false if georoute array has not proper format', () => {
                let georoute =  [[
                    [77.19461788443903 ,28.64469444841356],
                    [77.1859407902146 ,28.643557860380213],
                    [77.174932536347  ,28.64185295523916],
                    [77.17700467825279, 28.64014802238988],
                    [77.18244405075143, 28.636965406939993],
                    [77.18891949420293, 28.634237374004286]    
                ]]
                assert.equal(!isClosed(georoute) && isValidGeofence(georoute), false);
            });
            
        });
    });

    describe('2. Geofence and Georoute utility functions unit tests',  () => {
        
        describe('2.1 Geofence',  () => {
            it('should return true if the location is inside geofence', () => {
                let geofence = [
                    [27.78, 75.56],
                    [28.39, 75.46],
                    [28.43, 76.16],
                    [27.85, 76.19],
                    [27.78, 75.56]
                ];
                let location = [28.18, 75.86];
                assert.equal(containsLocation(location[1], location[0], geofence), true);
            });
            it('should return false if the location is outside geofence', () => {
                let geofence = [
                    [27.78, 75.56],
                    [28.39, 75.46],
                    [28.43, 76.16],
                    [27.85, 76.19],
                    [27.78, 75.56]
                ];
                let location = [28.18, 58.86];
                assert.equal(containsLocation(location[1], location[0], geofence), false);
            });

        });
        describe('2.2 Georoute',  () => {
            it('should return true if the location is on the preset path', () => {
                let georoute =  [
                    [77.19461788443903 ,28.64469444841356],
                    [77.1859407902146 ,28.643557860380213],
                    [77.174932536347  ,28.64185295523916],
                    [77.17700467825279, 28.64014802238988],
                    [77.18244405075143, 28.636965406939993],
                    [77.18891949420293, 28.634237374004286]         
                ]
                let location = [77.19467788443801, 28.64495244841356];
                assert.equal(isLocationOnPath(location, georoute, false, 30), true);
            });
            it('should return false if the location is not on the preset path', () => {
                let georoute =  [
                    [77.19461788443903 ,28.64469444841356],
                    [77.1859407902146 ,28.643557860380213],
                    [77.174932536347  ,28.64185295523916],
                    [77.17700467825279, 28.64014802238988],
                    [77.18244405075143, 28.636965406939993],
                    [77.18891949420293, 28.634237374004286]         
                ]
                let location = [77.19467788443801, 18.64495244841356];
                assert.equal(isLocationOnPath(location, georoute, false, 30), false);
            });
        });

    });

});