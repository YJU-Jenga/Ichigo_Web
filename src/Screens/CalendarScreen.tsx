import React, { useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { UserProps } from "../App";
import "./CalendarMonth.css";
import { NavLink } from "react-router-dom";
import { API_URL } from "../config";
import Swal from "sweetalert2";
import axios from "axios";
import { getCookie } from "../cookie";

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
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  let now = new Date().toISOString().slice(0, 16);

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

  const createSchedule = async () => {
    const createScheduleUrl = `${API_URL}/calendar/create`;
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const { value: formValues } = await Swal.fire({
      title: "스케줄 입력",
      html:
        '<input id="title" class="swal2-input" placeholder="제목">' +
        '<input id="description" class="swal2-input" placeholder="설명">' +
        '<input id="location" class="swal2-input" placeholder="위치">' +
        "<br/>" +
        '<label for="start" class="font-bold">시작 : </label>' +
        `<input id="start" type="datetime-local" name="start" value=${now} />` +
        "<br/>" +
        '<label for="end" class="font-bold">끝 : </label>' +
        `<input id="end" type="datetime-local" name="start" value=${now} />`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          setTitle(
            (document.getElementById("title") as HTMLInputElement)?.value
          ),
          setDescription(
            (document.getElementById("description") as HTMLInputElement)?.value
          ),
          setLocation(
            (document.getElementById("location") as HTMLInputElement)?.value
          ),
          setStart(
            (document.getElementById("start") as HTMLInputElement)?.value
          ),
          setEnd((document.getElementById("end") as HTMLInputElement)?.value),
        ];
      },
    });

    if (formValues) {
      const body = {
        userId: user?.id,
        title: title,
        start: start,
        end: end,
        location: location,
        description: description,
      };
      const res = await axios.post(createScheduleUrl, body, { headers });
      console.log(res);
    }
  };
  return (
    <>
      <button
        onClick={createSchedule}
        className="text-white bg-red-500 font-medium py-1 px-4 border rounded-lg tracking-wide mr-1 hover:bg-red-600"
      >
        일정 추가
      </button>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={handleViewChange}
        views={[CalendarView.DAY, CalendarView.WEEK, CalendarView.MONTH]}
      />
    </>
  );
};
export default CalendarScreen;
