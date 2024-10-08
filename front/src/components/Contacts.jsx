import React, { useEffect, useState } from "react";

const Contacts = ({ contacts = [], changeChat, isGlobalChat }) => {
  const [currentUser, setCurrentUser] = useState("");
  const [currentSelected, setCurrentSelected] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      const data = JSON.parse(localStorage.getItem("user"));
      if (data && data.username) {
        setCurrentUser(data);
      }
    };

    getUserData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  useEffect(() => {
    if (isGlobalChat) {
      setCurrentSelected(null);
    }
  }, [isGlobalChat]);

  const filteredContacts = contacts.filter(
    (contact) => contact._id !== currentUser._id
  );

  return (
    <div className="space-y-2 w-full">
      <div className=" p-2">
        <h2 className="text-xl text-amber-50 font-semibold">
          Hi! <span className="text-amber-950">"{currentUser.username}"</span>
        </h2>
      </div>
      <div className="space-y-2 w-3/4">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact, index) => (
            <div
              key={contact._id}
              className={`bg-amber-200 cursor-pointer p-2 rounded-md hover:scale-95 hover:bg-amber-600 ease-in-out duration-300
                        ${index === currentSelected ? "bg-amber-800" : ""}`}
              onClick={() => changeCurrentChat(index, contact)}
            >
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium">{contact.username}</h3>
              </div>
            </div>
          ))
        ) : (
          <p className="text-lg text-amber-50">No contacts available</p>
        )}
      </div>
    </div>
  );
};

export default Contacts;
