#!/bin/bash
# run.sh
export PYTHONPATH=$PYTHONPATH:$(pwd)/api-backend
./api-backend/venv/bin/uvicorn app.main:app --reload