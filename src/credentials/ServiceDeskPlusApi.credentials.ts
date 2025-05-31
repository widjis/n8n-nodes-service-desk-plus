import {
    ICredentialType,
    INodeProperties,
  } from 'n8n-workflow';
  
  export class ServiceDeskPlusApi implements ICredentialType {
    name = 'serviceDeskPlusApi';
    displayName = 'ServiceDesk Plus API';
    documentationUrl = 'https://www.manageengine.com/products/service-desk/';
    properties: INodeProperties[] = [
      {
        displayName: 'Base URL',
        name: 'baseUrl',
        type: 'string',
        default: 'https://helpdesk.merdekabattery.com:8080/api/v3',
        placeholder: 'https://your-instance.domain.com:8080/api/v3',
        description: 'Your ServiceDesk Plus API base URL (include `/api/v3`)',
      },
      {
        displayName: 'Auth Token',
        name: 'authToken',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        description: 'Your ServiceDesk Plus authtoken (see your user profile in SD+)',
      },
    ];
  }
  