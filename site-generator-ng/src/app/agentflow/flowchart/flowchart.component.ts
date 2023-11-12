import { Component, OnInit, OnChanges, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css']
})
export class FlowchartComponent implements OnInit, OnChanges {
  @Input() agents: any[] = [];
  @Input() messages: any[] = [];
  @Input() profile: any = { 'username': '' };

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

  getMessagesForAgent(agentName) {
    const filteredMessages = this.messages
      .filter(message => message.name === agentName);
    if (filteredMessages.length === 0) {
      return 'No messages available';
    }
    return filteredMessages[filteredMessages.length - 1].content;
  }

  getFontSize(screenWidth) {
    const maxWidthInPixels = 30 * 16;

    if (screenWidth <= maxWidthInPixels) {
      return 10;
    } else {
      return 16;
    }
  }

  getSymbolSize(screenWidth, screenHeight) {
    // Convert em to pixels; here, we assume 1em = 16px
    const maxWidthInPixels = 30 * 16;

    if (screenWidth <= maxWidthInPixels) {
      return [screenWidth * 0.2, screenHeight * 0.03];
    } else {
      return [screenWidth * 0.1, screenHeight * 0.05];
    }
  }

  private generateOptions(): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const centerX = 0.2 * screenWidth;
    const centerY = 0.3 * screenHeight;

    const angleStep = (2 * Math.PI) / this.agents.length;


    const proxyNode = {
      name: `${this.profile.username}_Proxy (${this.getMessageCountForAgent(`${this.profile.username}_Proxy`)})`,
      message: this.profile.username ? this.profile.username.message : 'A User Proxy that can be used to interact with the members of the team.',
      x: centerX - (0.25 * screenWidth),
      y: centerY - (0.5 * screenHeight),
      itemStyle: {
        color: '#99af9d'
      }
    };

    const managerNode = {
      name: "Manager",
      message: this.profile.username ? this.profile.username.message : 'Manager of the team.',
      x: centerX,
      y: centerY,
      itemStyle: {
        color: '#E3E3E3'
      }
    };


    let userNode = { 'name': '', 'message': '', 'x': 0, 'y': 0, 'itemStyle': { color: '' } };
    if (this.agents.length > 1) {
      userNode = {
        name: `${this.profile.username} (${this.getMessageCountForAgent('Manager')})`,
        message: 'Dialog with the agent.',
        x: centerX - (0.25 * screenWidth),
        y: centerY - (0.8 * screenHeight),
        itemStyle: {
          color: '#b7a51d'
        }
      }
    } else {
      userNode = {
        name: `${this.profile.username} (${this.getMessageCountForAgent('Manager')})`,
        message: 'Dialog with the agents.',
        x: centerX - (0.25 * screenWidth),
        y: centerY - (0.8 * screenHeight),
        itemStyle: {
          color: '#b7858d'
        }
      }
    }


    const agentNodes = this.agents!.slice(1).map((agent, index) => {
      const angle = index * angleStep;
      const x = centerX - (0.25 * screenWidth) * Math.cos(angle); // 25% of screen width as radius
      const y = centerY + (0.25 * screenHeight) * Math.sin(angle); // 25% of screen height as radius
      return {
        name: agent.agent_name + ` (${this.getMessageCountForAgent(agent.agent_name)})`,
        message: agent.message,
        x,
        y
      };
    });


    const agentLinks = [
      ...agentNodes.map(agent => ({
        source: managerNode.name,
        target: agent.name
      })),
      ...agentNodes.map(agent => ({
        source: agent.name,
        target: managerNode.name
      })),
      {
        source: managerNode.name,
        target: proxyNode.name
      },
      {
        source: proxyNode.name,
        target: managerNode.name
      },
      {
        source: userNode.name,
        target: proxyNode.name
      },
      {
        source: proxyNode.name,
        target: userNode.name
      }
    ];

    this.options = {
      title: {
        text: (this.messages.length > 0 ? `Messages: ${this.messages.length}` : 'No messages Available'),
        subtext: (this.messages.length > 0 ? `Latest message from: ${this.messages[this.messages.length - 1]?.name}` : '')
      },
      tooltip: {
        formatter: (params) => {
          if (params.dataType === 'node') {
            if (params.data.name.split(' ')[0] === this.profile.username) {
              return `<h4>User</h4>`;
            }
            else if (params.data.name === 'Manager') {
              return `<h4>Team Orchestrator</h4>`;
            }
            else if (params.data.name.split(' ')[0] === `${this.profile.username}_Proxy`) {
              const actualAgentName = params.data.name.split(' ')[0];
              const node = this.agents!.find(agent => agent.agent_name === actualAgentName);
              const description = node!.message ? node.message : '';
              return `<h4>Persona:</h4> ${description.length > 400 ? description.slice(0, 300) + '...' : description}<h4>Last message:</h4> <pre>"${this.getMessagesForAgent(`${this.profile.username}_Proxy`)}"<pre/>`;
            }
            else if (params.data.name.split(' ')[0] === `${this.profile.username}_AI`) {
              const actualAgentName = params.data.name.split(' ')[0];
              const node = this.agents!.find(agent => agent.agent_name === actualAgentName);
              const description = node!.message ? node.message : '';
              return `<h4>Persona:</h4> ${description.length > 400 ? description.slice(0, 300) + '...' : description}<h4>Last message:</h4> <pre>"${this.getMessagesForAgent(`${this.profile.username}_AI`)}"<pre/>`;
            }
            else {
              const actualAgentName = params.data.name.split(' ')[0];
              const node = this.agents!.find(agent => agent.agent_name === actualAgentName);
              const description = node!.message ? node.message : '';
              return `<h4>Persona:</h4> ${description.length > 400 ? description.slice(0, 300) + '...' : description}<h4>Last message:</h4> <pre>"${this.getMessagesForAgent(params.data.name)}"<pre/>`;
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
          symbolSize: this.getSymbolSize(screenWidth, screenHeight),
          roam: true,
          draggable: true,
          scaleLimit: { min: 0.5, max: 1 },
          label: {
            show: true,
            fontSize: this.getFontSize(screenWidth),
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
            managerNode,
            proxyNode,
            ...(Object.keys(userNode).length ? [userNode] : []),
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
