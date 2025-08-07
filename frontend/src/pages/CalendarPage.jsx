import { useState, useEffect } from 'react';
import React from 'react';

import '../App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { CalendarApp, createViewMonthGrid } from '@schedule-x/calendar';
import "@schedule-x/theme-default/dist/calendar.css";

import { format } from "date-fns"

import ExerciseEventCard from '../components/ExerciseEventCard';

import WorkoutLogModal from '../components/WorkoutLogModal';

import useExerciseEventStore from '../store/useExerciseEventStore';


function CalendarPage() {

  const today = new Date()
  const todayDate = format(today, 'yyyy-MM-dd')



  const userID = localStorage.getItem("userID");


  const {
    upcomingEvents,
    monthlyEvents,
    fetchMonthlyEvents,
    fetchUpcomingEvents,
    createEvents,
    isLoading,
    error,
  } = useExerciseEventStore();

  const [eventCount, setEventCount] = useState(1);


  // Fetch on load
  useEffect(() => {
    if (userID) {
      fetchUpcomingEvents(userID);
      fetchMonthlyEvents(userID);
    }
  }, [userID]);

  //console.log(monthlyEvents);





  //PLACEHOLDER EVENT
  const myEvent = {
    id: 1,
    date: todayDate,
    time: '7:00pm',
    group: "Push"

  }

  // Necessary variables and functions for modal use START
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleShow = (data) => {
    // we recieve data into function 
    setModalData(data);

    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  // necessary variables and fucntions for modal use END


  const calendar = useCalendarApp({
    views: [createViewMonthGrid()],
    events: [],
    selectedDate: todayDate,
    callbacks: {
      onEventClick: (calendarEvent) => {

        handleShow(calendarEvent);

      },
    },

  });
  //incase calendar hasnt loaded yet check if it exists then check  if calendar events has loaded ans monthly events has loaded
  useEffect(() => {
    if (calendar && calendar.events && monthlyEvents.length > 0) {
      calendar.events.set(monthlyEvents);
    }
  }, [calendar, monthlyEvents]);



  return (
    <>
      <Container fluid className="h-100 w-100 main-container">

        <WorkoutLogModal
          show={showModal}
          handleClose={handleClose}
          data={modalData}
        // Pass the object as a prop
        />

        <Row className=" h-100 main-row">
          <Col className="main-column col-4">
            <Container className='container-fluid m-4 h-100 upcoming'>
              <h2 className="m-3 d-flex align-items-center justify-content-between">
                <span>Upcoming Events</span>
                <div className="d-flex align-items-center">
                  <input
                    type="number"
                    value={eventCount}
                    min={1}
                    className="form-control me-2"
                    style={{ width: '80px' }}
                    onChange={(e) => setEventCount(Number(e.target.value))}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      //const userID = localStorage.getItem('userID');
                      //if (!userID) return alert('User ID not found in localStorage');

                      await createEvents(userID, eventCount);
                      fetchUpcomingEvents(userID);
                      fetchMonthlyEvents(userID);
                    }}
                  >
                    Create Events
                  </button>
                </div>
              </h2>

              {isLoading && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}

              {upcomingEvents.length === 0 && !isLoading && (
                <p>No upcoming events.</p>
              )}

              {upcomingEvents.map((event) => (
                <ExerciseEventCard
                  key={event.id}
                  exerciseEvent={event}
                  onCardClick={() => handleShow(event)}
                />
              ))}
            </Container>
          </Col>
          <Col className="main-column calendar-container col-8">
            <ScheduleXCalendar calendarApp={calendar} className="calendar" />
          </Col>
        </Row>
      </Container>



    </>
  )
}

export default CalendarPage