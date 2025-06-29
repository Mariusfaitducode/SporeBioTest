import { useState } from 'react';
import type { CommentCreate } from '../types/comment';
import { getTodayDateString } from '../utils';

interface AddCommentProps {
  biosampleId: number;
  onAddComment: (commentData: CommentCreate) => Promise<void>;
  isSubmitting: boolean;
}

export default function AddComment({ biosampleId, onAddComment, isSubmitting }: AddCommentProps) {
  const [newComment, setNewComment] = useState('');
  const [commentDate, setCommentDate] = useState('');
  const [useTodayForComment, setUseTodayForComment] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentData: CommentCreate = {
      biosample_id: biosampleId,
      content: newComment.trim()
    };
    
    // Add date only if not using today's date
    if (!useTodayForComment && commentDate) {
      commentData.created_at = commentDate;
    }
    
    await onAddComment(commentData);
    
    // Reset form after successful submission
    setNewComment('');
    setCommentDate('');
    setUseTodayForComment(true);
  };

  const today = getTodayDateString();

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <h3>Add Comment</h3>
      
      <div className="form-field">
        <label htmlFor="comment-content">Comment</label>
        <textarea
          id="comment-content"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Enter your comment..."
          required
          aria-describedby="comment-help"
        />
        <small id="comment-help" className="form-help">
          Add observations, notes, or any relevant information about this sample.
        </small>
      </div>

      <div className="form-date-group">
        <label htmlFor="comment-date">Comment Date</label>
        <div className="date-group" role="radiogroup">
          <label className="radio-option">
            <input
              type="radio"
              name="commentDateOption"
              value="today"
              checked={useTodayForComment}
              onChange={() => setUseTodayForComment(true)}
            />
            <span className="radio-label">Use today's date</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="commentDateOption"
              value="specify"
              checked={!useTodayForComment}
              onChange={() => setUseTodayForComment(false)}
            />
            <span className="radio-label">Specify date</span>
          </label>
          {!useTodayForComment && (
          <div className="form-field">
            <input
              type="date"
              id="comment-date"
              value={commentDate}
              onChange={(e) => setCommentDate(e.target.value)}
              max={today}
              required
            />
          </div>
        )}
        </div>
        
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting || !newComment.trim()}>
          {isSubmitting ? 'Adding...' : 'Add Comment'}
        </button>
      </div>
    </form>
  );
} 