import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator

class AppConfig(BaseSettings):
    model_path: str
    temperature: float = 0.0
    repeat_penalty: float = 1.15
    max_tokens: int
    api_host: str
    api_port: int
    langchain_tracing_v2: str = "false"
    langchain_api_key: str = ""
    dict_path: str = "./mock_dictionary.json"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @model_validator(mode='after')
    def resolve_paths(self) -> 'AppConfig':
        base_dir = os.path.dirname(os.path.abspath(__file__))
        if self.model_path.startswith("./"):
            self.model_path = os.path.join(base_dir, self.model_path[2:])
        if self.dict_path.startswith("./"):
            self.dict_path = os.path.join(base_dir, self.dict_path[2:])
        return self

settings = AppConfig()
