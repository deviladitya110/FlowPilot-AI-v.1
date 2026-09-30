import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Zap } from 'lucide-react';

const initialNodes = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'Request Received' }, type: 'input' },
  { id: '2', position: { x: 250, y: 150 }, data: { label: 'AI Analysis Engine' }, style: { border: '2px solid #FFD400', background: '#101010', color: '#fff' } },
  { id: '3', position: { x: 250, y: 250 }, data: { label: 'Evaluate Business Rules' } },
  { id: '4', position: { x: 100, y: 350 }, data: { label: 'Human Review' }, style: { border: '1px solid #f59e0b', color: '#fff', background: '#101010' } },
  { id: '5', position: { x: 400, y: 350 }, data: { label: 'Auto Process Action' }, style: { border: '1px solid #22c55e', color: '#fff', background: '#101010' } },
  { id: '6', position: { x: 250, y: 450 }, data: { label: 'Notification Sent' }, type: 'output' },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#FFD400' } },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4', label: 'High Risk / Edge Case' },
  { id: 'e3-5', source: '3', target: '5', label: 'Standard / Safe' },
  { id: 'e4-6', source: '4', target: '6' },
  { id: 'e5-6', source: '5', target: '6' },
];

export const WorkflowBuilder = () => {
  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center">
          <Zap className="mr-2 h-6 w-6 text-primary" />
          Workflow Builder (Demo)
        </h2>
        <p className="text-text-secondary mt-1">Visualize how requests are processed through the AI pipeline.</p>
      </div>

      <Card className="flex-1 overflow-hidden">
        <div style={{ height: '100%' }}>
          <ReactFlow 
            nodes={initialNodes} 
            edges={initialEdges}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#262626" gap={16} />
            <Controls style={{ background: '#101010', color: '#FFD400', border: 'none' }} />
          </ReactFlow>
        </div>
      </Card>
    </div>
  );
};
