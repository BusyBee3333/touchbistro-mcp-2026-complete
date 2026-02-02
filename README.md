> **🚀 Don't want to self-host?** [Join the waitlist for our fully managed solution →](https://mcpengage.com/touchbistro)
> 
> Zero setup. Zero maintenance. Just connect and automate.

---

# 🍽️ TouchBistro MCP Server — 2026 Complete Version

## 💡 What This Unlocks

**This MCP server gives AI direct access to your TouchBistro restaurant management system.** Instead of clicking through dashboards and reports, you just *tell* the AI what you need.

### 🎯 Restaurant Operations Power Moves

The AI can directly control your TouchBistro system with natural language:

1. **Order Flow Intelligence** — "Show me all open orders from the bar" or "Get today's delivery orders with customer details"
2. **Menu Optimization** — "List all active menu items by category" or "Show me which items are marked inactive"
3. **Reservation Management** — "Check tonight's reservations for parties of 4+" or "Create a reservation for Sarah's party of 6 at 7pm tomorrow"
4. **Staff Performance** — "Show me all active servers scheduled today" or "List staff members by role for scheduling"
5. **Sales Analytics** — "Generate a sales report for last week grouped by day" or "Show me top-selling items this month"

### 🔗 The Real Power: Combining Tools

AI can chain multiple TouchBistro operations together:

- Pull reservations → Check table availability → Send confirmation emails
- Analyze sales reports → Identify trends → Adjust menu pricing
- Review orders → Track server performance → Calculate labor costs
- Query menu items → Check popularity → Create promotional campaigns

## 📦 What's Inside

**7 powerful API tools** covering core restaurant management:

- **Orders**: `list_orders`, `get_order`
- **Menu**: `list_menu_items`
- **Reservations**: `list_reservations`, `create_reservation`
- **Staff**: `list_staff`
- **Reports**: `get_sales_report`

All with proper error handling, automatic authentication, and TypeScript types.

## 🚀 Quick Start

### Option 1: Claude Desktop (Local)

1. **Clone and build:**
   ```bash
   git clone https://github.com/BusyBee3333/TouchBistro-MCP-2026-Complete.git
   cd touchbistro-mcp-2026-complete
   npm install
   npm run build
   ```

2. **Get your TouchBistro API credentials:**
   - Log into TouchBistro Cloud
   - Go to Settings → API Access
   - Generate an API key
   - Note your Venue ID (location identifier)

3. **Configure Claude Desktop:**
   
   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   
   On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "touchbistro": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/touchbistro-mcp-2026-complete/dist/index.js"],
         "env": {
           "TOUCHBISTRO_API_KEY": "your-api-key-here",
           "TOUCHBISTRO_VENUE_ID": "your-venue-id-here"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop**

### Option 2: Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/touchbistro-mcp)

1. Click the button above
2. Set `TOUCHBISTRO_API_KEY` and `TOUCHBISTRO_VENUE_ID` in Railway dashboard
3. Use the Railway URL as your MCP server endpoint

### Option 3: Docker

```bash
docker build -t touchbistro-mcp .
docker run -p 3000:3000 \
  -e TOUCHBISTRO_API_KEY=your-key \
  -e TOUCHBISTRO_VENUE_ID=your-venue-id \
  touchbistro-mcp
```

## 🔐 Authentication

TouchBistro uses **API Key authentication** with venue-specific access.

**Required credentials:**
- `TOUCHBISTRO_API_KEY` — API key from TouchBistro Cloud (Settings → API Access)
- `TOUCHBISTRO_VENUE_ID` — Your venue/location identifier (found in Settings → Locations)

**Official docs:** [TouchBistro API Documentation](https://developer.touchbistro.com/docs/authentication)

The MCP server handles authentication headers and venue routing automatically.

## 🎯 Example Prompts for Claude

Once connected, you can use natural language to manage your restaurant:

**Order Management:**
- *"Show me all open dine-in orders right now"*
- *"Get full details for order #TB12345 including items and modifiers"*
- *"List delivery orders from the past 2 hours"*

**Menu Operations:**
- *"Show me all appetizers on the menu"*
- *"List menu items that are currently inactive"*
- *"Get pricing for all entrees"*

**Reservation Management:**
- *"Show tonight's reservations after 6pm"*
- *"Create a reservation for John Smith, party of 4, tomorrow at 7:30pm"*
- *"List all confirmed reservations for this weekend"*

**Staff Management:**
- *"Show me all active servers on duty"*
- *"List staff members by role for today's shift"*
- *"Get all bartenders scheduled this week"*

**Sales Analytics:**
- *"Generate a sales report for last week grouped by day"*
- *"Show me sales trends for the past month"*
- *"Compare this week's sales to last week, excluding voids"*

**Combined Operations:**
- *"Check tonight's 7pm reservations and show me which servers are working"*
- *"Pull last month's sales data and identify top 10 selling items"*

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- TouchBistro Cloud account with API access

### Setup

```bash
git clone https://github.com/BusyBee3333/TouchBistro-MCP-2026-Complete.git
cd touchbistro-mcp-2026-complete
npm install
cp .env.example .env
# Edit .env with your TouchBistro credentials
npm run build
npm start
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🐛 Troubleshooting

### "Authentication failed"
- Verify your API key is valid and active
- Check that your Venue ID is correct (Settings → Locations)
- Ensure your API key has the necessary permissions (read orders, manage reservations, etc.)

### "Venue not found"
- Confirm `TOUCHBISTRO_VENUE_ID` matches your location's ID
- Multiple locations? Use the specific venue ID you want to query

### "Tools not appearing in Claude"
- Restart Claude Desktop after updating config
- Check that the path in `claude_desktop_config.json` is absolute
- Verify the build completed successfully (`dist/index.js` exists)

## 📖 Resources

- [TouchBistro API Documentation](https://developer.touchbistro.com/docs)
- [TouchBistro Cloud Dashboard](https://cloud.touchbistro.com)
- [API Authentication Guide](https://developer.touchbistro.com/docs/authentication)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Desktop Documentation](https://claude.ai/desktop)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-tool`)
3. Commit your changes (`git commit -m 'Add amazing tool'`)
4. Push to the branch (`git push origin feature/amazing-tool`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Credits

Built by [MCPEngage](https://mcpengage.com) — AI infrastructure for business software.

Want more MCP servers? Check out our [full catalog](https://mcpengage.com) covering 30+ business platforms.

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/mcpengage).
