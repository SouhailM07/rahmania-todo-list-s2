export interface Task_i {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type filters_t = "all" | "active" | "completed";
