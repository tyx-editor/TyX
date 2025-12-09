import json
import os
from pathlib import Path

import pytest
import tyx_schema

EXAMPLE_DIRECTORY = os.path.join(os.path.dirname(__file__), "..", "..", "examples")


def test_examples(examples):
    for example in examples:
        content = Path(example).read_text()
        tyx_schema.TyXDocument(**json.loads(content))


@pytest.fixture
def examples():
    return [
        os.path.join(EXAMPLE_DIRECTORY, f)
        for f in os.listdir(EXAMPLE_DIRECTORY)
        if f.endswith(".tyx")
    ]
