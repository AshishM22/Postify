import Feed from './Feed';

const Home = ( { searchResults ,fetchError , isLoading }) => {
    return (
        <main className="Home">
            {isLoading && <p className='statusMsg'> Loading post ...</p>}
            {!isLoading && fetchError && <p className='statusMsg' style={{color:'red'}}>{fetchError}</p>}
            {!isLoading && !fetchError && (searchResults.length ?  (
                <Feed searchResults={searchResults}  />
            ) : (
                <p style={{ marginTop: "2rem" }}>
                    No posts to display.
                </p>
            ))}
        </main>
    )
}

export default Home;
