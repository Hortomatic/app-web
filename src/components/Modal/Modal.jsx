'use strict';

require('./Modal.css');

import React, {findDOMNode} from 'react';

import createLayeredComponent from 'createLayeredComponent';

import {contextTypes} from 'Context';

export class Modal extends React.Component {

	static propTypes = {
		isOpen: React.PropTypes.bool
	,	title: React.PropTypes.string
	,	onCloseIntent: React.PropTypes.func
	,	children: React.PropTypes.node.isRequired
	,	footer: React.PropTypes.node
	}

	static contextTypes = contextTypes

	constructor() {
		super();
		this.handleMouseClickOutside = this.handleMouseClickOutside.bind(this);
	}

	getDefaultProps(){
		return {
			isOpen: false
		}
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleMouseClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleMouseClickOutside);
	}

	render() {
		var $root = this.context.morearty.getBinding();
		if(!this.props.isOpen){
			if($root.get(['app', 'isModalOpen'])===true)
				$root.set(['app', 'isModalOpen'], false);
			return null;
		}

		//inform the app state that there is a modal open
		$root.set(['app', 'isModalOpen'], true);

		return (
			<div className="Modal" ref="backdrop">
				<div className="Modal-box" ref="modal">
					<div className="Modal-header">
						{!this.props.title || <h1>{this.props.title}</h1>}
					</div>
					<div className="Modal-content" ref="content">
						{this.props.children}
					</div>
					<div className="Modal-footer">
						{this.props.footer}
					</div>
				</div>
			</div>
		);
	}

	handleMouseClickOutside(e) {
		if( this.props.isOpen && this.refs.modal.contains(e.target) ) {
			return
		}
		e.stopPropagation()
		this.props.onCloseIntent()
	}

}

export default Modal

// export default createLayeredComponent(function(props) {
//   return (
//     <Modal {...props}>
//       {props.children}
//     </Modal>
//   )
// })