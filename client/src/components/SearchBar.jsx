import {useState} from "react"
import {debounce} from "lodash";
function SearchBar({onSearch}){

    const [keyword,setKeyWord]=useState("");
    const debouncedSearch=debounce((value)=>{
        onSearch(value);
    },500);
    return(
        <input
        type="text"
        placeholder="Search songs..."
        value={keyword}
        onChange={(e)=>{
            setKeyWord(e.target.value);
            debouncedSearch(e.target.value);
        }}
        />
    )
}

export default SearchBar;