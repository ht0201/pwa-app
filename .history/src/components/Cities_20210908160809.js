import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';

export default function Cities() {
  const [data, setData] = useState([]);
  const [mode, setMode] = useState('online');

  useEffect(() => {
    let url = 'https://js-post-api.herokuapp.com/api/cities';

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        console.log('Success ', result);
        setData(result);
        localStorage.setItem('cities', JSON.stringify(result));
      })
      .catch((err) => {
        //   console.log('Error ', err);
        let dataCities = JSON.parse(localStorage.getItem('cities'));
        setData(dataCities);
      });
  }, []);
  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((city, index) => (
            <tr key={index}>
              <td>{city.code}</td>
              <td>{city.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
