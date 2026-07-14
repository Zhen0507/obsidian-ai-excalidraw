import { App, Modal, Setting, Notice } from 'obsidian';
import { ExcalidrawGenerator, GeneratedDiagram } from '../generator/ExcalidrawGenerator';

export class DiagramInputModal extends Modal {
  private description: string = '';
  private style: string = 'hand-drawn';
  private generator: ExcalidrawGenerator;
  private settings: any;
  private currentDiagram: GeneratedDiagram | null = null;
  private isGenerating: boolean = false;

  constructor(app: App, generator: ExcalidrawGenerator, settings: any) {
    super(app);
    this.generator = generator;
    this.settings = settings;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h2', { text: '生成 Excalidraw 图表' });

    // 描述输入框
    new Setting(contentEl)
      .setName('图表描述')
      .setDesc('描述你想要创建的图表（流程图、架构图等）')
      .addTextArea(text => {
        text
          .setPlaceholder('例如："创建一个用户登录流程图，包括成功和失败的分支"')
          .setValue(this.description)
          .onChange(value => {
            this.description = value;
          });
        text.inputEl.style.minHeight = '100px';
      });

    // 风格选择
    new Setting(contentEl)
      .setName('绘图风格')
      .setDesc('为你的图表选择视觉风格')
      .addDropdown(dropdown => {
        dropdown
          .addOption('hand-drawn', '手绘风格')
          .addOption('cross-hatch', '交叉阴影')
          .addOption('thin-line', '细线条')
          .addOption('dark', '暗黑主题')
          .addOption('minimal', '极简风格')
          .setValue(this.style)
          .onChange(value => {
            this.style = value;
          });
      });

    // 按钮容器
    const buttonContainer = contentEl.createDiv('button-container');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.marginTop = '20px';
    buttonContainer.style.justifyContent = 'flex-end';

    // 生成按钮
    const generateBtn = buttonContainer.createEl('button', { text: '生成' });
    generateBtn.style.padding = '8px 16px';
    generateBtn.style.backgroundColor = '#4CAF50';
    generateBtn.style.color = 'white';
    generateBtn.style.border = 'none';
    generateBtn.style.borderRadius = '4px';
    generateBtn.style.cursor = 'pointer';
    generateBtn.onclick = () => this.generateDiagram(generateBtn);

    // 取消按钮
    const cancelBtn = buttonContainer.createEl('button', { text: '取消' });
    cancelBtn.style.padding = '8px 16px';
    cancelBtn.style.backgroundColor = '#f44336';
    cancelBtn.style.color = 'white';
    cancelBtn.style.border = 'none';
    cancelBtn.style.borderRadius = '4px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.onclick = () => this.close();

    // 结果区域（初始隐藏）
    const resultsContainer = contentEl.createDiv();
    resultsContainer.id = 'diagram-results';
    resultsContainer.style.marginTop = '20px';
    resultsContainer.style.display = 'none';
  }

  private async generateDiagram(btn: HTMLButtonElement) {
    if (!this.description.trim()) {
      new Notice('请描述你想要的图表');
      return;
    }

    if (this.isGenerating) {
      new Notice('正在生成中...');
      return;
    }

    this.isGenerating = true;
    const originalText = btn.textContent;
    btn.textContent = '生成中...';
    btn.disabled = true;

    try {
      new Notice('正在使用 AI 生成图表...');
      
      this.currentDiagram = await this.generator.generate({
        description: this.description,
        style: this.style
      });

      new Notice('图表生成成功！');
      this.showResults();

    } catch (error) {
      console.error('生成错误:', error);
      new Notice(`错误: ${error.message}`);
    } finally {
      this.isGenerating = false;
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }

  private showResults() {
    const contentEl = this.contentEl;
    const resultsContainer = contentEl.querySelector('#diagram-results') as HTMLDivElement;
    
    if (!resultsContainer) return;

    resultsContainer.empty();
    resultsContainer.style.display = 'block';

    // 显示图表预览信息
    const infoDiv = resultsContainer.createDiv();
    infoDiv.createEl('h3', { text: '✅ 图表生成成功！' });
    infoDiv.createEl('p', { text: `风格：${this.currentDiagram?.style}` });
    infoDiv.createEl('p', { text: `提供商：${this.currentDiagram?.provider}` });
    infoDiv.createEl('p', { text: `元素数：${this.currentDiagram?.json.length || 0}` });

    // 操作按钮
    const actionContainer = resultsContainer.createDiv();
    actionContainer.style.display = 'flex';
    actionContainer.style.gap = '10px';
    actionContainer.style.marginTop = '10px';
    actionContainer.style.flexWrap = 'wrap';

    // 插入按钮
    const insertBtn = actionContainer.createEl('button', { text: '插入到笔记' });
    insertBtn.style.padding = '8px 16px';
    insertBtn.style.backgroundColor = '#2196F3';
    insertBtn.style.color = 'white';
    insertBtn.style.border = 'none';
    insertBtn.style.borderRadius = '4px';
    insertBtn.style.cursor = 'pointer';
    insertBtn.onclick = () => this.insertToNote();

    // 重新生成按钮
    const regenBtn = actionContainer.createEl('button', { text: '重新生成' });
    regenBtn.style.padding = '8px 16px';
    regenBtn.style.backgroundColor = '#FF9800';
    regenBtn.style.color = 'white';
    regenBtn.style.border = 'none';
    regenBtn.style.borderRadius = '4px';
    regenBtn.style.cursor = 'pointer';
    regenBtn.onclick = () => {
      if (this.currentDiagram) {
        const originalBtn = this.contentEl.querySelector('button:nth-of-type(1)') as HTMLButtonElement;
        if (originalBtn) {
          this.generateDiagram(originalBtn);
        }
      }
    };

    // 修改按钮
    const modifyBtn = actionContainer.createEl('button', { text: '修改描述' });
    modifyBtn.style.padding = '8px 16px';
    modifyBtn.style.backgroundColor = '#9C27B0';
    modifyBtn.style.color = 'white';
    modifyBtn.style.border = 'none';
    modifyBtn.style.borderRadius = '4px';
    modifyBtn.style.cursor = 'pointer';
    modifyBtn.onclick = () => {
      resultsContainer.style.display = 'none';
    };
  }

  private insertToNote() {
    if (!this.currentDiagram) {
      new Notice('没有图表可以插入');
      return;
    }

    const activeEditor = this.app.workspace.activeEditor?.editor;
    if (!activeEditor) {
      new Notice('找不到活跃编辑器');
      return;
    }

    // 将图表数据格式化为 JSON 用于嵌入
    const diagramJson = JSON.stringify(this.currentDiagram.json, null, 2);
    const content = `\`\`\`excalidraw
${diagramJson}
\`\`\`

<!-- 由 AI Excalidraw 生成器创建 -->
<!-- 风格: ${this.currentDiagram.style} -->
<!-- 提供商: ${this.currentDiagram.provider} -->
<!-- 提示词: ${this.currentDiagram.prompt} -->`;

    activeEditor.replaceSelection(content);
    new Notice('图表已插入到笔记中！');
    this.close();
  }

  onClose() {
    this.contentEl.empty();
  }
}
