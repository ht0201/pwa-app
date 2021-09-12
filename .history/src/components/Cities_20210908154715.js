import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';

export default function Cities() {
  const [data, setData] = useState([]);
  useEffect(() => {
    let url = 'https://js-post-api.herokuapp.com/api/cities';

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        console.log('Success ', result);
        setData(result);
      })
      .catch((err) => console.log('Error ', err));
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
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}
