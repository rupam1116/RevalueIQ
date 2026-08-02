from fastapi import FastAPI

app = FastAPI(
    title="RevalueIQ API",
    description="AI-powered Circular Economy Platform",
    version="1.0.0",
)

@app.get("/")
async def root():
    return {"message": "Welcome to RevalueIQ API. The backend is running successfully!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
