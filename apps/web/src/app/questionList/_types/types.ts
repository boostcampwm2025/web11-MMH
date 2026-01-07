export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: number;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  problems: Problem[];
}