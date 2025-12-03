import React, {useState} from "react";

const SearchModule = ({onSearch}) => {
    const [city, setCity] = useState("");

    const handleSearch = () => {
        if (city.trim() !== "") {
            onSearch(city);
        } else {
            alert("Please enter a city name.");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            <input
                type="text"
                id="city"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyPress}
            />
            <button onClick={handleSearch}>Search</button>
        </>
    );
};

export default SearchModule;