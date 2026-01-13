export interface Question {
  id: number;
  title: string;
  content: string;
  avgImportance: number;
}

export interface Category {
  id: number;
  name: string;
  depth: number;
  parentId: number | null;
  children?: Category[];
}
