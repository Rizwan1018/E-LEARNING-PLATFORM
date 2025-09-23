export interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Assessment {
  id?: string;
  title: string;
  description: string;
  questions: Question[];
}