from typing import Dict
from fastapi import WebSocket

from src.profiles.team_profiles import TeamProfiles


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[TeamProfiles] = []

    async def connect(self, team_profiles: TeamProfiles):
        await team_profiles.websocket.accept()
        self.active_connections.append(team_profiles)

    async def disconnect(self, team_profiles):
        if team_profiles in self.active_connections:
            self.active_connections.remove(team_profiles)

    async def send_local_message(self, message: str, team_profiles: TeamProfiles):
        await team_profiles.websocket.send_text(message)
