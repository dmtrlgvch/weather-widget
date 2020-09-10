import React, { useState, useEffect } from 'react';

import { Button, Modal, Form, Col, Row } from 'react-bootstrap';

import './index.css';


function ModalAddCity(props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(props.show)
  }, [props])

  const handleClose = () => {
    setShow(false)
    props.changeModal(false)
  };

  function getGeoPosition() {
    navigator.geolocation.getCurrentPosition((pos) => {
      // console.log(pos);
      props.getCity(pos.coords)
    }, (err) => {
      console.log(err);
    });
  }
  function getCityName(e) {
    e.preventDefault()
    // console.log(e.target.city.value);
    props.getCity(e.target.city.value)
  }
  
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add city</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="secondary" onClick={getGeoPosition}>
            GEO
          </Button>
          <br />
          or
          <br />
          <Form onSubmit={getCityName}>
            <Form.Group as={Row} controlId="formPlaintextPassword">
              <Col sm="10">
                <Form.Control type="search" placeholder="City name" name="city"/>
              </Col>
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleClose}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalAddCity;
