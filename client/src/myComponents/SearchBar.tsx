import React from "react";
import { BiSearch } from "react-icons/bi";

const SearchBar = () => {
  return (
    <div className="w-[80%] flex items-center justify-center input">
      <label htmlFor="input">
        <BiSearch size={25} />
      </label>
      <input
        id="input"
        type="text"
        placeholder="Search a Confession here"
        className="input text-lg w-full border-none placeholder:text-xs md:placeholder:text-lg outline-none focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
