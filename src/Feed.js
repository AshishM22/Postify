import Post from './Post';


const Feed = ({ searchResults}) => {
 
    return (
        <>
            {searchResults.map(post => (
                <Post key={searchResults.id} post={post} />
            ))}
        </>
    )
}

export default Feed;