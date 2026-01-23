export interface Tab {
  name: string;
  id: string;
}

export interface TimelineStep {
  number: number;
  title: string;
  description: string;
}

export interface ResourceAllocation {
  role: string;
  allocation: string;
  phase: string;
}

export interface SprintTask {
  number: number;
  title: string;
  description: string;
  storyPoints: number;
  subtasks: string[];
}

export interface TeamMember {
  name: string;
  availability: string;
  storyPoints: number;
}
