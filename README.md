# n8n ServiceDesk Plus Node - Enhanced Integration

[![npm version](https://badge.fury.io/js/n8n-nodes-service-desk-plus.svg)](https://badge.fury.io/js/n8n-nodes-service-desk-plus)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive n8n node for ManageEngine ServiceDesk Plus integration with advanced conversation management, reply functionality, and AI automation capabilities.

## 🚀 Features

### Core Operations
- ✅ **Create Ticket** - Create new service desk tickets
- ✅ **Update Ticket** - Modify existing ticket properties
- ✅ **Get Ticket** - Retrieve detailed ticket information
- ✅ **List Tickets** - Browse tickets with filtering capabilities
- ✅ **Add Reply** - Reply to ticket conversations with advanced targeting
- ✅ **Get Conversations** - Retrieve complete conversation history

### Advanced Reply Features
- 🎯 **Reply to First Message** - Target initial web-created messages
- 🎯 **Reply to Latest Message** - Respond to most recent conversation
- 🎯 **Reply to Specific Message** - Target any message by ID
- 🔒 **Public/Private Replies** - Control reply visibility

### AI Integration
- 🤖 **6 AI-Accessible Tools** for intelligent automation
- 🤖 **Smart Ticket Triage** - AI can categorize and assign tickets
- 🤖 **Automated Status Updates** - AI-driven progress monitoring
- 🤖 **Intelligent Reply Generation** - Context-aware responses

## 📦 Installation

### Prerequisites
- n8n instance (self-hosted or cloud)
- ManageEngine ServiceDesk Plus with API access
- Valid API credentials (Base URL + Auth Token)

### Install via npm
```bash
npm install n8n-nodes-service-desk-plus
```

### Manual Installation
1. Clone this repository
2. Install dependencies: `npm install`
3. Build the node: `npm run build`
4. Link to your n8n installation

## ⚙️ Configuration

### 1. Create ServiceDesk Plus API Credentials

1. Navigate to n8n → Credentials
2. Create new "ServiceDesk Plus API" credential
3. Configure the following:

```json
{
  "baseUrl": "https://your-domain.servicedeskplus.com/api/v3",
  "authToken": "your-api-token-here"
}
```

### 2. Add Node to Workflow

1. Search for "ServiceDesk Plus" in the node palette
2. Drag and drop into your workflow
3. Select your configured credentials
4. Choose your desired operation

## 🎯 Usage Examples

### Create a New Ticket

```json
{
  "operation": "create",
  "subject": "Laptop not starting",
  "description": "User reports laptop won't boot after Windows update",
  "email_id": "user@company.com",
  "service_category": "01. PC/Laptop"
}
```

### Reply to First Message (Web-Created Ticket)

```json
{
  "operation": "addReply",
  "ticketId": "12345",
  "replyContent": "Thank you for reporting this issue. We are investigating and will provide an update within 2 hours.",
  "replyToMessage": "first",
  "isPublic": true
}
```

### Get Ticket Conversations

```json
{
  "operation": "getConversations",
  "ticketId": "12345"
}
```

### List Open Tickets

```json
{
  "operation": "listTickets",
  "limit": 20,
  "statusFilter": "Open"
}
```

## 🤖 AI Automation Examples

### Intelligent Ticket Triage

```javascript
// AI automatically categorizes and responds to new tickets
const ticket = await createServiceDeskTicket({
  subject: "Email not working",
  description: "Cannot send or receive emails since this morning",
  email_id: "user@company.com",
  service_category: "16. IT System and Mail"  // AI determines category
});

// AI provides immediate acknowledgment
const reply = await addReplyToTicket({
  ticketId: ticket.ticketId,
  replyContent: "Thank you for reporting the email issue. Our team is investigating and will provide an update within 2 hours.",
  replyToMessage: "first",
  isPublic: true
});
```

### Automated Status Monitoring

```javascript
// AI monitors and updates ticket progress
const tickets = await listServiceDeskTickets({
  statusFilter: "In Progress",
  limit: 50
});

for (const ticket of tickets.tickets) {
  const conversations = await getTicketConversations({
    ticketId: ticket.id
  });
  
  // AI determines if update is needed
  if (shouldProvideUpdate(conversations)) {
    await addReplyToTicket({
      ticketId: ticket.id,
      replyContent: "Status update: We are still working on your request and expect resolution by end of day.",
      replyToMessage: "latest",
      isPublic: true
    });
  }
}
```

## 📋 Supported Service Categories

The node supports 21 predefined service categories:

1. PC/Laptop
2. Office Application
3. Printer&Scanner
4. IT Peripheral
5. LED Monitor
6. Television
7. Merdeka System Apps
8. File Server
9. Network
10. Radio HT
11. Deskphone
12. Access Card
13. CCTV
14. IT Service Request Form
15. Other
16. IT System and Mail
17. IT Project Related to System
18. IT Project Related to Network
19. Preventive Maintenance Support
20. Preventive Maintenance Network
21. Document Control

## 🔧 API Operations

| Operation | Method | Endpoint | Purpose |
|-----------|--------|----------|----------|
| Create Ticket | POST | `/requests` | Create new ticket |
| Update Ticket | PUT | `/requests/{id}` | Update ticket properties |
| Get Ticket | GET | `/requests/{id}` | Retrieve ticket details |
| List Tickets | GET | `/requests` | List tickets with filters |
| Add Reply | POST | `/requests/{id}/conversations` | Add conversation reply |
| Get Conversations | GET | `/requests/{id}/conversations` | Get ticket conversations |
| Add Resolution | POST | `/requests/{id}/resolutions` | Add ticket resolution |

## 🛠️ Development

### Prerequisites
- Node.js 16+
- TypeScript
- n8n development environment

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/n8n-nodes-service-desk-plus.git
cd n8n-nodes-service-desk-plus

# Install dependencies
npm install

# Build the node
npm run build

# Run type checking
npm run type-check
```

### Project Structure

```
n8n-nodes-service-desk-plus/
├── src/
│   ├── ServiceDeskPlus.node.ts          # Main node implementation
│   ├── ServiceDeskPlus.node.json        # Node metadata
│   ├── credentials/
│   │   └── ServiceDeskPlusApi.credentials.ts  # Credential definition
│   ├── typings/
│   │   └── n8n-extensions.d.ts          # Type definitions
│   └── serviceDeskPlus.svg              # Node icon
├── docs/
│   └── journal.md                       # Development journal
├── package.json
├── tsconfig.json
└── README.md
```

## 🔍 Troubleshooting

### Common Issues

#### Connection Problems
- ✅ Verify base URL format: `https://your-domain.servicedeskplus.com/api/v3`
- ✅ Check API token validity and permissions
- ✅ Ensure network connectivity to ServiceDesk Plus instance

#### Reply Issues
- ✅ Verify ticket exists and is accessible
- ✅ Check conversation history before replying
- ✅ Use "first" or "latest" for automatic message targeting

#### Service Category Errors
- ✅ Use exact category names from the predefined list
- ✅ Check for typos or extra spaces
- ✅ Refer to the supported categories section above

### Error Response Format

All operations return consistent error responses:

```json
{
  "success": false,
  "error": "Detailed error message",
  "operation": "operationName"
}
```

## 📚 Documentation

- [Development Journal](./docs/journal.md) - Detailed development progress and technical notes
- [ManageEngine ServiceDesk Plus API Documentation](https://www.manageengine.com/products/service-desk/sdpod-v3-api/)
- [n8n Node Development Guide](https://docs.n8n.io/integrations/creating-nodes/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain backward compatibility
- Add comprehensive error handling
- Update documentation for new features
- Run `npm run type-check` before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [n8n](https://n8n.io/) - Workflow automation platform
- [ManageEngine ServiceDesk Plus](https://www.manageengine.com/products/service-desk/) - IT service management solution
- Community contributors and testers

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/n8n-nodes-service-desk-plus/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/n8n-nodes-service-desk-plus/discussions)
- 📧 **Email**: support@yourcompany.com

---

**Made with ❤️ for the n8n community**

*Last Updated: August 8, 2025 | Version: 2.0.0 (Enhanced)*