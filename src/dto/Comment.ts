export interface Comment {
  id: number;
  writer: number;
  postId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
  };
}
