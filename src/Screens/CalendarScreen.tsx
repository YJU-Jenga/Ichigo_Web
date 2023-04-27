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
import { ClientRequest } from "http";

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
  let now = new Date();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Array<EventData>>([]);
  const utcOffset = new Date().getTimezoneOffset() * -1; // 클라이언트의 UTC offset
  const [modalOpen, setModalOpen] = useState(false);
  const [hihi, setHihi] = useState(false);

  const handleViewChange = (newView: string) => {
    setView(newView as CalendarView);
  };

  const events: EventData[] = [];

  // 렌더링 전에 정보를 먼저 가져오기 위함
  useEffect(() => {
    getSchedule();
  }, []);

  useEffect(() => {
    getSchedule();
  }, [hihi]);

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
    };
    const body = {
      userId: user?.id,
      title: title,
      start: new Date(start),
      end: new Date(end),
      location: location,
      description: description,
      utcOffset: utcOffset,
    };
    const res = await axios.post(createScheduleUrl, body, { headers });
    console.log(res);
    if (res.status === 201) {
      setHihi(!hihi);
    }
  };

  for (let i in schedule) {
    events.push({
      id: schedule[i]?.id,
      title: schedule[i].title,
      start: new Date(
        new Date(schedule[i].start).getTime() - utcOffset * 60000
      ),
      end: new Date(new Date(schedule[i].end).getTime() - utcOffset * 60000),
    });
  }
  return (
    <div>
      <button
        className="text-white bg-red-500 font-medium py-1 px-4 border rounded-lg tracking-wide mr-1 hover:bg-red-600"
        type="button"
        onClick={() => setModalOpen(true)}
      >
        일정 추가
      </button>
      {modalOpen ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font-bold">일정추가</h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setModalOpen(false)}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <form className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full">
                    <label className="block text-black text-sm font-bold mb-1">
                      제목
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      onChange={(event) => setTitle(event.target.value)}
                    />
                    <label className="block text-black text-sm font-bold mb-1">
                      설명
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      onChange={(event) => setDescription(event.target.value)}
                    />
                    <label className="block text-black text-sm font-bold mb-1">
                      장소
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      onChange={(event) => setLocation(event.target.value)}
                    />
                    <label className="block text-black text-sm font-bold mb-1">
                      시작
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      type="datetime-local"
                      onBlur={(event) => setStart(event.target.value)}
                    />
                    <label className="block text-black text-sm font-bold mb-1">
                      끝
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      type="datetime-local"
                      onBlur={(event) => setEnd(event.target.value)}
                    />
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      createSchedule();
                      setModalOpen(false);
                    }}
                  >
                    일정 추가
                  </button>
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setModalOpen(false)}
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={handleViewChange}
        views={[CalendarView.DAY, CalendarView.WEEK, CalendarView.MONTH]}
      />
    </div>
  );
};
export default CalendarScreen;

// className={
//   modalOpen ? `z-10 fixed top-0 left-0 w-full bg-black opacity-70` : ""
// }
