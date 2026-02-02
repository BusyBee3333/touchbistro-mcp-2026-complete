#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================
// CONFIGURATION
// ============================================
const MCP_NAME = "touchbistro";
const MCP_VERSION = "1.0.0";
const API_BASE_URL = "https://cloud.touchbistro.com/api/v1";

// ============================================
// API CLIENT
// ============================================
class TouchBistroClient {
  private apiKey: string;
  private venueId: string;
  private baseUrl: string;

  constructor(apiKey: string, venueId: string) {
    this.apiKey = apiKey;
    this.venueId = venueId;
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "X-Venue-Id": this.venueId,
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TouchBistro API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // Orders
  async listOrders(params: { 
    page?: number; 
    pageSize?: number; 
    status?: string;
    orderType?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("pageSize", params.pageSize.toString());
    if (params.status) query.append("status", params.status);
    if (params.orderType) query.append("orderType", params.orderType);
    if (params.startDate) query.append("startDate", params.startDate);
    if (params.endDate) query.append("endDate", params.endDate);
    return this.get(`/orders?${query.toString()}`);
  }

  async getOrder(id: string) {
    return this.get(`/orders/${id}`);
  }

  // Menu Items
  async listMenuItems(params: { 
    page?: number; 
    pageSize?: number; 
    categoryId?: string;
    active?: boolean;
  }) {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("pageSize", params.pageSize.toString());
    if (params.categoryId) query.append("categoryId", params.categoryId);
    if (params.active !== undefined) query.append("active", params.active.toString());
    return this.get(`/menu/items?${query.toString()}`);
  }

  // Reservations
  async listReservations(params: { 
    page?: number; 
    pageSize?: number; 
    date?: string;
    status?: string;
    partySize?: number;
  }) {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("pageSize", params.pageSize.toString());
    if (params.date) query.append("date", params.date);
    if (params.status) query.append("status", params.status);
    if (params.partySize) query.append("partySize", params.partySize.toString());
    return this.get(`/reservations?${query.toString()}`);
  }

  async createReservation(data: {
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    partySize: number;
    date: string;
    time: string;
    tableId?: string;
    notes?: string;
    source?: string;
  }) {
    return this.post("/reservations", data);
  }

  // Staff
  async listStaff(params: { 
    page?: number; 
    pageSize?: number; 
    role?: string;
    active?: boolean;
  }) {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("pageSize", params.pageSize.toString());
    if (params.role) query.append("role", params.role);
    if (params.active !== undefined) query.append("active", params.active.toString());
    return this.get(`/staff?${query.toString()}`);
  }

  // Reports
  async getSalesReport(params: { 
    startDate: string;
    endDate: string;
    groupBy?: string;
    includeVoids?: boolean;
    includeRefunds?: boolean;
  }) {
    const query = new URLSearchParams();
    query.append("startDate", params.startDate);
    query.append("endDate", params.endDate);
    if (params.groupBy) query.append("groupBy", params.groupBy);
    if (params.includeVoids !== undefined) query.append("includeVoids", params.includeVoids.toString());
    if (params.includeRefunds !== undefined) query.append("includeRefunds", params.includeRefunds.toString());
    return this.get(`/reports/sales?${query.toString()}`);
  }
}

// ============================================
// TOOL DEFINITIONS
// ============================================
const tools = [
  {
    name: "list_orders",
    description: "List orders from TouchBistro POS. Filter by status, order type, and date range.",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number for pagination (default: 1)" },
        pageSize: { type: "number", description: "Number of results per page (default: 25, max: 100)" },
        status: { 
          type: "string", 
          description: "Filter by order status",
          enum: ["open", "closed", "voided", "refunded"]
        },
        orderType: { 
          type: "string", 
          description: "Filter by order type",
          enum: ["dine_in", "takeout", "delivery", "bar"]
        },
        startDate: { type: "string", description: "Filter by order date (start) in YYYY-MM-DD format" },
        endDate: { type: "string", description: "Filter by order date (end) in YYYY-MM-DD format" },
      },
    },
  },
  {
    name: "get_order",
    description: "Get detailed information about a specific order by ID, including all items, modifiers, payments, and discounts",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "The order ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_menu_items",
    description: "List menu items from TouchBistro. Get all items available for ordering.",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number for pagination" },
        pageSize: { type: "number", description: "Number of results per page (max: 100)" },
        categoryId: { type: "string", description: "Filter by menu category ID" },
        active: { type: "boolean", description: "Filter by active status (true = available for ordering)" },
      },
    },
  },
  {
    name: "list_reservations",
    description: "List reservations from TouchBistro",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number for pagination" },
        pageSize: { type: "number", description: "Number of results per page (max: 100)" },
        date: { type: "string", description: "Filter by reservation date in YYYY-MM-DD format" },
        status: { 
          type: "string", 
          description: "Filter by reservation status",
          enum: ["pending", "confirmed", "seated", "completed", "cancelled", "no_show"]
        },
        partySize: { type: "number", description: "Filter by party size" },
      },
    },
  },
  {
    name: "create_reservation",
    description: "Create a new reservation in TouchBistro",
    inputSchema: {
      type: "object" as const,
      properties: {
        customerName: { type: "string", description: "Customer name (required)" },
        customerPhone: { type: "string", description: "Customer phone number" },
        customerEmail: { type: "string", description: "Customer email address" },
        partySize: { type: "number", description: "Number of guests (required)" },
        date: { type: "string", description: "Reservation date in YYYY-MM-DD format (required)" },
        time: { type: "string", description: "Reservation time in HH:MM format (required)" },
        tableId: { type: "string", description: "Specific table ID to reserve" },
        notes: { type: "string", description: "Special requests or notes" },
        source: { 
          type: "string", 
          description: "Reservation source",
          enum: ["phone", "walk_in", "online", "third_party"]
        },
      },
      required: ["customerName", "partySize", "date", "time"],
    },
  },
  {
    name: "list_staff",
    description: "List staff members from TouchBistro",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number for pagination" },
        pageSize: { type: "number", description: "Number of results per page (max: 100)" },
        role: { 
          type: "string", 
          description: "Filter by staff role",
          enum: ["server", "bartender", "host", "manager", "kitchen", "cashier"]
        },
        active: { type: "boolean", description: "Filter by active employment status" },
      },
    },
  },
  {
    name: "get_sales_report",
    description: "Get sales report data from TouchBistro for analysis and reporting",
    inputSchema: {
      type: "object" as const,
      properties: {
        startDate: { type: "string", description: "Report start date in YYYY-MM-DD format (required)" },
        endDate: { type: "string", description: "Report end date in YYYY-MM-DD format (required)" },
        groupBy: { 
          type: "string", 
          description: "How to group the report data",
          enum: ["day", "week", "month", "category", "item", "server"]
        },
        includeVoids: { type: "boolean", description: "Include voided orders in the report" },
        includeRefunds: { type: "boolean", description: "Include refunded orders in the report" },
      },
      required: ["startDate", "endDate"],
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================
async function handleTool(client: TouchBistroClient, name: string, args: any) {
  switch (name) {
    case "list_orders":
      return await client.listOrders(args);
    
    case "get_order":
      return await client.getOrder(args.id);
    
    case "list_menu_items":
      return await client.listMenuItems(args);
    
    case "list_reservations":
      return await client.listReservations(args);
    
    case "create_reservation":
      return await client.createReservation(args);
    
    case "list_staff":
      return await client.listStaff(args);
    
    case "get_sales_report":
      return await client.getSalesReport(args);
    
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================
// SERVER SETUP
// ============================================
async function main() {
  const apiKey = process.env.TOUCHBISTRO_API_KEY;
  const venueId = process.env.TOUCHBISTRO_VENUE_ID;
  
  if (!apiKey) {
    console.error("Error: TOUCHBISTRO_API_KEY environment variable required");
    process.exit(1);
  }
  
  if (!venueId) {
    console.error("Error: TOUCHBISTRO_VENUE_ID environment variable required");
    process.exit(1);
  }

  const client = new TouchBistroClient(apiKey, venueId);

  const server = new Server(
    { name: `${MCP_NAME}-mcp`, version: MCP_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await handleTool(client, name, args || {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${MCP_NAME} MCP server running on stdio`);
}

main().catch(console.error);
