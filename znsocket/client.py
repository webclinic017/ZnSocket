from typing import Any
import socketio
import dataclasses


@dataclasses.dataclass
class Client:
    address: str
    sio: socketio.Client = dataclasses.field(default=None, repr=False, init=False)
    room: str = None

    def __post_init__(self):
        self.sio = socketio.Client()
        self.sio.connect(self.address)
        self.sio.emit("join", {"room": self.room})

    def __setattr__(self, name: str, value: Any) -> None:
        if name not in [x.name for x in dataclasses.fields(self)]:
            # send everything that is not a dataclass field to the server
            self.sio.emit("set", {"name": name, "value": value})
        else:
            super().__setattr__(name, value)

    def __getattribute__(self, name: str) -> Any:
        if name.startswith("_"):
            return super().__getattribute__(name)
        if name not in [x.name for x in dataclasses.fields(self)]:
            data = self.sio.call("get", {"name": name})
            if isinstance(data, dict) and data == {"AttributeError": "AttributeError"}:
                raise AttributeError(
                    f"znsocket.Client '{self}' can not access attribute '{name}'"
                )
            return data
        else:
            return super().__getattribute__(name)


if __name__ == "__main__":
    c = Client("http://localhost:5000", room="tmp")
    c.content = "Hello, World!"
    print(c.content)
    c2 = Client("http://localhost:5000", room="tmp")
    print(c2.content)
    c2.content = "Hello, there!"
    print("updated")
    print(c.content)
    print(c2.content)
