from fastapi import FastAPI

from routes.auth import auth
from routes.user import user
from routes.items import items

app = FastAPI()
app.include_router(auth)
app.include_router(user)
app.include_router(items)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
