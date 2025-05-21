export interface Project {
  id: number;
  name: string;
  status: 'in_progress' | 'completed' | 'delayed';
  progress: number;
  dueDate: string;
  team: string[];
}
