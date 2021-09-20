import React, { useState } from "react";
import { useSetRecoilState } from "recoil";

import AddIcon from "components/common/icons/AddIcon";
import TimerIcon from "components/common/icons/TimerIcon";
import s from "./styles.module.scss";
import { Task, tasksState } from "models/task";
import { formatDate } from "lib/format";

type Props = {
  title: string;
  handleTitleChange: React.ChangeEventHandler<HTMLInputElement>;
  expectedPomodoroNumber: number;
  handleExpectedPomodoroNumberChange: React.ChangeEventHandler<HTMLInputElement>;
  dueOn: Date | null;
  handleDueOnChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: (e: React.SyntheticEvent) => void;
};

export const AddTaskForm = ({
  title,
  handleTitleChange,
  expectedPomodoroNumber,
  handleExpectedPomodoroNumberChange,
  dueOn,
  handleDueOnChange,
  handleSubmit,
}: Props): JSX.Element => (
  <form onSubmit={handleSubmit} className={s.container}>
    <AddIcon fill="#212121" />
    <input
      type="text"
      title="タスク名"
      placeholder="タスクを追加"
      value={title}
      onChange={handleTitleChange}
      required
      className={s.title}
    />
    <TimerIcon fill="#666666" />
    <input
      type="number"
      title="予想ポモドーロ数"
      value={expectedPomodoroNumber}
      onChange={handleExpectedPomodoroNumberChange}
      min={0}
      max={6}
      className={s.expectedNum}
    />
    <input
      type="date"
      title="期日"
      value={dueOn !== null ? formatDate(dueOn) : ""}
      onChange={handleDueOnChange}
      className={s.dueOn}
    />
    <button type="submit" hidden />
  </form>
);

const AddTaskFormContainer = (): JSX.Element => {
  const [title, setTitle] = useState("");
  const [expectedPomodoroNumber, setExpectedPomodoroNumber] = useState(0);
  const [dueOn, setDueOn] = useState<Date | null>(null);
  const setTasks = useSetRecoilState(tasksState);

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTitle(e.target.value);
  };

  const handleExpectedPomodoroNumberChange: React.ChangeEventHandler<HTMLInputElement> =
    (e) => {
      setExpectedPomodoroNumber(Number(e.target.value));
    };

  const handleDueOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setDueOn(new Date(e.target.value + "T00:00:00Z"));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const task: Task = {
      id: Math.floor(Math.random() * 1000),
      title: title,
      expectedPomodoroNumber: expectedPomodoroNumber,
      actualPomodoroNumber: 0,
      dueOn: dueOn,
      isCompleted: false,
      completedOn: null,
    };

    // TODO: タスク追加 API を叩く
    setTasks((prev) => [...prev, task]);

    setTitle("");
    setExpectedPomodoroNumber(0);
    setDueOn(null);
  };

  return (
    <AddTaskForm
      title={title}
      handleTitleChange={handleTitleChange}
      expectedPomodoroNumber={expectedPomodoroNumber}
      handleExpectedPomodoroNumberChange={handleExpectedPomodoroNumberChange}
      dueOn={dueOn}
      handleDueOnChange={handleDueOnChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default AddTaskFormContainer;
