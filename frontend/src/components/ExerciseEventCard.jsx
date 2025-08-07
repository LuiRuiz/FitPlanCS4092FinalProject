import React from 'react';

import { Card } from "react-bootstrap"
// will take an exercise event object
function ExerciseEventCard({ onCardClick, exerciseEvent }) {
  //here you would declare any functions from exerciseEvent store
  //now we return the card

  return (
    <Card className="mt-2 mb-2" onClick={onCardClick}>
      <Card.Header as="h5">{exerciseEvent.date}</Card.Header>
      <Card.Body>
        <Card.Title>{exerciseEvent.exercise_group}</Card.Title>
        <Card.Text>
          {exerciseEvent.time}
        </Card.Text>
      </Card.Body>
    </Card>

  )
}

export default ExerciseEventCard
