import type { Comment } from '../types/comment';
import { formatDate } from '../utils';

interface CommentCardProps {
  comment: Comment;
  onDelete: (commentId: number) => void;
}

export default function CommentCard({ comment, onDelete }: CommentCardProps) {
  const handleDelete = () => {
    onDelete(comment.id);
  };

  return (
    <article className="comment" role="listitem">
      <div className="comment-header">
        <time className="comment-date" dateTime={comment.created_at}>
          {formatDate(comment.created_at)}
        </time>
        <button 
          className="danger small"
          onClick={handleDelete}
          aria-label="Delete this comment"
        >
          Delete
        </button>
      </div>
      <p className="comment-content">{comment.content}</p>
    </article>
  );
} 