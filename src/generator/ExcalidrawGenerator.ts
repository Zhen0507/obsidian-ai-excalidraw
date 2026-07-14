import axios from 'axios';
import { AIConfigManager } from '../config/AIConfigManager';

export interface GenerateOptions {
  description: string;
  style: string;
  regenerate?: boolean;
}

export interface GeneratedDiagram {
  json: any[];
  prompt: string;
  style: string;
  provider: string;
  timestamp: number;
}

export class ExcalidrawGenerator {
  private configManager: AIConfigManager;
  private requestHistory: Map<string, GeneratedDiagram> = new Map();

  constructor(configManager: AIConfigManager) {
    this.configManager = configManager;
  }

  /**
   * 根据描述生成 Excalidraw JSON
   */
  async generate(options: GenerateOptions): Promise<GeneratedDiagram> {
    try {
      this.configManager.validateConfig();

      const prompt = this.buildPrompt(options.description, options.style);
      const payload = this.configManager.buildRequestPayload(prompt, options.style);
      const headers = this.configManager.getRequestHeaders();
      const url = this.configManager.getApiUrl();
      const provider = this.configManager.getActiveProvider();

      // 调用 AI API
      console.log(`正在使用 ${provider} 生成图表...`);
      const response = await axios.post(url, payload, { headers, timeout: 30000 });

      // 从响应中提取 JSON
      const jsonContent = this.extractJSON(response.data, provider);
      const excalidrawJson = this.parseAndValidateJSON(jsonContent);

      // 如果需要，规范化坐标
      const normalizedJson = this.normalizeCoordinates(excalidrawJson);

      const result: GeneratedDiagram = {
        json: normalizedJson,
        prompt: options.description,
        style: options.style,
        provider,
        timestamp: Date.now()
      };

      // 存储在历史记录中用于潜在的重新生成
      const key = `${options.description}_${options.style}`;
      this.requestHistory.set(key, result);

      return result;
    } catch (error) {
      console.error('生成图表出错:', error);
      throw new Error(`生成图表失败: ${error.message}`);
    }
  }

  /**
   * 构建 AI 提示词
   */
  private buildPrompt(description: string, style: string): string {
    return `基于以下描述创建一个 Excalidraw 图表：

"${description}"

绘图风格：${style}
请生成有效的 Excalidraw JSON 来表示这个图表。`;
  }

  /**
   * 从 AI 响应中提取 JSON
   */
  private extractJSON(data: any, provider: string): string {
    let content = '';

    switch (provider) {
      case 'deepseek':
      case 'openai':
        content = data.choices?.[0]?.message?.content || '';
        break;
      case 'alibaba':
        content = data.output?.text || '';
        break;
      case 'volcengine':
        content = data.choices?.[0]?.message?.content || '';
        break;
      default:
        content = JSON.stringify(data);
    }

    // 移除 markdown 代码块（如果存在）
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    return content;
  }

  /**
   * 解析和验证 JSON
   */
  private parseAndValidateJSON(jsonStr: string): any[] {
    try {
      const parsed = JSON.parse(jsonStr);
      
      // 确保它是一个数组
      if (!Array.isArray(parsed)) {
        if (typeof parsed === 'object' && parsed !== null) {
          // 如果是对象且有 elements 属性，使用那个
          if (Array.isArray(parsed.elements)) {
            return parsed.elements;
          }
          // 否则将对象作为单个元素
          return [parsed];
        }
        throw new Error('JSON 必须是元素数组');
      }

      // 验证每个元素都有必需的属性
      return parsed.map((element, index) => {
        return this.normalizeElement(element, index);
      });
    } catch (error) {
      throw new Error(`AI 返回的 JSON 无效: ${error.message}`);
    }
  }

  /**
   * 规范化元素以确保有必需的属性
   */
  private normalizeElement(element: any, index: number): any {
    return {
      id: element.id || `element-${index}`,
      type: element.type || 'rectangle',
      x: element.x ?? 0,
      y: element.y ?? 0,
      width: element.width ?? 100,
      height: element.height ?? 50,
      angle: element.angle ?? 0,
      strokeColor: element.strokeColor ?? '#000000',
      backgroundColor: element.backgroundColor ?? '#ffffff',
      fillStyle: element.fillStyle ?? 'hachure',
      strokeWidth: element.strokeWidth ?? 1,
      roughness: element.roughness ?? 1,
      opacity: element.opacity ?? 100,
      groupIds: element.groupIds ?? [],
      frameId: element.frameId ?? null,
      roundness: element.roundness ?? undefined,
      seed: element.seed ?? Math.floor(Math.random() * 2147483647),
      versionNonce: element.versionNonce ?? Math.floor(Math.random() * 2147483647),
      isDeleted: element.isDeleted ?? false,
      boundElements: element.boundElements ?? null,
      updated: element.updated ?? Date.now(),
      link: element.link ?? null,
      locked: element.locked ?? false,
      ...(element.type === 'text' && {
        text: element.text || '文本',
        fontSize: element.fontSize ?? 16,
        fontFamily: element.fontFamily ?? 1,
        textAlign: element.textAlign ?? 'left',
        verticalAlign: element.verticalAlign ?? 'top'
      }),
      ...(element.type === 'arrow' && {
        startBindingElement: element.startBindingElement ?? null,
        endBindingElement: element.endBindingElement ?? null,
        startArrowType: element.startArrowType ?? null,
        endArrowType: element.endArrowType ?? 'arrow',
        x2: element.x2 ?? (element.x ?? 0) + 100,
        y2: element.y2 ?? (element.y ?? 0) + 50
      }),
      ...element
    };
  }

  /**
   * 规范化坐标以适应画布
   */
  private normalizeCoordinates(elements: any[]): any[] {
    if (elements.length === 0) return elements;

    // 查找边界
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    elements.forEach(el => {
      minX = Math.min(minX, el.x || 0);
      minY = Math.min(minY, el.y || 0);
      maxX = Math.max(maxX, (el.x || 0) + (el.width || 0));
      maxY = Math.max(maxY, (el.y || 0) + (el.height || 0));

      if (el.type === 'arrow') {
        minX = Math.min(minX, el.x2 || 0);
        minY = Math.min(minY, el.y2 || 0);
        maxX = Math.max(maxX, el.x2 || 0);
        maxY = Math.max(maxY, el.y2 || 0);
      }
    });

    // 如果边界无效，按原样返回
    if (minX === Infinity || minY === Infinity) {
      return elements;
    }

    // 添加填充
    const padding = 50;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);

    // 调整坐标
    return elements.map(el => {
      return {
        ...el,
        x: (el.x || 0) - minX,
        y: (el.y || 0) - minY,
        ...(el.type === 'arrow' && {
          x2: (el.x2 || 0) - minX,
          y2: (el.y2 || 0) - minY
        })
      };
    });
  }

  /**
   * 将图表转换为 Excalidraw 文件格式
   */
  convertToExcalidrawFormat(diagram: GeneratedDiagram): any {
    return {
      type: 'excalidraw',
      version: 2,
      source: 'https://excalidraw.com',
      elements: diagram.json,
      appState: {
        gridMode: false,
        viewBackgroundColor: '#ffffff',
        zoom: { value: 1 }
      },
      files: {}
    };
  }

  /**
   * 获取请求历史
   */
  getHistory(): Map<string, GeneratedDiagram> {
    return this.requestHistory;
  }

  /**
   * 清除历史
   */
  clearHistory(): void {
    this.requestHistory.clear();
  }
}
