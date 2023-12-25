from fastapi import FastAPI

from routes.auth import auth

app = FastAPI()
app.include_router(auth)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
