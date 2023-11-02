import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css']
})
export class FlowchartComponent implements OnInit, OnChanges {
  @Input() agents: any[] = [];
  @Input() messages: any[] = [];

  options: EChartsOption;
  public defaultAgents: any[] = []
  public lastMessenger = '';

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.generateOptions();
  }

  getMessageCountForAgent(agentName: string): number {
    return this.messages.filter(message => message.name === agentName).length;
  }

  getMessagesForAgent(agentName: string) {
    return this.messages
        .filter(message => message.name === agentName)
        .map(message => message.content);
  }

  private generateOptions(): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
  
    const centerX = 0.2 * screenWidth;
    const centerY = 0.3 * screenHeight;
  
    const angleStep = (2 * Math.PI) / this.agents.length;
  
    const firstAgent = this.agents[0];

    const rootNodeName = firstAgent ? firstAgent.agent_name + ` (${this.getMessageCountForAgent(firstAgent.agent_name)})` : 'Proxy';
    const rootNode = {
      name: rootNodeName,
      message: firstAgent ? firstAgent.message : 'A User Proxy that can be used to interact with the agents.',
      x: centerX,
      y: centerY,
      itemStyle: {
        color: '#99af9d'
      }
    };
  
    const agentNodes = this.agents!.slice(1).map((agent, index) => {
      const angle = index * angleStep;
      const x = centerX + (0.25 * screenWidth) * Math.cos(angle); // 25% of screen width as radius
      const y = centerY + (0.25 * screenHeight) * Math.sin(angle); // 25% of screen height as radius
      return {
        name: agent.agent_name  + ` (${this.getMessageCountForAgent(agent.agent_name)})`,
        message: agent.message,
        x,
        y
      };
    });

    let managerNode = {'name':'', 'message':'', 'x':0, 'y':0, 'itemStyle':{color:''}};
    if (agentNodes.length > 0) {
      managerNode = {
        name: `Manager (${this.getMessageCountForAgent('Manager')})`,
        message: 'Team supervisor.',
        x: centerX,
        y: 0,
        itemStyle: {
          color: '#b7a51d'
        }
      }
    }
      else {
        managerNode = {
          name: 'User',
          message: 'Dialog with the agents.',
          x: 0.5 * screenWidth,  // 10% of screen width
          y: 0.1 * screenHeight, // 70% of screen height
          itemStyle: {
            color: '#b7858d'
          }
        }; 
      }


      const lastMessage = this.messages[this.messages.length - 1];

    const agentLinks = [
      ...agentNodes.map(agent => ({
        source: agent.name,
        target: rootNode.name
      })),
      ...agentNodes.map(agent => ({
        source: rootNode.name,
        target: agent.name
      })),
      {
        source: managerNode.name,
        target: rootNode.name
      }
    ];

    this.options = {
      title:  {
        text: (this.messages.length > 0 ? `Messages: ${this.messages.length}` : 'No messages Available'),
        subtext: (this.messages.length > 0 ? `Latest message from: ${this.messages[this.messages.length - 1]?.name}`  : '')
      },
      tooltip: {
        formatter: (params) => {
          if (params.dataType === 'node') {
            if (params.data.name.split(' ')[0] === 'Manager') {
              return `<h4>Persona:</h4> ${params.data.message}<h4>Last message:</h4> "${this.getMessagesForAgent('Manager')}"`;
            } 
            if (params.data.name === 'User' || params.data.name === 'Proxy') {
              return `<h4>Persona:</h4> ${params.data.message}<br>`;
            } 
            else {
            const actualAgentName = params.data.name.split(' ')[0];
            const node = this.agents!.find(agent => agent.agent_name === actualAgentName);
            const description = node!.message ? node.message : '';
            return `<h4>Persona:</h4> ${description}<h4>Last message:</h4> "${this.getMessagesForAgent(actualAgentName)}"`;
          }
        }
        },
        className: 'tooltip',
        showContent: true,
        position: 'top',
        enterable: true,
        confine: true,
        transitionDuration: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#333',
        borderWidth: 0,
        padding: 25,
        textStyle: {
          color: '#fff',
          fontSize: 14
        },
        extraCssText: 'width: 50vh;max-height:50vh;overflow-y: auto; white-space: normal;'  
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'none',
          symbol: 'rect',
          symbolSize: [160, 50],
          roam: true,
          label: {
            show: true,
            fontSize: 16,
            fontFamily: 'Arial'
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            fontSize: 32,
            fontFamily: 'Arial'
          },
          data: [
            ...agentNodes,
            rootNode,
            ...(Object.keys(managerNode).length ? [managerNode] : []),
          ],
          links: [
            ...agentLinks
          ],
          lineStyle: {
            opacity: 0.9,
            width: 4,
            curveness: 0
          },
        },
      ],
    };
  }
}
