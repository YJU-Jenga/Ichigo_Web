import React, { useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { UserProps } from "../App";
import "./CalendarMonth.css";

moment.locale("ko-KR");
const localizer = momentLocalizer(moment);

interface EventData {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

enum CalendarView {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
}

const CalendarScreen = ({ user }: UserProps) => {
  const [view, setView] = useState<CalendarView>(CalendarView.MONTH);

  const handleViewChange = (newView: string) => {
    setView(newView as CalendarView);
  };

  const events: EventData[] = [
    {
      id: 1,
      title: "Test Event 1",
      start: new Date("2023-04-20T10:00:00Z"),
      end: new Date("2023-04-20T11:30:00Z"),
    },
    {
      id: 2,
      title: "Test Event 2",
      start: new Date("2023-04-22T14:00:00Z"),
      end: new Date("2023-04-25T15:30:00Z"),
    },
  ];

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      view={view}
      onView={handleViewChange}
      views={[CalendarView.DAY, CalendarView.WEEK, CalendarView.MONTH]}
    />
  );
};

export default CalendarScreen;
