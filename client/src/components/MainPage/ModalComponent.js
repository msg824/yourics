import React from 'react';
import Modal from 'react-bootstrap/Modal';
import './css/Modal.css';

class ModalComponent extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			show: false,
		};

		this.handleShow = () => {
			this.setState({ show: true });
		};

		this.handleHide = () => {
			this.setState({ show: false });
		};
	}

	render() {
		return (
			<>
				<Modal
					show={this.props.show}
					onHide={this.props.hide}
					dialogClassName="modalcss"
					aria-labelledby="example-custom-modal-styling-title"
				>
					<Modal.Header closeButton>
						<Modal.Title id="example-custom-modal-styling-title">
							'{this.props.modalTitle}' 검색 결과 {this.props.dataLength} 건
                        </Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div>
                            {this.props.content}
                        </div>
					</Modal.Body>
				</Modal>
			</>
		);
	}
}

export default ModalComponent

// export default () => (<div><ModalComponent /></div>)