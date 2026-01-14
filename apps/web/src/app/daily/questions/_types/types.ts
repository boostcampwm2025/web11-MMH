export interface Question {
  id: number;
  title: string;
  content: string;
  ttsUrl: string | null;
  avgScore: number;
  avgImportance: number;
  categoryId: number;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
  depth: number;
  parentId: number | null;
  children?: Category[];
}
