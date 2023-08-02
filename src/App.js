import Layout from './Layout';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import EditPost from './EditPost';
import { Route, Routes } from 'react-router-dom';
import useAxiosFetch from './hooks/useAxiosFetch';
import {  useState ,useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';


function App() {

  const baseUrl = 'http://localhost:3500/post';
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const navigate = useNavigate();
  const {data , fetchError , isLoading} = useAxiosFetch(baseUrl);
 

    
  useEffect( () => { setPosts(data) },[data]);

  useEffect(() => {
    const filteredResults = posts.filter((post) =>
      ((post.body).toLowerCase()).includes(search.toLowerCase())
      || ((post.title).toLowerCase()).includes(search.toLowerCase()));

    setSearchResults(filteredResults.reverse());
  }, [posts, search])

  const handleSubmit = async (e) => {
        e.preventDefault();
        const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const newPost = { id, title: postTitle, datetime, body: postBody };
        try{
            const respone = await axios.post(`${baseUrl}`,newPost);
            const allPosts = [...posts, respone.data];
            setPosts(allPosts);
            setPostTitle('');
            setPostBody('');
            navigate('/');
        }
        catch(err){  console.log(err) }   
  }

  async function handleEdit(id) {
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const updatedPost = { id, title: editTitle, datetime, body: editBody };
        try{
          const respone = await axios.put(`${baseUrl}/${id}`,updatedPost);
          setPosts(posts.map(post => post.id === id ? {...respone.data} : post));
          setEditTitle("");
          setEditBody("");
          navigate('/');
        }catch(err){ console.log(err)  }
  }
 

  return (
      <Routes>
    
        <Route path="/" element={<Layout search={search} setSearch={setSearch}/>}>      
          
          <Route index element={<Home  searchResults={searchResults} fetchError={fetchError} isLoading={isLoading} />} />

          <Route path="post">
            
            <Route index element={<NewPost 
              handleSubmit={handleSubmit} postTitle={postTitle} setPostTitle={setPostTitle} 
              postBody={postBody} setPostBody={setPostBody}
             />} />

            <Route path="edit/:id" element={<EditPost posts={posts} handleEdit={handleEdit} editTitle={editTitle} editBody={editBody} setEditTitle={setEditTitle} setEditBody={setEditBody} />} />

            <Route path=":id" element={<PostPage posts={posts} baseUrl={baseUrl} setPosts={setPosts}/>} />

          </Route>
          
          <Route path="about" element={<About />} />
          <Route path="*" element={<Missing />} />

        </Route>

       </Routes>
  
  );
}

export default App;