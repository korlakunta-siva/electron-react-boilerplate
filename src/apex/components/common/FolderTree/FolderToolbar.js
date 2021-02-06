import React, { Component } from 'react';
import styles from './folderTreeCSS.css';
import PropTypes from 'prop-types';

class FolderToolbar extends Component {


	render() {
		return (
			<div className={styles.folderToolbar}>
				<div className={styles.addButton} onClick={this.props.toggleAddingNewFile}><i className={styles.addIcon} /> Add</div>
				<div className={styles.deleteButton} onClick={ () => { this.props.deleteObj(); } }><i className={styles.deleteIcon} /> Delete</div>
			</div>
		);
	}

}

FolderToolbar.propTypes = {
	deleteObj: PropTypes.func.isRequired,	
	toggleAddingNewFile: PropTypes.func.isRequired,
};

export default FolderToolbar;