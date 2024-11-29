from pydantic import BaseModel, Field
from typing import Optional, List


class ColumnMetadata(BaseModel):
    column: str = Field(
        ...,
    )
    data_type: str = Field(
        ...,
    )
    transformation: str = Field(
        ...,
    )


class FeatureSetProfiling(BaseModel):
    datasource_id: str = Field(
        ...,
    )
    collection: str = Field(
        ...,
    )
    

class FeatureSetCreate(BaseModel):
    name: str = Field(
        ...,
    )
    datasource_id: str = Field(
        ...,
    )
    collection: str = Field(
        ...,
    )
    description: Optional[str] = Field(
        default=None,
    )
    features: List[ColumnMetadata] = Field(
        default_factory=list,
    )
    target: ColumnMetadata = Field(
        ...,
    )