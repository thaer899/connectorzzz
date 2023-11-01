import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css']
})
export class FlowchartComponent implements OnInit, OnChanges {
  @Input() agents: any[] = [];

  options: EChartsOption;
  public defaultAgents: any[] = []
  
  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.agents && changes.agents.currentValue) {
      this.generateOptions();
    }
  }

  private generateOptions(): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
  
    const centerX = 0.2 * screenWidth;
    const centerY = 0.4 * screenHeight;
  
    const angleStep = (2 * Math.PI) / this.agents.length;
  
    const firstAgent = this.agents[0];
  
    const rootNode = {
      name: firstAgent ? firstAgent.agent_name : 'Proxy',
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
        name: agent.agent_name,
        message: agent.message,
        x,
        y
      };
    });
  
    const userNode = {
      name: 'User',
      message: 'Dialog with the agents.',
      x: 0.5 * screenWidth,  // 10% of screen width
      y: 0.1 * screenHeight, // 70% of screen height
      itemStyle: {
        color: '#b7858d'
      }
    };

    let managerNode  = {};
    if (agentNodes.length > 0) {
      managerNode = {
        name: 'Manager',
        message: 'Team supervisor.',
        x: 0.1 * screenWidth,
        y: 0,
        itemStyle: {
          color: '#b7a51d'
        }
      };
    }

    const agentLinks = [
      ...this.agents.map(agent => ({
        source: agent.agent_name,
        target: rootNode.name
      })),
      {
        source: userNode.name,
        target: rootNode.name
      }
    ];

    this.options = {
      title: {
        text: 'Team Flow',
      },
      tooltip: {
        formatter: (params) => {
          if (params.dataType === 'node') {
            const node = this.agents!.find(agent => agent.agent_name === params.data.name);
            const description = node!.message ? `Description: ${node.message}` : '';
            return `Name: ${node.agent_name}<br>${description}`;
          }
        }
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
            userNode,
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
