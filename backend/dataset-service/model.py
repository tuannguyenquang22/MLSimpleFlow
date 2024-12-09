from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class Dataset(BaseModel):
    user_id: str
    name: str
    description: Optional[str] = None
    upload_date: datetime = Field(default_factory=datetime.now)
    file_url: str
    rows: int = Field(default=0)
    cols: int = Field(default=0)
    col_names: Optional[list] = Field(default=None) 
    col_types: Optional[list] = Field(default=None)