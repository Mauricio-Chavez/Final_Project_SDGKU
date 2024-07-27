
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './FileInput.css';
import { faEdit } from '@fortawesome/free-solid-svg-icons';



const FileInput = ({ onChange}:any) => {
    return (
        <div className="file-input-container">
            <input
                type="file"
                id="file-input"
                className="file-input"
                onChange={onChange}
            />
            <label htmlFor="file-input" className="file-input-label">
                <FontAwesomeIcon icon={faEdit}/>&nbsp; &nbsp;Select File
            </label>
        </div>
    );
};

export default FileInput;