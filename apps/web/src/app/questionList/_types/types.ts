export interface Question {
  id: number;
  title: string;
  context: string;
  importance: number;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  questions: Question[];
}
