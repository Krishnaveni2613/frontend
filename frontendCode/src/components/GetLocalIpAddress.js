// const os = require('os');

// const getLocalIPAddress = () => {
//    const networkInterfaces = os.networkInterfaces();
  
//    for (const interfaceName in networkInterfaces) {
//      const networkInterface = networkInterfaces[interfaceName];

//     for (const interfaceInfo of networkInterface) {
//        if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
//          return interfaceInfo.address;
//       }     }
// }
//   return '172.20.10.13'; // Fallback to localhost if no IP found
// };

// export const localIP = getLocalIPAddress();
export const localIP = 'localhost';

console.log('Local IP Address:', localIP);
