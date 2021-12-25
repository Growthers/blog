import { FC, ReactNode } from "react";

import { FiCalendar } from "react-icons/fi";
import { MdUpdate } from "react-icons/md";

type DateObjectProps = {
  year: string;
  month: string;
  day: string;
  headcomment: string;
  tailcomment: string;
  children: ReactNode;
};

type DisplayDateProps = {
  create: string;
  update: string;
};

type YearPassProps = {
  create: string;
  update: string;
};

const fillzero = (num: number, digit: number) => `${"0".repeat(digit)}${num}`.slice(-1 * digit);

export const DayParam = (strDate: string) => {
  let info = {
    isDate: false,
    year: "",
    month: "",
    day: "",
    UNIXTime: 0,
  };

  if (strDate === "") return info;

  // Asia/Tokyo
  const date = new Date(new Date(strDate).getTime() + 9 * 60 * 60 * 1000);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const UNIXTime = Math.floor(date.getTime() / 1000);

  info = {
    isDate: true,
    year: fillzero(year, 4),
    month: fillzero(month, 2),
    day: fillzero(day, 2),
    UNIXTime,
  };

  return info;
};

export const DateObject: FC<DateObjectProps> = ({ year, month, day, headcomment, tailcomment, children }) => (
  <div className="flex justify-center items-center">
    {children}
    <div className="ml-1">
      {headcomment}
      {year}年{month}月{day}日{tailcomment}
    </div>
  </div>
);

export const DisplayDate: FC<DisplayDateProps> = ({ create, update }) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (create === "" && update === "") return <></>;

  const { isDate: isCreate, year: Cyear, month: Cmonth, day: Cday, UNIXTime: CunixTime } = DayParam(create);
  const { isDate: isUpdate, year: Uyear, month: Umonth, day: Uday, UNIXTime: UunixTime } = DayParam(update);

  if (CunixTime > UunixTime)
    return (
      <DateObject year={Cyear} month={Cmonth} day={Cday} headcomment="" tailcomment="に作成">
        <FiCalendar />
      </DateObject>
    );
  if (!isUpdate)
    return (
      <DateObject year={Cyear} month={Cmonth} day={Cday} headcomment="" tailcomment="に作成">
        <FiCalendar />
      </DateObject>
    );
  if (!isCreate)
    return (
      <DateObject year={Uyear} month={Umonth} day={Uday} headcomment="" tailcomment="に更新">
        <MdUpdate />
      </DateObject>
    );
  if (Cyear === Uyear && Cmonth === Umonth && Cday === Uday)
    return (
      <DateObject year={Cyear} month={Cmonth} day={Cday} headcomment="" tailcomment="に作成">
        <FiCalendar />
      </DateObject>
    );
  return (
    <>
      <DateObject year={Cyear} month={Cmonth} day={Cday} headcomment="" tailcomment="に作成">
        <FiCalendar />
      </DateObject>
      <DateObject year={Uyear} month={Umonth} day={Uday} headcomment="" tailcomment="に更新">
        <MdUpdate />
      </DateObject>
    </>
  );
};

export const HasPassed: FC<YearPassProps> = ({ create, update }) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (create === "" && update === "") return <></>;
  const { UNIXTime: UunixTime } = DayParam(update);
  const nowUNIXTime = Math.floor(new Date().getTime() / 1000);
  const year = Math.floor((nowUNIXTime - UunixTime) / 31536000);

  if (year > 0)
    return (
      <div className="bg-yellow-300 p-4 mb-2 flex justify-center rounded">
        この記事は最終更新から{year}年以上が経過しています
      </div>
    );

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};
