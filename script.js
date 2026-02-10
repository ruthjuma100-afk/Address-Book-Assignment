// mini TDD helpers
function test(description, fn) {
    try {
        fn();
         console.log(description);
    } catch (error) {
         console.error(description);
         console.error(error.message);
    }
}

function expect(value) {
    return {
        toBe(expected) {
            if (value !== expected) {
                throw new Error(`${value} is not ${expected}`);
            }
        },
        toEqual(expected) {
            if (JSON.stringify(value) !== JSON.stringify(expected)) {
                throw new Error("Values are not equal");
            }
        },
        toBeDefined() {
            if (value === undefined) {
                throw new Error("Value is undefined");
            }
        },
        toBeType(type) {
            if (typeof value !== type) {
                throw new Error(`Expected ${type}, got ${typeof value}`);
            }
        }
    };
}


// address book constructor
function AddressBook(storage = localStorage) {
    this.storage = storage;
    this.contacts = JSON.parse(storage.getItem("contacts")) || [];
}

// add contact
AddressBook.prototype.addContact = function (contact) {
    this.contacts.push(contact);
    this.saveContacts();
};

// Delete contact
AddressBook.prototype.deleteContact = function (id) {
    this.contacts = this.contacts.filter(contact => contact.id !== id);
    this.saveContacts();
    this.displayContacts();
};

// Display contacts
AddressBook.prototype.displayContacts = function () {
    const contactList = document.getElementById("contactList");
    if (contactList) {
        contactList.innerHTML = "";

        this.contacts.forEach(contact => {
            const li = document.createElement("li");

            li.innerHTML = `
                <span>
                    <strong>${contact.name}</strong><br>
                    📞 ${contact.phone}<br>
                    ✉️ ${contact.email || "No email"}
                </span>
                <span class="delete" data-id="${contact.id}">❌</span>
            `;

            contactList.appendChild(li);
        });
    }
};
