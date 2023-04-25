import React, { useEffect, useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { UserProps } from "../App";
import "./CalendarMonth.css";
import { NavLink } from "react-router-dom";
import { API_URL } from "../config";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";
import { getCookie } from "../cookie";
import { useNavigate } from "react-router-dom";

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
  const TIME_ZONE = 9 * 60 * 60 * 1000;
  let now = new Date();
  const navigate = useNavigate();
  const [preSchedule, setPreSchedule] = useState<Array<EventData>>([]);
  const [schedule, setSchedule] = useState<Array<EventData>>([]);
  const clientUtcOffset = new Date().getTimezoneOffset() * -1; // 클라이언트의 UTC offset
  const clientDate = new Date().toUTCString();

  const handleViewChange = (newView: string) => {
    setView(newView as CalendarView);
  };

  const events: EventData[] = [];

  // 렌더링 전에 정보를 먼저 가져오기 위함
  useEffect(() => {
    getSchedule();
  }, []);

  // 글 상세정보와 댓글을 가져오기 함수
  const getSchedule = async () => {
    const getScheduleUrl = `${API_URL}/calendar/all`;
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const body = {
      userId: user?.id,
    };
    try {
      const res = await axios.post(getScheduleUrl, body, { headers });
      console.log(res);
      setSchedule(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "관리자에게 문의해주세요",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/error");
      }
    }
  };

  const createSchedule = async () => {
    const createScheduleUrl = `${API_URL}/calendar/create`;
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      Authorization: `Bearer ${token}`,
      "utc-offset": clientUtcOffset,
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
      console.log(formValues);
      const body = {
        userId: user?.id,
        title: title,
        start: new Date(start),
        end: new Date(end),
        location: location,
        description: description,
      };
      const res = await axios.post(createScheduleUrl, body, { headers });
      console.log(res);
    }
  };
  console.log(typeof schedule[0]?.start);
  for (let i in schedule) {
    events.push({
      id: schedule[i]?.id,
      title: schedule[i].title,
      start: new Date(schedule[i].start),
      end: new Date(schedule[i].end),
    });
  }
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
