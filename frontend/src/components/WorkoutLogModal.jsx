import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import useWorkoutLogStore from '../store/useWorkoutLogStore';

function WorkoutLogModal({ show, handleClose, data }) {
  const {
    logs,
    isLoading,
    error,
    fetchWorkoutLogs,
    clearLogs,
    updateWorkoutLog,
  } = useWorkoutLogStore();

  const [editableLogs, setEditableLogs] = useState([]);

  useEffect(() => {
    if (show && data?.id) {
      fetchWorkoutLogs(data.id);
    }
  }, [show, data]);

  useEffect(() => {
    setEditableLogs(
      logs.map(log => ({
        ...log,
        reps: log.reps || '',
        sets: log.sets || '',
        weight: log.weight || '',
      }))
    );
  }, [logs]);

  const handleChange = (index, field, value) => {
    const updated = [...editableLogs];
    updated[index][field] = value;
    setEditableLogs(updated);
  };

  const handleSubmit = async () => {
    const updateResults = await Promise.all(
      editableLogs.map((log) =>
        updateWorkoutLog(log.id, {
          reps: log.reps,
          sets: log.sets,
          weight: log.weight,
        })
      )
    );

    const allSucceeded = updateResults.every((success) => success);

    if (allSucceeded) {
      console.log('All logs updated successfully!');
    } else {
      console.warn('Some logs failed to update.');
    }

    handleClose();
  };

  const handleModalClose = () => {
    clearLogs();
    setEditableLogs([]);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Log Workout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <p>Loading logs...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!isLoading && editableLogs.length === 0 && <p>No logs available.</p>}

        <Form>
          {editableLogs.map((log, index) => (
            <div key={log.id} className="mb-3 p-3 border rounded">
              <h6 className="mb-3">{log.workout_name || 'Workout'}</h6>
              <Row className="align-items-center">
                <Col xs="4" sm="3" md="2">
                  <Form.Label className="mb-1">Reps</Form.Label>
                  <Form.Control
                    size="sm"
                    type="number"
                    value={log.reps}
                    onChange={(e) => handleChange(index, 'reps', e.target.value)}
                  />
                </Col>
                <Col xs="4" sm="3" md="2">
                  <Form.Label className="mb-1">Sets</Form.Label>
                  <Form.Control
                    size="sm"
                    type="number"
                    value={log.sets}
                    onChange={(e) => handleChange(index, 'sets', e.target.value)}
                  />
                </Col>
                <Col xs="4" sm="3" md="2">
                  <Form.Label className="mb-1">Weight</Form.Label>
                  <Form.Control
                    size="sm"
                    type="number"
                    value={log.weight}
                    onChange={(e) => handleChange(index, 'weight', e.target.value)}
                  />
                </Col>
              </Row>
            </div>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default WorkoutLogModal;
