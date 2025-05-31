import toolSchemas from './ServiceDeskPlus.node.json';
//console.log(JSON.stringify(toolSchemas, null, 2));


import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeConnectionType,
  } from 'n8n-workflow';
  import axios from 'axios';
  import * as https from 'https';
  
  export class ServiceDeskPlus implements INodeType {
    description: INodeTypeDescription = {
      displayName: 'ServiceDesk Plus',
      name: 'serviceDeskPlus',
      icon: 'file:serviceDeskPlus.svg',
      group: ['transform'],
      version: 1,
      description: 'Interact with ManageEngine ServiceDesk Plus',
      defaults: {
        name: 'ServiceDeskPlus',
        color: '#3366FF',
      },
      inputs: ['main'],
      outputs: ['main'],
      credentials: [
        {
          name: 'serviceDeskPlusApi',
          required: true,
        },
      ],
      properties: [
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          options: [
            { name: 'Create Ticket', value: 'create' },
            { name: 'Update Ticket', value: 'update' },
          ],
          default: 'create',
          description: 'Operation to perform',
        },
        // Create Ticket fields
        {
          displayName: 'Subject',
          name: 'subject',
          type: 'string',
          default: '',
          required: true,
          displayOptions: { show: { operation: ['create'] } },
        },
        {
          displayName: 'Description',
          name: 'description',
          type: 'string',
          typeOptions: { alwaysOpenEditWindow: true },
          default: '',
          required: true,
          displayOptions: { show: { operation: ['create'] } },
        },
        {
          displayName: 'Requester Email',
          name: 'email_id',
          type: 'string',
          default: '',
          required: true,
          displayOptions: { show: { operation: ['create'] } },
        },
        {
          displayName: 'Service Category',
          name: 'service_category',
          type: 'string',
          default: '',
          required: true,
          displayOptions: { show: { operation: ['create'] } },
          description: 'Category code provided by upstream AI classification',
        },
        // Update Ticket fields
        {
          displayName: 'Ticket ID',
          name: 'ticketId',
          type: 'string',
          default: '',
          required: true,
          displayOptions: { show: { operation: ['update'] } },
        },
        {
          displayName: 'Fields to Update',
          name: 'updateFields',
          type: 'collection',
          placeholder: 'Add Field',
          displayOptions: { show: { operation: ['update'] } },
          default: {},
          options: [
            {
              displayName: 'Service Category',
              name: 'service_category',
              type: 'string',
              default: '',
            },
            {
              displayName: 'Status',
              name: 'status',
              type: 'string',
              default: '',
            },
            {
              displayName: 'Technician Name',
              name: 'technicianName',
              type: 'string',
              default: '',
            },
            {
              displayName: 'ICT Technician',
              name: 'ictTechnician',
              type: 'string',
              default: '',
            },
            {
              displayName: 'Resolution',
              name: 'resolution',
              type: 'string',
              typeOptions: { alwaysOpenEditWindow: true },
              default: '',
            },
            {
              displayName: 'Priority',
              name: 'priority',
              type: 'options',
              options: [
                { name: 'Low', value: 'Low' },
                { name: 'Medium', value: 'Medium' },
                { name: 'High', value: 'High' },
              ],
              default: 'Low',
            },
          ],
        },
      ],
      usableAsTool: true,
      tools: [
        {
          name:        'createServiceDeskTicket',
          displayName: 'Create Ticket',
          description: 'Create a new ticket in ServiceDesk Plus',
          parameters: {
            type: 'object',
            properties: {
              subject:          { type: 'string', description: 'Ticket subject' },
              description:      { type: 'string', description: 'Detailed description' },
              email_id:         { type: 'string', description: 'Requester email' },
              service_category: {
                type: 'string',
                description: 'Service category code',
                enum: [
                  '01. PC/Laptop',
                  '02. Office Application',
                  '03. Printer&Scanner',
                  '04. IT Peripheral',
                  '05. LED Monitor',
                  '06. Television',
                  '07. Merdeka System Apps',
                  '08. File Server',
                  '09. Network',
                  '10. Radio HT',
                  '11. Deskphone',
                  '12. Access Card',
                  '13. CCTV',
                  '14. IT Service Request Form',
                  '15. Other',
                  '16. IT System and Mail',
                  '17. IT Project Related to System',
                  '18. IT Project Related to Network',
                  '19. Preventive Maintenance Support',
                  '20. Preventive Maintenance Network',
                  '21. Document Control',
                ],
              },
            },
            required: ['subject','description','email_id','service_category'],
          },
        },
        {
          name:        'updateServiceDeskTicket',
          displayName: 'Update Ticket',
          description: 'Update an existing ticket in ServiceDesk Plus',
          parameters: {
            type: 'object',
            properties: {
              ticketId:     { type: 'string', description: 'ID of ticket' },
              updateFields: {
                type: 'object',
                properties: {
                  service_category: {
                    type: 'string',
                    enum: [
                        '01. PC/Laptop',
                        '02. Office Application',
                        '03. Printer&Scanner',
                        '04. IT Peripheral',
                        '05. LED Monitor',
                        '06. Television',
                        '07. Merdeka System Apps',
                        '08. File Server',
                        '09. Network',
                        '10. Radio HT',
                        '11. Deskphone',
                        '12. Access Card',
                        '13. CCTV',
                        '14. IT Service Request Form',
                        '15. Other',
                        '16. IT System and Mail',
                        '17. IT Project Related to System',
                        '18. IT Project Related to Network',
                        '19. Preventive Maintenance Support',
                        '20. Preventive Maintenance Network',
                        '21. Document Control',
                    ]
                  },
                status: {
                    type: 'string',
                    description: 'Ticket status',
                    enum: [
                        'Assigned',
                        'Closed',
                        'In Progress',
                        'On Order',
                        'Onhold',
                        'Open',
                        'Resolved'
                    ],
                    },
                  technicianName: { type: 'string' },
                  resolution:     { type: 'string' },
                  priority: {
                    type: 'string',
                    enum: ['Low','Medium','High'],
                  },
                },
                required: ['service_category'],
              },
            },
            required: ['ticketId','updateFields'],
          },
        },
      ],
         
    };
  
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
      // Retrieve credentials (async in newer n8n versions)
      const credentials = (await this.getCredentials(
        'serviceDeskPlusApi',
      )) as {
        baseUrl: string;
        authToken: string;
      };
      const baseUrl = credentials.baseUrl;
      const authToken = credentials.authToken;
  
      const items = this.getInputData();
      const returnData: INodeExecutionData[] = [];
  
      const agent = new https.Agent({ rejectUnauthorized: false });
      const headers = {
        authtoken: authToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      };
  
      for (let i = 0; i < items.length; i++) {
        const operation = this.getNodeParameter('operation', i) as string;
  
        if (operation === 'create') {
          const subject = this.getNodeParameter('subject', i) as string;
          const description =
            this.getNodeParameter('description', i) as string;
          const emailId = this.getNodeParameter('email_id', i) as string;
          const serviceCategory =
            this.getNodeParameter('service_category',
            i) as string;
  
          const inputData = {
            request: {
              subject,
              description,
              requester: { email_id: emailId },
              status: { name: 'Open' },
              priority: { name: 'Low' },
              template: {
                is_service_template: false,
                name: 'Submit a New Request',
                id: '305',
              },
              service_category: { name: serviceCategory },
            },
          };
          const payload =
            `input_data=${encodeURIComponent(
              JSON.stringify(inputData),
            )}`;
  
          try {
            const response = await axios.post(
              `${baseUrl}/requests`,
              payload,
              { headers, httpsAgent: agent },
            );
            const ticketId = response.data.request.id;
            returnData.push({
              json: { success: true, ticketId },
            });
          } catch (error: any) {
            returnData.push({
              json: {
                success: false,
                error: error.message || error.toString(),
              },
            });
          }
        } else {
          // update
          const ticketId = this.getNodeParameter(
            'ticketId',
            i,
          ) as string;
          const updateFields = this.getNodeParameter(
            'updateFields',
            i,
          ) as any;
  
          const updateData: any = { request: {} };
          if (updateFields.service_category) {
            updateData.request.service_category = {
              name: updateFields.service_category,
            };
          }
          if (updateFields.status) {
            updateData.request.status = {
              name: updateFields.status,
            };
          }
          if (updateFields.technicianName) {
            updateData.request.technician = {
              name: updateFields.technicianName,
            };
          }
          if (updateFields.priority) {
            updateData.request.priority = {
              name: updateFields.priority,
            };
          }
          if (updateFields.ictTechnician) {
            updateData.request.udf_fields = {
                udf_pick_601: updateFields.ictTechnician,
              };
          }
  
          const payload =
            `input_data=${encodeURIComponent(
              JSON.stringify(updateData),
            )}`;
  
          try {
            await axios.put(
              `${baseUrl}/requests/${ticketId}`,
              payload,
              { headers, httpsAgent: agent },
            );
            if (updateFields.resolution) {
              const resData = {
                resolution: { content: updateFields.resolution },
              };
              const resPayload =
                `input_data=${encodeURIComponent(
                  JSON.stringify(resData),
                )}`;
              await axios.post(
                `${baseUrl}/requests/${ticketId}/resolutions`,
                resPayload,
                { headers, httpsAgent: agent },
              );
            }
            returnData.push({
              json: { success: true, ticketId },
            });
          } catch (error: any) {
            returnData.push({
              json: {
                success: false,
                error: error.message || error.toString(),
              },
            });
          }
        }
      }
  
      // Return single array of item data
      return this.prepareOutputData(returnData);
    }
  }
  