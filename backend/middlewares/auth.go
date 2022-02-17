package middlewares

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"net/http"

	"github.com/minguu42/tomeit"
	"github.com/minguu42/tomeit/logging"
)

type key int

var userKey key

func Auth(db tomeit.DBInterface, firebaseApp tomeit.FirebaseAppInterface) func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			idToken := r.Header.Get("Authorization")

			ctx := r.Context()

			token, err := firebaseApp.VerifyIDToken(ctx, idToken)
			if err != nil {
				logging.Error.Println("firebaseApp.VerifyIDToken failed:", err)
				// TODO: エラーレスポンスを生成する
				return
			}

			user, err := db.GetUserByDigestUID(hash(token.UID))
			if user == nil || err != nil {
				user, err = db.CreateUser(hash(token.UID))
				if err != nil {
					logging.Error.Println("db.CreateUser failed:", err)
					// TODO: エラーレスポンスを生成する
					return
				}
			}

			next.ServeHTTP(w, r.WithContext(context.WithValue(ctx, userKey, user)))
		})
	}
}

func hash(token string) string {
	bytes := sha256.Sum256([]byte(token))
	return hex.EncodeToString(bytes[:])
}
