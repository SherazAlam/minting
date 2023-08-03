import React from 'react'

const CardNFT = ({name, description, image}) => {
    return (
        <div className="card">
            <img src={image} alt="" />
            <h1>{name}</h1>
            <p>{description}</p>
        </div>
    )
}

export default CardNFT