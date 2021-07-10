import { VFC } from "react";
// @ts-ignore
import cn from "classnames";

import styles from "styles/components/TaskCard.module.scss";
import TimerIcon from "components/icons/TimerIcon";
import CircleIcon from "components/icons/CircleIcon";
import PlayCircleIcon from "./icons/PlayCircleIcon";

export type Task = {
  id: number;
  name: string;
  priority: number;
  deadline: string;
  pomodoroCount: number;
};

type Props = Task & {
  isPlaying: boolean;
};

const TaskCard: VFC<Props> = ({
  id,
  name,
  priority,
  deadline,
  pomodoroCount,
  isPlaying,
}) => (
  <div
    className={cn(styles.outer, {
      [styles.borderGreen]: priority === 1,
      [styles.borderYellow]: priority === 2,
      [styles.borderRed]: priority === 3,
    })}
  >
    <div className={styles.leftWrapper}>
      <button>
        {priority === 0 && <CircleIcon fill="#666666" />}
        {priority === 1 && <CircleIcon fill="#006e54" />}
        {priority === 2 && <CircleIcon fill="#c89932" />}
        {priority === 3 && <CircleIcon fill="#bb5535" />}
      </button>

      {pomodoroCount === 0 && <p className={styles.name}>{name}</p>}
      {1 <= pomodoroCount && pomodoroCount <= 5 && (
        <div>
          <p className={styles.name}>{name}</p>
          <div className={styles.iconWrapper}>
            {Array.from({ length: pomodoroCount }, (_, i) => i).map((i) => (
              <TimerIcon key={i} size={12} fill="#192f60" />
            ))}
          </div>
        </div>
      )}
      {6 <= pomodoroCount && (
        <div>
          <p className={styles.name}>{name}</p>
          <div className={styles.iconWrapper}>
            <TimerIcon size={12} fill="#192f60" />
            <p className={styles.pomodoroCount}>{pomodoroCount}</p>
          </div>
        </div>
      )}
    </div>

    <div className={styles.rightWrapper}>
      {deadline !== "0001-01-01" && (
        <p className={styles.deadline}>{deadline}</p>
      )}
      {isPlaying && <TimerIcon fill="#212121" />}
      {!isPlaying && (
        <button>
          <PlayCircleIcon fill="#212121" />
        </button>
      )}
    </div>
  </div>
);

export default TaskCard;
