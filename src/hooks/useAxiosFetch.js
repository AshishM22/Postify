import { useState , useEffect } from "react";
import axios from 'axios';

const useAxiosFetch = (url) => {
    const[data,setData] = useState([]);
    const[fetchError,setFetchError] = useState(null);
    const[isLoading,setIsLoading] = useState(false);
    
    useEffect(() => {
        let isMounted = true;
        const source = axios.CancelToken.source();
        const fetchData = async (url) => {
            setIsLoading(true);

            try{
                const response = await axios.get(url,{ cancelToken : source.token});
                if(isMounted){
                    setData(response.data);
                    setFetchError()
                }
            }catch(err){
                if(isMounted){
                    setFetchError(err.message);
                    setData([]);
                }
            }
            finally{
                isMounted && setIsLoading(false);
            }
        }
        fetchData(url);

        const cleanup = () => {
            isMounted = false;
            source.cancel();
        }
        return cleanup;
    },[url]);

    return {data ,fetchError , isLoading};
}
export default useAxiosFetch;