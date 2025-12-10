export interface Task {
  id?: number | string;
  title?: string;
  deadline?: Date;
  completed?: boolean;
  archived?: boolean;
}
