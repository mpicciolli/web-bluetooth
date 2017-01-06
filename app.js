/**
 * Created by mpicciolli on 06/01/2017.
 */

var scanBtn = document.getElementById("scanBtn");

scanBtn.addEventListener('click', function (event) {
    // Call navigator.bluetooth.requestDevice

    navigator.bluetooth.requestDevice({filters: [{services: ['battery_service']}]})
        .then(device => device.gatt.connect())
        .then(server => {
            // Getting Battery Service...
            return server.getPrimaryService('battery_service');
        })
        .then(service => {
            // Getting Battery Level Characteristic...
            return service.getCharacteristic('battery_level');
        })
        .then(characteristic => {
            // Reading Battery Level...
            return characteristic.readValue();
        })
        .then(value => {
            console.log('Battery percentage is ' + value.getUint8(0));
        })
        .catch(error => {
            console.log(error);
        });
});
