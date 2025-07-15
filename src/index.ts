#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { tools } from './tools.js';

const server = new Server(
  {
    name: 'alphavantage-mcp-server',
    version: '1.0.0',
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.entries(tools).map(([name, tool]) => {
      const shape = tool.parameters._def.shape();
      const properties: any = {};
      const required: string[] = [];

      Object.entries(shape).forEach(([key, schema]: [string, any]) => {
        const type = schema._def.typeName;
        if (type === 'ZodString') {
          properties[key] = { type: 'string' };
        } else if (type === 'ZodNumber') {
          properties[key] = { type: 'number' };
        } else if (type === 'ZodArray') {
          properties[key] = { type: 'array' };
        } else if (type === 'ZodEnum') {
          properties[key] = { type: 'string', enum: schema._def.values };
        } else if (type === 'ZodDefault') {
          properties[key] = { type: 'string' };
        } else {
          properties[key] = { type: 'string' };
        }

        if (!schema.isOptional) {
          required.push(key);
        }
      });

      return {
        name,
        description: tool.description,
        inputSchema: {
          type: 'object',
          properties,
          required,
        },
      };
    }),
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools[request.params.name as keyof typeof tools];
  
  if (!tool) {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  try {
    const args = tool.parameters.parse(request.params.arguments);
    const result = await tool.execute(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Tool execution failed: ${error.message}`);
    }
    throw new Error('Tool execution failed with unknown error');
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Check if this file is being run directly
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));

if (isMainModule) {
  main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}