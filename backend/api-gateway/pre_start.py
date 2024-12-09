import asyncio
import logging
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed
from app.db.session import ping

max_tries = 60 * 5
wait_seconds = 1

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
async def init():
    try:
        await ping()
        print("OK !")
    except Exception as e:
        logger.error(e)
        raise e


async def main() -> None:
    logger.info("Initializing service")
    await init()
    logger.info("Service finished initializing")


if __name__ == "__main__":
    asyncio.run(main())