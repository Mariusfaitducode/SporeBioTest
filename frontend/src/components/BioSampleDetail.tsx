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
import {
  confirmDeleteComment,
  confirmDeleteSample,
  getErrorMessage
} from '../utils';
import AddComment from './AddComment';
import CommentCard from './CommentCard';
import SampleInformation from './SampleInformation';

export default function BioSampleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sample, setSample] = useState<BioSample | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!sample) return;
    
    if (!confirmDeleteSample(sample.sampling_location, true)) {
      return;
    }

    try {
      await deleteBioSample(sample.id);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleAddComment = async (commentData: CommentCreate) => {
    try {
      setSubmittingComment(true);
      const createdComment = await createComment(commentData);
      setComments([...comments, createdComment]);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err; // Re-throw to let AddComment handle the error state
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirmDeleteComment()) {
      return;
    }

    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

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

      <SampleInformation sample={sample} />

      <section className="comments-section" aria-labelledby="comments-heading">
        <h2 id="comments-heading">Comments ({comments.length})</h2>
        
        {comments.length > 0 && (
          <div className="comments-list" role="list">
            {comments.map((comment) => (
              <CommentCard 
                key={comment.id}
                comment={comment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        )}

        <AddComment 
          biosampleId={sample.id}
          onAddComment={handleAddComment}
          isSubmitting={submittingComment}
        />
      </section>
    </div>
  );
} 