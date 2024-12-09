import motor.motor_asyncio
from config import settings


client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_DATABASE_URI)
db = client[settings.MONGO_DATABASE]


def serialize_doc(doc):
    """
    Utility function to convert ObjectId to string
    """
    doc['id'] = str(doc['_id'])
    del doc['_id']
    return doc
