import React from 'react';
import styles from './folderTreeCSS.css'
import PropTypes from 'prop-types';

class EditableName extends React.Component {

	constructor(props) {
    super(props);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);

    this.state = {
    	editing: false,
    	selected: false,
    };
  }

  componentWillReceiveProps(nextProps) {
  	if (nextProps.selected === 1)
  		this.setState({selected: 1});
  	else 
  		this.setState({selected: 0});
  }

  toggleEditing() {
  	this.setState(prevState => ({editing: !prevState.editing}));
  	if (this.state.editing) {						// TODO: this doesn't work 
  		this.textInput.focus();
  	}
  }

  handleChangeName() {
  	this.props.setMyName(this.textInput.value);
  	this.toggleEditing();
  }

	render() { 
		const input = (
			<span>
				<input type="text" defaultValue={this.props.filename} ref={ input => { this.textInput = input; } } />
				<i className={styles.OKIcon} onClick={this.handleChangeName} />
				<i className={styles.NoIcon} onClick={this.toggleEditing} />
			</span>
		);

		const name = (
			<span>
				{' ' + this.props.filename + ' '}
				{ this.state.selected === 1 && <i className={styles.pencilIcon} onClick={this.toggleEditing} /> }
			</span>
		);

		return (	
			<span>
    		{ this.state.editing? input : name }
  		</span>
		);
	}

}

EditableName.propTypes = {
	filename: PropTypes.string.isRequired,
	setMyName: PropTypes.func.isRequired,
	selected: PropTypes.number.isRequired,
};


export default EditableName;