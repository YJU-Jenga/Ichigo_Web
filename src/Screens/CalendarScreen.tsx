import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { UserProps } from "../App";

const CalendarScreen = ({ user }: UserProps) => {
  moment.locale("ko-KR");
  const localizer = momentLocalizer(moment);

  return <Calendar localizer={localizer} style={{ height: 500 }} />;
};

export default CalendarScreen;
