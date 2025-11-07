
export interface Question {
  id?: number;                 // <-- add this
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Assessment {
  id?: number;
  title: string;
  description: string;
  questions: Question[];
}
