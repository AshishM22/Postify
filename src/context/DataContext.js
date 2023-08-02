import { Route, Routes } from 'react-router-dom';
import useAxiosFetch from '../hooks/useAxiosFetch';
import {  useState ,useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { createContext } from 'react';


const DataContext = createContext({});
const baseUrl = 'http://localhost:3500/post';


export const DataProvider = ({children}) => {

    
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
   const handleDelete = async (id) => {
        console.log('Deleting the post with ' + id);
       try{
            await axios.delete(`${baseUrl}/${id}`)
            const postsList = posts.filter(post => post.id !== id);
            setPosts(postsList);
            navigate('/');
        }
        catch(err){ 
            console.log('Hello')
            console.log(err)  }    
          }
 

 
  

    return (
        <DataContext.Provider value={{
            search ,setSearch,
            searchResults,fetchError,isLoading,
            handleSubmit,postTitle,setPostTitle,postBody,setPostBody,
            posts,handleEdit,editBody,editTitle,setEditTitle,setPosts,
            setEditBody,handleDelete
           
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;