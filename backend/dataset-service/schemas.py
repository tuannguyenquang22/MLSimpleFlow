from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class DatasetCreate(BaseModel):
    name: str
    description: Optional[str] = None

class DatasetResponse(BaseModel):
    id: str
    user_id: str
    name: str
    description: Optional[str] = None
    upload_date: datetime
    file_url: str
    rows: int = Field(default=0)
    cols: int = Field(default=0)
    col_names: Optional[list] = Field(default=None) 
    col_types: Optional[list] = Field(default=None)