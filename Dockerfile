FROM python:3
WORKDIR /app
COPY . /app
RUN pip install -e .
CMD ["znsocket", "--port", "4748"]
