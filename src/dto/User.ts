export interface Board {
  id: number;
  writer: number;
  boardId: number;
  title: string;
  password: string;
  content: string;
  hit: number;
  state: boolean;
  secret: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  user: Object;
}
