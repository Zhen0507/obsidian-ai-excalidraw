/**
 * Excalidraw 样式配置
 * 定义不同的绘图风格和主题
 */

export interface StyleConfig {
  name: string;
  description: string;
  roughness: number;  // 0-3，数值越大越粗糙
  strokeWidth: number;
  fillStyle: 'hachure' | 'cross-hatch' | 'thin-hatch' | 'solid';
  strokeColor: string;
  backgroundColor: string;
  fontFamily: number; // 1=Virgil, 2=Helvetica, 3=Cascadia
  fontSize: number;
}

export class StyleManager {
  private static styles: Record<string, StyleConfig> = {
    'hand-drawn': {
      name: '手绘风格',
      description: '随意自然的手绘外观',
      roughness: 2,
      strokeWidth: 1.5,
      fillStyle: 'hachure',
      strokeColor: '#000000',
      backgroundColor: '#ffffff',
      fontFamily: 1,
      fontSize: 16
    },
    'cross-hatch': {
      name: '交叉阴影',
      description: '带有交叉阴影填充的正式风格',
      roughness: 1,
      strokeWidth: 1,
      fillStyle: 'cross-hatch',
      strokeColor: '#1a1a1a',
      backgroundColor: '#f5f5f5',
      fontFamily: 2,
      fontSize: 14
    },
    'thin-line': {
      name: '细线条',
      description: '干净简洁的细线条风格',
      roughness: 0,
      strokeWidth: 1,
      fillStyle: 'solid',
      strokeColor: '#000000',
      backgroundColor: '#ffffff',
      fontFamily: 2,
      fontSize: 14
    },
    'dark': {
      name: '暗黑主题',
      description: '深色背景的专业暗黑风格',
      roughness: 1,
      strokeWidth: 2,
      fillStyle: 'solid',
      strokeColor: '#ffffff',
      backgroundColor: '#2a2a2a',
      fontFamily: 2,
      fontSize: 14
    },
    'minimal': {
      name: '极简风格',
      description: '最小化设计，只有必要的元素',
      roughness: 0,
      strokeWidth: 0.5,
      fillStyle: 'solid',
      strokeColor: '#666666',
      backgroundColor: '#fafafa',
      fontFamily: 2,
      fontSize: 12
    }
  };

  /**
   * 获取所有可用的样式
   */
  static getAllStyles(): Record<string, StyleConfig> {
    return this.styles;
  }

  /**
   * 获取指定样式配置
   */
  static getStyle(styleName: string): StyleConfig {
    return this.styles[styleName] || this.styles['hand-drawn'];
  }

  /**
   * 获取样式名称列表
   */
  static getStyleNames(): string[] {
    return Object.keys(this.styles);
  }

  /**
   * 获取样式的中文名称
   */
  static getStyleLabel(styleName: string): string {
    return this.styles[styleName]?.name || styleName;
  }

  /**
   * 应用样式到元素
   */
  static applyStyleToElement(element: any, styleName: string): any {
    const style = this.getStyle(styleName);
    
    return {
      ...element,
      roughness: style.roughness,
      strokeWidth: style.strokeWidth,
      fillStyle: style.fillStyle,
      strokeColor: style.strokeColor,
      backgroundColor: style.backgroundColor,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize
    };
  }

  /**
   * 批量应用样式到多个元素
   */
  static applyStyleToElements(elements: any[], styleName: string): any[] {
    return elements.map(element => this.applyStyleToElement(element, styleName));
  }

  /**
   * 获取样式的 CSS 变量
   */
  static getStyleCSS(styleName: string): string {
    const style = this.getStyle(styleName);
    return `
      --stroke-color: ${style.strokeColor};
      --background-color: ${style.backgroundColor};
      --stroke-width: ${style.strokeWidth}px;
    `;
  }
}
