/**
 * AI 配置管理器
 * 管理 AI 提供商配置和 API 交互
 */

interface ProviderConfig {
  deepseek?: {
    apiKey: string;
    baseUrl: string;
    model?: string;
  };
  openai?: {
    apiKey: string;
    baseUrl: string;
    model?: string;
  };
  alibaba?: {
    apiKey: string;
    appId: string;
    model?: string;
  };
  volcengine?: {
    apiKey: string;
    baseUrl: string;
    model?: string;
  };
}

export class AIConfigManager {
  private activeProvider: string;
  private providers: Record<string, any>;
  private defaultStyle: string;

  constructor(settings: any) {
    this.activeProvider = settings.activeProvider || 'deepseek';
    this.providers = settings.providers || {};
    this.defaultStyle = settings.defaultStyle || 'hand-drawn';
  }

  /**
   * 获取当前活跃提供商
   */
  getActiveProvider(): string {
    return this.activeProvider;
  }

  /**
   * 获取活跃提供商的 API 配置
   */
  getActiveConfig(): any {
    return this.providers[this.activeProvider];
  }

  /**
   * 根据提供商获取 API URL
   */
  getApiUrl(): string {
    const config = this.getActiveConfig();
    const provider = this.activeProvider;

    switch (provider) {
      case 'deepseek':
        return config?.baseUrl || 'https://api.deepseek.com';
      case 'openai':
        return config?.baseUrl || 'https://api.openai.com/v1';
      case 'alibaba':
        return 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
      case 'volcengine':
        return config?.baseUrl || 'https://api.volcengine.com';
      default:
        throw new Error(`未知的提供商: ${provider}`);
    }
  }

  /**
   * 获取活跃提供商的模型名称
   */
  getModel(): string {
    const provider = this.activeProvider;
    const config = this.getActiveConfig();

    switch (provider) {
      case 'deepseek':
        return config?.model || 'deepseek-chat';
      case 'openai':
        return config?.model || 'gpt-4';
      case 'alibaba':
        return config?.model || 'qwen-turbo';
      case 'volcengine':
        return config?.model || 'doubao-pro-32k';
      default:
        return 'default';
    }
  }

  /**
   * 获取活跃提供商的 API 密钥
   */
  getApiKey(): string {
    const config = this.getActiveConfig();
    
    if (!config?.apiKey) {
      throw new Error(`未配置 ${this.activeProvider} 的 API 密钥`);
    }
    
    return config.apiKey;
  }

  /**
   * 获取默认绘图风格
   */
  getDefaultStyle(): string {
    return this.defaultStyle;
  }

  /**
   * 验证提供商配置
   */
  validateConfig(): boolean {
    const config = this.getActiveConfig();
    
    if (!config) {
      throw new Error(`未找到 ${this.activeProvider} 的配置`);
    }

    if (!config.apiKey) {
      throw new Error(`${this.activeProvider} 需要配置 API 密钥`);
    }

    return true;
  }

  /**
   * 获取提供商特定的请求头
   */
  getRequestHeaders(): Record<string, string> {
    const provider = this.activeProvider;
    const apiKey = this.getApiKey();

    switch (provider) {
      case 'deepseek':
      case 'openai':
        return {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        };
      case 'alibaba':
        return {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        };
      case 'volcengine':
        return {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        };
      default:
        return { 'Content-Type': 'application/json' };
    }
  }

  /**
   * 获取提供商特定的请求 payload 格式
   */
  buildRequestPayload(prompt: string, style: string): any {
    const provider = this.activeProvider;
    const model = this.getModel();

    const systemPrompt = this.buildSystemPrompt(style);

    switch (provider) {
      case 'deepseek':
      case 'openai':
        return {
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4000
        };
      case 'alibaba':
        return {
          model,
          input: {
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt }
            ]
          },
          parameters: {
            temperature: 0.7,
            max_tokens: 4000
          }
        };
      case 'volcengine':
        return {
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4000
        };
      default:
        return {};
    }
  }

  /**
   * 为 AI 构建系统提示词以生成有效的 Excalidraw JSON
   */
  private buildSystemPrompt(style: string): string {
    return `你是一个生成 Excalidraw 图表 JSON 格式的专家。
你的任务是将用户描述转换为有效的 Excalidraw JSON，可以被渲染。

重要规则：
1. 只返回有效的 JSON，不要 markdown、代码块、解释
2. JSON 应该是一个元素数组
3. 每个元素必须有必需字段：id、type、x、y、width、height
4. 使用这些元素类型：rectangle、diamond、ellipse、line、arrow、text
5. 绘图风格：${style}
6. 确保图表清晰、组织有序、易于理解
7. 使用适当的间距和对齐

返回完整的 Excalidraw JSON 数组。示例结构：
[
  {"id":"1","type":"rectangle","x":0,"y":0,"width":200,"height":100,"text":"开始","fontSize":16,"textAlign":"center","verticalAlign":"middle","strokeColor":"#000000","backgroundColor":"#ffffff","strokeWidth":2,"roughness":1,"opacity":100},
  {"id":"2","type":"rectangle","x":0,"y":150,"width":200,"height":100,"text":"处理","fontSize":16,"textAlign":"center","verticalAlign":"middle","strokeColor":"#000000","backgroundColor":"#ffffff","strokeWidth":2,"roughness":1,"opacity":100},
  {"id":"3","type":"arrow","x":100,"y":100,"x2":100,"y2":150,"strokeColor":"#000000","strokeWidth":2,"roughness":1,"opacity":100}
]`;
  }
}
