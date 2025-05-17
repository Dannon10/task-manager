import { Link } from 'react-router-dom';
import { Warning24Regular } from '@fluentui/react-icons';
import './error404.css';

const Error404 = () => {
    return (
        <div className="error-container">
            <div className="error-content">
                <div className="error-image">
                    <Warning24Regular />
                </div>
                <h1 className="error-title">Oops! Page Not Found</h1>
                <p className="error-description">Sorry, the page you're looking for doesn't exist.</p>
                <Link to="/" className="error-button">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Error404;
