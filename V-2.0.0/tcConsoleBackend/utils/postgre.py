from sqlalchemy import create_engine, MetaData, Table, text, update
from dotenv import load_dotenv
import os

load_dotenv()

POSTGRE_CLIENT = os.getenv("POSTGRES_CLIENT")
POSTGRE_CLIENT_INVNT = os.getenv("POSTGRE_CLIENT_INVNT")

engine = create_engine(POSTGRE_CLIENT)
invntengine = create_engine(POSTGRE_CLIENT_INVNT)

def insert_postgres(table: str, values: dict):
    meta = MetaData()
    tab = Table(table, meta, autoload_with=engine)

    with engine.connect() as conn:
        insert_query = tab.insert().values(**values)
        conn.execute(insert_query)
        conn.commit()

    return True


def insert_postgres_transaction(inserts: list[dict]):

    meta = MetaData()

    with engine.connect() as conn:
        try:
            for item in inserts:
                tab = Table(item["table"], meta, autoload_with=engine)
                conn.execute(tab.insert().values(**item["values"]))

            conn.commit()   
            return True

        except Exception as e:
            conn.rollback()
            raise e   


def update_postgres(table : str, values : dict, condition : dict):

    meta = MetaData()

    tab = Table(table, meta, autoload_with= engine)

    with engine.connect() as conn:

        try:
            query = (
                update(tab).where(*[
                        getattr(tab.c, key) == value
                        for key, value in condition.items()
                    ]
                )
                .values(**values)
            )

            conn.execute(query)
            conn.commit()

            return True

        except Exception as e:
            conn.rollback()
            raise e