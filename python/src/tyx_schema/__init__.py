import json
from pathlib import Path

from tyx_schema.document import *
from tyx_schema.settings import *


def get_document(path: Path):
    document = json.loads(path.read_bytes())
    return TyXDocument(**document)


def get_settings(path: Path):
    settings = json.loads(path.read_bytes())
    return TyXSettings(**settings)
