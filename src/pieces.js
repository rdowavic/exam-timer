import React from 'react'
import Moment from 'react-moment'
import chrono from 'chrono-node'
import { Modal, Button, Form, FormGroup, ControlLabel, Col, FormControl} from 'react-bootstrap'

export const Settings = (props) => {
  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Configure Timer</Modal.Title>
        <Modal.Body>
          <Form horizontal>
          <FormGroup controlId="formHorizontalName">
            <Col componentClass={ControlLabel} sm={6}>
              The name of this event is
            </Col>
            <Col sm={6}>
              <FormControl
                onChange={props.handleChange}
                name="eventName"
                type="text" placeholder="COMP2007 Quiz" />
            </Col>
          </FormGroup>
          <FormGroup
            controlId="formHorizontalReading">
            <Col componentClass={ControlLabel} sm={6}>
              The Exam starts
            </Col>
            <Col sm={6}>
              <FormControl name="startTime" onChange={props.handleChange} type="text" placeholder="at 10:30 am" />
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalReading">
            <Col componentClass={ControlLabel} sm={6}>
              Reading time goes for
            </Col>
            <Col sm={6}>
              <FormControl name="readingTime" onChange={props.handleChange} type="text" placeholder="10 minutes" />
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalDuration">
            <Col componentClass={ControlLabel} sm={6}>
              The duration is
            </Col>
            <Col sm={6}>
              <FormControl name="durationTime" onChange={props.handleChange} type="text" placeholder="2 hours" />
            </Col>
          </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ props.applyChanges }>Save</Button>
        </Modal.Footer>
      </Modal.Header>
    </Modal>
  )
}

export const Interval = (props) => {
  return (
    <div style={{ padding: 10 }} className={ props.isActive ? 'interval-active' : '' }>
      <h3>{ props.name }  <Moment format="h:mm a">{ props.time }</Moment></h3>
    </div>
  )
}
