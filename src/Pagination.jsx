import React from 'react'

const Pagination = ({totalCards, cardsPerPage, setCurrentPage, handlePagination}) => {
    let pages = [];
    for (let i = 1; i<= Math.ceil(totalCards / cardsPerPage); i++){
        pages.push(i);
    }
  return (
    <>
        {pages.map((page, index)=>(
            <button key={index} onClick={()=>{setCurrentPage(page);}}>{page}</button>
        ))}
    </>
  )
}

export default Pagination