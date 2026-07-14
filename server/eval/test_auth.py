import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from db.mongodb import db_manager
from motor.motor_asyncio import AsyncIOMotorClient

import pytest_asyncio

# Setup mongomock-motor for testing
@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    db_manager.client = AsyncIOMotorClient("mongodb://localhost:27017")
    db_manager.db = db_manager.client.get_database("test_interview_pilot")
    yield
    # Cleanup after test
    await db_manager.client.drop_database("test_interview_pilot")

@pytest.mark.asyncio
async def test_register_user():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="https://test") as ac:
        response = await ac.post("/api/v1/auth/register", json={
            "email": "test@example.com",
            "password": "securepassword123",
            "name": "Test User"
        })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"
    assert "id" in data
    assert "hashed_password" not in data

@pytest.mark.asyncio
async def test_register_duplicate_email():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="https://test") as ac:
        await ac.post("/api/v1/auth/register", json={
            "email": "test@example.com",
            "password": "securepassword123",
            "name": "Test User"
        })
        response = await ac.post("/api/v1/auth/register", json={
            "email": "test@example.com",
            "password": "securepassword123",
            "name": "Duplicate User"
        })
    assert response.status_code == 409
    assert response.json()["detail"] == "Email already registered"

@pytest.mark.asyncio
async def test_login_user():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="https://test") as ac:
        await ac.post("/api/v1/auth/register", json={
            "email": "login@example.com",
            "password": "securepassword123",
            "name": "Login User"
        })
        response = await ac.post("/api/v1/auth/login", json={
            "email": "login@example.com",
            "password": "securepassword123"
        })
    assert response.status_code == 200
    assert response.json()["email"] == "login@example.com"
    # Check if cookie is set
    assert "access_token" in response.cookies

@pytest.mark.asyncio
async def test_get_me():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="https://test") as ac:
        # Register and login to get cookie
        await ac.post("/api/v1/auth/register", json={
            "email": "me@example.com",
            "password": "securepassword123",
            "name": "Me User"
        })
        login_res = await ac.post("/api/v1/auth/login", json={
            "email": "me@example.com",
            "password": "securepassword123"
        })
        
        # Inject cookie into next request
        ac.cookies.update(login_res.cookies)
        
        response = await ac.get("/api/v1/auth/me")
    if response.status_code != 200:
        print("401 Detail:", response.json())
    assert response.status_code == 200
    assert response.json()["email"] == "me@example.com"

@pytest.mark.asyncio
async def test_get_me_unauthorized():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="https://test") as ac:
        response = await ac.get("/api/v1/auth/me")
    assert response.status_code == 401
