package handler

import (
	"net/http"

	"github.com/minguu42/tomeit/internal/handler/utils"
	"github.com/minguu42/tomeit/internal/log"
	"github.com/minguu42/tomeit/internal/model"
)

// GetHealthz は GET /healthz に対応するハンドラ
func (h *Handler) GetHealthz(w http.ResponseWriter, _ *http.Request) {
	if err := utils.WriteResponse(w, http.StatusOK, &model.HealthzResponse{
		Status: "OK",
	}); err != nil {
		utils.WriteErrorResponse(w, model.NewErrInternalServerError(err))
		log.Error("failed to write response.", err)
		return
	}
}