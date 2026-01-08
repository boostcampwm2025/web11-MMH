export interface Problem {
  id: number;
  title: string;
  description: string;
  importance: number;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  problems: Problem[];
}
