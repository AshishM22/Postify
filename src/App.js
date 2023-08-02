import Layout from './Layout';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import EditPost from './EditPost';
import { DataProvider  } from './context/DataContext';
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
    catch(err){
      console.log(err);
    }   
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
    }catch(err){

    }
  }
 

  return (
    <DataProvider>
      <Routes>
    
        <Route path="/" element={<Layout />}>      
          
          <Route index element={<Home />} />

          <Route path="post">
            <Route index element={<NewPost />} />
            <Route path="edit/:id" element={<EditPost />} />
            <Route path=":id" element={<PostPage />} />
          </Route>
          
          <Route path="about" element={<About />} />
          <Route path="*" element={<Missing />} />

        </Route>

       </Routes>
    </DataProvider>
  );
}

export default App;