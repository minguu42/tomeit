DROP TABLE IF EXISTS pomodoros;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id         INT       PRIMARY KEY AUTO_INCREMENT,
    digest_uid CHAR(64)  NOT NULL UNIQUE,
    rest_count INT       DEFAULT 4 NOT NULL CHECK ( 1 <= rest_count AND rest_count <= 4 ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id                       INT          PRIMARY KEY AUTO_INCREMENT,
    user_id                  INT          NOT NULL,
    title                    VARCHAR(120) NOT NULL,
    estimated_pomo_num       INT          DEFAULT 0 NOT NULL CHECK (0 <= estimated_pomo_num AND estimated_pomo_num <= 6),
    due_on                   TIMESTAMP    DEFAULT NULL,
    completed_on             TIMESTAMP    DEFAULT NULL,
    created_at               TIMESTAMP    DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at               TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS pomodoros (
    id           INT       PRIMARY KEY AUTO_INCREMENT,
    user_id      INT       NOT NULL,
    task_id      INT       NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
