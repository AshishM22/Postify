import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useContext } from 'react';
import DataContext from './context/DataContext';
import axios from 'axios';



const PostPage = () => {
    const { id } = useParams();
    const post = posts.find(post => (post.id).toString() === id);
    const navigate = useNavigate();
    const { posts ,baseUrl ,setPosts } = useContext(DataContext);
    
    
  const handleDelete = async (id) => {
    try{
      await axios.delete(`${baseUrl}/${id}`)
      const postsList = posts.filter(post => post.id !== id);
        setPosts(postsList);
        navigate('/');
      }catch(err){
      console.log(err);
    }    
  }
   

    return (
        <main className="PostPage">
            <article className="post">
                {post &&
                    <>
                        <h2>{post.title}</h2>
                        <p className="postDate">{post.datetime}</p>
                        <p className="postBody">{post.body}</p>
                        <Link to={`/post/edit/${post.id}`}><button className="editButton">Edit Post</button></Link>
                        <button className="deleteButton" onClick={() => handleDelete(post.id)}>
                            Delete Post
                        </button>
                    </>
                }
                {!post &&
                    <>
                        <h2>Post Not Found</h2>
                        <p>Well, that's disappointing.</p>
                        <p>
                            <Link to='/'>Visit Our Homepage</Link>
                        </p>
                    </>
                }
            </article>
        </main>
    )
}

export default PostPage