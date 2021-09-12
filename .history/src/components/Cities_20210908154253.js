import React, { useEffect } from 'react';

export default function Cities() {
  const [data, setData] = useState([]);
  useEffect(() => {
    let url = 'https://js-post-api.herokuapp.com/api/cities';
    fetch(url).then((res) => res.json());
  }, []);
  return <div></div>;
}
