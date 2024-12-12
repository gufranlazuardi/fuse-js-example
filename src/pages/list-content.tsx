import React from 'react';

interface ListContentProps {
  results: { title: string; _id: number | string }[];
}

const ListContent: React.FC<ListContentProps> = ({ results }) => {
  return (
    <div className="flex flex-col gap-2">

      {results.length > 0 ? (
        results.map((item) => (
          <div key={item._id} className="flex gap-2">
            <h2>{item.title}</h2>
          </div>
        ))
      ) : (
        <p>No results found</p> 
      )}
    </div>
  );
};

export default ListContent;
