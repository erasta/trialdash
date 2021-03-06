import gql from 'graphql-tag';
import { DEVICE_MUTATION } from '../../../../constants/base';

export default (device) => {
  const key = device.key ? device.key : `${device.experimentId}_${Date.now()}`;

  return gql`mutation {
        ${DEVICE_MUTATION}(
            key: "${key}",
            uid:"${localStorage.getItem('uid')}"
            experimentId:"${device.experimentId}"
            id:"${device.id}"
            name:"${device.name}"
            deviceTypeKey: "${device.deviceTypeKey}"
            properties: ${JSON.stringify(device.properties)
    .replace(/"key":/g, 'key:')
    .replace(/"val":/g, 'val:')
}
            ){
            key
            id
            name
            deviceTypeKey
            properties {
              key
              val
            }
        }
      }`;
};
