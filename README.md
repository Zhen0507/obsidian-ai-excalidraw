# AI Excalidraw Generator for Obsidian

An intelligent Obsidian plugin that generates Excalidraw diagrams using AI. Simply describe your flowchart or architecture diagram in natural language, and let AI create it for you!

## Features

✨ **AI-Powered Diagram Generation**
- Convert natural language descriptions into beautiful Excalidraw diagrams
- Support for flowcharts, architecture diagrams, and more

🔄 **Multi-Provider Support**
- DeepSeek API
- OpenAI GPT
- Alibaba Bailian
- Volcano Engine

🎨 **Customizable Drawing Styles**
- Hand-drawn
- Cross-hatch
- Thin Line
- Dark Theme
- Minimal

🔁 **Regenerate & Refine**
- Generate new diagrams instantly
- Modify descriptions and regenerate
- Keep your preferred style across generations

⚙️ **Easy Configuration**
- Set up API keys for your preferred AI provider
- Switch between providers seamlessly
- Set default diagram style

## Installation

1. Download the plugin from Obsidian Community Plugins
2. Or manually install from source:
   ```bash
   git clone https://github.com/Zhen0507/obsidian-ai-excalidraw
   cd obsidian-ai-excalidraw
   npm install
   npm run build
   ```

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Keys

Open plugin settings and add API keys for your preferred AI provider:

**DeepSeek:**
- Get API key from https://platform.deepseek.com
- Add to plugin settings

**OpenAI:**
- Get API key from https://platform.openai.com
- Add to plugin settings

**Alibaba Bailian:**
- Get credentials from https://dashscope.aliyuncs.com
- Add API Key and App ID

**Volcano Engine:**
- Get API key from Volcano Engine console
- Add to plugin settings

### 3. Choose Default Provider and Style
- Select which AI provider to use by default
- Choose your preferred diagram style
- These can be changed anytime

## Usage

### Generate a Diagram

1. **Using Command Palette:**
   - Press `Ctrl+P` (or `Cmd+P` on Mac)
   - Search for "Generate Excalidraw Diagram"
   - Press Enter

2. **Using Ribbon Icon:**
   - Click the pencil icon in the left ribbon

### In the Dialog

1. **Describe your diagram:**
   - "Create a flowchart for user authentication with login, password verification, and error handling"
   - "Draw a microservices architecture with API gateway, services, and database"

2. **Choose drawing style:**
   - Select from available styles: hand-drawn, cross-hatch, thin-line, dark, minimal

3. **Generate:**
   - Click "Generate" to create the diagram
   - Wait for AI to process and generate the Excalidraw JSON

4. **Review Options:**
   - **Insert to Note:** Add the diagram to your current note
   - **Regenerate:** Create a new diagram with the same description
   - **Modify Description:** Edit your description and try again

## How It Works

1. **Natural Language Input:** Describe what you want to draw
2. **AI Processing:** The plugin sends your description to the AI provider
3. **JSON Generation:** AI generates valid Excalidraw JSON format
4. **Validation:** Plugin validates the JSON structure
5. **Insertion:** Diagram is embedded in your note as an Excalidraw code block

## Supported Diagram Types

- **Flowcharts:** Processes with decision points, loops
- **Architecture Diagrams:** System components and relationships
- **Sequence Diagrams:** Interactions between entities
- **Entity Diagrams:** Data structures and relationships
- **Organizational Charts:** Hierarchies and reporting structures
- **Network Diagrams:** Connections and topologies

## Configuration

### Plugin Settings

| Setting | Description |
|---------|-------------|
| Active AI Provider | Choose which AI service to use |
| API Key | Service-specific authentication |
| Default Diagram Style | Visual style for generated diagrams |

### Excalidraw Elements

The plugin generates diagrams using these Excalidraw elements:
- Rectangles
- Diamonds (for decisions)
- Ellipses
- Arrows
- Text labels
- Lines

## Tips for Best Results

1. **Be Specific:** The more detailed your description, the better the result
2. **Use Keywords:** Mention diagram type (flowchart, architecture, etc.)
3. **Specify Structure:** "Left to right", "Top to bottom" helps with layout
4. **Name Components:** Give meaningful names to boxes and connections
5. **Regenerate:** If not satisfied, try regenerating with slightly different wording

## Examples

### Example 1: User Login Flow
```
Create a flowchart showing user login process:
- Start
- Enter username and password
- Validate credentials
- If valid: Login successful, redirect to dashboard
- If invalid: Show error message, return to login
- End
```

### Example 2: Microservices Architecture
```
Draw a microservices architecture diagram with:
- API Gateway at top
- Three backend services: User Service, Product Service, Order Service
- Each service connected to its own database
- Message queue connecting all services
```

## Troubleshooting

### "API Key not configured"
- Go to plugin settings
- Add your API key for the selected provider
- Restart Obsidian if needed

### "Invalid JSON from AI"
- Try a simpler description
- Use different wording
- Try another AI provider
- Check AI provider status

### "Connection timeout"
- Check your internet connection
- Verify API key is valid
- Check if AI provider service is available

## Development

### Build
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

### Project Structure
```
src/
├── config/
│   └── AIConfigManager.ts      # AI provider configuration
├── generator/
│   └── ExcalidrawGenerator.ts  # Diagram generation logic
└── ui/
    └── DiagramInputModal.ts    # User interface
main.ts                         # Main plugin file
```

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

MIT License - feel free to use and modify

## Credits

- Built with [Obsidian Plugin SDK](https://docs.obsidian.md/)
- Powered by AI (DeepSeek, OpenAI, Alibaba Bailian, Volcano Engine)
- Diagrams rendered with [Excalidraw](https://excalidraw.com/)

## Support

If you find this plugin helpful, please consider:
- ⭐ Starring the repository
- 💬 Sharing feedback and feature requests
- 🐛 Reporting bugs

## Roadmap

- [ ] Template system for common diagram types
- [ ] Diagram history and management
- [ ] Export to multiple formats (PNG, SVG, PDF)
- [ ] Custom style templates
- [ ] Batch diagram generation
- [ ] Integration with other Obsidian plugins
