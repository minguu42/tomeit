package tomeit

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
)

// CreateTask は'POST /tasks'エンドポイントに対応するハンドラ
func CreateTask(w http.ResponseWriter, r *http.Request) {
	var req createTaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErrorResponse(w, newErrBadRequest(err))
		LogInfo("failed to decode request.", err)
		return
	}

	if req.Title == "" {
		writeErrorResponse(w, newErrBadRequest(errors.New("title is required")))
		LogInfo("title is required")
		return
	}
	if req.EstimatedPomoNum < 0 || req.EstimatedPomoNum > 4 {
		writeErrorResponse(w, newErrBadRequest(errors.New("estimatedPomoNum should be positive number")))
		LogInfo("estimatedPomoNum should be positive number")
		return
	}
	var dueOn *time.Time
	if req.DueOn != "" {
		tmpDueOn, err := time.Parse(time.RFC3339, req.DueOn)
		if err != nil {
			writeErrorResponse(w, newErrBadRequest(err))
			LogInfo("failed to parse dueOn.", err)
			return
		}
		dueOn = &tmpDueOn
	}

	ctx := r.Context()
	user := ctx.Value(userKey{}).(*user)

	task, err := dbOperator.CreateTask(ctx, user.ID, req.Title, req.EstimatedPomoNum, dueOn)
	if err != nil {
		writeErrorResponse(w, newErrInternalServerError(err))
		LogError("failed to create task.", err)
		return
	}

	scheme := "https://"
	if r.TLS != nil {
		scheme = "http://"
	}
	w.Header().Set("Location", scheme+r.Host+r.URL.Path+"/"+strconv.Itoa(task.ID))
	if err := writeResponse(w, 201, newTaskResponse(task)); err != nil {
		writeErrorResponse(w, newErrInternalServerError(err))
		LogError("failed to write response.", err)
	}
}

// GetTasks は'GET /tasks'エンドポイントに対応するハンドラ
func GetTasks(w http.ResponseWriter, r *http.Request) {
	var req getTasksRequest
	for k, v := range r.URL.Query() {
		switch k {
		case "isCompleted":
			isCompleted, err := strconv.ParseBool(v[0])
			if err != nil {
				writeErrorResponse(w, newErrBadRequest(err))
				LogInfo("failed to parse isCompleted.", err)
				return
			}
			req.IsCompleted = &isCompleted
		case "completedOn":
			completedOn, err := time.Parse(time.RFC3339, v[0])
			if err != nil {
				writeErrorResponse(w, newErrBadRequest(err))
				LogInfo("failed to parse completedOn.", err)
				return
			}
			req.CompletedOn = &completedOn
		}
	}

	ctx := r.Context()
	user := ctx.Value(userKey{}).(*user)

	tasks, err := dbOperator.GetTasks(ctx, user.ID, &req)
	if err != nil {
		writeErrorResponse(w, newErrInternalServerError(err))
		LogError("failed to get tasks.", err)
		return
	}

	if err := writeResponse(w, 200, newTasksResponse(tasks)); err != nil {
		writeErrorResponse(w, newErrInternalServerError(err))
		LogError("failed to write response.", err)
	}
}

// UpdateTask は'PATCH /tasks/{taskID}'エンドポイントに対応するハンドラ
func UpdateTask(w http.ResponseWriter, r *http.Request) {
	var req updateTaskRequest
	taskID, err := strconv.Atoi(chi.URLParam(r, "taskID"))
	if err != nil {
		writeErrorResponse(w, newErrBadRequest(err))
		LogInfo("failed to convert taskID to integer.", err)
		return
	}
	req.TaskID = taskID
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErrorResponse(w, newErrBadRequest(err))
		LogInfo("failed to decode request.", err)
		return
	}

	ctx := r.Context()
	user := ctx.Value(userKey{}).(*user)

	task, err := dbOperator.GetTask(ctx, req.TaskID)
	switch {
	case errors.Is(err, sql.ErrNoRows):
		writeErrorResponse(w, newErrNotFound(err))
		LogInfo("task is not found.", err)
		return
	case err != nil:
		writeErrorResponse(w, newErrInternalServerError(err))
		LogError("failed to get task.", err)
		return
	}
	if !user.HasTask(task) {
		writeErrorResponse(w, newErrNotFound(errors.New("task is not found")))
		LogInfo("user does not have access to the task")
		return
	}

	if req.Title != "" {
		task.Title = req.Title
	}
	if req.EstimatedPomoNum != nil {
		task.EstimatedPomoNum = *req.EstimatedPomoNum
	}
	if req.DueOn != nil {
		dueOn, err := time.Parse(time.RFC3339, *req.DueOn)
		if err != nil {
			writeErrorResponse(w, newErrBadRequest(err))
			LogInfo("failed to parse dueOn.", err)
			return
		}
		task.DueOn = &dueOn
	}
	if req.CompletedOn != nil {
		completedOn, err := time.Parse(time.RFC3339, *req.CompletedOn)
		if err != nil {
			writeErrorResponse(w, newErrBadRequest(err))
			LogInfo("failed to parse completedOn.", err)
			return
		}
		task.CompletedOn = &completedOn
	}

	if err := dbOperator.UpdateTask(ctx, task); err != nil {
		writeErrorResponse(w, newErrInternalServerError(err))
		LogError("failed to update task.", err)
		return
	}

	if err := writeResponse(w, 200, newTaskResponse(task)); err != nil {
		writeErrorResponse(w, newErrInternalServerError(err))
		LogError("failed to write response.", err)
	}
}

// DeleteTask は'DELETE /tasks/{taskID}'エンドポイントに対応するハンドラ
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	var req deleteTaskRequest
	taskID, err := strconv.Atoi(chi.URLParam(r, "taskID"))
	if err != nil {
		writeErrorResponse(w, newErrBadRequest(err))
		LogInfo("failed to convert taskID to integer.", err)
		return
	}
	req.TaskID = taskID

	ctx := r.Context()
	user := ctx.Value(userKey{}).(*user)

	task, err := dbOperator.GetTask(ctx, req.TaskID)
	switch {
	case errors.Is(err, sql.ErrNoRows):
		writeErrorResponse(w, newErrNotFound(err))
		LogInfo("task is not found.", err)
		return
	case err != nil:
		writeErrorResponse(w, newErrInternalServerError(err))
		LogError("failed to get task.", err)
		return
	}
	if !user.HasTask(task) {
		writeErrorResponse(w, newErrNotFound(errors.New("task is not found")))
		LogInfo("user does not have access to the task")
		return
	}

	if err := dbOperator.DeleteTask(ctx, req.TaskID); err != nil {
		writeErrorResponse(w, newErrInternalServerError(err))
		LogError("failed to delete task.", err)
		return
	}

	w.WriteHeader(204)
}
