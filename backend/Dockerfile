FROM python:3.13-alpine3.21

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt
RUN python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('punkt_tab')"

COPY . /app

CMD ["fastapi", "run", "main.py", "--port", "8000"]
