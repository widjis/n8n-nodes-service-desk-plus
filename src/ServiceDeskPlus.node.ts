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
      inputs: [NodeConnectionType.Main],
      outputs: [NodeConnectionType.Main],
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
            { name: 'Add Reply', value: 'addReply' },
            { name: 'Get Ticket', value: 'getTicket' },
            { name: 'List Tickets', value: 'listTickets' },
            { name: 'Get Conversations', value: 'getConversations' },
            { name: 'Upload Attachment', value: 'uploadAttachment' },
            { name: 'Download Attachment', value: 'downloadAttachment' },
            { name: 'List Attachments', value: 'listAttachments' },
            { name: 'Delete Attachment', value: 'deleteAttachment' },
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
        // Add Reply fields
        {
          displayName: 'Ticket ID',
          name: 'ticketId',
          type: 'string',
          default: '',
          required: true,
          displayOptions: { show: { operation: ['addReply', 'getTicket', 'getConversations'] } },
        },
        {
          displayName: 'Reply Content',
          name: 'replyContent',
          type: 'string',
          typeOptions: { alwaysOpenEditWindow: true },
          default: '',
          required: true,
          displayOptions: { show: { operation: ['addReply'] } },
          description: 'Content of the reply message',
        },
        {
          displayName: 'Reply to Message',
          name: 'replyToMessage',
          type: 'options',
          options: [
            { name: 'First Message', value: 'first' },
            { name: 'Latest Message', value: 'latest' },
            { name: 'Specific Message ID', value: 'specific' },
          ],
          default: 'first',
          displayOptions: { show: { operation: ['addReply'] } },
          description: 'Which message to reply to',
        },
        {
          displayName: 'Message ID',
          name: 'messageId',
          type: 'string',
          default: '',
          required: true,
          displayOptions: { show: { operation: ['addReply'], replyToMessage: ['specific'] } },
          description: 'Specific message ID to reply to',
        },
        {
          displayName: 'Is Public Reply',
          name: 'isPublic',
          type: 'boolean',
          default: true,
          displayOptions: { show: { operation: ['addReply'] } },
          description: 'Whether the reply is visible to the requester',
        },
        // List Tickets fields
        {
          displayName: 'Limit',
          name: 'limit',
          type: 'number',
          default: 10,
          displayOptions: { show: { operation: ['listTickets'] } },
          description: 'Maximum number of tickets to return',
        },
        {
          displayName: 'Status Filter',
          name: 'statusFilter',
          type: 'options',
          options: [
            { name: 'All', value: '' },
            { name: 'Open', value: 'Open' },
            { name: 'In Progress', value: 'In Progress' },
            { name: 'Resolved', value: 'Resolved' },
            { name: 'Closed', value: 'Closed' },
          ],
          default: '',
          displayOptions: { show: { operation: ['listTickets'] } },
          description: 'Filter tickets by status',
        },
        // Update Ticket fields
        {
          displayName: 'Ticket ID',
          name: 'updateTicketId',
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
        // Attachment Management Properties
        {
          displayName: 'Ticket ID',
          name: 'attachmentTicketId',
          type: 'string',
          default: '',
          required: true,
          displayOptions: { show: { operation: ['uploadAttachment', 'downloadAttachment', 'listAttachments'] } },
          description: 'ID of the ticket to manage attachments for',
        },
        {
          displayName: 'File Path',
          name: 'filePath',
          type: 'string',
          default: '',
          required: true,
          displayOptions: { show: { operation: ['uploadAttachment'] } },
          description: 'Path to the file to upload',
        },
        {
          displayName: 'File Description',
          name: 'fileDescription',
          type: 'string',
          default: '',
          displayOptions: { show: { operation: ['uploadAttachment'] } },
          description: 'Optional description for the uploaded file',
        },
        {
          displayName: 'Attachment ID',
          name: 'attachmentId',
          type: 'string',
          default: '',
          required: true,
          displayOptions: { show: { operation: ['downloadAttachment', 'deleteAttachment'] } },
          description: 'ID of the attachment to download or delete',
        },
        {
          displayName: 'Download Path',
          name: 'downloadPath',
          type: 'string',
          default: '',
          displayOptions: { show: { operation: ['downloadAttachment'] } },
          description: 'Path where to save the downloaded file (optional)',
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
        {
          name: 'addReplyToTicket',
          displayName: 'Add Reply to Ticket',
          description: 'Add a reply to an existing ticket conversation',
          parameters: {
            type: 'object',
            properties: {
              ticketId: { type: 'string', description: 'ID of the ticket to reply to' },
              replyContent: { type: 'string', description: 'Content of the reply message' },
              replyToMessage: {
                type: 'string',
                enum: ['first', 'latest', 'specific'],
                description: 'Which message to reply to',
                default: 'first'
              },
              messageId: { type: 'string', description: 'Specific message ID (required if replyToMessage is "specific")' },
              isPublic: { type: 'boolean', description: 'Whether reply is visible to requester', default: true }
            },
            required: ['ticketId', 'replyContent']
          }
        },
        {
          name: 'getTicketDetails',
          displayName: 'Get Ticket Details',
          description: 'Retrieve detailed information about a specific ticket',
          parameters: {
            type: 'object',
            properties: {
              ticketId: { type: 'string', description: 'ID of the ticket to retrieve' }
            },
            required: ['ticketId']
          }
        },
        {
          name: 'listServiceDeskTickets',
          displayName: 'List Tickets',
          description: 'List tickets with optional filtering',
          parameters: {
            type: 'object',
            properties: {
              limit: { type: 'number', description: 'Maximum number of tickets to return', default: 10 },
              statusFilter: {
                type: 'string',
                enum: ['', 'Open', 'In Progress', 'Resolved', 'Closed'],
                description: 'Filter tickets by status'
              }
            }
          }
        },
        {
          name: 'getTicketConversations',
          displayName: 'Get Ticket Conversations',
          description: 'Retrieve all conversations/messages for a ticket',
          parameters: {
            type: 'object',
            properties: {
              ticketId: { type: 'string', description: 'ID of the ticket' }
            },
            required: ['ticketId']
          }
        },
        {
          name: 'uploadAttachment',
          displayName: 'Upload Attachment',
          description: 'Upload a file attachment to a ticket',
          parameters: {
            type: 'object',
            properties: {
              ticketId: { type: 'string', description: 'ID of the ticket to attach file to' },
              filePath: { type: 'string', description: 'Path to the file to upload' },
              fileDescription: { type: 'string', description: 'Optional description for the file' }
            },
            required: ['ticketId', 'filePath']
          }
        },
        {
          name: 'downloadAttachment',
          displayName: 'Download Attachment',
          description: 'Download an attachment from a ticket',
          parameters: {
            type: 'object',
            properties: {
              ticketId: { type: 'string', description: 'ID of the ticket' },
              attachmentId: { type: 'string', description: 'ID of the attachment to download' },
              downloadPath: { type: 'string', description: 'Optional path to save the file' }
            },
            required: ['ticketId', 'attachmentId']
          }
        },
        {
          name: 'listAttachments',
          displayName: 'List Attachments',
          description: 'List all attachments for a ticket',
          parameters: {
            type: 'object',
            properties: {
              ticketId: { type: 'string', description: 'ID of the ticket' }
            },
            required: ['ticketId']
          }
        },
        {
          name: 'deleteAttachment',
          displayName: 'Delete Attachment',
          description: 'Delete an attachment from a ticket',
          parameters: {
            type: 'object',
            properties: {
              ticketId: { type: 'string', description: 'ID of the ticket' },
              attachmentId: { type: 'string', description: 'ID of the attachment to delete' }
            },
            required: ['ticketId', 'attachmentId']
          }
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
        } else if (operation === 'update') {
          // update
          const ticketId = this.getNodeParameter(
            'updateTicketId',
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
        } else if (operation === 'addReply') {
          // Add reply to ticket
          const ticketId = this.getNodeParameter('ticketId', i) as string;
          const replyContent = this.getNodeParameter('replyContent', i) as string;
          const replyToMessage = this.getNodeParameter('replyToMessage', i) as string;
          const isPublic = this.getNodeParameter('isPublic', i) as boolean;
          
          try {
            // First get conversations to find the target message
            const conversationsResponse = await axios.get(
              `${baseUrl}/requests/${ticketId}/conversations`,
              { headers, httpsAgent: agent }
            );
            
            const conversations = conversationsResponse.data.conversations || [];
            let targetMessageId = null;
            
            if (replyToMessage === 'first' && conversations.length > 0) {
              targetMessageId = conversations[0].id;
            } else if (replyToMessage === 'latest' && conversations.length > 0) {
              targetMessageId = conversations[conversations.length - 1].id;
            } else if (replyToMessage === 'specific') {
              targetMessageId = this.getNodeParameter('messageId', i) as string;
            }
            
            // Add reply
            const replyData = {
              reply: {
                description: replyContent,
                is_public: isPublic,
                ...(targetMessageId && { in_reply_to: targetMessageId })
              }
            };
            
            const replyPayload = `input_data=${encodeURIComponent(JSON.stringify(replyData))}`;
            
            const replyResponse = await axios.post(
              `${baseUrl}/requests/${ticketId}/conversations`,
              replyPayload,
              { headers, httpsAgent: agent }
            );
            
            returnData.push({
              json: {
                success: true,
                ticketId,
                replyId: replyResponse.data.conversation?.id,
                targetMessageId
              }
            });
          } catch (error: any) {
            returnData.push({
              json: {
                success: false,
                error: error.message || error.toString(),
              },
            });
          }
        } else if (operation === 'getTicket') {
          // Get ticket details
          const ticketId = this.getNodeParameter('ticketId', i) as string;
          
          try {
            const response = await axios.get(
              `${baseUrl}/requests/${ticketId}`,
              { headers, httpsAgent: agent }
            );
            
            returnData.push({
              json: {
                success: true,
                ticket: response.data.request
              }
            });
          } catch (error: any) {
            returnData.push({
              json: {
                success: false,
                error: error.message || error.toString(),
              },
            });
          }
        } else if (operation === 'listTickets') {
          // List tickets
          const limit = this.getNodeParameter('limit', i) as number;
          const statusFilter = this.getNodeParameter('statusFilter', i) as string;
          
          try {
            let url = `${baseUrl}/requests?limit=${limit}`;
            if (statusFilter) {
              url += `&status=${encodeURIComponent(statusFilter)}`;
            }
            
            const response = await axios.get(url, { headers, httpsAgent: agent });
            
            returnData.push({
              json: {
                success: true,
                tickets: response.data.requests || [],
                count: response.data.requests?.length || 0
              }
            });
          } catch (error: any) {
            returnData.push({
              json: {
                success: false,
                error: error.message || error.toString(),
              },
            });
          }
        } else if (operation === 'getConversations') {
          // Get ticket conversations
          const ticketId = this.getNodeParameter('ticketId', i) as string;
          
          try {
            const response = await axios.get(
              `${baseUrl}/requests/${ticketId}/conversations`,
              { headers, httpsAgent: agent }
            );
            
            returnData.push({
              json: {
                success: true,
                ticketId,
                conversations: response.data.conversations || []
              }
            });
          } catch (error: any) {
            returnData.push({
              json: {
                success: false,
                error: error.message || error.toString(),
              },
            });
          }
        } else if (operation === 'uploadAttachment') {
          // Upload attachment to ticket
          const ticketId = this.getNodeParameter('attachmentTicketId', i) as string;
          const filePath = this.getNodeParameter('filePath', i) as string;
          const fileDescription = this.getNodeParameter('fileDescription', i) as string;
          
          try {
            const FormData = require('form-data');
            const fs = require('fs');
            const path = require('path');
            
            const form = new FormData();
            form.append('file', fs.createReadStream(filePath));
            if (fileDescription) {
              form.append('description', fileDescription);
            }
            
            const uploadHeaders = {
              ...headers,
              ...form.getHeaders(),
            };
            delete uploadHeaders['Content-Type'];
            
            const response = await axios.post(
              `${baseUrl}/requests/${ticketId}/attachments`,
              form,
              { headers: uploadHeaders, httpsAgent: agent }
            );
            
            returnData.push({
              json: {
                success: true,
                ticketId,
                attachmentId: response.data.attachment?.id,
                fileName: path.basename(filePath),
                message: 'File uploaded successfully'
              }
            });
          } catch (error: any) {
            returnData.push({
              json: {
                success: false,
                error: error.message || error.toString(),
              },
            });
          }
        } else if (operation === 'downloadAttachment') {
          // Download attachment from ticket
          const ticketId = this.getNodeParameter('attachmentTicketId', i) as string;
          const attachmentId = this.getNodeParameter('attachmentId', i) as string;
          const downloadPath = this.getNodeParameter('downloadPath', i) as string;
          
          try {
            const response = await axios.get(
              `${baseUrl}/requests/${ticketId}/attachments/${attachmentId}`,
              { 
                headers, 
                httpsAgent: agent,
                responseType: 'stream'
              }
            );
            
            if (downloadPath) {
              const fs = require('fs');
              const writer = fs.createWriteStream(downloadPath);
              response.data.pipe(writer);
              
              await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
              });
              
              returnData.push({
                json: {
                  success: true,
                  ticketId,
                  attachmentId,
                  downloadPath,
                  message: 'File downloaded successfully'
                }
              });
            } else {
              // Return file data as base64
              const chunks: any[] = [];
              response.data.on('data', (chunk: any) => chunks.push(chunk));
              
              await new Promise((resolve, reject) => {
                response.data.on('end', resolve);
                response.data.on('error', reject);
              });
              
              const buffer = Buffer.concat(chunks);
              const base64Data = buffer.toString('base64');
              
              returnData.push({
                json: {
                  success: true,
                  ticketId,
                  attachmentId,
                  fileData: base64Data,
                  message: 'File data retrieved successfully'
                }
              });
            }
          } catch (error: any) {
            returnData.push({
              json: {
                success: false,
                error: error.message || error.toString(),
              },
            });
          }
        } else if (operation === 'listAttachments') {
          // List attachments for ticket
          const ticketId = this.getNodeParameter('attachmentTicketId', i) as string;
          
          try {
            const response = await axios.get(
              `${baseUrl}/requests/${ticketId}/attachments`,
              { headers, httpsAgent: agent }
            );
            
            returnData.push({
              json: {
                success: true,
                ticketId,
                attachments: response.data.attachments || [],
                count: response.data.attachments?.length || 0
              }
            });
          } catch (error: any) {
            returnData.push({
              json: {
                success: false,
                error: error.message || error.toString(),
              },
            });
          }
        } else if (operation === 'deleteAttachment') {
          // Delete attachment from ticket
          const ticketId = this.getNodeParameter('attachmentTicketId', i) as string;
          const attachmentId = this.getNodeParameter('attachmentId', i) as string;
          
          try {
            await axios.delete(
              `${baseUrl}/requests/${ticketId}/attachments/${attachmentId}`,
              { headers, httpsAgent: agent }
            );
            
            returnData.push({
              json: {
                success: true,
                ticketId,
                attachmentId,
                message: 'Attachment deleted successfully'
              }
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
  