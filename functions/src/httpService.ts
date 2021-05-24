import * as functions from 'firebase-functions';
import { CommandAdmin } from '../../src/interfaces/commandAdmin.interface';
const rest = require("node-fetch");
const version = 'v0.01';

exports.httpsService = functions
.region('southamerica-east1')
.runWith({memory: '128MB', timeoutSeconds: 60})
.https.onCall(async (data, context) => {
    let command = JSON.parse(data.text) as CommandAdmin;
    switch (command.type) {
        case 'update':
            console.log(`Update ${version}: ${command.uidDevice} / ${command.pin} / ${command.value}`);        
            return await rest(`http://blynk-cloud.com/${command.uidDevice}/update/${command.pin}?value=${command.value}`)
            .then(async (response: any) => {
                return await response.json();
            }).catch(async (error: any) => {
                return error;
            });
        case 'get':
            console.log(`Get ${version}: ${command.uidDevice} / ${command.pin}`);        
            return await rest(`http://blynk-cloud.com/${command.uidDevice}/get/${command.pin}`)
            .then(async (response: any) => {
                return await response.json();
            }).catch(async (error: any) => {
                return error;
            });
        default:
            return {
                erro: 'Type invalido'
            };
    }
});