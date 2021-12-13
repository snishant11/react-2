import React, { useState, useEffect } from "react";
import Event from "./Event";

const clientID = `?client_id=${process.env.REACT_APP_KEY}`;
const mainURL = `https://api.seatgeek.com/2/events`;

function App() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);

  const pageurl = `&page=${page}`;
  const url = `${mainURL}${clientID}${pageurl}
  &per_page=20`;
  const fetchEvent = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      const { events } = data;

      setEvents((oldEvents) => {
        return [...oldEvents, ...events];
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [page]);

  useEffect(() => {
    const scrollEvent = window.addEventListener("scroll", () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 10
      ) {
        setPage((oldPage) => {
          return oldPage + 1;
        });
      }
    });
    return window.removeEventListener("scroll", scrollEvent);
  }, []);
  //IndexedDB update here
   useEffect(() => {
    let dbName = "demo-reactLocalDb";
    let dbVersion = 1;
    let dbRequest = window.indexedDB.open(dbName, dbVersion);
     
    dbRequest.onupgradeneeded = function (e) {
      console.log("upgrade needed");
      let db = e.target.result;
      db.createObjectStore("events", {
        keyPath: "id",
        autoIncrement: true,
      });
    };

    dbRequest.onerror = function (e) {
      console.log("error");
      console.log(e.target.errorCode);
    };

    dbRequest.onsuccess = function (e) {
      console.log("success");
      //handling database
      let db = e.target.result;
      //creating transaction
      let trans = db.transaction("events", "readwrite");

      let store = trans.objectStore("events");

      console.log(events);
      events.map((event) => {
        return store.add(event);
      });
    };

    dbRequest.onblocked = function (e) {
      console.log("hello");
    };
  }, [page]);

  return (
    <main>
      <h2 className="title">Events</h2>
      <section className="events">
        <div className="events-center">
          {events.map((event, index) => {
            return <Event key={index} {...event} />;
          })}
        </div>
        {loading && <h4 className="loading">loading...</h4>}
      </section>
    </main>
  );
}

export default App;
