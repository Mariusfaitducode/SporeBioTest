
export type Comment = {
    id: number;
    biosample_id: number;
    content: string;
    created_at: string;
  };
  
  export type CommentCreate = {
    biosample_id: number;
    content: string;
    created_at?: string;
  };