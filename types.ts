export enum ChartType {
  BAR = 'BAR',
  LINE = 'LINE',
  AREA = 'AREA'
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ChartConfig {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  type: ChartType;
  data: ChartDataPoint[];
  explanation: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface KeyConcept {
  title: string;
  description: string;
  emoji: string;
  example: string;
}

export interface StudyModule {
  topic: string;
  summary: string;
  analogy: {
    title: string;
    story: string;
  };
  keyConcepts: KeyConcept[];
  chartData: ChartConfig | null;
  quiz: QuizQuestion[];
}