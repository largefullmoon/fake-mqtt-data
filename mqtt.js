const mqtt = require('mqtt');
const hostFac = "185.61.139.41"
const hostLab = "98.46.166.159"
const mqtt_options = {
  username: "",
  password: "",
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
  keepalive: 10
}
// Define the MQTT settings  
const positionTopic = 'silabs/aoa/position/';
const manufTopic = 'fam/manuf_data/';
const angelTopic = 'silabs/aoa/angle/';

// Create an MQTT client  
const clientFac = mqtt.connect('mqtt://' + hostFac, this.mqtt_options);
const clientLab = mqtt.connect('mqtt://' + hostLab, this.mqtt_options);

const antennas = [
  "ble-pd-0C4314F46D53",
  "ble-pd-0C4314F46D0D",
  "ble-pd-0C4314F46CFB",
  "ble-pd-0C4314F46C91",
  "ble-pd-0C4314F46C4F",
  "ble-pd-0C4314F4692A",
]

const tags = [
  'ble-pd-0C4314AAAAA',
  'ble-pd-0C4314BBBBB',
  'ble-pd-0C4314CCCCC',
  'ble-pd-0C4314DDDDD',
  'ble-pd-60A423EEEEE',
  'ble-pd-0C4314FFFFF',
  'ble-pd-0C4314GGGGG',
  'ble-pd-0C4314HHHHH',
  'ble-pd-0C4314IIIII'
];

// Connect to the broker  
clientFac.on('connect', () => {
  // Publish data every second  
  setInterval(() => {
    // Create a message to publish 
    tags.forEach(tag => {
      const position_data = {
        x: 1 + Math.random() * (50 - 10),
        x_stdev: 1 + Math.random() * (50 - 10),
        y: 1 + Math.random() * (30 - 10),
        y_stdev: 1 + Math.random() * (30 - 10),
        z: 3 + Math.random() * (50 - 20),
        z_stdev: 3 + Math.random() * (50 - 20),
      }
      const messagePosition = JSON.stringify(position_data); // Convert data to JSON string  
      clientFac.publish(positionTopic + "factory" + "/" + tag, messagePosition, (error) => {
        if (error) {
          console.error('Publish error:', error);
        } else {
          console.log(`Published: ${messagePosition}`);
        }
      });
    })
    antennas.forEach(antenna => {
      tags.forEach((tag) => {
        const randomValue = 2.5 + Math.random() * (2.9 - 2.5);
        const manuf_data = {
          movement_status: 0,
          vbatt: randomValue,
          tx_power: 10,
          ext_adc: 0.3
        }
        const messageManuf = JSON.stringify(manuf_data); // Convert data to JSON string  
        clientFac.publish(manufTopic + antenna + "/" + tag, messageManuf, (error) => {
          if (error) {
            console.error('Publish error:', error);
          } else {
            console.log(`Published: ${messageManuf}`);
          }
        });
        const aoa_data = {
          azimuth: 10 + Math.random() * (11 - 10),
          azimuth_stdev: 25 + Math.random() * (40 - 25),
          elevation: 35 + Math.random() * (40 - 35),
          elevation_stdev: 10 + Math.random() * (20 - 10),
          distance: 27 + Math.random() * (40 - 27),
          distance_stdev: 0,
          sequence: 25384 + Math.random() * (25500 - 25384),
        }
        const messageAoa = JSON.stringify(aoa_data); // Convert data to JSON string  
        clientFac.publish(angelTopic + antenna + "/" + tag, messageAoa, (error) => {
          if (error) {
            console.error('Publish error:', error);
          } else {
            console.log(`Published: ${messageAoa}`);
          }
        });
      })
    });
  }, 10 * 1000);
});

// Connect to the broker  
// clientLab.on('connect', () => {
//   // Publish data every second  
//   setInterval(() => {
//     // Create a message to publish 
//     tags.forEach(tag => {
//       const position_data = {
//         x: 1 + Math.random() * (50 - 1),
//         x_stdev: 1 + Math.random() * (50 - 1),
//         y: 1 + Math.random() * (50 - 1),
//         y_stdev: 1 + Math.random() * (50 - 1),
//         z: 1 + Math.random() * (50 - 1),
//         z_stdev: 1 + Math.random() * (50 - 1),
//       }
//       const messagePosition = JSON.stringify(position_data); // Convert data to JSON string  
//       clientLab.publish(positionTopic + "lab" + "/" + tag, messagePosition, (error) => {
//         if (error) {
//           console.error('Publish error:', error);
//         } else {
//           console.log(`Published: ${messagePosition}`);
//         }
//       });
//     })
//     antennas.forEach(antenna => {
//       tags.forEach((tag) => {
//         const randomValue = 2.5 + Math.random() * (2.9 - 2.5);
//         const manuf_data = {
//           movement_status: 0,
//           vbatt: randomValue,
//           tx_power: 10,
//           ext_adc: 0.3
//         }
//         const messageManuf = JSON.stringify(manuf_data); // Convert data to JSON string  
//         clientLab.publish(manufTopic + antenna + "/" + tag, messageManuf, (error) => {
//           if (error) {
//             console.error('Publish error:', error);
//           } else {
//             console.log(`Published: ${messageManuf}`);
//           }
//         });
//         const aoa_data = {
//           azimuth: 10 + Math.random() * (11 - 10),
//           azimuth_stdev: 25 + Math.random() * (40 - 25),
//           elevation: 35 + Math.random() * (40 - 35),
//           elevation_stdev: 10 + Math.random() * (20 - 10),
//           distance: 27 + Math.random() * (40 - 27),
//           distance_stdev: 0,
//           sequence: 25384 + Math.random() * (25500 - 25384),
//         }
//         const messageAoa = JSON.stringify(aoa_data); // Convert data to JSON string  
//         clientLab.publish(angelTopic + antenna + "/" + tag, messageAoa, (error) => {
//           if (error) {
//             console.error('Publish error:', error);
//           } else {
//             console.log(`Published: ${messageAoa}`);
//           }
//         });
//       })
//     });
//   }, 1000);
// });

process.on('SIGINT', () => {
  clientLab.end(() => {
    console.log('Disconnected from MQTT broker');
    process.exit(0);
  });
  clientFac.end(() => {
    console.log('Disconnected from MQTT broker');
    process.exit(0);
  });
});