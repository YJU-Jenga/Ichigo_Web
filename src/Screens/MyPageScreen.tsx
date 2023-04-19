import { UserProps } from "../App";

const MyPageScreen = ({ user }: UserProps) => {
  return (
    <>
      <h1>{user?.name}님 안녕하세요</h1>
    </>
  );
};
export default MyPageScreen;
