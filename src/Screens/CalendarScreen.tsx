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
import timeGridPlugin from "@fullcalendar/timegrid";
import dayjs from "dayjs";

interface EventData {
  id: string;
  title: string;
  location: string;
  description: string;
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
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [hihi, setHihi] = useState(false);
  const [eventDetail, setEventDetail] = useState<EventData>();
  let now = new Date();
  const eventInfo: EventData[] = [];

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
      location: schedule[i]?.location,
      description: schedule[i]?.description,
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

  const updateSchedule = async (id: number) => {
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const updateScheduleUrl = `${API_URL}/calendar/update_calendar/${id}`;
    const body = {
      title: title,
      start: new Date(start),
      end: new Date(end),
      location: location,
      description: description,
      utcOffset: utcOffset,
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
      text: `開始 : ${clickInfo.event.start.toLocaleString()}`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `修正`,
      denyButtonText: `削除`,
      cancelButtonText: `キャンセル`,
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          for (let i in events) {
            if (
              Number(clickInfo.event._def.publicId) === Number(events[i]?.id)
            ) {
              setEventDetail(events[i]);
            }
          }
          setUpdateModalOpen(true);
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
          <div className="fixed inset-0 bg-black/70 z-10">
            <div className="flex justify-center h-screen w-full items-center z-50 fixed bg-black-100">
              <div className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 shadow-xl">
                <div className="flex flex-row justify-between p-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg">
                  <p className="font-semibold text-gray-800">日程追加</p>
                  <button onClick={() => setModalOpen(false)}>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col px-6 py-5 bg-gray-50">
                  <div className="mb-3">
                    <label className="mb-2 font-semibold text-gray-700">
                      タイトル
                    </label>
                    <input
                      type="text"
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                      onChange={(event) => setTitle(event.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 font-semibold text-gray-700">
                      内容
                    </label>
                    <input
                      type="text"
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 font-semibold text-gray-700">
                      場所
                    </label>
                    <input
                      type="text"
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                      onChange={(event) => setLocation(event.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 font-semibold text-gray-700">
                      開始日時
                    </label>
                    <input
                      type="datetime-local"
                      defaultValue={dayjs(now)
                        .add(1, "day")
                        .format("YYYY-MM-DDThh:mm")}
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                      onBlur={(event) => setStart(event.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 font-semibold text-gray-700">
                      終了日時
                    </label>
                    <input
                      type="datetime-local"
                      defaultValue={dayjs(now)
                        .add(1, "day")
                        .format("YYYY-MM-DDThh:mm")}
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                      onBlur={(event) => setEnd(event.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-row-reverse items-center p-5 bg-white border-t border-gray-200 rounded-bl-lg rounded-br-lg">
                  <button
                    className="text-white bg-yellow-500 active:bg-yellow-200 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      createSchedule();
                      setModalOpen(false);
                    }}
                  >
                    日程追加
                  </button>
                  <button
                    className="text-white bg-red-500 active:bg-red-200 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setModalOpen(false)}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {updateModalOpen ? (
        <>
          <div className="fixed inset-0 bg-black/70 z-10">
            <div className="flex justify-center h-screen w-full items-center z-50 fixed bg-black-100">
              <div className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 shadow-xl">
                <div className="flex flex-row justify-between p-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg">
                  <p className="font-semibold text-gray-800">日程修正</p>
                  <button onClick={() => setUpdateModalOpen(false)}>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col px-6 py-5 bg-gray-50">
                  <div className="mb-3">
                    <label className="mb-2 font-semibold text-gray-700">
                      タイトル
                    </label>
                    <input
                      type="text"
                      defaultValue={eventDetail?.title}
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                      onChange={(event) => setTitle(event.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 font-semibold text-gray-700">
                      内容
                    </label>
                    <input
                      type="text"
                      defaultValue={eventDetail?.description}
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 font-semibold text-gray-700">
                      場所
                    </label>
                    <input
                      type="text"
                      defaultValue={eventDetail?.location}
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                      onChange={(event) => setLocation(event.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 font-semibold text-gray-700">
                      開始日時
                    </label>
                    <input
                      type="datetime-local"
                      defaultValue={dayjs(eventDetail?.start)
                        // .add(1, "day")
                        .format("YYYY-MM-DDThh:mm")}
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                      onBlur={(event) => setStart(event.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 font-semibold text-gray-700">
                      終了日時
                    </label>
                    <input
                      type="datetime-local"
                      defaultValue={dayjs(eventDetail?.end)
                        // .add(1, "day")
                        .format("YYYY-MM-DDThh:mm")}
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                      onBlur={(event) => setEnd(event.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-row-reverse items-center p-5 bg-white border-t border-gray-200 rounded-bl-lg rounded-br-lg">
                  <button
                    className="text-white bg-yellow-500 active:bg-yellow-200 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      updateSchedule(Number(eventDetail?.id));
                      setUpdateModalOpen(false);
                    }}
                  >
                    日程修正
                  </button>
                  <button
                    className="text-white bg-red-500 active:bg-red-200 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setUpdateModalOpen(false)}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      <div className="App mt-5 z-30">
        <FullCalendar
          initialView="dayGridMonth"
          plugins={[dayGridPlugin, timeGridPlugin]}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventClick={handleEventClick}
          locale={"jp"}
        />
      </div>
      {!modalOpen ? (
        <div className="group fixed bottom-0 right-0 p-2 z-50  flex items-end justify-end">
          <button
            onClick={() => setModalOpen(true)}
            className="p-0 w-12 h-12 md:w-16 md:h-16 bg-red-300 rounded-full hover:bg-red-200 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"
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
      ) : null}
    </div>
  );
};
export default CalendarScreen;
