import { VFC } from "react";

import {
  AlarmIcon,
  AlarmOnIcon,
  CircleIcon,
  DeleteIcon,
  EditIcon,
  EventIcon,
} from "@/components/common/icons";
import IconButton from "@/components/common/IconButton";
import s from "./TaskSideSheet.module.css";
import { Task } from "@/models/task";
import { formatDateToJP } from "@/lib/format";

type Props = {
  task: Task | null;
};

const TaskSideSheet: VFC<Props> = ({ task }) => {
  if (task === null) {
    return <></>;
  }

  return (
    <aside className={s.container}>
      <div className={s.top}>
        <IconButton
          icon={<CircleIcon />}
          onClick={() => {
            alert("テスト");
          }}
          label="タスクを完了する"
        />
        <h2 className={s.title}>{task.title}</h2>
      </div>
      <ul className={s.fieldList}>
        <li className={s.fieldListItem}>
          <AlarmOnIcon />
          <p className={s.fieldName}>実行ポモドーロ数</p>
          <p className={s.fieldValue}>{task.actualPomodoroNum}</p>
        </li>
        <li className={s.fieldListItem}>
          <AlarmIcon />
          <p className={s.fieldName}>期待ポモドーロ数</p>
          <p className={s.fieldValue}>{task.expectedPomodoroNum}</p>
        </li>
        {task.dueOn && (
          <li className={s.fieldListItem}>
            <EventIcon />
            <p className={s.fieldName}>期限</p>
            <p className={s.fieldValue}>{formatDateToJP(task.dueOn)}</p>
          </li>
        )}
      </ul>
      <div className={s.spacer} />
      <ul>
        <li>
          <button className={s.actionListItem}>
            <div className={s.actionListItemLayer} />
            <EditIcon />
            <p className={s.actionName}>編集する</p>
          </button>
        </li>
        <li>
          <button className={s.actionListItem}>
            <div className={s.actionListItemLayer} />
            <DeleteIcon />
            <p className={s.actionName}>削除する</p>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default TaskSideSheet;