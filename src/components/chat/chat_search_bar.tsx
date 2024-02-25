import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const chat_search_bar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit">검색</button>
    </form>
  );
};

export default chat_search_bar;