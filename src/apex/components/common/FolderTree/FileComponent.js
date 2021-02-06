import React from 'react';
import Checkbox from './Checkbox';
import EditableName from './EditableName';
import styles from './folderTreeCSS.css'
import PropTypes from 'prop-types';

const FileComponent = ({ level, checked, handleCheck, filename, setMyName, selectMe, selected }) => (
  <div className={styles.file} style={{marginLeft: getInden(level)}}>
    <Checkbox status={checked} handleCheck={handleCheck} />

    <span className={selected ? [styles.fileText, styles.selected].join(' ') : styles.fileText} onClick={selectMe}>
      <i className={styles.fileIcon} style={{marginLeft: '10px'}} /> 
      <EditableName filename={filename} setMyName={setMyName} selected={selected} />
    </span>

  </div>
);

FileComponent.propTypes = {
  path: PropTypes.array.isRequired, 
  level: PropTypes.number.isRequired,
  checked: PropTypes.number.isRequired,
  filename: PropTypes.string.isRequired,
  selected: PropTypes.number.isRequired,
  
  selectMe: PropTypes.func.isRequired,
  setMyName: PropTypes.func.isRequired,
  handleCheck: PropTypes.func.isRequired,
};

function getInden(level) {
  return `${5 * level}px`;
}

export default FileComponent;