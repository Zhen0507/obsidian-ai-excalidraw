import { App, Plugin, PluginSettingTab, Setting, Modal, Notice } from 'obsidian';
import { AIConfigManager } from './src/config/AIConfigManager';
import { ExcalidrawGenerator } from './src/generator/ExcalidrawGenerator';
import { DiagramInputModal } from './src/ui/DiagramInputModal';

interface AIExcalidrawSettings {
  activeProvider: string;
  providers: Record<string, any>;
  defaultStyle: string;
}

const DEFAULT_SETTINGS: AIExcalidrawSettings = {
  activeProvider: 'deepseek',
  providers: {
    deepseek: { apiKey: '', baseUrl: 'https://api.deepseek.com' },
    openai: { apiKey: '', baseUrl: 'https://api.openai.com' },
    alibaba: { apiKey: '', appId: '' },
    volcengine: { apiKey: '', baseUrl: 'https://api.volcengine.com' }
  },
  defaultStyle: 'hand-drawn'
};

export default class AIExcalidrawPlugin extends Plugin {
  settings: AIExcalidrawSettings;
  configManager: AIConfigManager;
  generator: ExcalidrawGenerator;

  async onload() {
    console.log('加载 AI Excalidraw Generator 插件');
    
    await this.loadSettings();
    this.configManager = new AIConfigManager(this.settings);
    this.generator = new ExcalidrawGenerator(this.configManager);

    // 添加功能区图标
    this.addRibbonIcon('pencil', '生成图表', () => {
      new DiagramInputModal(this.app, this.generator, this.settings).open();
    });

    // 添加命令
    this.addCommand({
      id: 'generate-diagram',
      name: '生成 Excalidraw 图表',
      callback: () => {
        new DiagramInputModal(this.app, this.generator, this.settings).open();
      }
    });

    // 添加设置选项卡
    this.addSettingTab(new AIExcalidrawSettingTab(this.app, this));
  }

  onunload() {
    console.log('卸载 AI Excalidraw Generator 插件');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.configManager = new AIConfigManager(this.settings);
  }
}

class AIExcalidrawSettingTab extends PluginSettingTab {
  plugin: AIExcalidrawPlugin;

  constructor(app: App, plugin: AIExcalidrawPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'AI Excalidraw 生成器设置' });

    // 活跃提供商设置
    new Setting(containerEl)
      .setName('活跃 AI 提供商')
      .setDesc('选择要使用的 AI 服务')
      .addDropdown(dropdown => {
        dropdown
          .addOption('deepseek', 'DeepSeek')
          .addOption('openai', 'OpenAI')
          .addOption('alibaba', '阿里云百炼')
          .addOption('volcengine', '火山引擎')
          .setValue(this.plugin.settings.activeProvider)
          .onChange(async (value) => {
            this.plugin.settings.activeProvider = value;
            await this.plugin.saveSettings();
            this.display();
          });
      });

    // 提供商特定设置
    this.displayProviderSettings();

    // 默认风格设置
    new Setting(containerEl)
      .setName('默认图表风格')
      .setDesc('为生成的图表选择默认绘图风格')
      .addDropdown(dropdown => {
        dropdown
          .addOption('hand-drawn', '手绘风格')
          .addOption('cross-hatch', '交叉阴影')
          .addOption('thin-line', '细线条')
          .addOption('dark', '暗黑主题')
          .setValue(this.plugin.settings.defaultStyle)
          .onChange(async (value) => {
            this.plugin.settings.defaultStyle = value;
            await this.plugin.saveSettings();
          });
      });
  }

  displayProviderSettings(): void {
    const { containerEl } = this;
    const activeProvider = this.plugin.settings.activeProvider;
    const providerConfig = this.plugin.settings.providers[activeProvider];

    containerEl.createEl('h3', { text: `${activeProvider.toUpperCase()} 配置` });

    if (activeProvider === 'deepseek') {
      new Setting(containerEl)
        .setName('DeepSeek API 密钥')
        .setDesc('输入你的 DeepSeek API 密钥')
        .addText(text => {
          text
            .setPlaceholder('sk-...')
            .setValue(providerConfig.apiKey || '')
            .onChange(async (value) => {
              this.plugin.settings.providers.deepseek.apiKey = value;
              await this.plugin.saveSettings();
            });
          text.inputEl.type = 'password';
        });
    } else if (activeProvider === 'openai') {
      new Setting(containerEl)
        .setName('OpenAI API 密钥')
        .setDesc('输入你的 OpenAI API 密钥')
        .addText(text => {
          text
            .setPlaceholder('sk-...')
            .setValue(providerConfig.apiKey || '')
            .onChange(async (value) => {
              this.plugin.settings.providers.openai.apiKey = value;
              await this.plugin.saveSettings();
            });
          text.inputEl.type = 'password';
        });
    } else if (activeProvider === 'alibaba') {
      new Setting(containerEl)
        .setName('阿里云 API 密钥')
        .addText(text => {
          text
            .setPlaceholder('你的阿里云 API 密钥')
            .setValue(providerConfig.apiKey || '')
            .onChange(async (value) => {
              this.plugin.settings.providers.alibaba.apiKey = value;
              await this.plugin.saveSettings();
            });
          text.inputEl.type = 'password';
        });

      new Setting(containerEl)
        .setName('阿里云应用 ID')
        .addText(text => {
          text
            .setPlaceholder('你的应用 ID')
            .setValue(providerConfig.appId || '')
            .onChange(async (value) => {
              this.plugin.settings.providers.alibaba.appId = value;
              await this.plugin.saveSettings();
            });
        });
    } else if (activeProvider === 'volcengine') {
      new Setting(containerEl)
        .setName('火山引擎 API 密钥')
        .addText(text => {
          text
            .setPlaceholder('你的 API 密钥')
            .setValue(providerConfig.apiKey || '')
            .onChange(async (value) => {
              this.plugin.settings.providers.volcengine.apiKey = value;
              await this.plugin.saveSettings();
            });
          text.inputEl.type = 'password';
        });
    }
  }
}
