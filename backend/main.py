from fastapi import FastAPI

from routes.auth import auth
from routes.user import user
from routes.items import items
from routes.admin import admin
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins (for development purposes only)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth)
app.include_router(user)
app.include_router(items)
app.include_router(admin)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
