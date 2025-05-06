import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
    return (
        <div className="h-screen">
            Page not Found<Link to="/">Go to main</Link>
        </div>
    )
}
