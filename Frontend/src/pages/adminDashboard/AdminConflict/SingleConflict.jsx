import React from 'react'
import { useParams } from 'react-router-dom'

const SingleConflict = () => {
    const { id } = useParams()
    console.log(id)

    return <div>SingleConflict</div>
}

export default SingleConflict
