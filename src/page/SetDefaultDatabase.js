import React from "react";
import { Loader } from "../component/Loader";
import { EmptyEvaluationDB } from "../Firebase";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const rates = {
  1: "Normal/Slight",
  2: "Moderate",
  3: "NES",
  4: "End Stage",
  5: "Replaced",
};

export default class SetDefaultDatabase extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.emptyDatabase = this.emptyDatabase.bind(this);

    this.state = {
      loading: false,
      isModal: true,
      ResponseModal: false,
    };
  }

  async componentDidMount() {}

  async emptyDatabase() {
    this.setState({ loading: true, isModal: false });
    await EmptyEvaluationDB();
    this.setState({ loading: false, ResponseModal: true });
    this.props.history.push("/Home");
  }

  handleClose() {
    this.props.history.push("/Home");
  }

  render() {
    return (
      <React.Fragment>
        <section>
          <Loader loading={this.state.loading} />
        </section>

        <Modal show={this.state.isModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete All Xrays</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p style={{ color: "black" }}>
              Are you sure, you want to empty database? Warning: This can't be
              undone!
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              No
            </Button>
            <Button variant="primary" onClick={this.emptyDatabase}>
              Yes, I want to Clear Database
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.ResponseModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete All Xrays</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>All Xrays Deleted.</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}
