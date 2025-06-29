import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    deleteBioSample,
    fetchBioSample,
} from '../api/biosample';
import {
    createComment,
    deleteComment,
    fetchCommentsByBioSample
} from '../api/comment';
import type { BioSample } from '../types/biosample';
import type { Comment, CommentCreate } from '../types/comment';

export default function BioSampleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sample, setSample] = useState<BioSample | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentDate, setCommentDate] = useState('');
  const [useTodayForComment, setUseTodayForComment] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      loadData(parseInt(id));
    }
  }, [id]);

  const loadData = async (sampleId: number) => {
    try {
      setLoading(true);
      setError(null);
      const [sampleData, commentsData] = await Promise.all([
        fetchBioSample(sampleId),
        fetchCommentsByBioSample(sampleId)
      ]);
      setSample(sampleData);
      setComments(commentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!sample) return;
    
    const confirmMessage = `Are you sure you want to delete the sample from "${sample.sampling_location}"? This action cannot be undone and will also delete all associated comments.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await deleteBioSample(sample.id);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete sample');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sample || !newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const commentData: CommentCreate = {
        biosample_id: sample.id,
        content: newComment.trim()
      };
      
      // Add date only if not using today's date
      if (!useTodayForComment && commentDate) {
        commentData.created_at = commentDate;
      }
      
      const createdComment = await createComment(commentData);
      setComments([...comments, createdComment]);
      setNewComment('');
      setCommentDate('');
      setUseTodayForComment(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="container">
        <div className="loading" role="status" aria-label="Loading sample details">
          Loading sample details...
        </div>
      </div>
    );
  }

  if (!sample) {
    return (
      <div className="container">
        <div className="error" role="alert">Sample not found</div>
        <Link to="/" className="back-button">
          ← Back to Samples
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/" className="back-button">
        ← Back to Samples
      </Link>

      <div className="page-header">
        <h1 className="page-title">{sample.sampling_location}</h1>
        <div className="form-actions">
          <Link to={`/edit/${sample.id}`}>
            <button className="secondary" aria-label="Edit this sample">
              Edit Sample
            </button>
          </Link>
          <button 
            className="danger" 
            onClick={handleDelete}
            aria-label="Delete this sample"
          >
            Delete Sample
          </button>
        </div>
      </div>

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      <div className="card">
        <h2>Sample Information</h2>
        
        <div className="sample-info">
          <div className="sample-info-item">
            <span className="sample-info-label">Sample ID</span>
            <span className="sample-info-value">#{sample.id}</span>
          </div>
          <div className="sample-info-item">
            <span className="sample-info-label">Location</span>
            <span className="sample-info-value">{sample.sampling_location}</span>
          </div>
          <div className="sample-info-item">
            <span className="sample-info-label">Type</span>
            <span className="sample-info-value">{sample.type}</span>
          </div>
          <div className="sample-info-item">
            <span className="sample-info-label">Sampling Date</span>
            <time className="sample-info-value" dateTime={sample.sampling_date}>
              {formatDate(sample.sampling_date)}
            </time>
          </div>
          <div className="sample-info-item">
            <span className="sample-info-label">Operator</span>
            <span className="sample-info-value">{sample.sampling_operator}</span>
          </div>
        </div>
      </div>

      <section className="comments-section" aria-labelledby="comments-heading">
        <h2 id="comments-heading">Comments ({comments.length})</h2>
        
        {comments.length === 0 ? (
          <p className="empty-state">
            No comments yet. Add the first comment below.
          </p>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <article key={comment.id} className="comment">
                <header className="comment-header">
                  <time className="comment-date" dateTime={comment.created_at}>
                    {formatDate(comment.created_at)}
                  </time>
                  <button 
                    className="danger small" 
                    onClick={() => handleDeleteComment(comment.id)}
                    aria-label="Delete this comment"
                  >
                    Delete
                  </button>
                </header>
                <p className="comment-content">{comment.content}</p>
              </article>
            ))}
          </div>
        )}

        <form onSubmit={handleAddComment} className="comment-form">
          <h3>Add Comment</h3>
          
          <div className="form-group">
            <label htmlFor="comment" className="required">Comment</label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter your comment..."
              rows={4}
              required
              aria-describedby="comment-help"
            />
            <small id="comment-help">Describe observations, findings, or notes about this sample.</small>
          </div>

          <div className="form-group">
              <legend>Comment Date</legend>
              
              <div className="date-group" role="radiogroup" aria-labelledby="date-options">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="today"
                    name="commentDateOption"
                    checked={useTodayForComment}
                    onChange={() => setUseTodayForComment(true)}
                  />
                  <label htmlFor="today">
                    Use today's date ({today})
                  </label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="custom-date"
                    name="commentDateOption"
                    checked={!useTodayForComment}
                    onChange={() => setUseTodayForComment(false)}
                  />
                  <label htmlFor="custom-date">
                    Specify a date
                  </label>
                </div>
                {!useTodayForComment && (
                <div >
                  <input
                    type="date"
                    id="commentDate"
                    value={commentDate}
                    onChange={(e) => setCommentDate(e.target.value)}
                    required={!useTodayForComment}
                  />
                </div>
              )}
              </div>

              
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={submittingComment || !newComment.trim()}
              aria-describedby={submittingComment ? "submitting-status" : undefined}
            >
              {submittingComment ? 'Adding Comment...' : 'Add Comment'}
            </button>
            {submittingComment && (
              <span id="submitting-status" aria-live="polite">
                Please wait...
              </span>
            )}
          </div>
        </form>
      </section>
    </div>
  );
} 