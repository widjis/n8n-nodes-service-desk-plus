import 'n8n-workflow';

declare module 'n8n-workflow' {
  interface INodeTypeDescription {
    /**
     * The AI Agent “tools” this node exposes
     */
    tools?: Array<{
      name:        string;
      displayName: string;
      description: string;
      parameters?: object;
    }>;
  }
}
