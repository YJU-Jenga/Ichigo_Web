import React, { useEffect, useState } from "react";
import { UserProps } from "../App";
import "./CalendarMonth.css";
import { API_URL } from "../config";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";
import { getCookie } from "../cookie";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

interface EventData {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

const CalendarScreen = ({ user }: UserProps) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Array<EventData>>([]);
  const utcOffset = new Date().getTimezoneOffset() * -1; // 클라이언트의 UTC offset
  const [modalOpen, setModalOpen] = useState(false);
  const [hihi, setHihi] = useState(false);

  const events: EventData[] = [];

  // 렌더링 전에 정보를 먼저 가져오기 위함
  useEffect(() => {
    getSchedule();
  }, []);

  useEffect(() => {
    getSchedule();
  }, [hihi]);

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
      id: String(schedule[i]?.id),
      title: schedule[i]?.title,
      start: new Date(
        new Date(schedule[i]?.start).getTime() - utcOffset * 60000
      ),
      end: new Date(new Date(schedule[i]?.end).getTime() - utcOffset * 60000),
    });
  }

  const deleteSchedule = async (id: number) => {
    const deleteScheduleUrl = `${API_URL}/calendar/delete_calendar/${id}`;
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const res = await axios.delete(deleteScheduleUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    setHihi(!hihi);
    return res.status;
  };

  const updateSchedule = async (id: number, title: string) => {
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const updateScheduleUrl = `${API_URL}/calendar/update_calendar/${id}`;
    const body = {
      title: title,
      start: "2023-05-11T09:00:00.000Z",
      end: "2023-05-11T11:00:00.000Z",
      utcOffset: "-540",
    };
    const res = await axios.patch(updateScheduleUrl, body, { headers });
    setHihi(!hihi);
    return res.status;
  };

  const handleEventClick = (clickInfo: any) => {
    console.log(clickInfo.event);
    Swal.fire({
      title: `${clickInfo.event.title}`,
      text: `${clickInfo.event.title}`,
      showConfirmButton: true,
    });
    Swal.fire({
      title: `${clickInfo.event.title}`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `수정`,
      denyButtonText: `삭제`,
      cancelButtonText: `취소`,
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          const { value: title } = await Swal.fire({
            title: "스케줄명을 수정해주세요",
            input: "text",
          });

          // 이후 처리되는 내용.
          if (title) {
            updateSchedule(Number(clickInfo.event._def.publicId), title);
            Swal.fire(`수정되었습니다`, "", "success");
          }
        })();
      } else if (result.isDenied) {
        deleteSchedule(Number(clickInfo.event._def.publicId));
        Swal.fire("삭제되었습니다", "", "success");
      }
    });
  };

  return (
    <div>
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
      <div className="App">
        <FullCalendar
          initialView="dayGridMonth"
          plugins={[dayGridPlugin]}
          events={events}
          eventClick={handleEventClick}
          locale={"ko"}
        />
      </div>
      <div className="group fixed bottom-0 right-0 p-2  flex items-end justify-end">
        <div className="flex items-center justify-center p-3 rounded-full z-50 absolute">
          <button
            onClick={() => setModalOpen(true)}
            className="grid place-items-center p-0 w-16 h-16 bg-red-300 rounded-full hover:bg-red-100 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"
          >
            <svg
              viewBox="0 0 20 20"
              enable-background="new 0 0 20 20"
              className="w-6 h-6 inline-block"
            >
              <path
                fill="#FFFFFF"
                d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                  C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                  C15.952,9,16,9.447,16,10z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
export default CalendarScreen;
